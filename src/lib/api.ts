const API_BASE_URL = "https://api.exa.ai";

export type OutputMode = "json" | "plain";

export type ApiErrorBody = unknown;

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody;

  constructor(message: string, status: number, body: ApiErrorBody) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function requireApiKey(): string {
  const key = process.env.EXA_API_KEY;
  if (!key) {
    throw new Error("EXA_API_KEY is required in the environment");
  }
  return key;
}

export async function requestJson(
  path: string,
  apiKey: string,
  body: unknown,
  options?: { accept?: string },
): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: options?.accept ?? "application/json",
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await readResponseBody(response);
    throw new ApiError(`Request failed with status ${response.status}`, response.status, errorBody);
  }

  return response.json();
}

export async function requestStream(
  path: string,
  apiKey: string,
  body: unknown,
): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await readResponseBody(response);
    throw new ApiError(`Request failed with status ${response.status}`, response.status, errorBody);
  }

  return response;
}

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}
