'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, MapPin, Video, Home } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageCover } from '@/components/PageCover'
import { AppointmentPicker } from '@/components/booking/AppointmentPicker'
import { Button } from '@amare/ui'
import { getSlots, createBooking, type Slot } from '@/lib/booking'
import { DOCTORS } from '@/data/doctors'
import { CLINIC, PRICES } from '@/lib/clinic'
import { cn } from '@amare/ui'

const FORMATS: { id: Slot['format']; label: string; price: string; Icon: LucideIcon }[] = [
  { id: 'clinic', label: 'В клинике', price: PRICES.consultation, Icon: MapPin },
  { id: 'online', label: 'Онлайн', price: PRICES.online, Icon: Video },
  { id: 'home', label: 'С выездом на дом', price: PRICES.homeVisit, Icon: Home },
]

const WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']

function formatSlot(at: string) {
  const date = new Date(at)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const time = at.slice(11, 16)
  return { date: `${day}.${month}, ${WEEKDAYS[date.getDay()]}`, time }
}

/**
 * Онлайн-запись на консультацию (требование S-03 ТЗ).
 *
 * Оплаты здесь нет и в моке быть не должно: предоплата через Kaspi —
 * это серверный сценарий с подтверждением платежа и фискальным чеком,
 * имитировать её на фронте вредно, легко принять мок за работающую оплату.
 */
export function BookingPage() {
  const params = useSearchParams()
  const [format, setFormat] = useState<Slot['format']>(
    (params.get('format') as Slot['format']) || 'clinic',
  )
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotId, setSlotId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [consent, setConsent] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    void getSlots().then(setSlots)
  }, [])

  const visible = slots.filter((slot) => slot.format === format)
  const chosen = slots.find((slot) => slot.id === slotId)
  const chosenDoctor = chosen && DOCTORS.find((doctor) => doctor.id === chosen.doctorId)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!slotId || !consent) return
    setSending(true)
    const result = await createBooking({ slotId, name, phone, comment, consent })
    setSending(false)
    if (result.ok) setDone(true)
  }

  return (
    <>
      <PageCover
        crumb="Запись"
        title="Записаться на консультацию"
        note={`${PRICES.freeIntro}. Дальше врач составит план и скажет, нужен ли курс.`}
        image="/photos/reception-desk.jpg"
        alt="Стойка администратора: здесь подтверждают время приёма"
        objectPosition="center 40%"
      />

      <section className="container-content py-12">
        {done ? (
          <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-3xl border border-line bg-surface p-8">
            <CheckCircle2 className="h-10 w-10 text-brand" aria-hidden="true" />
            <h2 className="m-0 font-display text-2xl font-medium tracking-[-0.04em]">
              Заявка принята
            </h2>
            <p className="m-0 text-lg leading-relaxed text-muted">
              Администратор перезвонит и подтвердит время. Если нужно быстрее — позвоните сами.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href={CLINIC.phones[0].href}>{CLINIC.phones[0].label}</Button>
              <Button to="/" variant="outline">
                На главную
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-8 lg:grid-cols-12">
            <div className="flex flex-col gap-7 lg:col-span-7">
              <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
                <legend className="mb-1 p-0 font-display text-xl font-medium tracking-[-0.035em]">
                  1. Формат приёма
                </legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {FORMATS.map(({ id, label, price, Icon }) => (
                    <label
                      key={id}
                      className={cn(
                        'flex cursor-pointer flex-col gap-2 rounded-2xl border-[1.5px] p-4 transition-colors',
                        format === id ? 'border-accent bg-[rgb(253,238,237)]' : 'border-line bg-surface',
                      )}
                    >
                      <input
                        type="radio"
                        name="format"
                        value={id}
                        checked={format === id}
                        onChange={() => {
                          setFormat(id)
                          setSlotId(null)
                        }}
                        className="sr-only"
                      />
                      <Icon className="h-5 w-5 text-deep" aria-hidden="true" />
                      <span className="text-base font-semibold">{label}</span>
                      <span className="text-base text-muted">{price}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
                <legend className="mb-1 p-0 font-display text-xl font-medium tracking-[-0.035em]">
                  2. Дата и время
                </legend>

                <AppointmentPicker slots={visible} selectedId={slotId} onSelect={setSlotId} />

                {chosen && (
                  <p className="m-0 rounded-2xl bg-tint px-5 py-4 text-base leading-relaxed text-deep">
                    Выбрано: {formatSlot(chosen.at).date}, {formatSlot(chosen.at).time}
                    {chosenDoctor ? ` · ${chosenDoctor.name}, ${chosenDoctor.role}` : ''}
                  </p>
                )}
              </fieldset>
            </div>

            <div className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 lg:col-span-5">
              <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
                3. Ваши контакты
              </h2>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="b-name" className="text-base font-medium">
                  Как к вам обращаться
                </label>
                <input
                  id="b-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line bg-bg px-4 py-3 text-base"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="b-phone" className="text-base font-medium">
                  Телефон
                </label>
                <input
                  id="b-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  placeholder="+7 ___ ___ __ __"
                  required
                  className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line bg-bg px-4 py-3 text-base"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="b-comment" className="text-base font-medium">
                  Что важно знать врачу
                </label>
                <textarea
                  id="b-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Когда был инсульт, как человек передвигается"
                  className="rounded-xl border-[1.5px] border-line bg-bg px-4 py-3 text-base"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-4">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  className="mt-1 h-5 w-5 shrink-0 accent-[rgb(var(--c-accent))]"
                />
                <span className="text-base leading-relaxed text-muted">
                  Согласен на обработку персональных данных, включая сведения о здоровье.
                </span>
              </label>

              {chosen && (
                <p className="m-0 rounded-2xl bg-tint px-4 py-3 text-base text-deep">
                  Выбрано: {formatSlot(chosen.at).date}, {formatSlot(chosen.at).time}
                </p>
              )}

              <button
                type="submit"
                disabled={!slotId || !consent || sending}
                className="min-h-[3.4rem] rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-accent-ink disabled:opacity-50"
              >
                {sending ? 'Отправляем…' : 'Записаться'}
              </button>

              <p className="m-0 text-base leading-relaxed text-muted">
                Оплата не требуется: администратор подтвердит время по телефону.
              </p>
            </div>
          </form>
        )}
      </section>
    </>
  )
}
