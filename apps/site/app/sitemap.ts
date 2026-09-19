import type { MetadataRoute } from 'next'
import { ROUTES } from '@/lib/clinic'
import { localeHref } from '@amare/i18n/locales'
import { allPaths } from '@/lib/pages'
import { absoluteUrl } from '@/lib/seo'

// В статической сборке карта сайта должна быть файлом, а не ответом сервера
export const dynamic = 'force-static'

/**
 * Карта сайта сразу на двух языках.
 *
 * Обе версии перечислены не двумя записями, а одной с alternates: так
 * поисковик понимает, что это одна страница на двух языках, а не дубль.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return allPaths()
    // Страница входа — переход в кабинет, индексировать нечего
    .filter((path) => path !== ROUTES.login)
    .map((path) => ({
      url: absoluteUrl(path),
      alternates: {
        languages: {
          ru: absoluteUrl(path),
          kk: absoluteUrl(localeHref('kk', path)),
        },
      },
    }))
}
