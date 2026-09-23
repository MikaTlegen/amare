/**
 * Заявка на доп. услугу из кабинета — в ту же воронку CRM, что и заявки
 * с сайта (apps/site/lib/crm.ts): тот же публичный адрес лид-формы Tennet,
 * не отдельный пайплайн. Пациент уже авторизован и согласие на обработку
 * ПД дал при оформлении курса (см. DocsPanel, DEMO_CONSENTS) — здесь оно
 * не запрашивается заново, это не новый анонимный лид, а действие внутри
 * своего кабинета.
 *
 * Адрес формы — как у сайта: публичный по замыслу, секрета в нём нет
 * (см. комментарий в apps/site/lib/crm.ts).
 */

import type { Locale } from '@amare/i18n'

function formUrl(locale: Locale): string {
  return locale === 'kk'
    ? (process.env.NEXT_PUBLIC_CRM_LEAD_FORM_URL_KK ??
        'https://crm.tennet.kz/api/public/forms/3f9d1692-f6e1-45fb-99d1-d23398cbab84/')
    : (process.env.NEXT_PUBLIC_CRM_LEAD_FORM_URL_RU ??
        'https://crm.tennet.kz/api/public/forms/d4ad399c-701d-411e-a884-64881accca18/')
}

export interface UpsellRequest {
  offerTitle: string
  patientName: string
  phone: string
  locale?: Locale
}

/** Отказ не проглатываем: кнопка в UpsellPanel покажет ошибку, а не мнимый успех. */
export async function submitUpsellRequest({
  offerTitle,
  patientName,
  phone,
  locale = 'ru',
}: UpsellRequest): Promise<{ ok: boolean }> {
  try {
    const response = await fetch(formUrl(locale), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        standard_name: patientName,
        standard_phone: phone,
        standard_message: `Заявка из личного кабинета: ${offerTitle}`,
        website_url: '',
      }),
    })
    return { ok: response.ok }
  } catch {
    return { ok: false }
  }
}
