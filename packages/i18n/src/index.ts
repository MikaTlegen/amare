export const LOCALES = ["ru", "kk", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ru";

// Русский словарь — эталон: в нём должны быть все ключи
const ru = {
  "common.appName": "Amare Care",
  "common.missingInKk": "Раздел в разработке",
  "health.ok": "Сервис работает",
} as const;

export type MessageKey = keyof typeof ru;
type Dictionary = Partial<Record<MessageKey, string>>;

const dictionaries: Record<Locale, Dictionary> = {
  ru,
  kk: {
    "common.appName": "Amare Care",
    "health.ok": "Қызмет жұмыс істеп тұр",
  },
  en: {
    "common.appName": "Amare Care",
    "common.missingInKk": "Section under construction",
    "health.ok": "Service is up",
  },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

// Перевод с откатом на локаль по умолчанию, если ключа нет
export function t(locale: Locale, key: MessageKey): string {
  return dictionaries[locale][key] ?? ru[key];
}
