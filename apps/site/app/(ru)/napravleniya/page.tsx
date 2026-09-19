import type { Metadata } from 'next'
import { PageMessages } from '@/components/PageMessages'
import { DirectionsPage } from '@/components/pages/DirectionsPage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.directions, 'ru')

export default function Page() {
  return (
    <PageMessages path={ROUTES.directions} locale="ru">
      <DirectionsPage locale="ru" />
    </PageMessages>
  )
}
