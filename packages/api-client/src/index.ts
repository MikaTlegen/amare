export interface HealthResponse {
  status: "ok";
}

export interface ApiClientOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
}

export interface ApiClient {
  health(): Promise<HealthResponse>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function isHealthResponse(value: unknown): value is HealthResponse {
  return typeof value === "object" && value !== null && (value as { status?: unknown }).status === "ok";
}

export function createApiClient({ baseUrl, fetchImpl = fetch }: ApiClientOptions): ApiClient {
  const root = baseUrl.replace(/\/+$/, "");

  async function getJson(path: string): Promise<unknown> {
    const response = await fetchImpl(`${root}${path}`, { headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new ApiError(`Запрос ${path} завершился с кодом ${response.status}`, response.status);
    }
    return response.json();
  }

  return {
    async health() {
      const body = await getJson("/health");
      // Ответ сервера — внешние данные, проверяем форму перед использованием
      if (!isHealthResponse(body)) {
        throw new ApiError("Ответ /health не соответствует контракту");
      }
      return body;
    },
  };
}
