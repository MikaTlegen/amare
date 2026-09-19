import type { Metadata } from 'next'
import { ContactsPage } from '@/components/pages/ContactsPage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.contacts, 'ru')

export default function Page() {
  return <ContactsPage />
}
