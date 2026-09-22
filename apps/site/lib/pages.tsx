import { Suspense } from 'react'
import type { ReactNode } from 'react'
import type { Locale } from '@amare/i18n'
import { PageMessages } from '@/components/PageMessages'
import { BookingPage } from '@/components/pages/BookingPage'
import { CabinetRedirect } from '@/components/pages/CabinetRedirect'
import { ContactsPage } from '@/components/pages/ContactsPage'
import { CoursePage } from '@/components/pages/CoursePage'
import { DirectionsPage } from '@/components/pages/DirectionsPage'
import { DoctorProfilePage } from '@/components/pages/DoctorProfilePage'
import { FaqPage } from '@/components/pages/FaqPage'
import { HomePage } from '@/components/pages/HomePage'
import { IntakeFormPage } from '@/components/pages/IntakeFormPage'
import { KnowledgePage } from '@/components/pages/KnowledgePage'
import { PrivacyPage } from '@/components/pages/PrivacyPage'
import { RemotePage } from '@/components/pages/RemotePage'
import { ResultsPage } from '@/components/pages/ResultsPage'
import { ReviewsPage } from '@/components/pages/ReviewsPage'
import { StubPage } from '@/components/pages/StubPage'
import { TeamPage } from '@/components/pages/TeamPage'
import { DOCTORS } from '@/data/doctors'
import { ROUTES } from './clinic'

/**
 * Реестр страниц: путь → что на нём рисуется.
 *
 * Русская версия остаётся файловой (app/(ru)/…), казахская собирается из
 * этого реестра одним catch-all — иначе пришлось бы держать по два файла
 * на каждую страницу и следить, чтобы они не разъехались.
 *
 * Отсюда же берут список маршрутов sitemap и тесты, так что забытая
 * страница видна сразу, а не после жалобы на битую ссылку.
 */
export interface PageEntry {
  render: (locale: Locale) => ReactNode
}

/** TeamPage и BookingPage читают параметры адреса — Next требует границу Suspense. */
const withSuspense = (node: ReactNode): ReactNode => <Suspense>{node}</Suspense>

export const PAGES: Record<string, PageEntry> = {
  [ROUTES.home]: { render: () => <HomePage /> },
  [ROUTES.directions]: { render: (locale) => <DirectionsPage locale={locale} /> },
  [ROUTES.course]: { render: (locale) => <CoursePage locale={locale} /> },
  [ROUTES.team]: { render: () => withSuspense(<TeamPage />) },
  [ROUTES.login]: { render: () => <CabinetRedirect /> },
  [ROUTES.booking]: { render: (locale) => withSuspense(<BookingPage locale={locale} />) },
  [ROUTES.form]: { render: () => <IntakeFormPage /> },
  [ROUTES.remote]: { render: (locale) => <RemotePage locale={locale} /> },
  [ROUTES.knowledge]: { render: (locale) => <KnowledgePage locale={locale} /> },
  [ROUTES.faq]: { render: (locale) => <FaqPage locale={locale} /> },
  [ROUTES.reviews]: { render: (locale) => <ReviewsPage locale={locale} /> },
  [ROUTES.contacts]: { render: (locale) => <ContactsPage locale={locale} /> },
  [ROUTES.results]: { render: (locale) => <ResultsPage locale={locale} /> },
  [ROUTES.privacy]: { render: (locale) => <PrivacyPage locale={locale} /> },

  // Страницы-заглушки: содержимого ещё нет, но ссылка не должна быть битой
  [ROUTES.relatives]: { render: () => <StubPage /> },
  [ROUTES.about]: { render: () => <StubPage /> },
  [ROUTES.jobs]: { render: () => <StubPage /> },
  [ROUTES.offer]: { render: () => <StubPage /> },
  [ROUTES.license]: { render: () => <StubPage /> },
}

/** Карточка врача — единственный маршрут сайта с динамическим сегментом. */
export function doctorPath(doctorId: string): string {
  return `${ROUTES.team}/${doctorId}`
}

function doctorIdFromPath(path: string): string | null {
  const prefix = `${ROUTES.team}/`
  if (!path.startsWith(prefix)) return null

  const id = path.slice(prefix.length)
  return DOCTORS.some((doctor) => doctor.id === id) ? id : null
}

/** Все адреса сайта без префикса локали: реестр плюс карточки врачей. */
export function allPaths(): string[] {
  return [...Object.keys(PAGES), ...DOCTORS.map((doctor) => doctorPath(doctor.id))]
}

export function resolvePage(path: string): PageEntry | null {
  const entry = PAGES[path]
  if (entry) return entry

  const doctorId = doctorIdFromPath(path)
  return doctorId
    ? { render: (locale) => <DoctorProfilePage doctorId={doctorId} locale={locale} /> }
    : null
}

/** Страница вместе со словарями для её клиентских компонентов. */
export function renderPage(path: string, locale: Locale): ReactNode | null {
  const page = resolvePage(path)
  if (!page) return null

  return (
    <PageMessages path={path} locale={locale}>
      {page.render(locale)}
    </PageMessages>
  )
}
