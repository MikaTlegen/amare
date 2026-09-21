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
 */

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

/**
 * Отправка лида в воронку CRM.
 *
 * Форма принимает только имя и телефон, поэтому остальные ответы анкеты
 * (давность, подвижность, UTM) до CRM не доходят — они появятся, когда
 * владелец добавит поля в конструкторе формы Tennet.
 *
 * Отказ не проглатываем: возвращаем ok: false, и форма показывает человеку
 * телефон клиники, а не мнимый успех. Так же обрабатывается требование капчи:
 * решать её здесь нечем, поэтому для человека это обычный отказ.
 */
export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean }> {
  // Адрес формы вшивается в сборку скриптом build-static.sh
  const formUrl = process.env.NEXT_PUBLIC_CRM_LEAD_FORM_URL
  if (!payload.consent || !formUrl) {
    return { ok: false }
  }

  // Ловушка сработала — отвечаем успехом, но никуда не идём: бот не должен
  // понять, что отсеян, иначе подберёт обход
  if (payload.websiteUrl) {
    return { ok: true }
  }

  try {
    const response = await fetch(formUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        standard_name: payload.name ?? '',
        standard_phone: payload.phone ?? '',
        website_url: '',
      }),
    })
    return { ok: response.ok }
  } catch {
    return { ok: false }
  }
}
