'use client'

import { useEffect, useMemo, useState } from 'react'
import { Link } from '@/components/Links'
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3 } from 'lucide-react'
import type { Locale } from '@amare/i18n'
import { useContent, useT } from '@amare/i18n/react'
import { AppointmentPicker } from '@/components/booking/AppointmentPicker'
import { DOCTORS } from '@/data/doctors'
import { getSlots, type Slot } from '@/lib/booking'
import { ROUTES, bookingLink } from '@/lib/clinic'

/** Локаль форматирования дат: у Intl свои теги, у нас — коды локалей. */
const INTL_TAG: Record<Locale, string> = { ru: 'ru-RU', kk: 'kk-KZ' }

/** «2026-09-25T10:30» → Date по локальному времени: new Date() сдвинул бы зону. */
function slotDate(at: string): Date {
  const [date, time] = at.split('T')
  const [year, month, day] = date!.split('-').map(Number)
  const [hour, minute] = time!.split(':').map(Number)
  return new Date(year!, month! - 1, day!, hour!, minute!)
}

/** Профиль специалиста с предварительным расписанием до подключения CRM. */
export function DoctorProfilePage({ doctorId, locale }: { doctorId: string; locale: Locale }) {
  const t = useT('doctors')
  const text = useContent('doctors')
  const contacts = useT('contacts')

  const doctor = DOCTORS.find((item) => item.id === doctorId)
  const [slotId, setSlotId] = useState<string | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])

  useEffect(() => {
    void getSlots().then(setSlots)
  }, [])

  // Дата ближайшего окна: день недели и число берёт Intl, время — из самой строки
  const dayFormat = useMemo(
    () => new Intl.DateTimeFormat(INTL_TAG[locale], { weekday: 'short', day: 'numeric', month: 'numeric' }),
    [locale],
  )

  /*
   * Очный приём этого врача. Онлайн и выезд на дом остаются на странице
   * записи: переключателя формата здесь нет, а смешивать три формата
   * в одном списке времени — значит показывать одно окно трижды.
   */
  const doctorSlots = useMemo(
    () =>
      doctor
        ? slots.filter((slot) => slot.doctorId === doctor.id && slot.format === 'clinic')
        : [],
    [slots, doctor],
  )

  const selectedSlot = doctorSlots.find((slot) => slot.id === slotId && !slot.taken)
  const closestSlot = doctorSlots.find((slot) => !slot.taken)

  if (!doctor) {
    return (
      <section className='container-content py-20'>
        <h1 className='font-display text-3xl font-semibold'>{t('profile.notFound')}</h1>
        <Link href={ROUTES.team} className='mt-6 inline-flex text-brand'>{t('profile.back')}</Link>
      </section>
    )
  }

  const name = text(`${doctor.id}.name`)
  const role = text(`${doctor.id}.role`)

  return (
    <>
      <section className='bg-tint px-4 py-10 sm:px-8 lg:px-20'>
        <div className='mx-auto max-w-content'>
          <Link href={ROUTES.team} className='tap-target inline-flex items-center gap-2 text-sm font-semibold text-ink no-underline hover:text-brand'>
            <ArrowLeft className='h-4 w-4' aria-hidden='true' />
            {t('profile.all')}
          </Link>
          <div className='mt-8 grid gap-8 lg:grid-cols-12 lg:items-end'>
            <div className='overflow-hidden bg-bg lg:col-span-4'>
              {doctor.photo ? <img src={doctor.photo} alt={t('card.photoAlt', { role, name })} className='aspect-4/5 h-full w-full object-cover object-top' /> : null}
            </div>
            <div className='min-w-0 lg:col-span-7 lg:col-start-6'>
              <p className='text-sm font-semibold text-brand'>{role}</p>
              <h1 className='mt-3 max-w-[14ch] font-display text-3xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-6xl'>{name}</h1>
              <p className='mt-5 text-lg leading-relaxed text-muted'>{text(`${doctor.id}.about`)}</p>
              <div className='mt-7 flex flex-wrap gap-3'>
                <span className='bg-bg px-4 py-2 text-sm font-semibold text-ink'>{text(`${doctor.id}.experience`)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*
        Состояния и документы были только в данных и словаре: на странице
        не выводились ни списком, ни заголовком, а сертификаты висели
        безымянной плашкой рядом со стажем.
      */}
      <section className='mx-auto grid max-w-content gap-12 px-4 py-16 sm:px-8 lg:grid-cols-12 lg:px-20'>
        <div className='min-w-0 lg:col-span-5'>
          <h2 className='font-display text-2xl font-semibold leading-[1.2] tracking-[-0.02em] text-ink sm:text-3xl'>
            {t('profile.conditions')}
          </h2>
          <ul className='mt-6 flex list-none flex-col p-0'>
            {doctor.conditions.map((condition) => (
              <li key={condition} className='border-t border-line py-4 text-lg leading-relaxed text-ink'>
                {text(`condition.${condition}`)}
              </li>
            ))}
          </ul>
        </div>

        <div className='min-w-0 lg:col-span-6 lg:col-start-7'>
          <h2 className='font-display text-2xl font-semibold leading-[1.2] tracking-[-0.02em] text-ink sm:text-3xl'>
            {t('profile.certificates')}
          </h2>
          {doctor.certificates.length > 0 ? (
            <ul className='mt-6 flex list-none flex-col p-0'>
              {doctor.certificates.map((certificate) => (
                <li key={certificate.href} className='border-t border-line'>
                  <a
                    href={certificate.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='tap-target group flex items-center justify-between gap-6 py-4 text-lg leading-relaxed text-ink no-underline hover:text-brand'
                  >
                    {text(certificate.labelKey)}
                    <ArrowUpRight
                      className='h-5 w-5 shrink-0 text-brand transition-transform group-hover:translate-x-1'
                      aria-hidden='true'
                    />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            /* Документов у части специалистов клиника не публиковала. Пустой
               блок честнее выдуманной строки: это медицинский сайт. */
            <p className='mt-6 border-t border-line pt-4 text-base leading-relaxed text-muted'>
              {t('profile.noCertificates')}
            </p>
          )}
        </div>
      </section>

      <section className='mx-auto grid max-w-content gap-12 px-4 py-16 sm:px-8 lg:grid-cols-12 lg:px-20'>
        <div className='min-w-0 lg:col-span-5'>
          <p className='text-sm font-semibold text-brand'>{t('profile.bookingLabel')}</p>
          <h2 className='mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl'>{t('profile.bookingTitle')}</h2>
          <p className='mt-5 text-base leading-relaxed text-muted'>{t('profile.bookingNote')}</p>
          {closestSlot ? <p className='mt-6 inline-flex items-center gap-2 bg-tint px-4 py-3 text-sm font-semibold text-deep'><Clock3 className='h-4 w-4' aria-hidden='true' />{t('profile.closest', { slot: `${dayFormat.format(slotDate(closestSlot.at))} ${closestSlot.at.slice(11, 16)}` })}</p> : null}
        </div>

        <div className='min-w-0 lg:col-span-7'>
          <AppointmentPicker slots={doctorSlots} selectedId={slotId} onSelect={setSlotId} locale={locale} />

          <Link
            href={selectedSlot ? `${bookingLink(doctor.id)}&slot=${selectedSlot.id}` : bookingLink(doctor.id)}
            className={`mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-base font-semibold no-underline ${selectedSlot ? 'bg-accent text-accent-ink' : 'bg-deep text-white'}`}
          >
            <CalendarDays className='h-5 w-5' aria-hidden='true' />
            {selectedSlot ? t('profile.bookAt', { time: selectedSlot.at.slice(11, 16) }) : t('profile.request')}
          </Link>
          <p className='mt-4 text-xs leading-relaxed text-muted'>
            {t('profile.clinicOnly')}{' '}
            <Link href={bookingLink(doctor.id)} className='text-brand'>{t('profile.bookLink')}</Link>.
            {' '}{t('profile.bookNote', { hours: contacts('hours') })}
          </p>
        </div>
      </section>
    </>
  )
}
