import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiGET, apiPOST } from "../src/client.js";
import { logTest } from "./helpers/logger.js";
import { request } from "undici";

vi.mock("undici", () => ({
  request: vi.fn(),
}));

const mockedRequest = vi.mocked(request);

function mockSuccessResponse(payload: unknown) {
  return {
    statusCode: 200,
    headers: {},
    body: {
      json: vi.fn().mockResolvedValue(payload),
      text: vi.fn().mockResolvedValue(JSON.stringify(payload)),
    },
  } as const;
}

const ORIGINAL_BASE_URL = process.env.BASE_URL;
const ORIGINAL_AUTH = process.env.AUTH_BEARER;

describe("HTTP client", () => {
  beforeEach(() => {
    process.env.BASE_URL = "https://example.com/api";
    process.env.AUTH_BEARER = "token-123";
    mockedRequest.mockReset();
  });

  afterEach(() => {
    if (ORIGINAL_BASE_URL === undefined) {
      delete process.env.BASE_URL;
    } else {
      process.env.BASE_URL = ORIGINAL_BASE_URL;
    }

    if (ORIGINAL_AUTH === undefined) {
      delete process.env.AUTH_BEARER;
    } else {
      process.env.AUTH_BEARER = ORIGINAL_AUTH;
    }
  });

  it("sends Authorization header with bearer token", async () => {
    const payload = { ok: true };
    mockedRequest.mockResolvedValueOnce(mockSuccessResponse(payload));
    logTest("Calling apiGET", { path: "/demo" });
    const result = await apiGET("/demo");
    logTest("apiGET result", result);

    const [url, options] = mockedRequest.mock.calls[0];
    logTest("Request details", { url, headers: options?.headers });

    expect(url).toBe("https://example.com/api/demo");
    expect(options?.headers?.Authorization).toBe("Bearer token-123");
  });

  it("normalises bearer prefix from AUTH_BEARER", async () => {
    process.env.AUTH_BEARER = "Bearer extra-token";
    mockedRequest.mockResolvedValueOnce(mockSuccessResponse({ ok: true }));
    logTest("Calling apiGET with prefixed AUTH_BEARER");
    await apiGET("/demo");

    const [, options] = mockedRequest.mock.calls[0];
    logTest("Request headers", options?.headers);
    expect(options?.headers?.Authorization).toBe("Bearer extra-token");
  });

  it("serialises POST payloads", async () => {
    const payload = { hello: "world" };
    mockedRequest.mockResolvedValueOnce(mockSuccessResponse({ saved: true }));
    logTest("Calling apiPOST", payload);
    const result = await apiPOST("/demo", payload);
    logTest("apiPOST result", result);

    const [url, options] = mockedRequest.mock.calls[0];
    expect(url).toBe("https://example.com/api/demo");
    expect(options?.method).toBe("POST");
    expect(options?.body).toBe(JSON.stringify(payload));
    expect(options?.headers?.["Content-Type"]).toBe("application/json");
  });

  it("throws informative error on non-2xx responses", async () => {
    const errorPayload = { message: "Auth required" };
    mockedRequest.mockResolvedValueOnce({
      statusCode: 401,
      headers: {},
      body: {
        json: vi.fn(),
        text: vi.fn().mockResolvedValue(JSON.stringify(errorPayload)),
      },
    } as const);

    logTest("Expecting error from apiGET", errorPayload);

    await expect(apiGET("/secure")).rejects.toThrow(/HTTP 401/);
  });
});
