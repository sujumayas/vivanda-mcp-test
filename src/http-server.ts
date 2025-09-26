import "./env.js";
import { createServer as createHttpServer, type IncomingMessage, type ServerResponse } from "node:http";
import { URL } from "node:url";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type {
  JSONRPCMessage,
  JSONRPCRequest,
  MessageExtraInfo,
  RequestId,
} from "@modelcontextprotocol/sdk/types.js";
import { isJSONRPCError, isJSONRPCRequest, isJSONRPCResponse } from "@modelcontextprotocol/sdk/types.js";
import type { Transport, TransportSendOptions } from "@modelcontextprotocol/sdk/shared/transport.js";
import { createMcpServer } from "./mcp-server.js";

interface SessionEntry {
  server: McpServer;
  transport: SSEServerTransport;
}

const sessions = new Map<string, SessionEntry>();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, mcp-session-id",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

function applyCors(res: ServerResponse): void {
  for (const [key, value] of Object.entries(corsHeaders)) {
    res.setHeader(key, value);
  }
}

function sendJson(res: ServerResponse, status: number, payload: unknown): void {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
    ...corsHeaders,
  });
  res.end(body);
}

interface PendingRequest {
  messages: JSONRPCMessage[];
  resolve: (messages: JSONRPCMessage[]) => void;
  reject: (error: Error) => void;
  promise: Promise<JSONRPCMessage[]>;
}

class InlineHttpTransport implements Transport {
  onclose?: () => void;
  onerror?: (error: Error) => void;
  onmessage?: (message: JSONRPCMessage, extra?: MessageExtraInfo) => void;
  sessionId?: string;

  private readonly pendingRequests = new Map<RequestId, PendingRequest>();
  private queue: Promise<void> = Promise.resolve();

  async start(): Promise<void> {
    // No transport start actions required for inline usage.
  }

  async send(message: JSONRPCMessage, options?: TransportSendOptions): Promise<void> {
    const relatedId: RequestId | undefined =
      options?.relatedRequestId ??
      (isJSONRPCResponse(message) || isJSONRPCError(message) ? message.id : undefined);

    if (relatedId !== undefined) {
      const pending = this.pendingRequests.get(relatedId);
      if (pending) {
        pending.messages.push(message);
        if (isJSONRPCResponse(message) || isJSONRPCError(message)) {
          this.pendingRequests.delete(relatedId);
          pending.resolve([...pending.messages]);
        }
        return;
      }
    }

    if (isJSONRPCError(message)) {
      this.onerror?.(new Error(message.error.message));
    }
  }

  async close(): Promise<void> {
    this.onclose?.();
  }

  dispatch(message: JSONRPCMessage, extra?: MessageExtraInfo): Promise<JSONRPCMessage[]> {
    const result = this.queue.then(() => this.processMessage(message, extra));
    this.queue = result.then(
      () => undefined,
      () => undefined
    );
    return result;
  }

  private async processMessage(message: JSONRPCMessage, extra?: MessageExtraInfo): Promise<JSONRPCMessage[]> {
    if (!this.onmessage) {
      throw new Error("MCP server not connected");
    }

    if (isJSONRPCRequest(message)) {
      if (message.id === undefined || message.id === null) {
        throw new Error("JSON-RPC request must include an id");
      }

      const messages: JSONRPCMessage[] = [];
      let resolveFn: (value: JSONRPCMessage[]) => void = () => {};
      let rejectFn: (error: Error) => void = () => {};
      const promise = new Promise<JSONRPCMessage[]>((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
      });

      this.pendingRequests.set(message.id, {
        messages,
        resolve: resolveFn,
        reject: rejectFn,
        promise,
      });

      try {
        this.onmessage(message, extra);
      } catch (error) {
        this.pendingRequests.delete(message.id);
        rejectFn(error as Error);
        throw error;
      }

      return promise;
    }

    try {
      this.onmessage(message, extra);
    } catch (error) {
      this.onerror?.(error as Error);
      throw error;
    }

    return [];
  }
}

interface InlineServerContext {
  server: McpServer;
  transport: InlineHttpTransport;
}

const inlineServerContextPromise: Promise<InlineServerContext> = (async () => {
  const server = createMcpServer();
  const transport = new InlineHttpTransport();
  await server.connect(transport);
  return { server, transport } satisfies InlineServerContext;
})();

function getSingleHeader(value: string | string[] | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  return Array.isArray(value) ? value[0] : value;
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf-8").trim();
  if (raw === "") {
    throw new Error("Request body must contain JSON-RPC payload");
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error("Invalid JSON payload");
  }
}

