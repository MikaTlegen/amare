"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { format, pluralForm, PLURAL_FORMS } from "./format";
import { DEFAULT_LOCALE, type Locale } from "./locales";
import { ui as ruUi } from "./messages/ru/ui";
import type { MessageKey, Namespace, PluralKey, ProvidedMessages, Vars } from "./types";

interface I18nValue {
  locale: Locale;
  messages: ProvidedMessages;
}

/**
 * Значение по умолчанию — русский словарь общих компонентов.
 *
 * Компонент из @amare/ui может оказаться вне провайдера (так работают
 * кабинеты до подключения языка), и тогда он обязан показать текст,
 * а не ключи. Импортируется ровно одно пространство имён: тянуть сюда
 * весь словарь нельзя — он уедет в браузерный бандл целиком.
 */
const FALLBACK: I18nValue = { locale: DEFAULT_LOCALE, messages: { ui: ruUi } };

const I18nContext = createContext<I18nValue>(FALLBACK);

interface Props {
  locale?: Locale;
  messages?: ProvidedMessages;
  children: ReactNode;
}

/**
 * Провайдер словарей для клиентских компонентов.
 *
 * Вложенный провайдер дополняет родительский, а не заменяет: в макете лежит
 * обвязка (nav, footer, ui), на странице — её собственные пространства имён,
 * и страница при этом ничего не знает о макете.
 *
 * Словари приходят пропом от серверного компонента (pickMessages), поэтому
 * в клиентский бандл попадают только строки конкретной страницы.
 */
export function I18nProvider({ locale, messages, children }: Props) {
  const parent = useContext(I18nContext);

  const value = useMemo<I18nValue>(
    () => ({
      locale: locale ?? parent.locale,
      messages: { ...parent.messages, ...messages },
    }),
    [locale, messages, parent],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(I18nContext).locale;
}

function useDictionary(ns: Namespace): Record<string, unknown> {
  const { messages } = useContext(I18nContext);
  return (messages[ns] ?? {}) as Record<string, unknown>;
}

/**
 * Переводчик пространства имён.
 *
 * Если провайдер этого namespace не дал, на экране окажется сам ключ —
 * забытую строку в clientNamespaces видно сразу, а не через неделю.
 */
export function useT<N extends Namespace>(ns: N): (key: MessageKey<N>, vars?: Vars) => string {
  const dictionary = useDictionary(ns);

  return useMemo(
    () => (key: MessageKey<N>, vars?: Vars) => {
      const value = dictionary[key];
      return format(typeof value === "string" ? value : key, vars);
    },
    [dictionary],
  );
}

/** Строка с числом: форму выбирает Intl, `{count}` подставляется сам. */
export function usePlural<N extends Namespace>(
  ns: N,
): (key: PluralKey<N>, count: number, vars?: Vars) => string {
  const dictionary = useDictionary(ns);
  const locale = useLocale();

  return useMemo(
    () => (key: PluralKey<N>, count: number, vars?: Vars) => {
      const selected = pluralForm(locale, count);
      const order = [selected, ...PLURAL_FORMS.filter((form) => form !== selected)];

      for (const form of order) {
        const value = dictionary[`${key}.${form}`];
        if (typeof value === "string") return format(value, { count, ...vars });
      }
      return key;
    },
    [dictionary, locale],
  );
}

/** Клиентский вариант getContent: ключ собирается из данных. */
export function useContent<N extends Namespace>(ns: N): (key: string, vars?: Vars) => string {
  const dictionary = useDictionary(ns);

  return useMemo(
    () => (key: string, vars?: Vars) => {
      const value = dictionary[key];
      return format(typeof value === "string" ? value : key, vars);
    },
    [dictionary],
  );
}

/** Клиентский вариант getContentList. */
export function useContentList<N extends Namespace>(ns: N): (key: string) => readonly string[] {
  const dictionary = useDictionary(ns);

  return useMemo(
    () => (key: string) => {
      const value = dictionary[key];
      return Array.isArray(value) ? (value as readonly string[]) : [];
    },
    [dictionary],
  );
}
