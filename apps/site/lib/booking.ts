/**
 * Онлайн-запись на консультацию.
 *
 * Расписание пока демонстрационное: настоящих свободных окон взять негде,
 * пока нет бэкенда (см. getSlots). А вот заявка уходит по-настоящему — в
 * публичную лид-форму CRM Tennet, тем же путём, что анкета и квиз (lib/crm.ts).
 *
 * Выбранное окно при этом не бронируется: форма CRM принимает только имя и
 * телефон, полей под дату, врача и формат приёма в ней нет. Менеджер
 * перезванивает и договаривается о времени сам.
 */

import { submitLead } from '@/lib/crm'

export interface Slot {
  id: string
  /** Локальное время начала приёма: «2026-09-25T10:30». Без Z — это время клиники. */
  at: string
  doctorId: string
  format: 'clinic' | 'online' | 'home'
  /** Окно уже занято: показываем его перечёркнутым, выбрать нельзя. */
  taken: boolean
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

/** На сколько дней вперёд открыта запись. */
export const BOOKING_HORIZON_DAYS = 30

/** Сетка приёмов клиники: Пн–Пт 9:00–18:00, Сб 9:00–14:00 (CLINIC.hours). */
const WEEKDAY_TIMES = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
]
const SATURDAY_TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30']

const SPECIALISTS = ['kuspanova', 'ahaaga', 'zhumabekova', 'moldabekov', 'niyazbekova']
const FORMATS: Slot['format'][] = ['clinic', 'online', 'home']

/** Дата в «2026-09-25» по локальному времени: toISOString сдвинул бы день. */
function isoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/**
 * Демо-расписание.
 *
 * Занятость имитируется детерминированно (по остатку от деления), а не
 * через Math.random: иначе при каждом ререндере сетка слотов прыгала бы,
 * и человек терял бы уже выбранное время.
 *
 * Выезд на дом идёт реже и только в первой половине дня — так это
 * и работает в клинике.
 */
function createDemoSlots(): Slot[] {
  const slots: Slot[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let dayOffset = 1; dayOffset <= BOOKING_HORIZON_DAYS; dayOffset += 1) {
    const date = new Date(today)
    date.setDate(date.getDate() + dayOffset)

    const weekday = date.getDay()
    if (weekday === 0) continue // воскресенье клиника не работает

    const times = weekday === 6 ? SATURDAY_TIMES : WEEKDAY_TIMES
    const day = isoDate(date)

    FORMATS.forEach((format, formatIndex) => {
      times.forEach((time, timeIndex) => {
        // Выезд на дом клиника проводит через окно и только до обеда —
        // это не занятость, такого приёма в сетке нет вовсе.
        if (format === 'home' && timeIndex % 2 === 1) return
        if (format === 'home' && time >= '13:00') return

        // Часть окон «занята»: пустое расписание выглядит нерабочим.
        // Раньше такие слоты просто не создавались, и человек видел
        // необъяснимый разрыв 11:30 → 12:30. Теперь они видны перечёркнутыми.
        const taken = (dayOffset + timeIndex + formatIndex * 2) % 3 === 0

        const doctorId = SPECIALISTS[(dayOffset + timeIndex) % SPECIALISTS.length]!
        slots.push({ id: `${format}-${day}-${time}`, at: `${day}T${time}`, doctorId, format, taken })
      })
    })
  }

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
 *
 * Отказ CRM не проглатываем: возвращаем ok: false, и страница показывает
 * человеку телефон клиники. Иначе он уйдёт в уверенности, что записан,
 * и будет ждать звонка, которого никто не сделает.
 */
export async function createBooking(payload: BookingPayload): Promise<{ ok: boolean }> {
  if (!payload.consent) return { ok: false }

  return submitLead({
    name: payload.name,
    phone: payload.phone,
    source: 'booking',
    consent: payload.consent,
  })
}
