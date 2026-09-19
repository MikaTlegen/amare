import type { Locale } from '@amare/i18n/locales'

/** Локаль форматирования дат и чисел: у Intl свои теги, у нас — коды локалей. */
export const INTL_TAG: Record<Locale, string> = { ru: 'ru-RU', kk: 'kk-KZ' }
