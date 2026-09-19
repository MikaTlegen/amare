import type { Metadata } from 'next'
import { IntakeFormPage } from '@/components/pages/IntakeFormPage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.form, 'ru')

export default function Page() {
  return <IntakeFormPage />
}
