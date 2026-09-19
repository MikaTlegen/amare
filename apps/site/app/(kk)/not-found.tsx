import type { Metadata } from 'next'
import { t } from '@amare/i18n'
import { NotFoundPage } from '@/components/pages/NotFoundPage'

export const metadata: Metadata = { title: t('kk', 'meta', 'notFound') }

export default function NotFound() {
  return <NotFoundPage />
}
