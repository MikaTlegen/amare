'use client'

import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Button, Link } from '@/components/Links'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, MapPin, Video, Home, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageCover } from '@/components/PageCover'
import { AppointmentPicker } from '@/components/booking/AppointmentPicker'
import { getSlots, createBooking, type Slot } from '@/lib/booking'
import { DOCTORS } from '@/data/doctors'
import { CLINIC, ROUTES } from '@/lib/clinic'
import { cn } from '@amare/ui'
import type { Locale } from '@amare/i18n'
import { useContent, useT } from '@amare/i18n/react'

/** Форматы приёма: подписи и цены лежат в словарях по ключу формата. */
const FORMATS: { id: Slot['format']; priceKey: 'consultation' | 'online' | 'homeVisit'; Icon: LucideIcon }[] = [
  { id: 'clinic', priceKey: 'consultation', Icon: MapPin },
  { id: 'online', priceKey: 'online', Icon: Video },
  { id: 'home', priceKey: 'homeVisit', Icon: Home },
]

/** Локаль форматирования дат: у Intl свои теги, у нас — коды локалей. */
const INTL_TAG: Record<Locale, string> = { ru: 'ru-RU', kk: 'kk-KZ' }

/**
 * Онлайн-запись на консультацию (требование S-03 ТЗ).
 *
 * Оплаты здесь нет и в моке быть не должно: предоплата через Kaspi —
 * это серверный сценарий с подтверждением платежа и фискальным чеком,
 * имитировать её на фронте вредно, легко принять мок за работающую оплату.
 */
