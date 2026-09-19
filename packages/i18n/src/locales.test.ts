import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_LOCALE,
  LANG_STORAGE_KEY,
  localeFromPath,
  localeHref,
  readStoredLocale,
  stripLocale,
  writeStoredLocale,
} from "./locales";

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

describe("хранилище языка", () => {
  it("неизвестное значение откатывается на язык по умолчанию", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => void store.set(key, value),
    });

    expect(readStoredLocale()).toBe(DEFAULT_LOCALE);

    writeStoredLocale("kk");
    expect(readStoredLocale()).toBe("kk");

    store.set(LANG_STORAGE_KEY, "de");
    expect(readStoredLocale()).toBe(DEFAULT_LOCALE);

    vi.unstubAllGlobals();
  });

  it("недоступное хранилище не роняет страницу", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("приватный режим");
      },
      setItem: () => {
        throw new Error("приватный режим");
      },
    });

    expect(readStoredLocale()).toBe(DEFAULT_LOCALE);
    expect(() => writeStoredLocale("kk")).not.toThrow();

    vi.unstubAllGlobals();
  });
});
