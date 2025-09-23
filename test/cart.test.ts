import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { createCartWithItems } from "../src/tool.cart.js";
import { apiGET, apiPOST } from "../src/client.js";
import type { CartToolResult } from "../src/types.js";

vi.mock("../src/client.js", () => ({
  apiGET: vi.fn(),
  apiPOST: vi.fn(),
}));

const mockedApiGET = vi.mocked(apiGET);
const mockedApiPOST = vi.mocked(apiPOST);

function mockCartResponse(): Record<string, unknown> {
  return {
    id: "cart-123",
    status: "ACTIVE",
    items: [
      {
        id: "item-1",
        quantity: 2,
        product: {
          id: "prod-1",
          sku: "sku-1",
          name: "Cookies",
        },
        totals: {
          total: 18,
        },
        pricing: {
          unitPrice: 9,
        },
      },
    ],
    totals: {
      grandTotal: 18,
    },
  };
}

const ORIGINAL_WEB_BASE = process.env.WEB_BASE_URL;
const ORIGINAL_CART_TOKEN = process.env.CART_SESSION_TOKEN;
const ORIGINAL_TEMPLATE = process.env.CART_LINK_TEMPLATE;

describe("createCartWithItems tool", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.WEB_BASE_URL = "https://shop.example.com";
    process.env.CART_SESSION_TOKEN = "token-123";
    delete process.env.CART_LINK_TEMPLATE;
  });

  afterEach(() => {
    if (ORIGINAL_WEB_BASE === undefined) {
      delete process.env.WEB_BASE_URL;
    } else {
      process.env.WEB_BASE_URL = ORIGINAL_WEB_BASE;
    }
    if (ORIGINAL_CART_TOKEN === undefined) {
      delete process.env.CART_SESSION_TOKEN;
    } else {
      process.env.CART_SESSION_TOKEN = ORIGINAL_CART_TOKEN;
    }
    if (ORIGINAL_TEMPLATE === undefined) {
      delete process.env.CART_LINK_TEMPLATE;
    } else {
      process.env.CART_LINK_TEMPLATE = ORIGINAL_TEMPLATE;
    }
  });

  it("creates a cart, adds items in bulk, and returns summary", async () => {
    mockedApiPOST.mockResolvedValueOnce({ id: "cart-123" });
    mockedApiPOST.mockResolvedValueOnce({});
    mockedApiGET.mockResolvedValueOnce(mockCartResponse());

    const result = (await createCartWithItems.handler({
      storeId: "store-1",
      items: [
        {
          productId: "prod-1",
          quantity: 2,
        },
      ],
    })) as CartToolResult;

    expect(mockedApiPOST).toHaveBeenNthCalledWith(1, "/shopping-cart/v2/cart", {
      storeId: "store-1",
    });

    expect(mockedApiPOST).toHaveBeenNthCalledWith(2, "/shopping-cart/v2/cart/items/bulk", {
      items: [
        {
          productId: "prod-1",
          quantity: 2,
        },
      ],
    });

    expect(mockedApiGET).toHaveBeenCalledWith("/shopping-cart/v2/cart", {
      storeId: "store-1",
    });

    expect(result.cart.id).toBe("cart-123");
    expect(result.preview[0]?.name).toBe("Cookies");
    expect(result.preview[0]?.sku).toBe("sku-1");
    expect(result.sessionToken).toBe("token-123");
    expect(result.cartLink).toBe("https://shop.example.com/cart?cartId=cart-123&storeId=store-1");
  });

  it("uses template link when provided", async () => {
    process.env.CART_LINK_TEMPLATE = "https://example.com/{storeId}/cart/{cartId}";
    mockedApiPOST.mockResolvedValue({});
    mockedApiGET.mockResolvedValue(mockCartResponse());

    const result = await createCartWithItems.handler({
      storeId: "store-1",
      items: [
        {
          productId: "prod-1",
          quantity: 1,
        },
      ],
    });

    expect((result as CartToolResult).cartLink).toBe("https://example.com/store-1/cart/cart-123");
  });

  it("rejects items without product identifiers", async () => {
    await expect(
      createCartWithItems.handler({
        storeId: "store-1",
        items: [
          {
            quantity: 1,
          },
        ],
      })
    ).rejects.toThrow(/productId or sku/);
  });
});
