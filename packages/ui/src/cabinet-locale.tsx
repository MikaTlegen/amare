'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ProvidedMessages } from '@amare/i18n'
import { DEFAULT_LOCALE, readStoredLocale, writeStoredLocale, type Locale } from '@amare/i18n/locales'
import { I18nProvider } from '@amare/i18n/react'

/** Смена языка кабинета: её вызывает переключатель в шапке CabinetShell. */
const SetLocaleContext = createContext<(locale: Locale) => void>(() => undefined)

export function useSetCabinetLocale(): (locale: Locale) => void {
  return useContext(SetLocaleContext)
}

/**
 * Язык кабинета.
 *
 * В адресе его нет: кабинет за логином и закрыт от индексации, префикс
 * /kk/ ничего не дал бы, а число экспортируемых страниц удвоил. Выбор
 * лежит в localStorage и подхватывается на сайте и в обоих кабинетах —
 * домен у них общий.
 *
 * До гидратации язык считается русским. Доступность от этого не страдает:
 * содержимое кабинета целиком за RequireAuth, в статическом HTML его нет,
 * и скринридер получает уже правильный <html lang>.
 */
export function CabinetLocaleProvider({
  messages,
  children,
}: {
  /** Словари по локалям, собранные pickMessages на стороне приложения. */
  messages: Record<Locale, ProvidedMessages>
  children: ReactNode
}) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    setLocale(readStoredLocale())
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const choose = (next: Locale) => {
    setLocale(next)
    writeStoredLocale(next)
  }

  return (
    <I18nProvider locale={locale} messages={messages[locale]}>
      <SetLocaleContext.Provider value={choose}>{children}</SetLocaleContext.Provider>
    </I18nProvider>
  )
}
