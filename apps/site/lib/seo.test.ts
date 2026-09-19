import { describe, expect, it } from 'vitest'
import { LOCALES } from '@amare/i18n/locales'
import { ROUTES } from './clinic'
import { allPaths } from './pages'
import { absoluteUrl, alternatesFor, pageMetadata } from './seo'

/*
 * Сторож языковых альтернатив.
 *
 * hreflang учитывается поисковиком только когда ссылки взаимны: каждая
 * версия указывает на себя и на другую. Односторонняя разметка не «работает
 * наполовину», а игнорируется целиком — поэтому проверяется каждый маршрут.
 */

const languagesOf = (path: string, locale: (typeof LOCALES)[number]) => {
  const languages = alternatesFor(path, locale)?.languages
  if (!languages) throw new Error(`нет alternates для ${path}`)
  return languages as Record<string, string>
}

describe('absoluteUrl', () => {
  // Статическая сборка раскладывает страницы папками: без слеша такого адреса нет
  it('всегда с хвостовым слешем и полным доменом', () => {
    expect(absoluteUrl('/')).toMatch(/^https?:\/\/[^/]+\/$/)
    expect(absoluteUrl('/kurs-i-ceny')).toMatch(/\/kurs-i-ceny\/$/)
    expect(absoluteUrl('/kk')).toMatch(/\/kk\/$/)
  })
})

describe.each(allPaths())('альтернативы %s', (path) => {
  it('обе локали ссылаются на одни и те же адреса', () => {
    const [fromRu, fromKk] = LOCALES.map((locale) => languagesOf(path, locale))
    expect(fromRu).toEqual(fromKk)
  })

  it('русская версия без префикса, казахская под /kk/', () => {
    const languages = languagesOf(path, 'ru')

    expect(languages.ru).toBe(absoluteUrl(path))
    expect(languages.kk).toBe(absoluteUrl(path === ROUTES.home ? '/kk' : `/kk${path}`))
  })

  it('x-default указывает на русскую версию', () => {
    const languages = languagesOf(path, 'ru')
    expect(languages['x-default']).toBe(languages.ru)
  })

  it.each([...LOCALES])('canonical локали %s указывает на неё саму', (locale) => {
    const alternates = alternatesFor(path, locale)
    expect(alternates?.canonical).toBe(languagesOf(path, locale)[locale])
  })
})

describe('pageMetadata', () => {
  it('заголовок главной не получает шаблон с названием клиники дважды', () => {
    expect(pageMetadata(ROUTES.home, 'ru').title).toEqual({ absolute: expect.any(String) })
  })

  it('переводит заголовок и описание', () => {
    const ru = pageMetadata(ROUTES.knowledge, 'ru')
    const kk = pageMetadata(ROUTES.knowledge, 'kk')

    expect(ru.title).toBe('База знаний')
    expect(kk.title).toBe('Білім базасы')
    expect(kk.description).not.toBe(ru.description)
  })

  // Карточка врача — не маршрут из ROUTES, заголовок ей ставит страница
  it('для адреса вне реестра отдаёт только альтернативы', () => {
    const metadata = pageMetadata('/vrachi/kuspanova', 'kk')

    expect(metadata.title).toBeUndefined()
    expect(metadata.alternates).toBeDefined()
  })
})
