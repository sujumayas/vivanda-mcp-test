# MCP Server Plan: Search Products

## Goal
Create a Node + TypeScript MCP server exposing a single tool, `searchProducts`, which wraps the REST endpoint:

- `GET /catalog/v2/stores/{storeId}/products`
- Supports query text, pagination, sorting, and filters (price/category/brand).
- Returns `{ page, items }` directly from the API.

---

## Tech Stack
- Node 18+, TypeScript
- MCP SDK: @modelcontextprotocol/sdk
- HTTP client: undici
- Schema validation: zod
- Env config: dotenv
- Testing: vitest

---

## Repo Structure
```
mcp-search-products/
 ├─ src/
 │   ├─ index.ts          # server bootstrap
 │   ├─ client.ts         # fetch wrapper
 │   ├─ tool.search.ts    # searchProducts tool
 │   ├─ types.ts          # DTOs
 │   └─ util.ts           # helpers
 ├─ test/
 │   └─ search.test.ts
 ├─ .env.example
 ├─ package.json
 ├─ tsconfig.json
 └─ README.md
```

---

## Environment
`.env`
```
BASE_URL=https://<your-host>
AUTH_BEARER=xxxxx
TIMEOUT_MS=10000
STORE_ID=
STORE_NAME=
STORE_LIST=
```

Default fallback stores (used when the env variables above are unset) are defined in
`src/tool.store.ts` on the `DEFAULT_STORES` constant.

---

## Types (src/types.ts)
```ts
export interface PageMeta {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  empty: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
  order: number;
}

export interface Product {
  id: string;
  externalId?: string;
  sku?: string;
  ean?: string;
  name?: string;
  description?: string;
  images?: ProductImage[];
}

export interface ProductSearchResponse {
  page: PageMeta;
  items: Product[];
}
```

---

## HTTP Client (src/client.ts)
```ts
import { request } from "undici";

const BASE = process.env.BASE_URL!;
const AUTH = process.env.AUTH_BEARER ?? "";
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS ?? "10000");

export async function apiGET<T>(path: string, query?: Record<string, unknown>): Promise<T> {
  const qs = query
    ? "?" + Object.entries(query)
        .filter(([,v]) => v!==undefined && v!=="")
        .map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join("&")
    : "";
  const url = BASE.replace(/\/$/,"") + path + qs;
  const res = await request(url, {
    method: "GET",
    headers: {
      "Accept":"application/json",
      ...(AUTH ? { "Authorization":`Bearer ${AUTH}` } : {})
    },
    bodyTimeout: TIMEOUT_MS,
    headersTimeout: TIMEOUT_MS
  });
  if (res.statusCode >= 400) {
    const body = await res.body.text();
    throw new Error(`HTTP ${res.statusCode} ${url} :: ${body}`);
  }
  return res.body.json() as Promise<T>;
}
```

---

## Tool (src/tool.search.ts)
```ts
import { z } from "zod";
import { apiGET } from "./client";
import type { ProductSearchResponse } from "./types";

export const searchProducts = {
  name: "searchProducts",
  description: "Search products by text, filters, pagination and sorting.",
  inputSchema: z.object({
    storeId: z.string().min(1),
    q: z.string().optional(),
    page: z.number().int().min(0).default(0),
    size: z.number().int().min(1).max(200).default(20),
    sort: z.array(z.enum([
      "name_asc","price_desc","score_desc","releaseDate_desc","discount_desc"
    ])).optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    categoryIds: z.string().optional(),
    brandIds: z.string().optional()
  }),
  handler: async (input:any): Promise<ProductSearchResponse> => {
    const { storeId, ...query } = input;
    return apiGET<ProductSearchResponse>(`/catalog/v2/stores/${storeId}/products`, query);
  }
};
```

---

## Server Bootstrap (src/index.ts)
```ts
import "dotenv/config";
import { Server } from "@modelcontextprotocol/sdk/server";
import { searchProducts } from "./tool.search";

async function main() {
  const server = new Server({ name: "cord-search-products", version: "0.1.0" });
  server.tool(searchProducts);
  await server.start();
}

main().catch(e => {
  console.error("Failed to start MCP server:", e);
  process.exit(1);
});
```

---

## Scripts (package.json)
```json
{
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run"
  }
}
```

---

## Claude Desktop Config
```json
{
  "mcpServers": {
    "cord-search-products": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "BASE_URL": "https://<your-host>",
        "AUTH_BEARER": "xxxxx",
        "TIMEOUT_MS": "10000",
        "STORE_ID": "<store-id>",
        "STORE_NAME": "<store-name>",
        "STORE_LIST": "[{\"id\":\"<store-id>\",\"name\":\"<store-name>\"}]"
      }
    }
  }
}
```

---

## Example Prompts for Claude
- "List stores".
- "Search for the Vivanda Centro store".
- "Select the store with id 12345".
- "Search products in store 12345 for 'galleta', size 10, sorted by price_desc."
- "List products in store 12345 with minPrice 50, maxPrice 200, sorted by score_desc."

---

## Acceptance
- Starts and registers tool `searchProducts`.
- Returns correct `{ page, items }` response.
- Supports q, pagination, sort, filters.
- Errors surfaced with status + message.
- Config via env only.
