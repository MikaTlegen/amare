import { describe, expect, it, vi } from "vitest";
import { ApiError, createApiClient } from "./index";

function fakeFetch(status: number, body: unknown) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status }));
}

describe("createApiClient().health", () => {
  it("возвращает статус сервиса и ходит на /health", async () => {
    const fetchImpl = fakeFetch(200, { status: "ok" });
    const client = createApiClient({ baseUrl: "http://api.test/", fetchImpl });

    await expect(client.health()).resolves.toEqual({ status: "ok" });
    expect(fetchImpl).toHaveBeenCalledWith("http://api.test/health", expect.any(Object));
  });

  it("бросает ApiError при неуспешном ответе", async () => {
    const client = createApiClient({ baseUrl: "http://api.test", fetchImpl: fakeFetch(503, {}) });

    await expect(client.health()).rejects.toBeInstanceOf(ApiError);
  });

  it("бросает ApiError, если ответ не соответствует контракту", async () => {
    const client = createApiClient({ baseUrl: "http://api.test", fetchImpl: fakeFetch(200, { foo: 1 }) });

    await expect(client.health()).rejects.toBeInstanceOf(ApiError);
  });
});
