import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageMessages } from '@/components/PageMessages'
import { TeamPage } from '@/components/pages/TeamPage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.team, 'ru')

// Страница читает параметры адреса (useSearchParams) — Next требует границу Suspense
export default function Page() {
  return (
    <Suspense>
      <PageMessages path={ROUTES.team} locale="ru">
        <TeamPage />
      </PageMessages>
    </Suspense>
  )
}
