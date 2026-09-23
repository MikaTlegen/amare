import type { Metadata } from 'next'
import { getMessages, t, type Locale, type MessageKey } from '@amare/i18n'
import { CLINIC, ROUTES } from './clinic'
import { localeHref } from '@amare/i18n/locales'

/**
 * Адреса, заголовки и языковые альтернативы страниц.
 *
 * hreflang работает только взаимно: русская и казахская версии обязаны
 * ссылаться друг на друга и каждая на себя, иначе поисковик игнорирует
 * всю группу целиком. Поэтому альтернативы собираются в одном месте,
 * а не расставляются руками по страницам (сторожит lib/seo.test.ts).
 */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://amaru.tennet.kz').replace(/\/+$/, '')

type MetaKey = MessageKey<'meta'>

const META_KEYS = new Set(Object.keys(getMessages('ru', 'meta')))

/** Путь → имя маршрута. Имена в ROUTES совпадают с ключами словаря meta. */
const ROUTE_NAME_BY_PATH: ReadonlyMap<string, string> = new Map(
  Object.entries(ROUTES).map(([name, path]) => [path, name]),
)

function metaKey(path: string, prefix = ''): MetaKey | null {
  const name = ROUTE_NAME_BY_PATH.get(path)
  if (!name) return null

  const key = `${prefix}${name}`
  return META_KEYS.has(key) ? (key as MetaKey) : null
}

/**
 * Полный адрес страницы с хвостовым слешем.
 *
 * Статическая сборка раскладывает страницы папками (trailingSlash), и
 * canonical без слеша указывал бы на адрес, которого на хостинге нет.
 */
export function absoluteUrl(path: string): string {
  const withSlash = path.endsWith('/') ? path : `${path}/`
  return `${SITE_URL}${withSlash}`
}

export function alternatesFor(path: string, locale: Locale): Metadata['alternates'] {
  return {
    canonical: absoluteUrl(localeHref(locale, path)),
    languages: {
      ru: absoluteUrl(path),
      kk: absoluteUrl(localeHref('kk', path)),
      // Язык по умолчанию для всех прочих: русский лежит в корне
      'x-default': absoluteUrl(path),
    },
  }
}

/** Метаданные страницы с явным заголовком — карточка врача, 404. */
export function entityMetadata(path: string, title: string, locale: Locale): Metadata {
  return { title, alternates: alternatesFor(path, locale) }
}

/** Метаданные страницы из реестра маршрутов. */
export function pageMetadata(path: string, locale: Locale): Metadata {
  const alternates = alternatesFor(path, locale)
  const titleKey = metaKey(path)
  if (!titleKey) return { alternates }

  const descriptionKey = metaKey(path, 'description.')
  const title = t(locale, 'meta', titleKey)

  return {
    // Заголовок главной уже содержит название клиники: шаблон «%s — Amare.kz»
    // приписал бы его второй раз
    title: path === ROUTES.home ? { absolute: title } : title,
    ...(descriptionKey ? { description: t(locale, 'meta', descriptionKey) } : {}),
    alternates,
  }
}

/** Метаданные корневого макета: общие для всех страниц локали. */
export function rootMetadata(locale: Locale): Metadata {
  return {
    // Без него alternates собрались бы относительными, и hreflang стал бы невалидным
    metadataBase: new URL(`${SITE_URL}/`),
    title: {
      default: t(locale, 'meta', 'home'),
      template: `%s — ${CLINIC.name}`,
    },
    description: t(locale, 'meta', 'siteDescription'),
    manifest: '/manifest.webmanifest',
    icons: {
      icon: [
        { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: '/icons/icon-192.png',
    },
  }
}
