import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readUtm, submitLead } from "./crm";

const FORM_URL = "https://crm.example.test/api/public/forms/test/";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_CRM_LEAD_FORM_URL", FORM_URL);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function stubFetch(ok: boolean): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn(async () => ({ ok, status: ok ? 200 : 400 }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("submitLead", () => {
  // Сведения о здоровье — особая категория ПД (раздел 4 ТЗ): без согласия ничего не уходит
  it("без согласия возвращает ok: false и ничего не отправляет", async () => {
    const fetchMock = stubFetch(true);

    const result = await submitLead({ filledBy: "relative", phone: "+7 700 000 00 00", source: "form", consent: false });

    expect(result).toEqual({ ok: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("с согласием отправляет имя и телефон в лид-форму CRM", async () => {
    const fetchMock = stubFetch(true);

    const result = await submitLead({
      filledBy: "patient",
      name: "Тест",
      phone: "+7 700 000 00 00",
      source: "quiz",
      consent: true,
    });

    expect(result).toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(FORM_URL);
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toEqual({
      standard_name: "Тест",
      standard_phone: "+7 700 000 00 00",
      website_url: "",
    });
  });

  // Боту нельзя показывать, что ловушка сработала, иначе он подберёт обход
  it("не ходит в CRM, если заполнена ловушка для ботов", async () => {
    const fetchMock = stubFetch(true);

    const result = await submitLead({
      filledBy: "patient",
      phone: "+7 700 000 00 00",
      source: "form",
      consent: true,
      websiteUrl: "http://spam.example",
    });

    expect(result).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  // Без этой ветки человек увидит «заявка отправлена», а заявки не будет
  it("возвращает ok: false, когда CRM отклонила заявку", async () => {
    stubFetch(false);

    const result = await submitLead({ filledBy: "patient", phone: "+7 700 000 00 00", source: "form", consent: true });

    expect(result).toEqual({ ok: false });
  });

  it("возвращает ok: false, когда сеть недоступна", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("Failed to fetch");
      }),
    );

    const result = await submitLead({ filledBy: "patient", phone: "+7 700 000 00 00", source: "form", consent: true });

    expect(result).toEqual({ ok: false });
  });

  // Сборка без адреса формы — заявка уйдёт в никуда, честнее показать отказ
  it("возвращает ok: false, если адрес формы не задан при сборке", async () => {
    vi.stubEnv("NEXT_PUBLIC_CRM_LEAD_FORM_URL", "");
    const fetchMock = stubFetch(true);

    const result = await submitLead({ filledBy: "patient", phone: "+7 700 000 00 00", source: "form", consent: true });

    expect(result).toEqual({ ok: false });
    expect(fetchMock).not.toHaveBeenCalled();
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
