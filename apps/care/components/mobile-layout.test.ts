import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/*
 * Сторож мобильной вёрстки кабинета: правила проверяются по тексту
 * исходников, как в packages/ui/src/tokens/palette.test.ts (DOM-тестов нет).
 */

const componentsDir = fileURLToPath(new URL('.', import.meta.url))
const layout = readFileSync(fileURLToPath(new URL('../app/layout.tsx', import.meta.url)), 'utf8')

const sources = readdirSync(componentsDir, { recursive: true, encoding: 'utf8' })
  .filter((name) => name.endsWith('.tsx'))
  .map((name) => ({ name, text: readFileSync(`${componentsDir}${name}`, 'utf8') }))

describe('плавающие кнопки', () => {
  // Кнопка SOS у нижнего края попадает в зону системного жеста iOS,
  // если не учесть безопасную зону.
  it.each(sources)('$name — fixed bottom учитывает безопасную зону', ({ text }) => {
    const risky = (text.match(/className="[^"]*\bfixed\b[^"]*"/g) ?? [])
      .filter((cls) => /\bbottom-/.test(cls))
      .filter((cls) => !/\bhidden\b/.test(cls))
      .filter((cls) => !cls.includes('env(safe-area-inset-bottom)'))

    expect(risky).toEqual([])
  })
})

describe('app/layout.tsx', () => {
  it('объявляет viewport-fit=cover — иначе env(safe-area-inset-*) на iOS равен нулю', () => {
    expect(layout).toMatch(/viewportFit:\s*"cover"/)
  })

  it('не запрещает масштабирование пальцами (S-13)', () => {
    expect(layout).not.toMatch(/userScalable|maximumScale/)
  })
})
