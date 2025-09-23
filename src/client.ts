import { request } from "undici";
import type { Dispatcher } from "undici";
import type { QueryRecord } from "./util.js";
import { compactQueryParams, requireEnv, headersFromEnv } from "./util.js";

const AUTH_HEADER = process.env.AUTH_BEARER ?? "";
const EXTRA_HEADERS = headersFromEnv();

function getTimeout(): number {
  const raw = process.env.TIMEOUT_MS ?? "10000";
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 10000;
}

const TIMEOUT_MS = getTimeout();

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  query?: QueryRecord;
  body?: unknown;
  headers?: Record<string, string>;
}

function buildUrl(path: string, query: QueryRecord = {}): string {
  const base = requireEnv("BASE_URL").replace(/\/$/, "");
  const params = compactQueryParams(query);
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.append(key, String(value));
  }
  const qs = search.toString();
  return `${base}${path}${qs ? `?${qs}` : ""}`;
}

async function executeRequest<T>({ method, path, query = {}, body, headers = {} }: RequestOptions): Promise<T> {
  const url = buildUrl(path, query);

  const baseHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(AUTH_HEADER ? { Authorization: `Bearer ${AUTH_HEADER}` } : {}),
    ...EXTRA_HEADERS,
    ...headers,
  };

  const requestOptions: Parameters<typeof request>[1] = {
    method,
    headers: baseHeaders,
    bodyTimeout: TIMEOUT_MS,
    headersTimeout: TIMEOUT_MS,
  };

  if (body !== undefined) {
    let serialisedBody: Dispatcher.RequestOptions["body"];

    if (typeof body === "string" || body instanceof Uint8Array || body instanceof Buffer) {
      serialisedBody = body;
    } else if (body instanceof ArrayBuffer) {
      serialisedBody = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      const view = body as ArrayBufferView;
      serialisedBody = Buffer.from(view.buffer, view.byteOffset, view.byteLength);
    } else {
      serialisedBody = JSON.stringify(body);
    }

    requestOptions.body = serialisedBody;
    requestOptions.headers = {
      ...baseHeaders,
      "Content-Type": baseHeaders["Content-Type"] ?? "application/json",
    };
  }

  const response = await request(url, requestOptions);

  if (response.statusCode >= 400) {
    const responseBody = await response.body.text();
    throw new Error(`HTTP ${response.statusCode} ${url} :: ${responseBody}`);
  }

  return response.body.json() as Promise<T>;
}

export async function apiGET<T>(path: string, query: QueryRecord = {}): Promise<T> {
  return executeRequest<T>({ method: "GET", path, query });
}

export async function apiPOST<T>(path: string, body: unknown, query: QueryRecord = {}): Promise<T> {
  return executeRequest<T>({ method: "POST", path, body, query });
}
