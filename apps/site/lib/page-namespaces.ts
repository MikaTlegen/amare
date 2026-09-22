import type { Namespace } from '@amare/i18n'
import { ROUTES } from './clinic'

/**
 * Какие словари нужны клиентским компонентам каждой страницы.
 *
 * Серверные компоненты получают локаль пропом и читают словарь прямо при
 * рендере — в браузер он не едет. Клиентским словарь приносит провайдер,
 * и вот эти строки уже попадают в разметку страницы. Поэтому список
 * точечный: отдать «все словари на всякий случай» — это лишние десятки
 * килобайт в каждой странице.
 *
 * Файл нарочно не импортирует компоненты: его читают и страницы, и реестр,
 * и тесты, а тащить за собой всё дерево страниц никому из них не нужно.
 */
export const PAGE_NAMESPACES: Record<string, readonly Namespace[]> = {
  [ROUTES.home]: ['home', 'prices', 'contacts', 'directions', 'course', 'doctors', 'progress', 'quiz', 'reviews', 'nav'],
  [ROUTES.directions]: [],
  [ROUTES.course]: [],
  [ROUTES.team]: ['doctors', 'prices', 'nav'],
  [ROUTES.login]: ['pages'],
  [ROUTES.booking]: ['booking', 'prices', 'doctors', 'nav'],
  [ROUTES.form]: ['forms', 'contacts', 'nav'],
  [ROUTES.remote]: [],
  [ROUTES.knowledge]: [],
  [ROUTES.faq]: [],
  [ROUTES.reviews]: [],
  [ROUTES.contacts]: ['contacts'],
  [ROUTES.results]: [],
  [ROUTES.relatives]: ['legal', 'meta', 'contacts'],
  [ROUTES.about]: ['legal', 'meta', 'contacts'],
  [ROUTES.jobs]: ['legal', 'meta', 'contacts'],
  [ROUTES.offer]: ['legal', 'meta', 'contacts'],
  [ROUTES.privacy]: ['privacy', 'contacts', 'nav'],
  [ROUTES.license]: ['legal', 'meta', 'contacts'],
}

/** Карточка врача — отдельный маршрут с динамическим сегментом. */
export const DOCTOR_NAMESPACES: readonly Namespace[] = ['doctors', 'contacts', 'booking', 'nav']

export function namespacesFor(path: string): readonly Namespace[] {
  return PAGE_NAMESPACES[path] ?? DOCTOR_NAMESPACES
}
