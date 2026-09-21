import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BOOKING_HORIZON_DAYS, createBooking, getSlots } from "./booking";

const FORM_URL = "https://crm.example.test/api/public/forms/test/";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_CRM_LEAD_FORM_URL", FORM_URL);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

/** Подменяет сеть: из тестов заявка не должна уходить в настоящую CRM. */
function stubFetch(ok: boolean): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn(async () => ({ ok, status: ok ? 200 : 400 }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("createBooking", () => {
  // Сведения о здоровье — особая категория ПД (раздел 4 ТЗ): без согласия ничего не уходит
  it("без согласия на обработку ПД не создаёт запись и не ходит в CRM", async () => {
    const fetchMock = stubFetch(true);

    const result = await createBooking({ slotId: "s-1", name: "Тест", phone: "+7 700 000 00 00", consent: false });

    expect(result).toEqual({ ok: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("с согласием отправляет имя и телефон в лид-форму CRM", async () => {
    const fetchMock = stubFetch(true);

    const result = await createBooking({ slotId: "s-1", name: "Тест", phone: "+7 700 000 00 00", consent: true });

    expect(result).toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(FORM_URL);
    expect(JSON.parse(String(init.body))).toEqual({
      standard_name: "Тест",
      standard_phone: "+7 700 000 00 00",
      website_url: "",
    });
  });

  // До этого здесь стояла заглушка: она отвечала ok, никуда не сходив, и человек
  // видел «вы записаны», хотя заявки не было ни у кого
  it("возвращает ok: false, когда CRM отклонила заявку", async () => {
    stubFetch(false);

    const result = await createBooking({ slotId: "s-1", name: "Тест", phone: "+7 700 000 00 00", consent: true });

    expect(result).toEqual({ ok: false });
  });

  it("возвращает ok: false, когда сеть недоступна", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("Failed to fetch");
      }),
    );

    const result = await createBooking({ slotId: "s-1", name: "Тест", phone: "+7 700 000 00 00", consent: true });

    expect(result).toEqual({ ok: false });
  });
});

describe("getSlots", () => {
  it("отдаёт демо-слоты с форматом приёма", async () => {
    const slots = await getSlots();

    expect(slots.length).toBeGreaterThan(0);
    expect(slots.every((slot) => ["clinic", "online", "home"].includes(slot.format))).toBe(true);
  });
});

describe('getSlots', () => {
  it('отдаёт слоты всех трёх форматов приёма', async () => {
    const slots = await getSlots()
    const formats = new Set(slots.map((slot) => slot.format))

    expect(formats).toEqual(new Set(['clinic', 'online', 'home']))
  })

  it('не предлагает воскресенье: клиника не работает', async () => {
    const slots = await getSlots()
    const weekdays = slots.map((slot) => new Date(slot.at).getDay())

    expect(weekdays).not.toContain(0)
  })

  it('держит запись в пределах горизонта и не предлагает прошедшие даты', async () => {
    const slots = await getSlots()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const horizon = new Date(today)
    horizon.setDate(horizon.getDate() + BOOKING_HORIZON_DAYS)

    for (const slot of slots) {
      const at = new Date(slot.at)
      expect(at.getTime()).toBeGreaterThan(today.getTime())
      expect(at.getTime()).toBeLessThanOrEqual(horizon.getTime() + 24 * 60 * 60 * 1000)
    }
  })

  it('выдаёт стабильные id: повторный запрос не сдвигает выбранное время', async () => {
    const first = await getSlots()
    const second = await getSlots()

    expect(second.map((slot) => slot.id)).toEqual(first.map((slot) => slot.id))
  })
})

describe('занятое время', () => {
  it('отдаёт и свободные окна, и занятые — разрыв в расписании должен быть объяснён', async () => {
    const slots = await getSlots()

    expect(slots.some((slot) => slot.taken)).toBe(true)
    expect(slots.some((slot) => !slot.taken)).toBe(true)
  })

  it('свободных больше, чем занятых: расписание не выглядит мёртвым', async () => {
    const slots = await getSlots()
    const taken = slots.filter((slot) => slot.taken).length

    expect(taken).toBeLessThan(slots.length - taken)
  })

  it('выезд на дом не предлагается после 13:00 — это не занятость, а отсутствие услуги', async () => {
    const slots = await getSlots()
    const lateHomeVisits = slots.filter(
      (slot) => slot.format === 'home' && slot.at.slice(11) >= '13:00',
    )

    expect(lateHomeVisits).toEqual([])
  })

  it('держит занятость стабильной: повторный запрос не «освобождает» время', async () => {
    const first = await getSlots()
    const second = await getSlots()

    expect(second.map((slot) => slot.taken)).toEqual(first.map((slot) => slot.taken))
  })
})
