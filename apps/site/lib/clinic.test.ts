import { describe, expect, it } from "vitest";
import { DOCTORS } from "../data/doctors";
import { ROUTES, bookingLink } from "./clinic";

describe("bookingLink", () => {
  it("ведёт на страницу записи с идентификатором врача", () => {
    // Arrange
    const doctor = DOCTORS[0]!;

    // Act
    const href = bookingLink(doctor.id);

    // Assert
    expect(href).toBe(`${ROUTES.booking}?doctor=${doctor.id}`);
  });

  it("экранирует идентификатор, чтобы он не разломал адрес", () => {
    expect(bookingLink("врач &1")).toBe(`${ROUTES.booking}?doctor=%D0%B2%D1%80%D0%B0%D1%87%20%261`);
  });

  it("даёт рабочую ссылку для каждого врача из справочника", () => {
    for (const doctor of DOCTORS) {
      const url = new URL(bookingLink(doctor.id), "https://amare.kz");

      expect(url.pathname).toBe(ROUTES.booking);
      expect(url.searchParams.get("doctor")).toBe(doctor.id);
    }
  });
});
