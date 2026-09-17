/**
 * Онлайн-запись — заглушка до появления API (перенесено из api/client.ts набросков).
 * Когда появится бэкенд, меняется только тело функций; вызов уйдёт в @amare/api-client.
 */

export interface Slot {
  id: string
  /** ISO-время начала приёма. */
  at: string
  doctorId: string
  format: 'clinic' | 'online' | 'home'
}

export interface BookingPayload {
  slotId: string
  name: string
  phone: string
  comment?: string
  consent: boolean
}

/** Имитация сетевой задержки, чтобы интерфейс показывал состояние загрузки. */
const LATENCY_MS = 260

const DEMO_SLOTS: Slot[] = [
  { id: 's-1', at: '2026-09-18T09:00', doctorId: 'zhumabekova', format: 'clinic' },
  { id: 's-2', at: '2026-09-18T11:30', doctorId: 'zhumabekova', format: 'clinic' },
  { id: 's-3', at: '2026-09-18T15:00', doctorId: 'kuspanova', format: 'online' },
  { id: 's-4', at: '2026-09-19T10:00', doctorId: 'ahaaga', format: 'clinic' },
  { id: 's-5', at: '2026-09-19T14:00', doctorId: 'zhumabekova', format: 'home' },
  { id: 's-6', at: '2026-09-20T09:30', doctorId: 'niyazbekova', format: 'clinic' },
]

function delay<T>(value: T, ms = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/** TODO API: свободные слоты по врачу, формату и дате (S-03, модуль M2). */
export async function getSlots(): Promise<Slot[]> {
  return delay(DEMO_SLOTS)
}

/**
 * Создание записи. Без согласия на обработку ПД ничего не отправляется.
 * Оплаты здесь нет намеренно: предоплата — серверный сценарий с чеком ОФД.
 */
export async function createBooking(payload: BookingPayload): Promise<{ ok: boolean }> {
  if (!payload.consent) return { ok: false }
  console.info('[booking] заглушка, ничего не отправлено:', payload)
  return delay({ ok: true }, 500)
}
