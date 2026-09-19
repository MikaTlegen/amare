import type { Metadata } from 'next'
import { PageMessages } from '@/components/PageMessages'
import { CoursePage } from '@/components/pages/CoursePage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.course, 'ru')

export default function Page() {
  return (
    <PageMessages path={ROUTES.course} locale="ru">
      <CoursePage locale="ru" />
    </PageMessages>
  )
}
