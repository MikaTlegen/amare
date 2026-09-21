import "reflect-metadata";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
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
};

type Probe = () => Promise<unknown>;

interface Fakes {
  postgres?: Probe;
  redis?: Probe;
  s3?: Probe;
}

const ok: Probe = async () => "ok";
const unavailable: Probe = async () => {
  throw new Error("connect ECONNREFUSED 10.0.0.1:6379");
};

// Настоящие клиенты подменяются: тесты не ходят в сеть
async function createApp(fakes: Fakes = {}): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(ENV)
    .useValue(testEnv)
    .overrideProvider(PG_POOL)
    .useValue({ query: vi.fn(fakes.postgres ?? ok), end: vi.fn(ok) })
    .overrideProvider(REDIS)
    .useValue({ ping: vi.fn(fakes.redis ?? ok), quit: vi.fn(ok) })
    .overrideProvider(S3_CLIENT)
    .useValue({ send: vi.fn(fakes.s3 ?? ok), destroy: vi.fn() })
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();
  return app;
}

describe("health", () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it("GET /health отвечает 200 без проверки зависимостей", async () => {
    app = await createApp({ postgres: unavailable, redis: unavailable, s3: unavailable });

    const response = await request(app.getHttpServer()).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("GET /health/ready отвечает 200, когда postgres, redis и s3 доступны", async () => {
    app = await createApp();

    const response = await request(app.getHttpServer()).get("/health/ready");

    expect(response.status).toBe(200);
    expect(response.body.info).toEqual({
      postgres: { status: "up" },
      redis: { status: "up" },
      s3: { status: "up" },
    });
  });

  it("GET /health/ready отвечает 503 и не раскрывает детали ошибки, если зависимость недоступна", async () => {
    app = await createApp({ redis: unavailable });

    const response = await request(app.getHttpServer()).get("/health/ready");

    expect(response.status).toBe(503);
    expect(response.body.error).toEqual({ redis: { status: "down", message: "unavailable" } });
    expect(JSON.stringify(response.body)).not.toContain("ECONNREFUSED");
  });

  it("неизвестный маршрут закрыт: 404", async () => {
    app = await createApp();

    const response = await request(app.getHttpServer()).get("/admin");

    expect(response.status).toBe(404);
  });
});
