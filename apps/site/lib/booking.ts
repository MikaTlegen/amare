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

function createDemoSlots(): Slot[] {
  const specialists = ['kuspanova', 'ahaaga', 'zhumabekova', 'moldabekov', 'niyazbekova']
  const times = ['09:30', '11:00', '12:30', '15:00', '16:30']
  const slots: Slot[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  specialists.forEach((doctorId, doctorIndex) => {
    for (let dayOffset = 1; dayOffset <= 7; dayOffset += 1) {
      const date = new Date(today)
      date.setDate(date.getDate() + dayOffset)
      const time = times[(doctorIndex + dayOffset) % times.length]
      slots.push({
        id: `${doctorId}-${dayOffset}`,
        at: `${date.toISOString().slice(0, 10)}T${time}`,
        doctorId,
        format: 'clinic',
      })
    }
  })

  return slots
}


function delay<T>(value: T, ms = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/** TODO API: свободные слоты по врачу, формату и дате (S-03, модуль M2). */
export async function getSlots(): Promise<Slot[]> {
  return delay(createDemoSlots())
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
