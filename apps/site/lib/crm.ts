/**
 * Отправка заявок с сайта в CRM.
 *
 * Важно про персональные данные (требование ТЗ, раздел 4 и S-04, S-10):
 * — форма не отправляется без явного согласия на обработку медданных;
 * — никакие ПД не попадают в аналитику и внешние скрипты.
 *
 * Заявка уходит прямо в публичную лид-форму CRM Tennet, без промежуточного
 * бэкенда: сайт собирается статикой и лежит на файловом хостинге, запустить
 * там свой обработчик негде (docs/DECISIONS.md). Это отступление от требования
 * «данные уходят на собственный бэкенд в РК» — решение владельца, зафиксировано
 * в журнале решений. Секретов здесь нет: адрес формы публичный по замыслу.
 *
 * Форм две — русская и казахская. У казахской есть поле «дополнительные
 * сведения», в него уезжают ответы анкеты.
 */

import type { Locale } from '@amare/i18n'

export type LeadSource = 'quiz' | 'form' | 'callback' | 'booking'

export interface LeadPayload {
  /**
   * Кто заполняет: сам пациент или родственник. Влияет на тон общения.
   * В форме записи такого вопроса нет, поэтому поле необязательное:
   * лучше не знать, чем проставить наугад.
   */
  filledBy?: 'patient' | 'relative'
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

/** Подписи ответов анкеты для оператора. Он читает карточку в CRM по-русски. */
const FILLED_BY_LABEL: Record<NonNullable<LeadPayload['filledBy']>, string> = {
  patient: 'сам пациент',
  relative: 'родственник',
}

const STROKE_AGO_LABEL: Record<NonNullable<LeadPayload['strokeAgo']>, string> = {
  '<1m': 'меньше месяца',
  '1-6m': '1–6 месяцев',
  '6-12m': '6–12 месяцев',
  '>12m': 'больше года',
}

const MOBILITY_LABEL: Record<NonNullable<LeadPayload['mobility']>, string> = {
  bedridden: 'лежачий',
  wheelchair: 'на коляске',
  assisted: 'ходит с поддержкой',
  independent: 'ходит сам',
}

/** Форма без ответов анкеты: поле обязательное, пустым его слать нельзя. */
const FALLBACK_MESSAGE = 'Заявка с сайта'

/**
 * Ответы анкеты одной строкой для поля «дополнительные сведения».
 *
 * Отдельных полей под давность и подвижность в форме CRM нет, а терять их
 * жалко: по ним администратор понимает срочность ещё до звонка.
 */
export function buildMessage(payload: LeadPayload): string {
  const parts = [
    payload.filledBy && `кто заполняет: ${FILLED_BY_LABEL[payload.filledBy]}`,
    payload.strokeAgo && `давность события: ${STROKE_AGO_LABEL[payload.strokeAgo]}`,
    payload.mobility && `подвижность: ${MOBILITY_LABEL[payload.mobility]}`,
    `источник: ${payload.source}`,
    payload.utm &&
      Object.keys(payload.utm).length > 0 &&
      Object.entries(payload.utm)
        .map(([key, value]) => `${key}=${value}`)
        .join(', '),
  ].filter((part): part is string => typeof part === 'string' && part.length > 0)

  return parts.length > 0 ? parts.join('; ') : FALLBACK_MESSAGE
}

/** Адрес формы своего языка: у русской и казахской он разный. */
function formUrl(locale: Locale): string | undefined {
  return locale === 'kk'
    ? process.env.NEXT_PUBLIC_CRM_LEAD_FORM_URL_KK
    : process.env.NEXT_PUBLIC_CRM_LEAD_FORM_URL_RU
}

/**
 * Отправка лида в воронку CRM.
 *
 * Отказ не проглатываем: возвращаем ok: false, и форма показывает человеку
 * телефон клиники, а не мнимый успех. Так же обрабатывается требование капчи:
 * решать её здесь нечем, поэтому для человека это обычный отказ.
 */
export async function submitLead(
  payload: LeadPayload,
  locale: Locale = 'ru',
): Promise<{ ok: boolean }> {
  // Адрес формы вшивается в сборку скриптом build-static.sh
  const url = formUrl(locale)
  if (!payload.consent || !url) {
    return { ok: false }
  }

  // Ловушка сработала — отвечаем успехом, но никуда не идём: бот не должен
  // понять, что отсеян, иначе подберёт обход
  if (payload.websiteUrl) {
    return { ok: true }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        standard_name: payload.name ?? '',
        standard_phone: payload.phone ?? '',
        // Русская форма такого поля пока не имеет и просто его игнорирует
        standard_message: buildMessage(payload),
        website_url: '',
      }),
    })
    return { ok: response.ok }
  } catch {
    return { ok: false }
  }
}
