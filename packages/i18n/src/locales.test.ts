import { describe, expect, it } from "vitest";
import { localeFromPath, localeHref, stripLocale } from "./locales";

describe("localeHref", () => {
  it("русский остаётся без префикса", () => {
    expect(localeHref("ru", "/kurs-i-ceny")).toBe("/kurs-i-ceny");
    expect(localeHref("ru", "/")).toBe("/");
  });

  it("казахский получает префикс, главная — без хвостового слеша", () => {
    expect(localeHref("kk", "/kurs-i-ceny")).toBe("/kk/kurs-i-ceny");
    expect(localeHref("kk", "/")).toBe("/kk");
  });

  // Переключение языка на /zapis?doctor=x не должно терять выбранного врача
  it("сохраняет параметры и якорь", () => {
    expect(localeHref("kk", "/zapis?doctor=kuspanova")).toBe("/kk/zapis?doctor=kuspanova");
    expect(localeHref("kk", "/napravleniya#mehanoterapiya")).toBe("/kk/napravleniya#mehanoterapiya");
  });

  it("не трогает внешние адреса и телефоны", () => {
    expect(localeHref("kk", "https://wa.me/77005252577")).toBe("https://wa.me/77005252577");
    expect(localeHref("kk", "tel:+77005252577")).toBe("tel:+77005252577");
    expect(localeHref("kk", "#main")).toBe("#main");
  });
});

describe("stripLocale", () => {
  it("снимает префикс казахского", () => {
    expect(stripLocale("/kk/vrachi")).toBe("/vrachi");
    expect(stripLocale("/kk")).toBe("/");
    expect(stripLocale("/kk/vrachi/kuspanova")).toBe("/vrachi/kuspanova");
  });

  it("русский адрес не меняет", () => {
    expect(stripLocale("/vrachi")).toBe("/vrachi");
    expect(stripLocale("/")).toBe("/");
  });

  // Обычный сегмент не должен приниматься за локаль: адресов /ru/ у нас нет
  it("не путает обычный сегмент с локалью", () => {
    expect(stripLocale("/kontakty")).toBe("/kontakty");
    expect(stripLocale("/ru/kontakty")).toBe("/ru/kontakty");
  });
});

describe("localeFromPath", () => {
  it("узнаёт локаль по первому сегменту", () => {
    expect(localeFromPath("/kk/vrachi")).toBe("kk");
    expect(localeFromPath("/vrachi")).toBe("ru");
    expect(localeFromPath("/")).toBe("ru");
  });
});
