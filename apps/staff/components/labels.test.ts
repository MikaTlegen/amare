import { describe, expect, it } from 'vitest'
import { getMessages, LOCALES } from '@amare/i18n'
import { VERDICT_KEY } from '@amare/api-client'
import { STATUS_KEY } from './patient-status'
import { STAFF_ROLE_KEY } from '@/auth/AuthContext'

/*
 * Сторож подписей рабочего места.
 *
 * Роли, статусы светофора и вердикты видеоразбора хранятся ключами:
 * подпись рисует компонент. Забытый ключ иначе доедет до куратора как
 * «status.red» вместо текста, поэтому проверяем перебором по обеим локалям.
 */
const MAPS = {
  'роль сотрудника': STAFF_ROLE_KEY,
  'статус пациента': STATUS_KEY,
  'вердикт видеоразбора': VERDICT_KEY,
}

describe.each(Object.entries(MAPS))('%s', (_name, map) => {
  it.each(Object.entries(map))('%s → %s переведён', (_id, key) => {
    for (const locale of LOCALES) {
      const value = (getMessages(locale, 'staff') as Record<string, unknown>)[key]
      expect(typeof value === 'string' && value !== '', `${locale}: staff.${key}`).toBe(true)
    }
  })
})
