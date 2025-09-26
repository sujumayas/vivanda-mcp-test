import { expect } from "vitest";

function currentTestName(): string {
  const state = typeof expect.getState === "function" ? expect.getState() : undefined;
  return state?.currentTestName ?? "unknown";
}

export function logTest(step: string, payload?: unknown): void {
  const prefix = `[test:${currentTestName()}]`;
  if (payload === undefined) {
    console.info(`${prefix} ${step}`);
  } else {
    console.info(`${prefix} ${step}`, payload);
  }
}
