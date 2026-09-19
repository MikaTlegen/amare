import { describe, expect, it } from 'vitest'
import { getMessages, LOCALES } from '@amare/i18n'
import { ROLE_KEY } from './AuthContext'

/*
 * Сторож подписей ролей кабинета: подпись хранится ключом, а рисует её
 * шапка. Пропущенный перевод иначе показывает «role.patient» пациенту.
 */
describe.each(Object.entries(ROLE_KEY))('роль %s', (_role, key) => {
  it.each([...LOCALES])('переведена на %s', (locale) => {
    const value = (getMessages(locale, 'cabinet') as Record<string, unknown>)[key]
    expect(typeof value === 'string' && value !== '').toBe(true)
  })
})
