/**
 * Порядок вопросов. Текст переехал в @amare/i18n (namespace faq),
 * ключи — `<id>.question` и `<id>.answer`.
 *
 * TODO CMS: список ведётся в админке (модуль M2), клинические
 * формулировки утверждает МДГ.
 */
export const FAQ_IDS = [
  'when-start',
  'how-long',
  'price',
  'osms',
  'bedridden',
  'other-city',
  'relatives',
  'after-course',
  'documents',
  'guarantee',
] as const

export type FaqId = (typeof FAQ_IDS)[number]
