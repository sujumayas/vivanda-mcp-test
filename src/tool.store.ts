import { z } from "zod";
import type { StoreInfo, StoreListResponse } from "./types.js";

export const selectStoreParams = {
  storeId: z.string().optional(),
} satisfies z.ZodRawShape;

const storeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  selected: z.boolean().optional(),
});

const storeListSchema = z.object({
  stores: z.array(storeSchema),
});

type AssertStoreInfo = z.infer<typeof storeSchema> extends StoreInfo ? true : never;
type AssertStoreList = z.infer<typeof storeListSchema> extends StoreListResponse ? true : never;

type _StoreInfoCheck = AssertStoreInfo;
type _StoreListCheck = AssertStoreList;

const inputSchema = z.object(selectStoreParams);

function availableStores(): StoreInfo[] {
  const storeId = process.env.STORE_ID;
  if (!storeId) {
    return [];
  }
  return [
    {
      id: storeId,
      name: "Vivanda Store",
    },
  ];
}

export const selectStore = {
  name: "selectStore",
  description: "List available stores and mark the selected one.",
  inputSchema,
  outputSchema: storeListSchema,
  handler: async (input: unknown): Promise<StoreListResponse> => {
    const { storeId } = inputSchema.parse(input ?? {});
    const stores = availableStores();

    if (stores.length === 0) {
      throw new Error("No stores configured. Set STORE_ID in the environment.");
    }

    const selectedId = storeId ?? stores[0].id;
    const payload = {
      stores: stores.map((store) => ({
        ...store,
        selected: store.id === selectedId,
      })),
    } satisfies StoreListResponse;

    return storeListSchema.parse(payload);
  },
};
