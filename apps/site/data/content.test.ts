import { describe, expect, it } from 'vitest'
import { getMessages, LOCALES, type Namespace } from '@amare/i18n'
import { DIRECTIONS } from './directions'
import { CONDITION_LIST, DOCTORS } from './doctors'

/*
 * Сторож связки «данные ↔ словарь».
 *
 * Ключи вида `<id>.<поле>` собираются в рантайме из data/*.ts, и типы их
 * проверить не могут. Забытый ключ иначе доедет до посетителя как
 * «kuspanova.about» вместо текста — поэтому проверяем перебором.
 */

const has = (ns: Namespace, key: string, kind: 'string' | 'list') => {
  for (const locale of LOCALES) {
    const value = (getMessages(locale, ns) as Record<string, unknown>)[key]
    const ok = kind === 'list' ? Array.isArray(value) : typeof value === 'string' && value !== ''
    expect(ok, `${locale}: ${ns}.${key}`).toBe(true)
  }
}

describe.each(DIRECTIONS)('направление $id', ({ id }) => {
  it.each(['title', 'method', 'short', 'full', 'photoAlt'])('есть %s', (field) => {
    has('directions', `${id}.${field}`, 'string')
  })

  it('есть список тегов', () => {
    has('directions', `${id}.tags`, 'list')
  })
})

describe.each(DOCTORS)('врач $id', ({ id, certificates }) => {
  it.each(['name', 'role', 'experience', 'about'])('есть %s', (field) => {
    has('doctors', `${id}.${field}`, 'string')
  })

  it('подписи сертификатов переведены', () => {
    for (const cert of certificates) has('doctors', cert.labelKey, 'string')
  })
})

describe('состояния пациентов', () => {
  it.each(CONDITION_LIST)('%s переведено', (id) => {
    has('doctors', `condition.${id}`, 'string')
  })
})
