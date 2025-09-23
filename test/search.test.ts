import { describe, expect, it, vi, beforeEach } from "vitest";
import { searchProducts } from "../src/tool.search.js";
import type { ProductSearchResponse } from "../src/types.js";
import { apiGET } from "../src/client.js";

vi.mock("../src/client.js", () => ({
  apiGET: vi.fn(),
}));

const mockedApiGET = vi.mocked(apiGET);

describe("searchProducts tool", () => {
  beforeEach(() => {
    mockedApiGET.mockReset();
  });

  it("returns API payload with expected query parameters", async () => {
    const payload: ProductSearchResponse = {
      page: {
        number: 0,
        size: 10,
        totalElements: 1,
        totalPages: 1,
        empty: false,
      },
      items: [
        {
          id: "1",
          name: "Product 1",
        },
      ],
    };

    mockedApiGET.mockResolvedValueOnce(payload);

    const result = await searchProducts.handler({
      storeId: "12345",
      q: "galleta",
      size: 10,
      sort: ["price_desc"],
      minPrice: 5,
      maxPrice: 100,
      categoryIds: "cat1,cat2",
      brandIds: "brandA",
    });

    expect(mockedApiGET).toHaveBeenCalledWith(
      "/catalog/v2/stores/12345/products",
      {
        q: "galleta",
        page: 0,
        size: 10,
        sort: ["price_desc"],
        minPrice: 5,
        maxPrice: 100,
        categoryIds: "cat1,cat2",
        brandIds: "brandA",
      }
    );
    expect(result).toEqual(payload);
  });

  it("alerts when storeId missing", async () => {
    await expect(searchProducts.handler({ q: "chocolate" })).rejects.toThrow(/Missing storeId/);
  });

  it("applies default pagination values", async () => {
    const payload: ProductSearchResponse = {
      page: {
        number: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0,
        empty: true,
      },
      items: [],
    };

    mockedApiGET.mockResolvedValueOnce(payload);

    await searchProducts.handler({ storeId: "store-1" });

    expect(mockedApiGET).toHaveBeenCalledWith(
      "/catalog/v2/stores/store-1/products",
      {
        page: 0,
        size: 20,
      }
    );
  });

  it("rejects invalid price ranges", async () => {
    await expect(
      searchProducts.handler({ storeId: "store", minPrice: 100, maxPrice: 10 })
    ).rejects.toThrow(/minPrice must be less than or equal to maxPrice/);
  });
});
