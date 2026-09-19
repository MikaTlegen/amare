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

/**
 * Язык кабинетов хранится в браузере, а не в адресе.
 *
 * Кабинеты за логином и закрыты от индексации, поэтому префикс /kk/ им
 * ничего не даёт, а число экспортируемых страниц удвоил бы. На сайте
 * наоборот: там источник правды — только адрес, и сайт в это хранилище
 * лишь пишет выбор человека, чтобы кабинет открылся на том же языке.
 *
 * На файловом хостинге сайт, /care/ и /staff/ лежат на одном домене,
 * поэтому хранилище у них общее. В разработке (порты 3001–3003) — нет:
 * то же ограничение, что у виджета доступности (docs/DECISIONS.md).
 */
export const LANG_STORAGE_KEY = "amare:lang";

export function readStoredLocale(): Locale {
  try {
    const raw = localStorage.getItem(LANG_STORAGE_KEY);
    return raw && isLocale(raw) ? raw : DEFAULT_LOCALE;
  } catch {
    // приватный режим или заблокированное хранилище — не повод падать
    return DEFAULT_LOCALE;
  }
}

export function writeStoredLocale(locale: Locale): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, locale);
  } catch {
    // см. выше: выбор просто не переживёт перезагрузку
  }
}
