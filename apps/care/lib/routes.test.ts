import { describe, expect, it } from 'vitest'
import { safeRedirectPath, staffLoginUrl, STAFF_ROLES } from './routes'

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

describe('staffLoginUrl', () => {
  it('ведёт на вход рабочего места и передаёт роль', () => {
    expect(staffLoginUrl('curator')).toBe('http://localhost:3003/vhod?role=curator')
  })

  it('знает все три роли сотрудников', () => {
    expect(STAFF_ROLES).toEqual(['curator', 'moderator', 'admin'])
    for (const role of STAFF_ROLES) {
      expect(staffLoginUrl(role)).toBe(`http://localhost:3003/vhod?role=${role}`)
    }
  })

  it('подставляет в адрес только роль из белого списка', () => {
    // Роль уходит в адресную строку: произвольная строка попадать туда не должна
    const forged = 'admin&next=https://evil.tld' as unknown as (typeof STAFF_ROLES)[number]
    expect(staffLoginUrl(forged)).toBe('http://localhost:3003/vhod?role=curator')
  })
})
