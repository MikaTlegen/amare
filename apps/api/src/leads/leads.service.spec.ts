import "reflect-metadata";
import { ServiceUnavailableException } from "@nestjs/common";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Env } from "../config/env";
import type { Lead } from "./lead.schema";
import { LeadsService } from "./leads.service";

const FORM_URL = "https://crm.example.test/api/public/forms/00000000-0000-0000-0000-000000000000/";

const env = { CRM_LEAD_FORM_URL: FORM_URL } as Env;

const lead: Lead = {
  filledBy: "relative",
  phone: "+7 (700) 000-00-00",
  name: "Тестов Тест",
  source: "form",
  consent: true,
};

function stubFetch(response: { ok: boolean; body?: unknown }): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn(async () => ({
    ok: response.ok,
    status: response.ok ? 200 : 400,
    json: async () => response.body ?? {},
  }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("LeadsService", () => {
  it("отправляет имя и телефон в лид-форму CRM", async () => {
    const fetchMock = stubFetch({ ok: true, body: { success: true, lead_id: 1 } });

    const result = await new LeadsService(env).submit(lead);

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(FORM_URL);
    expect(JSON.parse(String(init.body))).toEqual({
      standard_name: "Тестов Тест",
      standard_phone: "+7 (700) 000-00-00",
      website_url: "",
    });
  });

  // Боту нельзя показывать, что ловушка сработала, иначе он подберёт обход
  it("не ходит в CRM, если заполнена ловушка для ботов", async () => {
    const fetchMock = stubFetch({ ok: true, body: { success: true } });

    const result = await new LeadsService(env).submit({ ...lead, websiteUrl: "http://spam.example" });

    expect(result).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("сообщает об ошибке, когда CRM отклонила заявку", async () => {
    stubFetch({ ok: false, body: { error: "captcha required" } });

    await expect(new LeadsService(env).submit(lead)).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  it("сообщает об ошибке, когда CRM недоступна", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("connect ECONNREFUSED");
      }),
    );

    await expect(new LeadsService(env).submit(lead)).rejects.toBeInstanceOf(ServiceUnavailableException);
  });

  // Данные анкеты не должны теряться молча: форма в CRM их пока не принимает
  it("предупреждает в логах о полях, которых нет в форме CRM", async () => {
    stubFetch({ ok: true, body: { success: true } });
    const service = new LeadsService(env);
    const warn = vi.spyOn(service.logger, "warn").mockImplementation(() => {});

    await service.submit({ ...lead, strokeAgo: "1-6m", mobility: "wheelchair" });

    expect(warn).toHaveBeenCalledOnce();
    expect(String(warn.mock.calls[0]?.[0])).toContain("strokeAgo");
  });
});