async function handleInlineJsonRpc(req: IncomingMessage, res: ServerResponse, url: URL): Promise<boolean> {
  if (req.method !== "POST" || url.pathname !== "/") {
    return false;
  }

  applyCors(res);

  let payload: unknown;
  try {
    payload = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: (error as Error).message });
    return true;
  }

  const messages = Array.isArray(payload) ? payload : [payload];
  if (messages.length === 0) {
    sendJson(res, 400, { error: "Empty JSON-RPC batch" });
    return true;
  }

  try {
    const { transport } = await inlineServerContextPromise;
    const responses: JSONRPCMessage[] = [];

    for (const candidate of messages) {
      if (!isJSONRPCRequest(candidate as JSONRPCMessage)) {
        sendJson(res, 400, { error: "Each entry must be a JSON-RPC request object." });
        return true;
      }

      const request = candidate as JSONRPCRequest;
      const messageResponses = await transport.dispatch(request as JSONRPCMessage);
      responses.push(...messageResponses);
    }

    if (Array.isArray(payload)) {
      sendJson(res, 200, responses);
    } else if (responses.length > 0) {
      sendJson(res, 200, responses[0]);
    } else {
      res.writeHead(204, corsHeaders);
      res.end();
    }
  } catch (error) {
    console.error("Failed to process JSON-RPC request:", error);
    if (!res.headersSent) {
      sendJson(res, 500, { error: "Internal server error" });
    }
  }

  return true;
}

async function handleSseConnection(req: IncomingMessage, res: ServerResponse): Promise<void> {
  applyCors(res);
  const server = createMcpServer();
  const transport = new SSEServerTransport("/mcp/messages", res);

  try {
    await server.connect(transport);
  } catch (error) {
    console.error("Failed to establish SSE transport:", error);
    if (!res.headersSent) {
      sendJson(res, 500, { error: "Failed to establish SSE transport." });
    } else {
      res.end();
    }
    void server.close().catch((closeError) => {
      console.error("Error closing MCP server after SSE failure:", closeError);
    });
    return;
  }

  const sessionId = transport.sessionId;
  sessions.set(sessionId, { server, transport });
  console.log(`MCP session established (sessionId=${sessionId})`);

  let cleanedUp = false;
  const cleanup = (initiator: "request" | "transport") => {
    if (cleanedUp) {
      return;
    }
    cleanedUp = true;
    sessions.delete(sessionId);
    console.log(`MCP session closed (sessionId=${sessionId})`);
    if (initiator === "request") {
      void transport.close().catch((transportError) => {
        console.error("Error closing SSE transport:", transportError);
      });
    }
    void server.close().catch((serverError) => {
      console.error("Error closing MCP server:", serverError);
    });
  };

  req.on("close", () => cleanup("request"));
  transport.onclose = () => cleanup("transport");
}

async function handlePostMessage(req: IncomingMessage, res: ServerResponse, url: URL): Promise<void> {
  applyCors(res);
  const sessionId = getSingleHeader(req.headers["mcp-session-id"]) ?? url.searchParams.get("sessionId") ?? undefined;

  if (!sessionId) {
    sendJson(res, 400, { error: "Missing sessionId." });
    return;
  }

  const session = sessions.get(sessionId);
  if (!session) {
    sendJson(res, 404, { error: `Unknown session: ${sessionId}` });
    return;
  }

  try {
    await session.transport.handlePostMessage(req, res);
  } catch (error) {
    console.error("Error handling POST message:", error);
    if (!res.headersSent) {
      sendJson(res, 500, { error: "Failed to process message." });
    }
  }
}

function handleOptions(res: ServerResponse): void {
  res.writeHead(204, {
    ...corsHeaders,
  });
  res.end();
}

async function requestListener(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const method = req.method ?? "GET";
    const host = req.headers.host ?? "localhost";
    const url = new URL(req.url ?? "/", `http://${host}`);

    if (method === "OPTIONS") {
      handleOptions(res);
      return;
    }

    if (method === "GET" && url.pathname === "/") {
      sendJson(res, 200, { status: "ok" });
      return;
    }

    if (await handleInlineJsonRpc(req, res, url)) {
      return;
    }

    if (method === "GET" && url.pathname === "/mcp") {
      await handleSseConnection(req, res);
      return;
    }

    if (method === "POST" && url.pathname === "/mcp/messages") {
      await handlePostMessage(req, res, url);
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    console.error("Unhandled error in HTTP server:", error);
    if (!res.headersSent) {
      sendJson(res, 500, { error: "Internal server error" });
    } else {
      res.end();
    }
  }
}

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const server = createHttpServer((req, res) => {
  void requestListener(req, res);
});

server.listen(port, () => {
  console.log(`HTTP MCP server listening on port ${port}`);
});

const shutdownSignals: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];
for (const signal of shutdownSignals) {
  process.on(signal, () => {
    console.log(`Received ${signal}, shutting down HTTP server.`);
    server.close((error) => {
      if (error) {
        console.error("Error closing HTTP server:", error);
      }
      for (const [sessionId, session] of sessions) {
        sessions.delete(sessionId);
        void session.transport.close().catch((transportError) => {
          console.error("Error closing SSE transport during shutdown:", transportError);
        });
        void session.server.close().catch((serverError) => {
          console.error("Error closing MCP server during shutdown:", serverError);
        });
      }
      void inlineServerContextPromise
        .then(async ({ transport, server: inlineServer }) => {
          try {
            await transport.close();
          } catch (transportError) {
            console.error("Error closing inline transport during shutdown:", transportError);
          }
          try {
            await inlineServer.close();
          } catch (serverError) {
            console.error("Error closing inline MCP server during shutdown:", serverError);
          }
        })
        .catch((error) => {
          console.error("Error cleaning up inline MCP server:", error);
        });
      process.exit(0);
    });
  });
}
