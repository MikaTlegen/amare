import type { Metadata } from 'next'
import { ReviewsPage } from '@/components/pages/ReviewsPage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.reviews, 'ru')

export default function Page() {
  return <ReviewsPage />
}
