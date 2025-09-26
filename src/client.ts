import "./env.js";
import { request } from "undici";
import type { Dispatcher } from "undici";
import type { QueryRecord } from "./util.js";
import { compactQueryParams, requireEnv, headersFromEnv } from "./util.js";

function normaliseBearerToken(token: string | undefined): string {
  if (!token) {
    return "";
  }
  const trimmed = token.trim();
  if (trimmed === "") {
    return "";
  }
  return trimmed.replace(/^Bearer\s+/i, "").trim();
}

function splitCookieHeader(header: string): Array<[string, string]> {
  return header
    .split(/;\s*/)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)
    .map((segment) => {
      const index = segment.indexOf("=");
      if (index === -1) {
        return [segment, ""] as [string, string];
      }
      const name = segment.slice(0, index).trim();
      const value = segment.slice(index + 1).trim();
      return [name, value] as [string, string];
    })
    .filter(([name]) => name.length > 0);
}

const cookieJar = new Map<string, string>();

function seedCookieJar(header?: string): void {
  if (!header) {
    return;
  }
  for (const [name, value] of splitCookieHeader(header)) {
    if (value === "") {
      cookieJar.delete(name);
    } else {
      cookieJar.set(name, value);
    }
  }
}

function cookieJarHeader(): string | undefined {
  if (cookieJar.size === 0) {
    return undefined;
  }
  return Array.from(cookieJar.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

function extractCookieHeader(headers: Record<string, string>): string | undefined {
  const header = headers.Cookie ?? headers.cookie;
  if (header !== undefined) {
    delete headers.Cookie;
    delete headers.cookie;
    return header;
  }
  return undefined;
}

function mergeCookies(...sources: Array<string | undefined>): string | undefined {
  const merged = new Map<string, string>();
  for (const source of sources) {
    if (!source) {
      continue;
    }
    for (const [name, value] of splitCookieHeader(source)) {
      if (value === "") {
        merged.delete(name);
      } else {
        merged.set(name, value);
      }
    }
  }
  if (merged.size === 0) {
    return undefined;
  }
  return Array.from(merged.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

function updateCookieJarFromSetCookie(values: string | string[] | undefined): void {
  if (!values) {
    return;
  }
  const entries = Array.isArray(values) ? values : [values];
  for (const entry of entries) {
    const [firstPart] = entry.split(";");
    if (!firstPart) {
      continue;
    }
    const index = firstPart.indexOf("=");
    if (index === -1) {
      const cookieName = firstPart.trim();
      if (cookieName) {
        cookieJar.delete(cookieName);
      }
      continue;
    }
    const name = firstPart.slice(0, index).trim();
    const value = firstPart.slice(index + 1).trim();
    if (!name) {
      continue;
    }
    if (value === "" || /^delete$/i.test(value)) {
      cookieJar.delete(name);
      continue;
    }
    cookieJar.set(name, value);
  }
}

const EXTRA_HEADERS = headersFromEnv();
const ENV_COOKIE = extractCookieHeader(EXTRA_HEADERS);
if (ENV_COOKIE) {
  seedCookieJar(ENV_COOKIE);
}

function getTimeout(): number {
  const raw = process.env.TIMEOUT_MS ?? "10000";
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 10000;
}

const TIMEOUT_MS = getTimeout();

function getAuthToken(): string {
  return normaliseBearerToken(process.env.AUTH_BEARER);
}

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

  const headerOverrides = { ...headers };
  const overrideCookie = extractCookieHeader(headerOverrides);

  const authToken = getAuthToken();

  const baseHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...EXTRA_HEADERS,
    ...headerOverrides,
  };

  const combinedCookie = mergeCookies(cookieJarHeader(), overrideCookie);
  if (combinedCookie) {
    baseHeaders.Cookie = combinedCookie;
  }

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

  updateCookieJarFromSetCookie(response.headers["set-cookie"]);

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
