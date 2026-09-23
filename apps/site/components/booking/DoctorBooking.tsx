'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Calendar } from './Calendar'
import { CLINIC } from '@/lib/clinic'
import {
  createBooking,
  getServices,
  getSlots,
  nextDays,
  type CrmService,
  type CrmSlot,
} from '@/lib/booking-crm'
import { cn, formatKzPhone } from '@amare/ui'
import type { Locale } from '@amare/i18n'
import { useT } from '@amare/i18n/react'

/** Локаль форматирования дат: у Intl свои теги, у нас — коды локалей. */
const INTL_TAG: Record<Locale, string> = { ru: 'ru-RU', kk: 'kk-KZ' }

/** На сколько дней вперёд открыта запись. */
const DAYS_AHEAD = 30

/** «2026-09-25» → Date по местному времени: полночь UTC сдвинула бы день. */
function asDate(value: string): Date {
  return new Date(`${value}T12:00`)
}

/** Обратно в «2026-09-25»: toISOString сдвинул бы день на часовой пояс. */
function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/**
 * Запись к конкретному специалисту.
 *
 * Показывает его настоящие свободные окна из CRM и создаёт запись в календаре
 * клиники — те же шаги, что в виджете Tennet, но без ухода с сайта: услуга
 * и специалист уже выбраны, человеку остаются дата, время и контакты.
 *
 * Оплаты здесь нет намеренно: предоплата — серверный сценарий с чеком ОФД.
 */
