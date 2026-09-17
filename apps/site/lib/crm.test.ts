import { afterEach, describe, expect, it, vi } from "vitest";
import { readUtm, submitLead } from "./crm";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("submitLead", () => {
  // Сведения о здоровье — особая категория ПД (раздел 4 ТЗ): без согласия ничего не уходит
  it("без согласия возвращает ok: false и ничего не отправляет", async () => {
    const send = vi.spyOn(console, "info").mockImplementation(() => {});

    const result = await submitLead({ filledBy: "relative", phone: "+7 700 000 00 00", source: "form", consent: false });

    expect(result).toEqual({ ok: false });
    expect(send).not.toHaveBeenCalled();
  });

  it("с согласием принимает заявку", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});

    const result = await submitLead({ filledBy: "patient", name: "Тест", source: "quiz", consent: true });

    expect(result).toEqual({ ok: true });
  });
});

describe("readUtm", () => {
  it("берёт из адреса только utm-метки", () => {
    vi.stubGlobal("window", { location: { search: "?utm_source=2gis&utm_campaign=stroke&phone=123&ref=x" } });

    expect(readUtm()).toEqual({ utm_source: "2gis", utm_campaign: "stroke" });
  });

  it("на сервере возвращает пустой объект", () => {
    vi.stubGlobal("window", undefined);

    expect(readUtm()).toEqual({});
  });
});
