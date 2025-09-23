import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { listStores, searchStores, selectStore } from "../src/tool.store.js";

const ORIGINAL_STORE_ID = process.env.STORE_ID;
const ORIGINAL_STORE_LIST = process.env.STORE_LIST;
const ORIGINAL_STORE_NAME = process.env.STORE_NAME;

describe("store tools", () => {
  beforeEach(() => {
    process.env.STORE_ID = "store-123";
    delete process.env.STORE_LIST;
    delete process.env.STORE_NAME;
  });

  afterEach(() => {
    if (ORIGINAL_STORE_ID === undefined) {
      delete process.env.STORE_ID;
    } else {
      process.env.STORE_ID = ORIGINAL_STORE_ID;
    }

    if (ORIGINAL_STORE_LIST === undefined) {
      delete process.env.STORE_LIST;
    } else {
      process.env.STORE_LIST = ORIGINAL_STORE_LIST;
    }

    if (ORIGINAL_STORE_NAME === undefined) {
      delete process.env.STORE_NAME;
    } else {
      process.env.STORE_NAME = ORIGINAL_STORE_NAME;
    }
  });

  it("lists configured store with default selection", async () => {
    const result = await listStores.handler();
    expect(result.stores).toEqual([
      { id: "store-123", name: "Vivanda Store", selected: true },
    ]);
  });

  it("uses STORE_NAME when provided", async () => {
    process.env.STORE_NAME = "My Vivanda";
    const result = await listStores.handler();
    expect(result.stores[0]).toMatchObject({ name: "My Vivanda" });
  });

  it("marks provided storeId as selected when available", async () => {
    const result = await selectStore.handler({ storeId: "store-123" });
    expect(result.stores[0]).toMatchObject({
      id: "store-123",
      selected: true,
    });
  });

  it("searches stores by name", async () => {
    process.env.STORE_LIST = JSON.stringify([
      { id: "store-1", name: "Vivanda Centro" },
      { id: "store-2", name: "Vivanda Sur" },
    ]);
    const result = await searchStores.handler({ query: "sur" });
    expect(result.stores).toEqual([{ id: "store-2", name: "Vivanda Sur" }]);
  });

  it("searches stores by id for exact matches", async () => {
    process.env.STORE_LIST = JSON.stringify([
      { id: "store-1", name: "Vivanda Centro" },
      { id: "store-2", name: "Vivanda Sur" },
    ]);
    const result = await searchStores.handler({ query: "store-1" });
    expect(result.stores).toEqual([{ id: "store-1", name: "Vivanda Centro" }]);
  });

  it("returns empty results when no store matches", async () => {
    process.env.STORE_LIST = JSON.stringify([
      { id: "store-1", name: "Vivanda Centro" },
    ]);
    const result = await searchStores.handler({ query: "norte" });
    expect(result.stores).toEqual([]);
  });

  it("throws when no stores configured", async () => {
    delete process.env.STORE_ID;
    delete process.env.STORE_LIST;
    await expect(listStores.handler()).rejects.toThrow(/No stores configured/);
  });
});
