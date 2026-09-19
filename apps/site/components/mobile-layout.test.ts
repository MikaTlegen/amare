import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/*
 * Сторож мобильной вёрстки сайта.
 *
 * Проверяет правила по тексту исходников (DOM-тестов в проекте нет),
 * как это уже сделано в packages/ui/src/tokens/palette.test.ts.
 */

const componentsDir = fileURLToPath(new URL(".", import.meta.url));
const layout = readFileSync(fileURLToPath(new URL("../app/layout.tsx", import.meta.url)), "utf8");

const sources = readdirSync(componentsDir, { recursive: true, encoding: "utf8" })
  .filter((name) => name.endsWith(".tsx"))
  .map((name) => ({ name, text: readFileSync(`${componentsDir}${name}`, "utf8") }));

describe("липкие панели", () => {
  // Без env(safe-area-inset-bottom) нижняя панель уходит под системную
  // полосу жестов на iPhone, и её кнопки частично недоступны.
  it.each(sources)("$name — fixed bottom учитывает безопасную зону", ({ text }) => {
    const risky = (text.match(/className="[^"]*\bfixed\b[^"]*"/g) ?? [])
      .filter((cls) => /\bbottom-/.test(cls))
      // Панели, скрытые на телефоне (hidden … md:flex), безопасной зоны не касаются
      .filter((cls) => !/\bhidden\b/.test(cls))
      .filter((cls) => !cls.includes("env(safe-area-inset-bottom)"));

    expect(risky).toEqual([]);
  });
});

describe("боковые отступы", () => {
  // Гаттер страницы один на весь сайт: px-4 sm:px-8 lg:px-20 (как container-content).
  it.each(sources)("$name — не смешивает px-5 с sm:px-8", ({ text }) => {
    const mixed = (text.match(/className=['"][^'"]*['"]/g) ?? []).filter(
      (cls) => /\bpx-5\b/.test(cls) && /\bsm:px-8\b/.test(cls),
    );

    expect(mixed).toEqual([]);
  });
});

describe("app/layout.tsx", () => {
  it("объявляет viewport-fit=cover — иначе env(safe-area-inset-*) на iOS равен нулю", () => {
    expect(layout).toMatch(/viewportFit:\s*"cover"/);
  });

  it("не запрещает масштабирование пальцами (S-13)", () => {
    expect(layout).not.toMatch(/userScalable|maximumScale/);
  });
});
