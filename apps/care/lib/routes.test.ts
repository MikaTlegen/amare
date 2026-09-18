import { describe, expect, it } from 'vitest'
import { safeRedirectPath } from './routes'

describe('safeRedirectPath', () => {
  it('пропускает одиночный относительный путь', () => {
    expect(safeRedirectPath('/kabinet/opekun')).toBe('/kabinet/opekun')
  })

  it('отклоняет null и пустую строку', () => {
    expect(safeRedirectPath(null)).toBeNull()
    expect(safeRedirectPath('')).toBeNull()
  })

  it('отклоняет внешний домен без ведущего слэша', () => {
    expect(safeRedirectPath('https://evil.tld')).toBeNull()
  })

  it('отклоняет протокол-относительный URL (//host)', () => {
    expect(safeRedirectPath('//evil.tld')).toBeNull()
  })

  it('отклоняет обратный слэш, который браузер трактует как //', () => {
    expect(safeRedirectPath('/\\evil.tld')).toBeNull()
  })
})
