import { afterEach, describe, expect, it, vi } from "vitest";
import { BOOKING_HORIZON_DAYS, createBooking, getSlots } from "./booking";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createBooking", () => {
  it("без согласия на обработку ПД не создаёт запись", async () => {
    const send = vi.spyOn(console, "info").mockImplementation(() => {});

    const result = await createBooking({ slotId: "s-1", name: "Тест", phone: "+7 700 000 00 00", consent: false });

    expect(result).toEqual({ ok: false });
    expect(send).not.toHaveBeenCalled();
  });

  it("с согласием подтверждает запись", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});

    const result = await createBooking({ slotId: "s-1", name: "Тест", phone: "+7 700 000 00 00", consent: true });

    expect(result).toEqual({ ok: true });
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
