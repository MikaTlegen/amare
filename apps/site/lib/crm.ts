/**
 * Заглушки интеграции с CRM. Сейчас ничего не отправляют — только логируют.
 * Когда появится бэкенд, меняется только тело функций.
 *
 * Важно про персональные данные (требование ТЗ, раздел 4 и S-04, S-10):
 * — форма не отправляется без явного согласия на обработку медданных;
 * — данные уходят на собственный бэкенд в РК, а не в сторонние сервисы;
 * — никакие ПД не попадают в аналитику и внешние скрипты.
 * Поэтому здесь нет прямых вызовов к чужим API и нет ключей в коде.
 */

export type LeadSource = 'quiz' | 'form' | 'callback' | 'booking'

export interface LeadPayload {
  /** Кто заполняет: сам пациент или родственник. Влияет на тон общения. */
  filledBy: 'patient' | 'relative'
  /** Давность события — по ней CRM считает период восстановления. */
  strokeAgo?: '<1m' | '1-6m' | '6-12m' | '>12m'
  /** Как передвигается — грубая оценка тяжести для приоритета лида. */
  mobility?: 'bedridden' | 'wheelchair' | 'assisted' | 'independent'
  name?: string
  phone?: string
  source: LeadSource
  /** UTM-метки: требование S-14 — источник хранится до оплаты курса. */
  utm?: Record<string, string>
  /** Отметка согласия на обработку ПД. Без неё отправки быть не должно. */
  consent: boolean
}

/** Снимает UTM-метки из адресной строки один раз при входе на сайт. */
export function readUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const value = params.get(key)
    if (value) utm[key] = value
  }
  return utm
}

/**
 * Отправка лида. Сейчас — заглушка.
 *
 * TODO CRM: POST на собственный бэкенд (не напрямую в CRM из браузера,
 * иначе ключ интеграции окажется в бандле и его увидит любой посетитель).
 * Бэкенд уже сам кладёт лид в воронку «Первичное обращение» (C-03).
 */
export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean }> {
  if (!payload.consent) {
    return { ok: false }
  }
  console.info('[lead] заглушка, ничего не отправлено:', payload)
  await new Promise((resolve) => setTimeout(resolve, 400))
  return { ok: true }
}
