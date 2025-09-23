import { z } from "zod";
import { apiGET } from "./client.js";
import type { ProductSearchResponse, Product, ProductImage, PageMeta } from "./types.js";

const sortOptions = [
  "name_asc",
  "price_desc",
  "score_desc",
  "releaseDate_desc",
  "discount_desc",
] as const;

const optionalString = z.preprocess(
  (value) => (value === null ? undefined : value),
  z.string().optional()
);

export const searchProductsParams = {
  storeId: z.string().min(1),
  q: optionalString,
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(200).default(20),
  sort: z.array(z.enum(sortOptions)).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  categoryIds: optionalString,
  brandIds: optionalString,
} satisfies z.ZodRawShape;

const pageMetaSchema = z.object({
  number: z.number().int(),
  size: z.number().int(),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  empty: z.boolean(),
});

const productImageSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  order: z.number().int(),
});

const productSchema = z.object({
  id: z.string(),
  externalId: optionalString,
  sku: optionalString,
  ean: optionalString,
  name: optionalString,
  description: optionalString,
  images: z.array(productImageSchema).optional(),
});

const productSearchResponseSchema = z.object({
  page: pageMetaSchema,
  items: z.array(productSchema),
});

type AssertPageMeta = z.infer<typeof pageMetaSchema> extends PageMeta ? true : never;
type AssertProductImage = z.infer<typeof productImageSchema> extends ProductImage ? true : never;
type AssertProduct = z.infer<typeof productSchema> extends Product ? true : never;
type AssertProductSearchResponse = z.infer<typeof productSearchResponseSchema> extends ProductSearchResponse
  ? true
  : never;

type _PageMetaCheck = AssertPageMeta;
type _ProductImageCheck = AssertProductImage;
type _ProductCheck = AssertProduct;
type _ProductSearchResponseCheck = AssertProductSearchResponse;

const inputSchema = z
  .object(searchProductsParams)
  .refine(
    ({ minPrice, maxPrice }) =>
      minPrice === undefined ||
      maxPrice === undefined ||
      (Number.isFinite(minPrice) && Number.isFinite(maxPrice) && minPrice <= maxPrice),
    {
      message: "minPrice must be less than or equal to maxPrice",
      path: ["minPrice"],
    }
  );

export type SearchProductsInput = z.infer<typeof inputSchema>;

export const searchProducts = {
  name: "searchProducts",
  description: "Search products by text, filters, pagination and sorting.",
  inputSchema,
  outputSchema: productSearchResponseSchema,
  handler: async (input: unknown): Promise<ProductSearchResponse> => {
    const parsed = inputSchema.safeParse(input);

    if (!parsed.success) {
      const missingStoreId = parsed.error.errors.some((err) => err.path[0] === "storeId");
      if (missingStoreId) {
        throw new Error(
          "Missing storeId. Ask the user to choose a store (e.g. via selectStore) before searching products."
        );
      }
      throw parsed.error;
    }

    const { storeId, ...query } = parsed.data;
    const response = await apiGET<ProductSearchResponse>(
      `/catalog/v2/stores/${storeId}/products`,
      query
    );
    return productSearchResponseSchema.parse(response);
  },
};

export type SearchProductsResult = z.infer<typeof productSearchResponseSchema>;
