import type { Metadata } from 'next'
import { FaqPage } from '@/components/pages/FaqPage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.faq, 'ru')

export default function Page() {
  return <FaqPage />
}
