import { z } from "zod";
import { apiGET, apiPOST } from "./client.js";
import type {
  CartDetails,
  CartItemInput,
  CartItemPreview,
  CartToolResult,
} from "./types.js";

const optionalString = z.preprocess((value) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== "string") {
    return value;
  }
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}, z.string().optional());

const metadataSchema = z.record(z.string(), z.unknown());

const cartItemInputSchema = z
  .object({
    productId: optionalString,
    sku: optionalString,
    quantity: z.number().positive({ message: "quantity must be greater than 0" }),
    unitPrice: z.number().positive().optional(),
    notes: optionalString,
    metadata: metadataSchema.optional(),
  })
  .refine((item) => Boolean(item.productId || item.sku), {
    message: "Each item must include productId or sku",
    path: ["productId"],
  });

export const createCartInputSchema = z.object({
  storeId: z.string().min(1),
  branchId: optionalString,
  channel: optionalString,
  notes: optionalString,
  items: z.array(cartItemInputSchema).min(1, "Provide at least one item"),
  metadata: metadataSchema.optional(),
  linkParams: z.record(z.string(), z.string()).optional(),
  includeDetails: z.boolean().optional(),
});

export type CreateCartInput = z.infer<typeof createCartInputSchema>;

const cartItemSchema = z.object({}).passthrough();

