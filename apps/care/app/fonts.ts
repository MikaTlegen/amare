import { Inter, Manrope } from "next/font/google";

/*
 * Шрифты скачиваются при сборке и раздаются с нашего домена:
 * браузер посетителя не обращается к Google.
 * Переменные подхватывает тема @amare/ui (font-display, font-sans).
 */
export const manrope = Manrope({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-inter",
  display: "swap",
});
