import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { selectStore } from "../src/tool.store.js";

const ORIGINAL_STORE_ID = process.env.STORE_ID;

describe("selectStore tool", () => {
  beforeEach(() => {
    process.env.STORE_ID = "store-123";
  });

  afterEach(() => {
    if (ORIGINAL_STORE_ID === undefined) {
      delete process.env.STORE_ID;
    } else {
      process.env.STORE_ID = ORIGINAL_STORE_ID;
    }
  });

  it("returns configured store with default selection", async () => {
    const result = await selectStore.handler({});
    expect(result.stores).toEqual([
      { id: "store-123", name: "Vivanda Store", selected: true },
    ]);
  });

  it("marks provided storeId as selected when available", async () => {
    const result = await selectStore.handler({ storeId: "store-123" });
    expect(result.stores[0]).toMatchObject({
      id: "store-123",
      selected: true,
    });
  });

  it("throws when no stores configured", async () => {
    delete process.env.STORE_ID;
    await expect(selectStore.handler({})).rejects.toThrow(/No stores configured/);
  });
});
