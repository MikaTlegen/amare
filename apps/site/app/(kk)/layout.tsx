import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { SiteShell } from '@/components/layout/SiteShell'
import { rootMetadata } from '@/lib/seo'
import '../globals.css'

export const metadata: Metadata = rootMetadata('kk')

/*
 * viewport-fit=cover обязателен: без него env(safe-area-inset-*) на iOS всегда 0,
 * и липкие панели уезжают под системную полосу жестов.
 * Масштабирование пальцами не ограничиваем — аудитория 55+ (S-13).
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="kk">{children}</SiteShell>
}
