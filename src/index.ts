import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { searchProducts, searchProductsParams } from "./tool.search.js";
import { selectStore, selectStoreParams } from "./tool.store.js";

async function main() {
  const server = new McpServer({ name: "cord-search-products", version: "0.1.0" });

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
        content: [],
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
        content: [],
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
