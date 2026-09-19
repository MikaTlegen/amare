import type { Metadata } from 'next'
import { PageMessages } from '@/components/PageMessages'
import { KnowledgePage } from '@/components/pages/KnowledgePage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.knowledge, 'ru')

export default function Page() {
  return (
    <PageMessages path={ROUTES.knowledge} locale="ru">
      <KnowledgePage locale="ru" />
    </PageMessages>
  )
}
