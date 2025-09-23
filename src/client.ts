import { request } from "undici";
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

export async function apiGET<T>(path: string, query: QueryRecord = {}): Promise<T> {
  const base = requireEnv("BASE_URL").replace(/\/$/, "");
  const params = compactQueryParams(query);
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    search.append(key, String(value));
  }
  const qs = search.toString();
  const url = `${base}${path}${qs ? `?${qs}` : ""}`;

  const headers = {
    Accept: "application/json",
    ...(AUTH_HEADER ? { Authorization: `Bearer ${AUTH_HEADER}` } : {}),
    ...EXTRA_HEADERS,
  } as Record<string, string>;

  const response = await request(url, {
    method: "GET",
    headers,
    bodyTimeout: TIMEOUT_MS,
    headersTimeout: TIMEOUT_MS,
  });

  if (response.statusCode >= 400) {
    const body = await response.body.text();
    throw new Error(`HTTP ${response.statusCode} ${url} :: ${body}`);
  }

  return response.body.json() as Promise<T>;
}
