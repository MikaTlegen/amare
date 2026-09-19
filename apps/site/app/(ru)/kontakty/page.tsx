import type { Metadata } from 'next'
import { PageMessages } from '@/components/PageMessages'
import { ContactsPage } from '@/components/pages/ContactsPage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.contacts, 'ru')

export default function Page() {
  return (
    <PageMessages path={ROUTES.contacts} locale="ru">
      <ContactsPage locale="ru" />
    </PageMessages>
  )
}
