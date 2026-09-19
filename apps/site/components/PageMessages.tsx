import type { ReactNode } from 'react'
import { pickMessages, type Locale } from '@amare/i18n'
import { I18nProvider } from '@amare/i18n/react'
import { namespacesFor } from '@/lib/page-namespaces'

/**
 * Словари для клиентских компонентов страницы.
 *
 * Провайдер вкладывается в тот, что ставит макет: макет даёт обвязку
 * (шапка, подвал, общие компоненты), страница добавляет своё.
 */
export function PageMessages({
  path,
  locale,
  children,
}: {
  path: string
  locale: Locale
  children: ReactNode
}) {
  return (
    <I18nProvider locale={locale} messages={pickMessages(locale, namespacesFor(path))}>
      {children}
    </I18nProvider>
  )
}
