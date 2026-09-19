import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo'

// В статической сборке robots должен быть файлом, а не ответом сервера.
// Лежит в корне app/, а не в группе локали: из группы Next его не собирает.
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${absoluteUrl('/')}sitemap.xml`,
  }
}
