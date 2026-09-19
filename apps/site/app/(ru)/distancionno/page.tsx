import type { Metadata } from 'next'
import { RemotePage } from '@/components/pages/RemotePage'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.remote, 'ru')

export default function Page() {
  return <RemotePage />
}
