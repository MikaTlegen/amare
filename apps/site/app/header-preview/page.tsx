import type { Metadata } from 'next'
import { AnimatedHeaderPreview } from '@/components/header-preview/AnimatedHeaderPreview'

export const metadata: Metadata = {
  title: 'Макет анимированной шапки',
  robots: { index: false, follow: false },
}

export default function HeaderPreviewPage() {
  return <AnimatedHeaderPreview />
}
