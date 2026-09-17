import { Onest, Unbounded } from "next/font/google";

/*
 * Шрифты скачиваются при сборке и раздаются с нашего домена:
 * браузер посетителя не обращается к Google.
 * Переменные подхватывает тема @amare/ui (font-display, font-sans).
 */
export const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  display: "swap",
});

export const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
  display: "swap",
});