const cartSchema = z
  .object({
    id: optionalString,
    status: optionalString,
    storeId: optionalString,
    branchId: optionalString,
    items: z.array(cartItemSchema).optional(),
    totals: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

const previewRowSchema = z.object({
  id: z.string(),
  sku: z.string().nullable(),
  name: z.string(),
  quantity: z.number().nullable(),
  unitPrice: z.number().nullable(),
  totalPrice: z.number().nullable(),
});

const addedItemSchema = z.object({
  input: cartItemInputSchema,
  present: z.boolean(),
});

const outputSchema = z.object({
  message: z.string(),
  cart: cartSchema,
  preview: z.array(previewRowSchema),
  addedItems: z.array(addedItemSchema),
  cartLink: z.string().url().optional(),
  sessionToken: z.string().optional(),
});

type CartApiItem = z.infer<typeof cartItemSchema>;
type CartApiResponse = z.infer<typeof cartSchema>;

function omitUndefined<T extends Record<string, unknown>>(value: T): Record<string, unknown> {
  const entries = Object.entries(value).filter(([, entryValue]) => entryValue !== undefined);
  return Object.fromEntries(entries);
}

const numericKeys = [
  "quantity",
  "total",
  "value",
  "amount",
  "price",
  "unit",
  "regular",
  "final",
  "grandTotal",
  "subtotal",
];

function extractNumber(candidate: unknown, depth = 0): number | null {
  if (candidate === null || candidate === undefined) {
    return null;
  }
  if (typeof candidate === "number") {
    return Number.isFinite(candidate) ? candidate : null;
  }
  if (typeof candidate === "string") {
    const trimmed = candidate.trim();
    if (trimmed === "") {
      return null;
    }
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (typeof candidate !== "object" || depth > 4) {
    return null;
  }
  const record = candidate as Record<string, unknown>;
  for (const key of numericKeys) {
    if (key in record) {
      const value = extractNumber(record[key], depth + 1);
      if (value !== null) {
        return value;
      }
    }
  }
  return null;
}

const stringKeys = ["name", "title", "label", "displayName", "id", "sku", "code"];

function extractString(candidate: unknown, depth = 0): string | null {
  if (candidate === null || candidate === undefined) {
    return null;
  }
  if (typeof candidate === "string") {
    const trimmed = candidate.trim();
    return trimmed === "" ? null : trimmed;
  }
  if (typeof candidate !== "object" || depth > 4) {
    return null;
  }
  const record = candidate as Record<string, unknown>;
  for (const key of stringKeys) {
    if (key in record) {
      const value = extractString(record[key], depth + 1);
      if (value !== null) {
        return value;
      }
    }
  }
  return null;
}

function toPreview(item: CartApiItem, index: number): CartItemPreview {
  const record = item as Record<string, unknown>;
  const product = (record.product as Record<string, unknown> | undefined) ?? undefined;
  const fallbackId = `item-${index + 1}`;
  const idSources = [record.id, product?.id, product?.sku, record.sku];
  const nameSources = [record.name, product?.name, record.title];
  const skuSources = [record.sku, product?.sku];

  const id = idSources.reduce<string | null>((found, candidate) => (found !== null ? found : extractString(candidate)), null) ?? fallbackId;
  const name =
    nameSources.reduce<string | null>((found, candidate) => (found !== null ? found : extractString(candidate)), null) ??
    "Cart item";
  const sku = skuSources.reduce<string | null>((found, candidate) => (found !== null ? found : extractString(candidate)), null);

  const quantity = extractNumber(record.quantity ?? record.qty ?? record.amount ?? product?.quantity ?? record.metrics);
  const unitPrice = extractNumber(
    record.unitPrice ?? record.price ?? record.pricing ?? record.unit ??
      (record.totals as Record<string, unknown> | undefined)?.unit ?? product?.price
  );
  const totalPrice = extractNumber(
    record.totalPrice ?? record.total ?? record.totals ??
      (record.pricing as Record<string, unknown> | undefined)?.total ??
      (record.summary as Record<string, unknown> | undefined)?.total
  );

  return {
    id,
    sku: sku ?? null,
    name,
    quantity,
    unitPrice,
    totalPrice,
  };
}

function buildCartLink(cart: CartApiResponse, storeId: string, linkParams?: Record<string, string>): string | undefined {
  const cartId = extractString(cart.id);
  const template = process.env.CART_LINK_TEMPLATE;
  const baseUrl = process.env.WEB_BASE_URL;

  if (template) {
    const replacements: Record<string, string> = {
      cartId: cartId ?? "",
      storeId,
      status: extractString(cart.status) ?? "",
      branchId: extractString(cart.branchId) ?? "",
    };
    let result = template;
    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
    }
    if (linkParams) {
      for (const [key, value] of Object.entries(linkParams)) {
        result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
      }
    }
    return result;
  }

  if (!baseUrl || !cartId) {
    return undefined;
  }

  const url = new URL(baseUrl);
  const path = url.pathname.replace(/\/$/, "");
  url.pathname = `${path}/cart`;
  url.searchParams.set("cartId", cartId);
  url.searchParams.set("storeId", storeId);
  if (linkParams) {
    for (const [key, value] of Object.entries(linkParams)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

function matchCartItem(input: CartItemInput, item: CartApiItem): boolean {
  const record = item as Record<string, unknown>;
  const product = (record.product as Record<string, unknown> | undefined) ?? undefined;
  const productId = extractString(product?.id ?? record.productId ?? record.id);
  const sku = extractString(product?.sku ?? record.sku);

  if (input.productId && productId) {
    return input.productId === productId;
  }
  if (input.sku && sku) {
    return input.sku === sku;
  }
  return false;
}

function summariseResult(
  cart: CartApiResponse,
  inputs: CartItemInput[],
  preview: CartItemPreview[],
  cartLink?: string
): string {
  const cartId = extractString(cart.id) ?? "unknown cart";
  const status = extractString(cart.status) ?? "ACTIVE";
  const totalItems = cart.items?.length ?? 0;
  const presentCount = inputs.filter((input) => (cart.items ?? []).some((item) => matchCartItem(input, item))).length;
  const parts: string[] = [];

  parts.push(`Cart ${cartId} (${status}) now has ${totalItems} item${totalItems === 1 ? "" : "s"}.`);
  parts.push(`Successfully matched ${presentCount} of ${inputs.length} requested item${inputs.length === 1 ? "" : "s"}.`);
  if (preview.length > 0) {
    parts.push(`Preview the first ${preview.length} item${preview.length === 1 ? "" : "s"} below.`);
  }
  if (cartLink) {
    parts.push(`Open the cart: ${cartLink}`);
  }

  return parts.join(" ");
}

export const createCartWithItems = {
  name: "createCartWithItems",
  description: "Create or reuse a cart for a store and bulk add items, returning a shareable link.",
  inputSchema: createCartInputSchema,
  outputSchema,
  handler: async (input: unknown): Promise<CartToolResult> => {
    const parsed = createCartInputSchema.parse(input);

    const cartPayload = omitUndefined({
      storeId: parsed.storeId,
      branchId: parsed.branchId,
      channel: parsed.channel,
      notes: parsed.notes,
      metadata: parsed.metadata,
    });

    await apiPOST<Record<string, unknown>>("/shopping-cart/v2/cart", cartPayload);

    const bulkPayload = {
      items: parsed.items.map((item) =>
        omitUndefined({
          productId: item.productId,
          sku: item.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes,
          metadata: item.metadata,
        })
      ),
    };

    await apiPOST<Record<string, unknown>>("/shopping-cart/v2/cart/items/bulk", bulkPayload);

    const cartQuery: Record<string, unknown> = { storeId: parsed.storeId };
    if (parsed.includeDetails !== undefined) {
      cartQuery.includeDetails = parsed.includeDetails;
    }

    const cartRaw = await apiGET<Record<string, unknown>>("/shopping-cart/v2/cart", cartQuery);
    const cart = cartSchema.parse(cartRaw);

    const preview = (cart.items ?? []).slice(0, 10).map((item, index) => toPreview(item, index));
    const addedItems = parsed.items.map((inputItem) => ({
      input: inputItem,
      present: (cart.items ?? []).some((item) => matchCartItem(inputItem, item)),
    }));

    const cartLink = buildCartLink(cart, parsed.storeId, parsed.linkParams);
    const message = summariseResult(cart, parsed.items, preview, cartLink);
    const sessionToken = process.env.CART_SESSION_TOKEN ?? process.env.AUTH_BEARER ?? undefined;

    const result: CartToolResult = {
      message,
      cart: cart as CartDetails,
      preview,
      addedItems,
      cartLink,
      sessionToken,
    };

    return outputSchema.parse(result);
  },
};

export type CreateCartResult = z.infer<typeof outputSchema>;
