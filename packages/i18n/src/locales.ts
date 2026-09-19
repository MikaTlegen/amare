/**
 * Список локалей отдельно от словарей.
 *
 * Клиентский слой (react.tsx) обязан обходиться без импорта словарей: иначе
 * любой компонент с useT утянул бы в браузерный бандл все переводы сразу.
 */
export const LOCALES = ["ru", "kk"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ru";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
