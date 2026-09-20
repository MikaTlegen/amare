/*
 * Палитра Amare Care данными — для кода, которому нужны значения, а не классы
 * (графики, canvas), и для теста контраста.
 * Те же значения лежат в styles/tokens.css; расхождение ловит palette.test.ts.
 *
 * Цвета сняты с логотипа клиники: бирюза #2BC4D4 и красный #E8503C.
 * Для текста оба затемнены — чистые цвета логотипа не дают 4.5:1 с белым.
 */

export type Rgb = readonly [number, number, number];

export const COLOR_TOKENS = [
  "bg",
  "surface",
  "ink",
  "muted",
  "line",
  "line-strong",
  "scrim",
  "deep",
  "deep-2",
  "brand",
  "brand-bright",
  "sky",
  "accent",
  "accent-ink",
  "tint",
] as const;

export type ColorToken = (typeof COLOR_TOKENS)[number];
export type ThemeName = "default" | "highContrast";
export type Palette = Readonly<Record<ColorToken, Rgb>>;

export const PALETTE: Readonly<Record<ThemeName, Palette>> = {
  default: {
    bg: [242, 247, 248],
    surface: [255, 255, 255],
    ink: [15, 26, 28],
    muted: [76, 95, 99],
    line: [219, 231, 233],
    "line-strong": [116, 142, 149],
    scrim: [6, 32, 42],
    deep: [8, 58, 66],
    "deep-2": [13, 82, 93],
    brand: [9, 118, 132],
    "brand-bright": [43, 196, 212],
    sky: [140, 228, 238],
    accent: [201, 58, 44],
    "accent-ink": [255, 255, 255],
    tint: [224, 246, 249],
  },
  // Контрастная тема: data-contrast="high" на <html>
  highContrast: {
    bg: [255, 255, 255],
    surface: [255, 255, 255],
    ink: [0, 0, 0],
    muted: [26, 26, 26],
    line: [0, 0, 0],
    "line-strong": [0, 0, 0],
    scrim: [0, 0, 0],
    deep: [3, 34, 39],
    "deep-2": [3, 34, 39],
    brand: [4, 80, 90],
    "brand-bright": [4, 80, 90],
    sky: [176, 236, 244],
    accent: [165, 34, 28],
    "accent-ink": [255, 255, 255],
    tint: [233, 247, 249],
  },
};

export function toCssRgb([r, g, b]: Rgb): string {
  return `rgb(${r} ${g} ${b})`;
}

// Относительная яркость по WCAG 2.x
function relativeLuminance(rgb: Rgb): number {
  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Контраст двух цветов по WCAG: от 1 до 21
export function contrastRatio(a: Rgb, b: Rgb): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x) as [number, number];
  return (lighter + 0.05) / (darker + 0.05);
}