export function DoctorBooking({
  specialistId,
  doctorName,
  locale,
}: {
  specialistId: number
  doctorName: string
  locale: Locale
}) {
  const t = useT('booking')

  const [services, setServices] = useState<CrmService[]>([])
  const [serviceId, setServiceId] = useState<number | null>(null)
  const [days] = useState<string[]>(() => nextDays(DAYS_AHEAD))
  const [date, setDate] = useState<string>(() => nextDays(1)[0]!)
  const [slots, setSlots] = useState<CrmSlot[] | null>(null)
  const [time, setTime] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [failed, setFailed] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const doneRef = useRef<HTMLDivElement>(null)

  // Блок успеха подменяет форму: без переноса фокуса человек со скринридером
  // не узнаёт, что запись создана
  useEffect(() => {
    if (done) doneRef.current?.focus()
  }, [done])

  useEffect(() => {
    void getServices()
      .then((loaded) => {
        setServices(loaded)
        setServiceId(loaded[0]?.id ?? null)
      })
      .catch(() => setUnavailable(true))
  }, [])

  // Окна перезапрашиваем при смене услуги или дня: расписание живое
  useEffect(() => {
    if (!serviceId) return
    let cancelled = false
    setSlots(null)
    setTime(null)
    void getSlots(serviceId, specialistId, date)
      .then((loaded) => {
        if (!cancelled) setSlots(loaded)
      })
      .catch(() => {
        if (!cancelled) setUnavailable(true)
      })
    return () => {
      cancelled = true
    }
  }, [serviceId, specialistId, date])

  const dayFormat = new Intl.DateTimeFormat(INTL_TAG[locale], {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  // Полдень, а не полночь: иначе часовой пояс сдвинул бы подпись на день назад
  const formatDay = (value: string) => dayFormat.format(new Date(`${value}T12:00`))

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!serviceId || !time || !consent) return
    setFailed(false)
    setSending(true)
    const result = await createBooking({ serviceId, specialistId, date, time, name, phone })
    setSending(false)
    // Отказ нельзя проглатывать: иначе человек уйдёт, считая, что записан
    if (result.ok) setDone(true)
    else setFailed(true)
  }

  if (unavailable) {
    return (
      <p className="m-0 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface px-5 py-4 text-base leading-relaxed text-muted">
        {t('slots.failed')}
        <a href={CLINIC.phones[0].href} className="font-medium text-ink">
          {CLINIC.phones[0].label}
        </a>
      </p>
    )
  }

  if (done) {
    return (
      <div
        ref={doneRef}
        role="status"
        tabIndex={-1}
        className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6"
      >
        <CheckCircle2 className="h-10 w-10 text-brand" aria-hidden="true" />
        <h3 className="m-0 font-display text-2xl font-medium tracking-[-0.02em]">
          {t('done.title')}
        </h3>
        <p className="m-0 text-base leading-relaxed text-muted">
          {t('slots.chosen', { date: formatDay(date), time: time ?? '' })}
        </p>
        <p className="m-0 text-base leading-relaxed text-muted">{t('done.note')}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-6 rounded-3xl border border-line bg-surface p-6"
    >
      <p className="m-0 text-base leading-relaxed text-muted">
        {t('slots.doctorNote', { name: doctorName })}
      </p>

      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="mb-1 p-0 text-base font-semibold">{t('slots.service')}</legend>
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <label
              key={service.id}
              className={cn(
                'flex cursor-pointer flex-col gap-0.5 rounded-2xl border-[1.5px] px-4 py-3 text-base',
                serviceId === service.id ? 'border-accent bg-accent/8' : 'border-line bg-bg',
              )}
            >
              <input
                type="radio"
                name="service"
                value={service.id}
                checked={serviceId === service.id}
                onChange={() => setServiceId(service.id)}
                className="sr-only"
              />
              <span className="font-medium">{service.name}</span>
              <span className="text-muted">{t('slots.duration', { count: service.duration })}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="mb-1 p-0 text-base font-semibold">{t('slots.date')}</legend>
        {/* Календарь, а не ряд кнопок: человек ищет «следующую среду»,
            а не пятый день от сегодня. Дальше горизонта записи не пускаем */}
        <Calendar
          lang={locale}
          mode="single"
          selected={asDate(date)}
          onSelect={(next) => next && setDate(toIsoDate(next))}
          startMonth={asDate(days[0]!)}
          endMonth={asDate(days[days.length - 1]!)}
          disabled={(day) => toIsoDate(day) < days[0]! || toIsoDate(day) > days[days.length - 1]!}
        />
      </fieldset>

      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="mb-1 p-0 text-base font-semibold">{t('slots.time')}</legend>
        {slots === null ? (
          <p className="m-0 text-base text-muted">{t('slots.loading')}</p>
        ) : slots.length === 0 ? (
          <p className="m-0 text-base text-muted">{t('slot.dayEmpty')}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {slots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                onClick={() => setTime(slot.time)}
                className={cn(
                  'min-h-[2.8rem] rounded-xl border-[1.5px] px-4 py-2 text-base',
                  time === slot.time
                    ? 'border-accent bg-accent/8 font-semibold'
                    : 'border-line bg-bg',
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>
        )}
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="db-name" className="text-base font-medium">
            {t('contacts.name')}
          </label>
          <input
            id="db-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line-strong bg-bg px-4 py-3 text-base"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="db-phone" className="text-base font-medium">
            {t('contacts.phone')}
          </label>
          <input
            id="db-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatKzPhone(e.target.value))}
            autoComplete="tel"
            placeholder={t('contacts.phonePlaceholder')}
            maxLength={18}
            required
            className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line-strong bg-bg px-4 py-3 text-base"
          />
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-base leading-relaxed text-muted">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          className="mt-1 h-5 w-5 shrink-0 accent-[rgb(var(--c-accent))]"
        />
        {t('contacts.consent')}
      </label>

      {failed && (
        <p
          role="alert"
          className="m-0 rounded-2xl border-[1.5px] border-accent bg-accent/10 px-4 py-3 text-base leading-relaxed text-ink"
        >
          {t('submit.error')}
        </p>
      )}

      <button
        type="submit"
        disabled={!time || !consent || sending}
        className="min-h-[3.4rem] self-start rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-accent-ink disabled:opacity-50"
      >
        {sending ? t('submit.sending') : t('submit.label')}
      </button>
    </form>
  )
}
