/**
 * Локали и работа с адресом страницы.
 *
 * Отдельно от словарей: клиентский слой (react.tsx) и общие компоненты
 * обязаны обходиться без импорта переводов, иначе любой компонент с useT
 * утянул бы в браузерный бандл все словари сразу.
 */
export const LOCALES = ["ru", "kk"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ru";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Внешние адреса, якоря и tel:/mailto: префикс локали не получают. */
function isInternal(path: string): boolean {
  return path.startsWith("/");
}

/**
 * Адрес страницы в нужной локали: '/zapis?doctor=x' → '/kk/zapis?doctor=x'.
 *
 * Русский лежит в корне и префикса не получает — так старые ссылки на сайт
 * продолжают работать.
 */
export function localeHref(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE || !isInternal(path)) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Тот же адрес без префикса локали: '/kk/vrachi' → '/vrachi'. */
export function stripLocale(path: string): string {
  const [, first, ...rest] = path.split("/");
  if (!first || !isLocale(first) || first === DEFAULT_LOCALE) return path;
  return rest.length > 0 ? `/${rest.join("/")}` : "/";
}

/** Локаль, которой принадлежит адрес. */
export function localeFromPath(path: string): Locale {
  const [, first] = path.split("/");
  return first && isLocale(first) ? first : DEFAULT_LOCALE;
}
