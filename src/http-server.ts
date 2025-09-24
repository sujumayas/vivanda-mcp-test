import "dotenv/config";
import { createServer as createHttpServer, type IncomingMessage, type ServerResponse } from "node:http";
import { URL } from "node:url";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
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
  const headerSession = req.headers["mcp-session-id"];
  const sessionId =
    (Array.isArray(headerSession) ? headerSession[0] : headerSession) ?? url.searchParams.get("sessionId");

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
      process.exit(0);
    });
  });
}
