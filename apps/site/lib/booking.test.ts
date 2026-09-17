import { afterEach, describe, expect, it, vi } from "vitest";
import { createBooking, getSlots } from "./booking";

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
