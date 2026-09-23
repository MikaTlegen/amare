/**
 * Публичный API онлайн-записи Tennet.
 *
 * Тот же источник, что у виджета CRM: свободные окна берутся из настоящего
 * расписания специалистов, запись создаётся в календаре клиники. Ключей нет,
 * адрес публичный, запросы с нашего домена разрешены (CORS).
 *
 * Своя форма нужна затем, что виджет нельзя встроить в страницу
 * (X-Frame-Options, см. docs/DECISIONS.md), а уводить человека на чужой сайт
 * посреди выбора врача — терять половину обратившихся.
 */

const API_URL = (
  process.env.NEXT_PUBLIC_CRM_BOOKING_API_URL ??
  'https://crm.tennet.kz/api/public/booking/05a40895-39c2-4a5e-8b9d-21ec43b01bbb/'
).replace(/\/*$/, '/')

/** Услуга из справочника CRM: длительность в минутах, цена строкой «18000.00». */
export interface CrmService {
  id: number
  name: string
  duration: number
  price: string
  category: string
}

/** Свободное окно: «09:30» по времени клиники. */
export interface CrmSlot {
  time: string
  end_time: string
}

export interface BookingRequest {
  serviceId: number
  specialistId: number
  /** Дата в виде «2026-09-25»: так её ждёт CRM. */
  date: string
  time: string
  name: string
  phone: string
}

/** Услуги клиники. Ошибку не прячем: страница покажет телефон вместо формы. */
export async function getServices(): Promise<CrmService[]> {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error(`CRM ответила ${response.status}`)
  const data = (await response.json()) as { services?: CrmService[] }
  return data.services ?? []
}

/** Свободные окна специалиста на день. Пустой список — рабочий ответ, не ошибка. */
export async function getSlots(
  serviceId: number,
  specialistId: number,
  date: string,
): Promise<CrmSlot[]> {
  const query = new URLSearchParams({
    service_id: String(serviceId),
    specialist_id: String(specialistId),
    date,
  })
  const response = await fetch(`${API_URL}slots/?${query}`)
  if (!response.ok) throw new Error(`CRM ответила ${response.status}`)
  const data = (await response.json()) as { slots?: CrmSlot[] }
  return data.slots ?? []
}

/**
 * Создание записи. Отказ не проглатываем: человек должен увидеть, что окно
 * не забронировано, а не уйти с ложной уверенностью.
 */
export async function createBooking(request: BookingRequest): Promise<{ ok: boolean }> {
  try {
    const response = await fetch(`${API_URL}submit/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: request.serviceId,
        specialist_id: request.specialistId,
        date: request.date,
        time: request.time,
        client_name: request.name,
        client_phone: request.phone,
      }),
    })
    return { ok: response.ok }
  } catch {
    return { ok: false }
  }
}

/** Ближайшие дни для выбора даты: дальше горизонта записи не заглядываем. */
export function nextDays(count: number, from: Date = new Date()): string[] {
  const days: string[] = []
  for (let offset = 0; offset < count; offset += 1) {
    const day = new Date(from)
    day.setDate(day.getDate() + offset)
    // Локальная дата, а не toISOString: тот сдвинул бы день на часовой пояс
    const month = String(day.getMonth() + 1).padStart(2, '0')
    const date = String(day.getDate()).padStart(2, '0')
    days.push(`${day.getFullYear()}-${month}-${date}`)
  }
  return days
}
