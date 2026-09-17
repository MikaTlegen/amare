import type { Metadata } from 'next'
import { HomePage } from '@/components/pages/HomePage'

export const metadata: Metadata = {
  title: 'Полный макет главной страницы',
  robots: { index: false, follow: false },
}

export default function HeaderPreviewPage() {
  return <HomePage />
}
