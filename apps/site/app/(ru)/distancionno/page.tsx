import type { Metadata } from 'next'
import { PageMessages } from '@/components/PageMessages'
import { RemotePage } from '@/components/pages/RemotePage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.remote, 'ru')

export default function Page() {
  return (
    <PageMessages path={ROUTES.remote} locale="ru">
      <RemotePage locale="ru" />
    </PageMessages>
  )
}
