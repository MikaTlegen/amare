'use client'

import { useMemo, useState } from 'react'
import { Calendar } from './Calendar'
import { cn } from '@amare/ui'
import type { Slot } from '@/lib/booking'
import { BOOKING_HORIZON_DAYS } from '@/lib/booking'
import { DOCTORS } from '@/data/doctors'

const MONTH_DAY = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' })
const WEEKDAY = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' })

/** «2026-09-25T10:30» → Date по локальному времени, без сдвига часового пояса. */
function slotDate(at: string): Date {
  const [date, time] = at.split('T')
  const [year, month, day] = date!.split('-').map(Number)
  const [hour, minute] = time!.split(':').map(Number)
  return new Date(year!, month! - 1, day!, hour!, minute!)
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  )
}

interface Props {
  slots: Slot[]
  selectedId: string | null
  onSelect: (slotId: string) => void
}

/**
 * Выбор даты и времени приёма (S-03 ТЗ).
 *
 * Раньше свободные слоты были одним длинным списком: на неделю он ещё
 * читался, на месяц — уже нет. Календарь решает главный вопрос человека
 * («когда вообще есть места») одним взглядом: дни без приёма выключены,
 * а справа — время выбранного дня.
 *
 * Календарь и список времени — две половины одного элемента управления,
 * поэтому выбор дня сбрасывает выбранное время: иначе можно отправить
 * заявку на время из другого дня.
 */
export function AppointmentPicker({ slots, selectedId, onSelect }: Props) {
  const today = useMemo(() => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    return date
  }, [])

  const lastDay = useMemo(() => {
    const date = new Date(today)
    date.setDate(date.getDate() + BOOKING_HORIZON_DAYS)
    return date
  }, [today])

  /** Дни, в которые есть хотя бы один свободный слот выбранного формата. */
  const openDays = useMemo(() => {
    const seen = new Map<string, Date>()
    for (const slot of slots) {
      const key = slot.at.slice(0, 10)
      if (!seen.has(key)) seen.set(key, slotDate(slot.at))
    }
    return [...seen.values()]
  }, [slots])

  const [day, setDay] = useState<Date | undefined>(() => openDays[0])

  // Формат мог смениться — тогда прежний день может оказаться закрытым
  const activeDay = day && openDays.some((open) => sameDay(open, day)) ? day : openDays[0]

  const daySlots = activeDay
    ? slots
        .filter((slot) => sameDay(slotDate(slot.at), activeDay))
        .sort((a, b) => a.at.localeCompare(b.at))
    : []

  return (
    <div className="grid overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-12">
      <div className="flex justify-center border-line p-4 sm:p-6 lg:col-span-7 lg:border-r">
        <Calendar
          mode="single"
          selected={activeDay}
          month={activeDay}
          onSelect={(next) => next && setDay(next)}
          startMonth={today}
          endMonth={lastDay}
          disabled={(date) => !openDays.some((open) => sameDay(open, date))}
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-line p-4 sm:p-6 lg:col-span-5 lg:border-t-0">
        {activeDay ? (
          <>
            <div className="flex flex-col">
              <span className="font-display text-lg font-medium tracking-[-0.03em]">
                {MONTH_DAY.format(activeDay)}
              </span>
              <span className="text-base text-muted">{WEEKDAY.format(activeDay)}</span>
            </div>

            <ul className="m-0 grid max-h-96 list-none grid-cols-2 gap-2 overflow-y-auto p-0 pr-1 sm:grid-cols-3 lg:grid-cols-2">
              {daySlots.map((slot) => {
                const doctor = DOCTORS.find((item) => item.id === slot.doctorId)
                const chosen = slot.id === selectedId
                return (
                  <li key={slot.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(slot.id)}
                      aria-pressed={chosen}
                      className={cn(
                        'flex min-h-14 w-full flex-col items-center justify-center rounded-xl border-[1.5px] px-2 py-2 transition-colors',
                        chosen
                          ? 'border-deep bg-deep text-white'
                          : 'border-line hover:border-deep hover:bg-tint',
                      )}
                    >
                      <span className="text-base font-semibold">{slot.at.slice(11, 16)}</span>
                      {doctor && (
                        <span
                          className={cn(
                            'max-w-full truncate text-sm',
                            chosen ? 'text-white/75' : 'text-muted',
                          )}
                        >
                          {doctor.name.split(' ')[0]}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>

            {daySlots.length === 0 && (
              <p className="m-0 text-base text-muted">На этот день свободного времени нет.</p>
            )}
          </>
        ) : (
          <p className="m-0 text-base text-muted">
            Свободного времени в этом формате сейчас нет. Позвоните — администратор подберёт время
            вручную.
          </p>
        )}
      </div>
    </div>
  )
}
