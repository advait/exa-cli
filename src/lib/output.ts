import type { ApiError, OutputMode } from "./api.js";

type ErrorPayload = {
  error: string;
  status?: number;
  details?: unknown;
};

export function resolveOutputMode(flags: { plain?: boolean }): OutputMode {
  return flags.plain ? "plain" : "json";
}

export function writeJson(data: unknown): void {
  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
}

export function writeError(mode: OutputMode, error: ErrorPayload): void {
  if (mode === "plain") {
    process.stderr.write(`${error.error}\n`);
    return;
  }

  process.stderr.write(`${JSON.stringify(error, null, 2)}\n`);
}

export function formatApiError(err: ApiError): ErrorPayload {
  if (typeof err.body === "object" && err.body !== null) {
    return {
      error: "API error",
      status: err.status,
      details: err.body,
    };
  }

  return {
    error: err.body ? String(err.body) : err.message,
    status: err.status,
  };
}
