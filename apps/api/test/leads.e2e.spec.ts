import "reflect-metadata";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AppModule } from "../src/app.module";
import { ENV, type Env } from "../src/config/env";
import { PG_POOL, REDIS, S3_CLIENT } from "../src/infra/infra.tokens";

const testEnv: Env = {
  NODE_ENV: "test",
  PORT: 3000,
  DATABASE_URL: "postgres://user:pass@localhost:5432/amare",
  REDIS_URL: "redis://localhost:6379",
  S3_ENDPOINT: "http://localhost:3900",
  S3_REGION: "garage",
  S3_BUCKET: "amare",
  S3_ACCESS_KEY_ID: "GKtest",
  S3_SECRET_ACCESS_KEY: "test-secret",
  CRM_LEAD_FORM_URL: "https://crm.example.test/api/public/forms/test/",
  SITE_ORIGINS: "http://localhost:3001",
};

const validLead = {
  filledBy: "relative",
  strokeAgo: "1-6m",
  mobility: "wheelchair",
  name: "Тестов Тест",
  phone: "+7 (700) 000-00-00",
  source: "form",
  consent: true,
};

// Клиенты инфраструктуры подменяются: тесты не ходят в сеть
async function createApp(): Promise<INestApplication> {
  const ok = async (): Promise<string> => "ok";
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(ENV)
    .useValue(testEnv)
    .overrideProvider(PG_POOL)
    .useValue({ query: vi.fn(ok), end: vi.fn(ok) })
    .overrideProvider(REDIS)
    .useValue({ ping: vi.fn(ok), quit: vi.fn(ok) })
    .overrideProvider(S3_CLIENT)
    .useValue({ send: vi.fn(ok), destroy: vi.fn() })
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();
  return app;
}

describe("POST /leads", () => {
  let app: INestApplication | undefined;

  beforeEach(async () => {
    app = await createApp();
  });

  afterEach(async () => {
    await app?.close();
    app = undefined;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("принимает заявку и передаёт её в CRM", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ success: true }) }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await request(app!.getHttpServer()).post("/leads").send(validLead);

    expect(response.status).toBe(202);
    expect(response.body).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  // Сведения о здоровье — особая категория ПД: без согласия заявка не принимается
  it("отклоняет заявку без согласия и не ходит в CRM", async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, status: 200, json: async () => ({}) }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await request(app!.getHttpServer())
      .post("/leads")
      .send({ ...validLead, consent: false });

    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("называет некорректные поля, но не возвращает присланные значения", async () => {
    const response = await request(app!.getHttpServer())
      .post("/leads")
      .send({ ...validLead, phone: "", mobility: "летает" });

    expect(response.status).toBe(400);
    expect(String(response.body.message)).toMatch(/phone/);
    expect(String(response.body.message)).toMatch(/mobility/);
    expect(String(response.body.message)).not.toMatch(/летает/);
  });

  it("сообщает об ошибке, когда CRM недоступна", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("connect ECONNREFUSED");
      }),
    );

    const response = await request(app!.getHttpServer()).post("/leads").send(validLead);

    expect(response.status).toBe(503);
  });
});