export function BookingPage({ locale }: { locale: Locale }) {
  const t = useT('booking')
  const price = useT('prices')
  const common = useT('common')
  const doctorText = useContent('doctors')

  // Дата выбранного окна: день и месяц берёт Intl, время — из самой строки
  const slotFormat = new Intl.DateTimeFormat(INTL_TAG[locale], {
    day: '2-digit',
    month: '2-digit',
    weekday: 'short',
  })
  const formatSlot = (at: string) => ({ date: slotFormat.format(new Date(at)), time: at.slice(11, 16) })

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
  const [failed, setFailed] = useState(false)
  const doneRef = useRef<HTMLDivElement>(null)

  // Форма подменяется блоком успеха. Без переноса фокуса человек со
  // скринридером нажимает «Записаться» и не узнаёт, что что-то произошло.
  useEffect(() => {
    if (done) doneRef.current?.focus()
  }, [done])

  useEffect(() => {
    void getSlots().then((loaded) => {
      setSlots(loaded)
      // ?slot=<id> приходит со страницы врача: подставляем выбранное там время,
      // но только если оно свободно и нужного формата
      const requested = params.get('slot')
      const preset = loaded.find((slot) => slot.id === requested && !slot.taken)
      if (preset) {
        setSlotId(preset.id)
        setFormat(preset.format)
      }
    })
    // Адрес читаем один раз при загрузке: дальше временем управляет человек
  }, [])

  /*
   * ?doctor=<id> приходит с карточки врача. Показываем только его слоты,
   * иначе человек, нажавший «Записаться» у конкретного специалиста,
   * попадёт в общий список и выберет чужое время.
   * Неизвестный id фильтр не включает — лучше общий список, чем пустая страница.
   */
  const doctor = DOCTORS.find((item) => item.id === params.get('doctor'))
  // Занятые окна тоже попадают в список — они рисуются перечёркнутыми
  const visible = slots.filter(
    (slot) => slot.format === format && (!doctor || slot.doctorId === doctor.id),
  )
  // Выбрать можно только свободное время, даже если id пришёл из адреса
  const chosen = slots.find((slot) => slot.id === slotId && !slot.taken)
  const chosenDoctor = chosen && DOCTORS.find((doctor) => doctor.id === chosen.doctorId)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!slotId || !consent) return
    setFailed(false)
    setSending(true)
    const result = await createBooking({ slotId, name, phone, comment, consent })
    setSending(false)
    // Отказ нельзя проглатывать: без этой ветки кнопка просто разблокируется,
    // человек считает, что записался, а заявки нет и ему никто не позвонит
    if (result.ok) setDone(true)
    else setFailed(true)
  }

  return (
    <>
      <PageCover
        crumb={t('cover.crumb')}
        title={t('cover.title')}
        note={t('cover.note', { freeIntro: price('freeIntro') })}
        image="/photos/reception-desk.jpg"
        alt={t('cover.alt')}
        objectPosition="center 40%"
      />

      <section className="container-content py-12">
        {done ? (
          <div
            ref={doneRef}
            role="status"
            tabIndex={-1}
            className="mx-auto flex max-w-2xl flex-col gap-4 rounded-3xl border border-line bg-surface p-8"
          >
            <CheckCircle2 className="h-10 w-10 text-brand" aria-hidden="true" />
            <h2 className="m-0 font-display text-2xl font-medium tracking-[-0.02em]">
              {t('done.title')}
            </h2>
            <p className="m-0 text-lg leading-relaxed text-muted">
              {t('done.note')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href={CLINIC.phones[0].href}>{CLINIC.phones[0].label}</Button>
              <Button to="/" variant="outline">
                {t('done.home')}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-8 lg:grid-cols-12">
            <div className="flex flex-col gap-7 lg:col-span-7">
              <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
                <legend className="mb-1 p-0 font-display text-xl font-medium tracking-[-0.02em]">
                  {t('format.legend')}
                </legend>
                <div className="grid gap-3 sm:grid-cols-3">
                  {FORMATS.map(({ id, priceKey, Icon }) => (
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
                      <span className="text-base font-semibold">{t(`format.${id}`)}</span>
                      <span className="text-base text-muted">{price(priceKey)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
                <legend className="mb-1 p-0 font-display text-xl font-medium tracking-[-0.02em]">
                  {t('time.legend')}
                </legend>

                {doctor && (
                  <p className="m-0 flex flex-wrap items-center gap-3 text-base text-muted">
                    {t('time.onlyDoctor', {
                      name: doctorText(`${doctor.id}.name`),
                      role: doctorText(`${doctor.id}.role`).toLocaleLowerCase(locale),
                    })}
                    <Link
                      href={ROUTES.booking}
                      className="inline-flex min-h-[2.6rem] items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-base font-medium text-ink no-underline"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                      {t('time.showAll')}
                    </Link>
                  </p>
                )}

                <AppointmentPicker
                  slots={visible}
                  selectedId={slotId}
                  onSelect={setSlotId}
                  locale={locale}
                />

                {chosen && (
                  <p className="m-0 rounded-2xl bg-tint px-5 py-4 text-base leading-relaxed text-deep">
                    {chosenDoctor
                      ? t('time.chosenDoctor', {
                          ...formatSlot(chosen.at),
                          name: doctorText(`${chosenDoctor.id}.name`),
                          role: doctorText(`${chosenDoctor.id}.role`),
                        })
                      : t('time.chosen', formatSlot(chosen.at))}
                  </p>
                )}
              </fieldset>
            </div>

            <div className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 lg:col-span-5">
              <h2 className="m-0 font-display text-xl font-medium tracking-[-0.02em]">
                {t('contacts.legend')}
              </h2>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="b-name" className="text-base font-medium">
                  {t('contacts.name')}
                </label>
                <input
                  id="b-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line-strong bg-bg px-4 py-3 text-base"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="b-phone" className="text-base font-medium">
                  {t('contacts.phone')}
                </label>
                <input
                  id="b-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  placeholder={t('contacts.phonePlaceholder')}
                  required
                  className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line-strong bg-bg px-4 py-3 text-base"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="b-comment" className="text-base font-medium">
                  {t('contacts.comment')}
                </label>
                <textarea
                  id="b-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder={t('contacts.commentPlaceholder')}
                  className="rounded-xl border-[1.5px] border-line-strong bg-bg px-4 py-3 text-base"
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
                {/* Ссылка на политику обязана стоять рядом с согласием:
                    иначе человек соглашается на обработку медданных, не имея
                    под рукой документа, на который соглашается */}
                <span className="text-base leading-relaxed text-muted">
                  {t('contacts.consent')}{' '}
                  <Link href={ROUTES.privacy} className="tap-target font-semibold text-ink">
                    {common('policy')}
                  </Link>
                </span>
              </label>

              {chosen && (
                <p className="m-0 rounded-2xl bg-tint px-4 py-3 text-base text-deep">
                  {t('time.chosen', formatSlot(chosen.at))}
                </p>
              )}

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
                disabled={!slotId || !consent || sending}
                className="min-h-[3.4rem] rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-accent-ink disabled:opacity-50"
              >
                {sending ? t('submit.sending') : t('submit.label')}
              </button>

              <p className="m-0 text-base leading-relaxed text-muted">
                {t('submit.note')}
              </p>
            </div>
          </form>
        )}
      </section>
    </>
  )
}
