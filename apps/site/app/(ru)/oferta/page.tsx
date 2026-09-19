import type { Metadata } from 'next'
import { PageMessages } from '@/components/PageMessages'
import { StubPage } from '@/components/pages/StubPage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.offer, 'ru')

export default function Page() {
  return (
    <PageMessages path={ROUTES.offer} locale="ru">
      <StubPage />
    </PageMessages>
  )
}
