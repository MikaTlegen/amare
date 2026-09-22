import type { Metadata } from 'next'
import { PageMessages } from '@/components/PageMessages'
import { PrivacyPage } from '@/components/pages/PrivacyPage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.privacy, 'ru')

export default function Page() {
  return (
    <PageMessages path={ROUTES.privacy} locale="ru">
      <PrivacyPage locale="ru" />
    </PageMessages>
  )
}
