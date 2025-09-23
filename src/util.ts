export type QueryRecord = Record<string, unknown>;

export type QueryParamValue = string | number | boolean;

export type QueryParams = Record<string, QueryParamValue>;

/**
 * Remove empty values from the query object and normalise arrays to comma-separated strings.
 */
export function compactQueryParams(query: QueryRecord): QueryParams {
  const result: QueryParams = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) {
      continue;
    }
    if (typeof value === "string" && value.trim() === "") {
      continue;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) {
        continue;
      }
      result[key] = value.map((entry) => String(entry)).join(",");
      continue;
    }
    result[key] = value as QueryParamValue;
  }
  return result;
}

/**
 * Fetch a mandatory environment variable or throw with a descriptive error.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Collect custom headers from environment variables with a given prefix.
 * HEADER_X_APPLICATION -> header "x-application".
 */
export function headersFromEnv(prefix = "HEADER_"): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const [name, value] of Object.entries(process.env)) {
    if (!name.startsWith(prefix) || value === undefined) {
      continue;
    }
    const headerName = name
      .slice(prefix.length)
      .replace(/_/g, "-")
      .toLowerCase();
    if (value.trim() !== "") {
      headers[headerName] = value;
    }
  }
  return headers;
}
