import type { Metadata } from 'next'
import { DirectionsPage } from '@/components/pages/DirectionsPage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.directions, 'ru')

export default function Page() {
  return <DirectionsPage />
}
