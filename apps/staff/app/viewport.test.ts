import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

// Правила окна просмотра проверяются текстом исходника: DOM-тестов в проекте нет
const layout = readFileSync(fileURLToPath(new URL('./layout.tsx', import.meta.url)), 'utf8')

describe('app/layout.tsx', () => {
  it('объявляет viewport-fit=cover — иначе env(safe-area-inset-*) на iOS равен нулю', () => {
    expect(layout).toMatch(/viewportFit:\s*"cover"/)
  })

  it('не запрещает масштабирование пальцами (S-13)', () => {
    expect(layout).not.toMatch(/userScalable|maximumScale/)
  })
})
