import type { Metadata } from 'next'
import { PageMessages } from '@/components/PageMessages'
import { HomePage } from '@/components/pages/HomePage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.home, 'ru')

export default function Page() {
  return (
    <PageMessages path={ROUTES.home} locale="ru">
      <HomePage />
    </PageMessages>
  )
}
