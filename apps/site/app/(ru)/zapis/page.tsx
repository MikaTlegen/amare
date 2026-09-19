import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageMessages } from '@/components/PageMessages'
import { BookingPage } from '@/components/pages/BookingPage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.booking, 'ru')

// Страница читает параметры адреса (useSearchParams) — Next требует границу Suspense
export default function Page() {
  return (
    <Suspense>
      <PageMessages path={ROUTES.booking} locale="ru">
        <BookingPage locale="ru" />
      </PageMessages>
    </Suspense>
  )
}
