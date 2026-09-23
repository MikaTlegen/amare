import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildMessage, readUtm, submitLead } from "./crm";

const FORM_URL = "https://crm.example.test/api/public/forms/ru/";
const FORM_URL_KK = "https://crm.example.test/api/public/forms/kk/";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_CRM_LEAD_FORM_URL_RU", FORM_URL);
  vi.stubEnv("NEXT_PUBLIC_CRM_LEAD_FORM_URL_KK", FORM_URL_KK);
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
    expect(JSON.parse(String(init.body))).toMatchObject({
      standard_name: "Тест",
      standard_phone: "+7 700 000 00 00",
      website_url: "",
    });
  });

  // Заявку с казахской страницы ждёт своя форма, со своими подписями полей
  it("с казахской страницы шлёт в казахскую форму", async () => {
    const fetchMock = stubFetch(true);

    await submitLead(
      { filledBy: "patient", phone: "+7 700 000 00 00", source: "form", consent: true },
      "kk",
    );

    expect(fetchMock.mock.calls[0]?.[0]).toBe(FORM_URL_KK);
  });

  it("кладёт ответы анкеты в поле дополнительных сведений", async () => {
    const fetchMock = stubFetch(true);

    await submitLead(
      {
        filledBy: "relative",
        strokeAgo: "1-6m",
        mobility: "wheelchair",
        phone: "+7 700 000 00 00",
        source: "form",
        consent: true,
      },
      "kk",
    );

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const message = String(JSON.parse(String(init.body)).standard_message);
    expect(message).toContain("родственник");
    expect(message).toContain("1–6 месяцев");
    expect(message).toContain("на коляске");
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
    vi.stubEnv("NEXT_PUBLIC_CRM_LEAD_FORM_URL_RU", "");
    const fetchMock = stubFetch(true);

    const result = await submitLead({ filledBy: "patient", phone: "+7 700 000 00 00", source: "form", consent: true });

    expect(result).toEqual({ ok: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("buildMessage", () => {
  // Поле в казахской форме обязательное: пустую строку она не примет
  it("без ответов анкеты даёт непустую строку", () => {
    const message = buildMessage({ filledBy: "patient", source: "callback", consent: true });

    expect(message.length).toBeGreaterThan(0);
  });

  it("переносит utm-метки", () => {
    const message = buildMessage({
      filledBy: "patient",
      source: "quiz",
      consent: true,
      utm: { utm_source: "2gis" },
    });

    expect(message).toContain("utm_source=2gis");
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
