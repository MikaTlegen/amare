import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { COLOR_TOKENS, type ColorToken, contrastRatio, PALETTE, type Rgb, type ThemeName } from "./palette";

const WHITE: Rgb = [255, 255, 255];
const AA_TEXT = 4.5;
const AAA_TEXT = 7;

const cssPath = fileURLToPath(new URL("../styles/tokens.css", import.meta.url));
const css = readFileSync(cssPath, "utf8");

// Достаёт --c-* из блока CSS с указанным селектором
function readCssTheme(selector: string): Record<string, Rgb> {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`В tokens.css нет блока ${selector}`);
  const block = css.slice(start, css.indexOf("}", start));
  const entries = [...block.matchAll(/--c-([a-z0-9-]+):\s*(\d+)\s+(\d+)\s+(\d+)\s*;/g)].map(
    ([, name, r, g, b]) => [name, [Number(r), Number(g), Number(b)] as Rgb] as const,
  );
  return Object.fromEntries(entries);
}

const CSS_SELECTORS: Record<ThemeName, string> = {
  default: ":root",
  highContrast: ':root[data-contrast="high"]',
};

// Пары «текст / фон», которые реально встречаются в наброске интерфейса
const TEXT_PAIRS: ReadonlyArray<[ColorToken | "white", ColorToken]> = [
  ["ink", "bg"],
  ["ink", "surface"],
  ["muted", "bg"],
  ["muted", "surface"],
  ["brand", "surface"],
  ["accent-ink", "accent"],
  ["white", "deep"],
  ["white", "deep-2"],
  ["sky", "deep"],
];

function color(theme: ThemeName, token: ColorToken | "white"): Rgb {
  return token === "white" ? WHITE : PALETTE[theme][token];
}

describe("contrastRatio", () => {
  it("даёт 21:1 для чёрного на белом и 1:1 для одинаковых цветов", () => {
    expect(contrastRatio([0, 0, 0], WHITE)).toBeCloseTo(21, 5);
    expect(contrastRatio(WHITE, WHITE)).toBeCloseTo(1, 5);
  });
});

describe.each(Object.keys(CSS_SELECTORS) as ThemeName[])("тема %s", (theme) => {
  it("tokens.css совпадает с palette.ts", () => {
    const fromCss = readCssTheme(CSS_SELECTORS[theme]);

    expect(Object.keys(fromCss).sort()).toEqual([...COLOR_TOKENS].sort());
    for (const token of COLOR_TOKENS) {
      expect(fromCss[token], token).toEqual(PALETTE[theme][token]);
    }
  });

  const minimum = theme === "default" ? AA_TEXT : AAA_TEXT;

  it.each(TEXT_PAIRS)(`%s на %s — не ниже ${minimum}:1`, (text, background) => {
    expect(contrastRatio(color(theme, text), color(theme, background))).toBeGreaterThanOrEqual(minimum);
  });
});
