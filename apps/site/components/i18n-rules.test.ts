import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/*
 * Сторож перевода.
 *
 * Проверяет правила по тексту исходников — как mobile-layout.test.ts и
 * palette.test.ts: DOM-тестов в проекте нет.
 */

const componentsDir = fileURLToPath(new URL('.', import.meta.url))

/**
 * Обвязка страницы — она переведена и обязана остаться переведённой.
 * Список пополняется по мере перевода остальных компонентов.
 */
const TRANSLATED = [
  'layout/Header.tsx',
  'layout/Footer.tsx',
  'layout/SiteLogo.tsx',
  'layout/CabinetLink.tsx',
  'layout/SiteShell.tsx',
  'layout/MobileMenu.tsx',
  'BottomNav.tsx',
  'ContactFab.tsx',
  'CookieBanner.tsx',
]

const read = (name: string) => readFileSync(`${componentsDir}${name}`, 'utf8')

/** Комментарии на русском — требование проекта, их проверять не надо. */
function withoutComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
}

describe.each(TRANSLATED)('%s', (name) => {
  it('не содержит русского текста — только ключи словаря', () => {
    const cyrillic = withoutComments(read(name)).match(/[А-Яа-яЁё][А-Яа-яЁё\s.,:—-]*/g) ?? []
    expect(cyrillic).toEqual([])
  })
})

describe('ссылки', () => {
  // Префикс локали добавляет только обёртка: прямой next/link уводит из /kk/
  it.each(TRANSLATED)('%s не импортирует next/link напрямую', (name) => {
    expect(read(name)).not.toMatch(/from ['"]next\/link['"]/)
  })
})
