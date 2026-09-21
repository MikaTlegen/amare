import { describe, expect, it } from "vitest";
import { loadEnv } from "./env";

const validEnv = {
  PORT: "3100",
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

function without(source: Record<string, string>, name: string): Record<string, string> {
  return Object.fromEntries(Object.entries(source).filter(([key]) => key !== name));
}

describe("loadEnv", () => {
  it("разбирает корректное окружение и приводит PORT к числу", () => {
    const env = loadEnv(validEnv);

    expect(env.PORT).toBe(3100);
    expect(env.S3_BUCKET).toBe("amare");
  });

  it("подставляет порт 3000 по умолчанию", () => {
    expect(loadEnv(without(validEnv, "PORT")).PORT).toBe(3000);
  });

  it("называет отсутствующие переменные и не раскрывает значения секретов", () => {
    const broken = without(
      { ...validEnv, DATABASE_URL: "not-a-url", S3_SECRET_ACCESS_KEY: "super-secret" },
      "REDIS_URL",
    );

    const act = () => loadEnv(broken);

    expect(act).toThrow(/DATABASE_URL/);
    expect(act).toThrow(/REDIS_URL/);
    expect(act).not.toThrow(/super-secret/);
  });
});
