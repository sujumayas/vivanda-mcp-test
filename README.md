# MCP Search Products Server

Node + TypeScript Model Context Protocol (MCP) server providing tools to pick a store and search its catalog via `/catalog/v2/stores/{storeId}/products`.

## Prerequisites
- Node.js 18+
- pnpm, npm, or yarn for dependency management

## Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in your credentials:
   ```sh
   cp .env.example .env
   ```
   Required variables:
   - `BASE_URL`: API host (e.g. `https://api-qa.cord.pe/cord-rest`)
   - `AUTH_BEARER`: Optional bearer token for auth
   - `TIMEOUT_MS`: Request timeout in milliseconds
   - `STORE_ID`: Default store id exposed by `selectStore`
   - `STORE_NAME`: Optional friendly name for the default store
   - `STORE_LIST`: Optional JSON array of `{ "id": string, "name": string }` entries when multiple stores are available
   - `HEADER_*`: Any extra headers to send (e.g. `HEADER_X_APPLICATION=MRK`)

## Development
- Run the MCP server in watch mode:
  ```sh
  npm run dev
  ```
- Build the TypeScript outputs:
  ```sh
  npm run build
  ```
- Start the compiled server:
  ```sh
  npm start
  ```

## Testing
Execute the Vitest suite:
```sh
npm test
```

## Claude Desktop Configuration
Example MCP server registration:
```json
{
  "mcpServers": {
    "cord-search-products": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "BASE_URL": "https://api-qa.cord.pe/cord-rest",
        "AUTH_BEARER": "xxxxx",
        "TIMEOUT_MS": "10000",
        "STORE_ID": "4e68a220-db2a-4328-83e9-ecd029977945",
        "STORE_NAME": "Vivanda San Isidro",
        "STORE_LIST": "[{\"id\":\"4e68a220-db2a-4328-83e9-ecd029977945\",\"name\":\"Vivanda San Isidro\"}]",
        "HEADER_X_APPLICATION": "MRK",
        "HEADER_X_PLATFORM": "WEB"
      }
    }
  }
}
```

## Tool Prompts
- "List available stores" (shows configured store names and ids).
- "Search for the Vivanda Centro store" (find the id by name before selecting).
- "Select a store" (marks the chosen store id as selected for confirmation).
- "Search products in store 12345 for 'galleta', size 10, sorted by price_desc."
- "List products in store 12345 with minPrice 50, maxPrice 200, sorted by score_desc."

## Project Structure
```
mcp-search-products/
 ├─ src/
 │   ├─ index.ts
 │   ├─ client.ts
 │   ├─ tool.search.ts
 │   ├─ tool.store.ts
 │   ├─ types.ts
 │   └─ util.ts
 ├─ test/
 │   ├─ search.test.ts
 │   └─ store.test.ts
 ├─ .env.example
 ├─ package.json
 ├─ tsconfig.json
 └─ README.md
```
