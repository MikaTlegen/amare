import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/*
 * Сторож правил мобильной вёрстки в общем слое.
 *
 * DOM-тестов в проекте нет (ни jsdom, ни Playwright), поэтому проверяем не
 * геометрию, а правила, которыми она держится: текст исходников — как в
 * palette.test.ts. Тест ловит откат правила, а не сам симптом.
 */

const read = (name: string) => readFileSync(fileURLToPath(new URL(name, import.meta.url)), "utf8");

const base = read("./base.css");
const components = read("./components.css");
const chart = read("../barthel-chart.tsx");

describe("base.css — правила против горизонтальной прокрутки", () => {
  it("на телефоне включён overflow-x: clip", () => {
    expect(base).toMatch(/@media \(width < 40rem\)[\s\S]*?overflow-x:\s*clip/);
  });

  it("не использует overflow-x: hidden — он ломает липкую шапку", () => {
    expect(base).not.toMatch(/overflow-x:\s*hidden/);
  });

  it("у якорей есть отступ под липкую шапку", () => {
    expect(base).toMatch(/:target\s*\{[\s\S]*?scroll-margin-top/);
  });

  it("длинные слова в заголовках переносятся", () => {
    expect(base).toMatch(/overflow-wrap:\s*break-word/);
  });

  it("кегль по-прежнему масштабируется виджетом доступности", () => {
    expect(base).toMatch(/font-size:\s*calc\(18px \* var\(--font-scale\)\)/);
  });
});

describe("components.css — зона нажатия", () => {
  it("утилита tap-target есть и растягивает зону по вертикали", () => {
    expect(components).toMatch(/@utility tap-target[\s\S]*?inset-block:\s*-0\.5rem/);
  });
});

describe("barthel-chart — цвета и кегли", () => {
  // Литералы вида rgb(200 53 46) не следовали палитре и не реагировали
  // на data-contrast="high", а размеры в px — на --font-scale.
  // Белый с прозрачностью — исключение: подписи поверх тёмной полосы,
  // отдельного токена для него в палитре нет.
  it("цвета берутся только из переменных палитры", () => {
    const literals = (chart.match(/rgb\([^)]*\)/g) ?? []).filter(
      (color) => !color.includes("var(--c-") && !color.startsWith("rgb(255 255 255"),
    );
    expect(literals).toEqual([]);
  });

  it("кегли подписей заданы в rem", () => {
    expect(chart).not.toMatch(/fontSize:\s*\d/);
    expect(chart).toMatch(/fontSize:\s*'[\d.]+rem'/);
  });
});
