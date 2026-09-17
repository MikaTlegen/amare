import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, isLocale, t } from "./index";

describe("t", () => {
  it("возвращает перевод для указанной локали", () => {
    expect(t("en", "common.appName")).toBe("Amare Care");
    expect(t("ru", "health.ok")).toBe("Сервис работает");
  });

  it("падает обратно на локаль по умолчанию, если перевода нет", () => {
    expect(t("kk", "common.missingInKk")).toBe(t(DEFAULT_LOCALE, "common.missingInKk"));
  });
});

describe("isLocale", () => {
  it("принимает только поддерживаемые локали", () => {
    expect(isLocale("kk")).toBe(true);
    expect(isLocale("de")).toBe(false);
  });
});
