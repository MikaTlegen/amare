import type { Metadata } from 'next'
import { PageMessages } from '@/components/PageMessages'
import { ReviewsPage } from '@/components/pages/ReviewsPage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.reviews, 'ru')

export default function Page() {
  return (
    <PageMessages path={ROUTES.reviews} locale="ru">
      <ReviewsPage locale="ru" />
    </PageMessages>
  )
}
