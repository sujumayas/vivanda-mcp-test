import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { searchProducts, searchProductsParams } from "./tool.search.js";
import { listStores, searchStores, selectStore, selectStoreParams } from "./tool.store.js";
import type { ProductSearchResponse, StoreListResponse } from "./types.js";

function summarizeStores(response: StoreListResponse): string {
  if (response.stores.length === 0) {
    return "No stores configured.";
  }
  const lines = response.stores.map((store) => {
    const selected = store.selected ? " [selected]" : "";
    return `${store.name} (${store.id})${selected}`;
  });
  return `Stores (${response.stores.length}):\n${lines.join("\n")}`;
}

function summarizeSearch(response: ProductSearchResponse): string {
  const { items, page } = response;
  const pageNumber = page.number + 1;
  const totalPages = page.totalPages > 0 ? page.totalPages : 1;
  if (items.length === 0) {
    return `No products found (page ${pageNumber} of ${totalPages}).`;
  }
  const preview = items
    .slice(0, 5)
    .map((product) => {
      const name = product.name ?? "Unnamed product";
      const sku = product.sku ?? product.id;
      return `- ${name} [${sku}]`;
    })
    .join("\n");
  return `Found ${page.totalElements} products (showing ${items.length} on page ${pageNumber} of ${totalPages}).\n${preview}`;
}

async function main() {
  const server = new McpServer({ name: "cord-search-products", version: "0.1.0" });

  server.registerTool(
    listStores.name,
    {
      title: "List Stores",
      description: listStores.description,
      inputSchema: listStores.inputSchema.shape,
      outputSchema: listStores.outputSchema.shape,
    },
    async (_args, _extra) => {
      const result = await listStores.handler();
      return {
        content: [
          {
            type: "text",
            text: summarizeStores(result),
          },
        ],
        structuredContent: result as unknown as Record<string, unknown>,
      };
    }
  );

  server.registerTool(
    searchStores.name,
    {
      title: "Search Stores",
      description: searchStores.description,
      inputSchema: searchStores.inputSchema.shape,
      outputSchema: searchStores.outputSchema.shape,
    },
    async (args, _extra) => {
      const result = await searchStores.handler(args);
      return {
        content: [
          {
            type: "text",
            text: summarizeStores(result),
          },
        ],
        structuredContent: result as unknown as Record<string, unknown>,
      };
    }
  );

  server.registerTool(
    selectStore.name,
    {
      title: "Select Store",
      description: selectStore.description,
      inputSchema: selectStoreParams,
      outputSchema: selectStore.outputSchema.shape,
    },
    async (args, _extra) => {
      const result = await selectStore.handler(args);
      return {
        content: [
          {
            type: "text",
            text: summarizeStores(result),
          },
        ],
        structuredContent: result as unknown as Record<string, unknown>,
      };
    }
  );

  server.registerTool(
    searchProducts.name,
    {
      title: "Search Products",
      description: searchProducts.description,
      inputSchema: searchProductsParams,
      outputSchema: searchProducts.outputSchema.shape,
    },
    async (args, _extra) => {
      const result = await searchProducts.handler(args);
      return {
        content: [
          {
            type: "text",
            text: summarizeSearch(result),
          },
        ],
        structuredContent: result as unknown as Record<string, unknown>,
      };
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});
