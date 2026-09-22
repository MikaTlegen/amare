import { describe, expect, it } from "vitest";
import { NAMESPACES } from "../index";
import type { Namespace } from "../types";
import { kk } from "./kk";
import { ru } from "./ru";

/**
 * Сторож словарей.
 *
 * Типы уже не дают завести в казахском лишний ключ, но не ловят расхождение
 * форм значения и не отличают «переведено» от «заглушка». Это делает тест —
 * по образцу palette.test.ts, который так же сторожит токены.
 */

/** Пространства имён, объявленные переведёнными: в них пропуск ключа — ошибка. */
const COMPLETE: readonly Namespace[] = [
  "booking",
  "cabinet",
  "common",
  "contacts",
  "course",
  "directions",
  "doctors",
  "faq",
  "knowledge",
  "footer",
  "forms",
  "home",
  "legal",
  "meta",
  "nav",
  "pages",
  // privacy в список не входит намеренно: тело политики на казахском
  // откатывается на русский, пока перевод не вычитает юрист (kk/privacy.ts)
  "prices",
  "progress",
  "quiz",
  "remote",
  "reviews",
  "staff",
  "stories",
  "ui",
];

const entries = (dictionary: Record<string, unknown>) => Object.entries(dictionary);

function shape(value: unknown): "string" | "list" | "empty" {
  if (Array.isArray(value)) return "list";
  return value === "" ? "empty" : "string";
}

describe.each(NAMESPACES)("пространство имён %s", (ns) => {
  const base = ru[ns] as Record<string, unknown>;
  const draft = kk[ns] as Record<string, unknown>;

  it("в казахском нет ключей, которых нет в эталоне", () => {
    const extra = Object.keys(draft).filter((key) => !(key in base));
    expect(extra).toEqual([]);
  });

  it("форма значения совпадает с эталоном", () => {
    for (const [key, value] of entries(draft)) {
      if (value === undefined) continue;
      expect(shape(value), key).toBe(shape(base[key]));
    }
  });

  it("нет пустых строк-заглушек", () => {
    const empty = entries(draft)
      .filter(([, value]) => value === "" || (Array.isArray(value) && value.length === 0))
      .map(([key]) => key);
    expect(empty).toEqual([]);
  });

  it("плейсхолдеры сохранены", () => {
    const names = (value: unknown) =>
      typeof value === "string" ? [...value.matchAll(/\{(\w+)\}/g)].map(([, name]) => name).sort() : [];

    for (const [key, value] of entries(draft)) {
      if (value === undefined) continue;
      expect(names(value), key).toEqual(names(base[key]));
    }
  });

  it.runIf(COMPLETE.includes(ns))("переведён полностью", () => {
    const missing = Object.keys(base).filter((key) => draft[key] === undefined);
    expect(missing).toEqual([]);
  });
});

describe("формы числа", () => {
  it("у каждого ключа с .one есть .few и .many", () => {
    for (const ns of NAMESPACES) {
      for (const dictionary of [ru[ns], kk[ns]] as Record<string, unknown>[]) {
        for (const key of Object.keys(dictionary)) {
          if (!key.endsWith(".one")) continue;
          const stem = key.slice(0, -".one".length);
          expect(dictionary[`${stem}.few`], `${ns}: ${stem}.few`).toBeTypeOf("string");
          expect(dictionary[`${stem}.many`], `${ns}: ${stem}.many`).toBeTypeOf("string");
        }
      }
    }
  });
});
