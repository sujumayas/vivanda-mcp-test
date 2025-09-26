import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { listStores, searchStores, selectStore } from "../src/tool.store.js";
import { logTest } from "./helpers/logger.js";

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
    logTest("Listing stores with default env", {
      STORE_ID: process.env.STORE_ID,
      STORE_NAME: process.env.STORE_NAME,
      STORE_LIST: process.env.STORE_LIST,
    });

    const result = await listStores.handler();
    logTest("listStores result", result);
    expect(result.stores).toEqual([
      { id: "store-123", name: "Vivanda Store", selected: true },
    ]);
  });

  it("uses STORE_NAME when provided", async () => {
    process.env.STORE_NAME = "My Vivanda";
    logTest("Running listStores with custom STORE_NAME", { STORE_NAME: process.env.STORE_NAME });
    const result = await listStores.handler();
    logTest("listStores result", result);
    expect(result.stores[0]).toMatchObject({ name: "My Vivanda" });
  });

  it("marks provided storeId as selected when available", async () => {
    const input = { storeId: "store-123" } as const;
    logTest("Selecting store", input);
    const result = await selectStore.handler(input);
    logTest("selectStore result", result);
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
    const input = { query: "sur" } as const;
    logTest("Searching stores by name", { input, STORE_LIST: process.env.STORE_LIST });
    const result = await searchStores.handler(input);
    logTest("searchStores result", result);
    expect(result.stores).toEqual([{ id: "store-2", name: "Vivanda Sur" }]);
  });

  it("searches stores by id for exact matches", async () => {
    process.env.STORE_LIST = JSON.stringify([
      { id: "store-1", name: "Vivanda Centro" },
      { id: "store-2", name: "Vivanda Sur" },
    ]);
    const input = { query: "store-1" } as const;
    logTest("Searching stores by id", { input, STORE_LIST: process.env.STORE_LIST });
    const result = await searchStores.handler(input);
    logTest("searchStores result", result);
    expect(result.stores).toEqual([{ id: "store-1", name: "Vivanda Centro" }]);
  });

  it("returns empty results when no store matches", async () => {
    process.env.STORE_LIST = JSON.stringify([
      { id: "store-1", name: "Vivanda Centro" },
    ]);
    const input = { query: "norte" } as const;
    logTest("Searching stores with no match", { input, STORE_LIST: process.env.STORE_LIST });
    const result = await searchStores.handler(input);
    logTest("searchStores result", result);
    expect(result.stores).toEqual([]);
  });

  it("falls back to default stores when env not set", async () => {
    delete process.env.STORE_ID;
    delete process.env.STORE_LIST;
    delete process.env.STORE_NAME;
    logTest("Listing stores using defaults after clearing env" );
    const result = await listStores.handler();
    logTest("listStores result", result);
    expect(result.stores).toEqual([
      { id: "4e68a220-db2a-4328-83e9-ecd029977945", name: "Vivanda San Isidro", selected: true },
    ]);
  });

  it("throws for invalid STORE_LIST JSON", async () => {
    delete process.env.STORE_ID;
    process.env.STORE_LIST = "not-json";
    logTest("Expecting invalid STORE_LIST failure", { STORE_LIST: process.env.STORE_LIST });
    await expect(listStores.handler()).rejects.toThrow(/Invalid STORE_LIST JSON/);
  });
});
