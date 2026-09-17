/*
 * Палитра Amare Care данными — для кода, которому нужны значения, а не классы
 * (графики, canvas), и для теста контраста.
 * Те же значения лежат в styles/tokens.css; расхождение ловит palette.test.ts.
 *
 * Цвета взяты из фирменного стиля клиники: голубой логотипа #07ACE7,
 * бирюза видеороликов #01B0C9, красный второй половины сердца #D73B3A.
 */

export type Rgb = readonly [number, number, number];

export const COLOR_TOKENS = [
  "bg",
  "surface",
  "ink",
  "muted",
  "line",
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
    bg: [243, 247, 249],
    surface: [255, 255, 255],
    ink: [15, 26, 31],
    muted: [76, 93, 102],
    line: [220, 230, 234],
    deep: [11, 58, 74],
    "deep-2": [17, 79, 102],
    brand: [6, 113, 143],
    "brand-bright": [7, 172, 231],
    sky: [127, 215, 242],
    accent: [200, 53, 46],
    "accent-ink": [255, 255, 255],
    tint: [227, 243, 249],
  },
  // Контрастная тема: data-contrast="high" на <html>
  highContrast: {
    bg: [255, 255, 255],
    surface: [255, 255, 255],
    ink: [0, 0, 0],
    muted: [26, 26, 26],
    line: [0, 0, 0],
    deep: [4, 33, 44],
    "deep-2": [4, 33, 44],
    brand: [4, 78, 100],
    "brand-bright": [4, 78, 100],
    sky: [175, 234, 250],
    accent: [165, 34, 28],
    "accent-ink": [255, 255, 255],
    tint: [234, 246, 250],
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
