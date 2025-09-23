import { z } from "zod";
import type { StoreInfo, StoreListResponse } from "./types.js";

const storeConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

const storeSchema = storeConfigSchema.extend({
  selected: z.boolean().optional(),
});

const storeListSchema = z.object({
  stores: z.array(storeSchema),
});

const listStoresInputSchema = z.object({});

export const selectStoreParams = {
  storeId: z.string().optional(),
} satisfies z.ZodRawShape;

const selectStoreInputSchema = z.object(selectStoreParams);

const searchStoresInputSchema = z.object({
  query: z.string().min(1, "Provide a store name to search for."),
});

type AssertStoreInfo = z.infer<typeof storeSchema> extends StoreInfo ? true : never;
type AssertStoreList = z.infer<typeof storeListSchema> extends StoreListResponse ? true : never;

type _StoreInfoCheck = AssertStoreInfo;
type _StoreListCheck = AssertStoreList;

function getConfiguredStores(): StoreInfo[] {
  const rawList = process.env.STORE_LIST;
  if (rawList && rawList.trim() !== "") {
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawList);
    } catch (error) {
      throw new Error("Invalid STORE_LIST JSON. Expected an array of { id, name } objects.");
    }
    const stores = z.array(storeConfigSchema).parse(parsed);
    return stores;
  }

  const storeId = process.env.STORE_ID;
  if (!storeId) {
    return [];
  }

  const storeName = process.env.STORE_NAME && process.env.STORE_NAME.trim() !== ""
    ? process.env.STORE_NAME
    : "Vivanda Store";

  return [
    {
      id: storeId,
      name: storeName,
    },
  ];
}

function requireStores(): StoreInfo[] {
  const stores = getConfiguredStores();
  if (stores.length === 0) {
    throw new Error("No stores configured. Set STORE_ID or STORE_LIST in the environment.");
  }
  return stores;
}

function markSelected(stores: StoreInfo[], selectedId?: string): StoreInfo[] {
  const targetId = selectedId ?? stores[0]?.id;
  return stores.map((store) => ({
    ...store,
    selected: targetId ? store.id === targetId : undefined,
  }));
}

export const listStores = {
  name: "listStores",
  description: "List all configured stores.",
  inputSchema: listStoresInputSchema,
  outputSchema: storeListSchema,
  handler: async (): Promise<StoreListResponse> => {
    const stores = markSelected(requireStores());
    return storeListSchema.parse({ stores });
  },
};

export const searchStores = {
  name: "searchStores",
  description: "Search configured stores by name and return matching IDs.",
  inputSchema: searchStoresInputSchema,
  outputSchema: storeListSchema,
  handler: async (input: unknown): Promise<StoreListResponse> => {
    const { query } = searchStoresInputSchema.parse(input);
    const stores = requireStores();
    const normalized = query.trim().toLowerCase();

    const matches = stores.filter((store) =>
      store.name.toLowerCase().includes(normalized) || store.id.toLowerCase() === normalized
    );

    const response: StoreListResponse = {
      stores: matches,
    };

    return storeListSchema.parse(response);
  },
};

export const selectStore = {
  name: "selectStore",
  description: "Mark the provided store as selected.",
  inputSchema: selectStoreInputSchema,
  outputSchema: storeListSchema,
  handler: async (input: unknown): Promise<StoreListResponse> => {
    const { storeId } = selectStoreInputSchema.parse(input ?? {});
    const stores = requireStores();

    const payload: StoreListResponse = {
      stores: markSelected(stores, storeId),
    };

    return storeListSchema.parse(payload);
  },
};
