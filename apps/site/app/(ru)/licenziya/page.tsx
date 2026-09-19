import type { Metadata } from 'next'
import { StubPage } from '@/components/pages/StubPage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.license, 'ru')

export default function Page() {
  return <StubPage />
}
