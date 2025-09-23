import { z } from "zod";
import { apiGET } from "./client.js";
import type {
  ProductSearchResponse,
  Product,
  ProductImage,
  PageMeta,
  ProductPricing,
} from "./types.js";

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

function normalizeBrand(input: unknown, depth = 0): string | undefined {
  if (input === null || input === undefined) {
    return undefined;
  }
  if (typeof input === "string") {
    const trimmed = input.trim();
    return trimmed === "" ? undefined : trimmed;
  }
  if (typeof input !== "object" || depth > 3) {
    return undefined;
  }
  const candidate = input as Record<string, unknown>;
  const keys = ["name", "label", "displayName", "value", "title"] as const;
  for (const key of keys) {
    if (key in candidate) {
      const nested = normalizeBrand(candidate[key], depth + 1);
      if (nested !== undefined) {
        return nested;
      }
    }
  }
  return undefined;
}

function normalizeNumeric(input: unknown, depth = 0): number | null | undefined {
  if (input === null) {
    return null;
  }
  if (input === undefined) {
    return undefined;
  }
  if (typeof input === "number") {
    return Number.isFinite(input) ? input : undefined;
  }
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (trimmed === "") {
      return undefined;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  if (typeof input !== "object" || depth > 3) {
    return undefined;
  }
  const candidate = input as Record<string, unknown>;
  const keys = ["amount", "value", "price", "current", "regular", "final"] as const;
  for (const key of keys) {
    if (key in candidate) {
      const nested = normalizeNumeric(candidate[key], depth + 1);
      if (nested !== undefined) {
        return nested;
      }
    }
  }
  return undefined;
}

function normalizePricing(input: unknown): ProductPricing | undefined {
  if (input === null || input === undefined) {
    return undefined;
  }
  if (typeof input !== "object") {
    const value = normalizeNumeric(input);
    if (value === undefined) {
      return undefined;
    }
    return { finalPrice: value };
  }

  const candidate = input as Record<string, unknown>;

  const regularPrice = normalizeNumeric(
    candidate.regularPrice ?? candidate.listPrice ?? candidate.originalPrice ?? candidate.original
  );
  const finalPrice = normalizeNumeric(
    candidate.finalPrice ?? candidate.currentPrice ?? candidate.salePrice ?? candidate.price
  );
  const discount = normalizeNumeric(
    candidate.discount ?? candidate.discountPercent ?? candidate.percentage ?? candidate.percent
  );

  const pricing: ProductPricing = {};
  if (regularPrice !== undefined) {
    pricing.regularPrice = regularPrice;
  }
  if (finalPrice !== undefined) {
    pricing.finalPrice = finalPrice;
  }
  if (discount !== undefined) {
    pricing.discount = discount;
  }

  return Object.keys(pricing).length > 0 ? pricing : undefined;
}

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

const brandSchema = z.preprocess(
  (value) => normalizeBrand(value),
  z.string().optional()
);

const priceValueSchema = z.preprocess(
  (value) => normalizeNumeric(value),
  z.number().nullable().optional()
);

const pricingSchemaInner = z
  .object({
    regularPrice: priceValueSchema,
    discount: priceValueSchema,
    finalPrice: priceValueSchema,
  })
  .partial();

const pricingSchema = z.preprocess(
  (value) => normalizePricing(value),
  pricingSchemaInner.optional()
);

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
  brand: brandSchema,
  pricing: pricingSchema.optional(),
});

const productSearchResponseSchema = z.object({
  page: pageMetaSchema,
  items: z.array(productSchema),
});

type AssertPageMeta = z.infer<typeof pageMetaSchema> extends PageMeta ? true : never;
type AssertProductImage = z.infer<typeof productImageSchema> extends ProductImage ? true : never;
type AssertProduct = z.infer<typeof productSchema> extends Product ? true : never;
type AssertProductPricing = z.infer<typeof pricingSchema> extends ProductPricing ? true : never;
type AssertProductSearchResponse = z.infer<typeof productSearchResponseSchema> extends ProductSearchResponse
  ? true
  : never;

type _PageMetaCheck = AssertPageMeta;
type _ProductImageCheck = AssertProductImage;
type _ProductCheck = AssertProduct;
type _ProductPricingCheck = AssertProductPricing;
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
