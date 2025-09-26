import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(moduleDir, "..");

function loadFile(path: string, override = false): void {
  if (existsSync(path)) {
    loadEnv({ path, override });
  }
}

// Load base .env first to provide defaults.
loadFile(resolve(projectRoot, ".env"));

// Allow developer-specific overrides that do not get committed.
loadFile(resolve(projectRoot, ".env.local"), true);

// Fallback to current working directory for compatibility if nothing was loaded.
if (!process.env.BASE_URL || !process.env.AUTH_BEARER) {
  loadEnv();
}
