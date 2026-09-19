import type { Metadata } from 'next'
import { ResultsPage } from '@/components/pages/ResultsPage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.results, 'ru')

export default function Page() {
  return <ResultsPage />
}
