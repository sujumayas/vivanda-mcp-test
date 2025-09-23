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
   - `CART_SESSION_TOKEN`: Optional session bearer to share with Claude (defaults to `AUTH_BEARER`)
   - `WEB_BASE_URL`: Base web URL used to craft cart deep links (e.g. `https://shop-qa.cord.pe`)
   - `CART_LINK_TEMPLATE`: Optional link template supporting `{cartId}`, `{storeId}`, `{status}`, `{branchId}` placeholders
   - `TIMEOUT_MS`: Request timeout in milliseconds
   - `STORE_ID`: Default store id exposed by `selectStore`
   - `STORE_NAME`: Optional friendly name for the default store
   - `STORE_LIST`: Optional JSON array of `{ "id": string, "name": string }` entries when multiple stores are available
   - `HEADER_*`: Any extra headers to send (e.g. `HEADER_X_APPLICATION=MRK`)

3. (Optional) Update the default store catalog exposed when no environment overrides are present. The list lives in
   `src/tool.store.ts` under the `DEFAULT_STORES` constant.

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
- "Create a cart in store 12345 with specific items" (creates or reuses the cart, bulk uploads the items, and shares a cart link plus session token guidance).

## Project Structure
```
mcp-search-products/
 ├─ src/
 │   ├─ index.ts
 │   ├─ client.ts
 │   ├─ tool.cart.ts
 │   ├─ tool.search.ts
 │   ├─ tool.store.ts
 │   ├─ types.ts
 │   └─ util.ts
 ├─ test/
 │   ├─ cart.test.ts
 │   ├─ search.test.ts
 │   └─ store.test.ts
 ├─ .env.example
 ├─ package.json
 ├─ tsconfig.json
 └─ README.md
```
