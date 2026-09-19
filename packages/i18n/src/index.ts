import { format, pluralForm, PLURAL_FORMS } from "./format";
import { DEFAULT_LOCALE, type Locale } from "./locales";
import { kk } from "./messages/kk";
import { ru } from "./messages/ru";
import type {
  ListKey,
  Messages,
  MessageKey,
  Namespace,
  PluralKey,
  ProvidedMessages,
  Vars,
} from "./types";

export type {
  ListKey,
  Messages,
  MessageKey,
  Namespace,
  Namespaces,
  PluralKey,
  ProvidedMessages,
  Translation,
  Vars,
} from "./types";
export { format, pluralForm } from "./format";

export { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from "./locales";

/** Список пространств имён — по нему ходит тест-сторож и сборка payload'а. */
export const NAMESPACES = Object.keys(ru) as Namespace[];

// Слияние делается один раз на пару «локаль + namespace»: словари неизменяемы
const merged = new Map<string, unknown>();

/**
 * Готовый словарь пространства имён: русский, поверх которого легли непустые
 * значения запрошенной локали.
 *
 * Пустая строка — это «ещё не переведено», а не перевод: она откатывается
 * на русский наравне с отсутствующим ключом.
 */
export function getMessages<N extends Namespace>(locale: Locale, ns: N): Messages<N> {
  const base = ru[ns];
  if (locale === DEFAULT_LOCALE) return base;

  const cacheKey = `${locale}:${ns}`;
  const cached = merged.get(cacheKey);
  if (cached) return cached as Messages<N>;

  const filled = Object.fromEntries(
    Object.entries(kk[ns]).filter(([, value]) => value !== undefined && value !== ""),
  );
  const result = { ...base, ...filled } as Messages<N>;
  merged.set(cacheKey, result);
  return result;
}

/**
 * Читает строку из уже слитого словаря.
 *
 * Отсутствующий ключ возвращается как есть: типы такого не допускают, но
 * составные ключи форм числа собираются в рантайме, и видимый на экране
 * `barthel.score.other` показывает дыру сразу.
 */
function read(locale: Locale, ns: Namespace, key: string): string {
  const messages = getMessages(locale, ns) as Record<string, unknown>;
  const value = messages[key];
  return typeof value === "string" ? value : key;
}

/** Переводчик одного пространства имён: создаётся один раз на страницу. */
export function getT<N extends Namespace>(
  locale: Locale,
  ns: N,
): (key: MessageKey<N>, vars?: Vars) => string {
  return (key, vars) => format(read(locale, ns, key), vars);
}

/** Разовый перевод без создания переводчика. */
export function t<N extends Namespace>(
  locale: Locale,
  ns: N,
  key: MessageKey<N>,
  vars?: Vars,
): string {
  return format(read(locale, ns, key), vars);
}

/** Списковое значение: тезисы статьи, пункты программы. */
export function getList<N extends Namespace>(
  locale: Locale,
  ns: N,
  key: ListKey<N>,
): readonly string[] {
  const messages = getMessages(locale, ns) as Record<string, unknown>;
  const value = messages[key];
  return Array.isArray(value) ? (value as readonly string[]) : [];
}

/**
 * Строка с числом: форму выбирает Intl, `{count}` подставляется сам.
 *
 * Если нужной формы в словаре нет, перебираются остальные — лучше показать
 * соседнюю форму, чем ключ.
 */
export function getPlural<N extends Namespace>(
  locale: Locale,
  ns: N,
): (key: PluralKey<N>, count: number, vars?: Vars) => string {
  return (key, count, vars) => {
    const messages = getMessages(locale, ns) as Record<string, unknown>;
    const selected = pluralForm(locale, count);
    const order = [selected, ...PLURAL_FORMS.filter((form) => form !== selected)];

    for (const form of order) {
      const value = messages[`${key}.${form}`];
      if (typeof value === "string") return format(value, { count, ...vars });
    }
    return key;
  };
}

/**
 * Payload для клиентского провайдера: только те пространства имён, которые
 * действительно нужны странице. Иначе в каждую страницу уедет весь словарь.
 */
export function pickMessages(locale: Locale, namespaces: readonly Namespace[]): ProvidedMessages {
  const picked: Record<string, unknown> = {};
  for (const ns of namespaces) picked[ns] = getMessages(locale, ns);
  return picked as ProvidedMessages;
}
