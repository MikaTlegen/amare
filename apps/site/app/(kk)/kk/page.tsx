import type { Metadata } from 'next'
import { renderPage } from '@/lib/pages'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.home, 'kk')

/** Главная казахской версии. Остальные страницы собирает [...slug]. */
export default function Page() {
  return renderPage(ROUTES.home, 'kk')
}
