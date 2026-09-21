/**
 * Отправка заявок с сайта в CRM.
 *
 * Важно про персональные данные (требование ТЗ, раздел 4 и S-04, S-10):
 * — форма не отправляется без явного согласия на обработку медданных;
 * — данные уходят на собственный бэкенд в РК, а не в сторонние сервисы;
 * — никакие ПД не попадают в аналитику и внешние скрипты.
 * Поэтому браузер шлёт заявку только на apps/api, а тот уже передаёт её
 * в лид-форму CRM. Адрес формы в бандл не попадает.
 */

/** Адрес API, который принимает заявки. В проде задаётся переменной окружения. */
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '')

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
  /** Ловушка для ботов: поле скрыто от людей, заполненное — признак спама. */
  websiteUrl?: string
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
 * Отправка лида на собственный бэкенд, оттуда — в воронку CRM.
 *
 * Сетевую ошибку не проглатываем: возвращаем ok: false, и форма показывает
 * человеку отказ с телефоном клиники, а не мнимый успех.
 */
export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean }> {
  if (!payload.consent) {
    return { ok: false }
  }

  try {
    const response = await fetch(`${API_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return { ok: response.ok }
  } catch {
    return { ok: false }
  }
}
