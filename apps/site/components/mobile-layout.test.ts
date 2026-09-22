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
// Корневых макетов два: у каждой локали свой <html lang> (см. app/(ru) и app/(kk))
const layouts = ["(ru)", "(kk)"].map((group) => ({
  name: `app/${group}/layout.tsx`,
  text: readFileSync(fileURLToPath(new URL(`../app/${group}/layout.tsx`, import.meta.url)), "utf8"),
}));

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

describe("карточка куки над нижней навигацией", () => {
  // Свести эти два числа в одну константу нельзя: Tailwind собирает классы
  // по тексту исходников и вычисленную строку не увидит. Поэтому их
  // согласованность сторожит тест.
  const rem = (name: string, pattern: RegExp) => {
    const source = sources.find((file) => file.name.endsWith(name));
    const value = source?.text.match(pattern)?.[1];

    expect(value, `${name}: не найден размер по образцу ${pattern}`).toBeDefined();
    return Number(value);
  };

  it("отступ карточки больше высоты панели — иначе карточка ляжет на вкладки", () => {
    const navHeight = rem("BottomNav.tsx", /h-\[calc\(([\d.]+)rem_\+_env\(safe-area-inset-bottom\)\)\]/);
    const cardOffset = rem("CookieBanner.tsx", /bottom-\[calc\(([\d.]+)rem_\+_env\(safe-area-inset-bottom\)\)\]/);

    expect(cardOffset).toBeGreaterThan(navHeight);
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

describe.each(layouts)("$name", ({ text }) => {
  it("объявляет viewport-fit=cover — иначе env(safe-area-inset-*) на iOS равен нулю", () => {
    expect(text).toMatch(/viewportFit:\s*'cover'/);
  });

  it("не запрещает масштабирование пальцами (S-13)", () => {
    expect(text).not.toMatch(/userScalable|maximumScale/);
  });
});
