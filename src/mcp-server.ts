import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { searchProducts, searchProductsParams } from "./tool.search.js";
import { createCartWithItems } from "./tool.cart.js";
import {
  listStores,
  searchStores,
  selectStore,
  selectStoreParams,
} from "./tool.store.js";
import type {
  CartToolResult,
  ProductSearchResponse,
  StoreListResponse,
} from "./types.js";

type StoreSummaryContext = "list" | "search" | "select";

interface PreviewRow {
  id: string;
  sku: string | null;
  name: string;
  brand: string | null;
  finalPrice: number | null;
  regularPrice: number | null;
  discount: number | null;
}

interface SearchSummary {
  message: string;
  previewRows: PreviewRow[];
  totalOnPage: number;
  previewCount: number;
}

function summarizeStores(
  response: StoreListResponse,
  context: StoreSummaryContext = "list"
): string {
  if (response.stores.length === 0) {
    if (context === "search") {
      return "No stores matched your query.";
    }
    return "No stores configured.";
  }
  const lines = response.stores.map((store) => {
    const selected = store.selected ? " [selected]" : "";
    return `${store.name} (${store.id})${selected}`;
  });
  return `Stores (${response.stores.length}):\n${lines.join("\n")}`;
}

function summarizeSearch(response: ProductSearchResponse): SearchSummary {
  const { items, page } = response;
  const pageNumber = page.number + 1;
  const totalPages = page.totalPages > 0 ? page.totalPages : 1;
  if (items.length === 0) {
    return {
      message: `No products found (page ${pageNumber} of ${totalPages}).`,
      previewRows: [],
      totalOnPage: 0,
      previewCount: 0,
    };
  }
  const previewLimit = 10;
  const previewItems = items.slice(0, previewLimit);
  const previewRows = previewItems.map<PreviewRow>((product) => {
    const { pricing } = product;
    return {
      id: product.id,
      sku: product.sku ?? null,
      name: product.name ?? "Unnamed product",
      brand: product.brand ?? null,
      finalPrice: pricing?.finalPrice ?? pricing?.regularPrice ?? null,
      regularPrice: pricing?.regularPrice ?? null,
      discount: pricing?.discount ?? null,
    };
  });

  const previewLabel =
    items.length > previewLimit
      ? `Preview (first ${previewItems.length} of ${items.length} on this page).`
      : `Showing all ${items.length} items on this page.`;

  const message = `Found ${page.totalElements} products (showing ${items.length} on page ${pageNumber} of ${totalPages}). ${previewLabel} Format the JSON preview data into a table with columns Name, Brand, Final Price, Regular Price, Discount.`;

  return {
    message,
    previewRows,
    totalOnPage: items.length,
    previewCount: previewItems.length,
  };
}

function summarizeCart(result: CartToolResult) {
  const matched = result.addedItems.filter((item) => item.present).length;
  const missing = result.addedItems.length - matched;
  const previewCount = result.preview.length;
  const previewJson = JSON.stringify(result.preview, null, 2);
  const notes =
    missing > 0
      ? `${missing} requested item${missing === 1 ? "" : "s"} could not be confirmed in the cart. Consult the cart details payload for discrepancies.`
      : `All requested items were located in the cart.`;

  const previewMessage =
    previewCount > 0
      ? `Preview data (JSON, first ${previewCount} item${previewCount === 1 ? "" : "s"}):\n\n\`\`\`json\n${previewJson}\n\`\`\`\nFormat this preview as a table with columns Name, SKU, Quantity, Unit Price, Total Price.`
      : "No items available for preview.";

  return {
    notes,
    previewMessage,
  };
}

export function createMcpServer(): McpServer {
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
            type: "text" as const,
            text: summarizeStores(result, "list"),
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
            type: "text" as const,
            text: summarizeStores(result, "search"),
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
            type: "text" as const,
            text: summarizeStores(result, "select"),
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
      const summary = summarizeSearch(result);
      const previewJson = JSON.stringify(summary.previewRows, null, 2);
      return {
        content: [
          {
            type: "text" as const,
            text: summary.message,
          },
          {
            type: "text" as const,
            text: `Preview data (JSON, first ${summary.previewCount} of ${summary.totalOnPage} on this page):\n\n\`\`\`json\n${previewJson}\n\`\`\`\nFormat this preview as a table with columns Name, Brand, Final Price, Regular Price, Discount.`,
          },
        ],
        structuredContent: {
          ...result,
          preview: summary.previewRows,
        } as unknown as Record<string, unknown>,
      };
    }
  );

  server.registerTool(
    createCartWithItems.name,
    {
      title: "Create Cart With Items",
      description: createCartWithItems.description,
      inputSchema: createCartWithItems.inputSchema.shape,
      outputSchema: createCartWithItems.outputSchema.shape,
    },
    async (args, _extra) => {
      const result = await createCartWithItems.handler(args);
      const { notes, previewMessage } = summarizeCart(result);

      const content = [
        {
          type: "text" as const,
          text: result.message,
        },
        {
          type: "text" as const,
          text: notes,
        },
        {
          type: "text" as const,
          text: previewMessage,
        },
      ];

      if (result.cartLink) {
        content.splice(1, 0, {
          type: "text" as const,
          text: `Cart link: ${result.cartLink}`,
        });
      }

      if (result.sessionToken) {
        content.push({
          type: "text" as const,
          text: `Session token (include as Bearer when opening the cart, if required): ${result.sessionToken}`,
        });
      }

      return {
        content,
        structuredContent: result as unknown as Record<string, unknown>,
      };
    }
  );

  return server;
}
