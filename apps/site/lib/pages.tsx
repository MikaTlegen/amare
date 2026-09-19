import { Suspense } from 'react'
import type { ReactNode } from 'react'
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
  render: () => ReactNode
}

/** TeamPage и BookingPage читают параметры адреса — Next требует границу Suspense. */
const withSuspense = (node: ReactNode): ReactNode => <Suspense>{node}</Suspense>

export const PAGES: Record<string, PageEntry> = {
  [ROUTES.home]: { render: () => <HomePage /> },
  [ROUTES.directions]: { render: () => <DirectionsPage /> },
  [ROUTES.course]: { render: () => <CoursePage /> },
  [ROUTES.team]: { render: () => withSuspense(<TeamPage />) },
  [ROUTES.login]: { render: () => <CabinetRedirect /> },
  [ROUTES.booking]: { render: () => withSuspense(<BookingPage />) },
  [ROUTES.form]: { render: () => <IntakeFormPage /> },
  [ROUTES.remote]: { render: () => <RemotePage /> },
  [ROUTES.knowledge]: { render: () => <KnowledgePage /> },
  [ROUTES.faq]: { render: () => <FaqPage /> },
  [ROUTES.reviews]: { render: () => <ReviewsPage /> },
  [ROUTES.contacts]: { render: () => <ContactsPage /> },
  [ROUTES.results]: { render: () => <ResultsPage /> },

  // Страницы-заглушки: содержимого ещё нет, но ссылка не должна быть битой
  [ROUTES.relatives]: { render: () => <StubPage /> },
  [ROUTES.about]: { render: () => <StubPage /> },
  [ROUTES.jobs]: { render: () => <StubPage /> },
  [ROUTES.offer]: { render: () => <StubPage /> },
  [ROUTES.privacy]: { render: () => <StubPage /> },
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
  return doctorId ? { render: () => <DoctorProfilePage doctorId={doctorId} /> } : null
}
