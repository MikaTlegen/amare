'use client'

import { Link } from '@/components/Links'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import type { Locale } from '@amare/i18n'
import { useContent, useT } from '@amare/i18n/react'
import { BookingWidget } from '@/components/booking/BookingWidget'
import { DoctorBooking } from '@/components/booking/DoctorBooking'
import { DOCTORS } from '@/data/doctors'
import { ROUTES, bookingLink } from '@/lib/clinic'

/** Профиль специалиста. Время приёма показывает виджет записи CRM. */
export function DoctorProfilePage({ doctorId, locale }: { doctorId: string; locale: Locale }) {
  const t = useT('doctors')
  const text = useContent('doctors')
  const contacts = useT('contacts')
  const booking = useT('booking')

  const doctor = DOCTORS.find((item) => item.id === doctorId)

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

      {/*
       * Пара снимков «до/после». Плашка «пример оформления» обязательна:
       * без неё заглушка читается как заявление о результате лечения,
       * которое нельзя проверить. Так же подписан график Бартел на главной.
       */}
      <section className='mx-auto max-w-content px-4 pb-4 sm:px-8 lg:px-20'>
        <div className='flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6'>
          <div className='flex flex-wrap items-center gap-3'>
            <h2 className='m-0 font-display text-2xl font-medium tracking-[-0.02em]'>
              {t('showcase.title')}
            </h2>
            <span className='rounded-full bg-tint px-3 py-1 text-sm font-semibold text-deep'>
              {t('showcase.demo')}
            </span>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            {(['before', 'after'] as const).map((side) => (
              <figure key={side} className='m-0 flex flex-col gap-2'>
                <figcaption className='text-base font-semibold'>{t(`showcase.${side}`)}</figcaption>
                {doctor.showcase ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={doctor.showcase[side]}
                    alt={`${t(`showcase.${side}`)} — ${text(`${doctor.id}.name`)}`}
                    className='aspect-[4/3] w-full rounded-2xl object-cover'
                  />
                ) : (
                  <div className='flex aspect-[4/3] w-full items-center justify-center rounded-2xl border border-dashed border-line bg-bg px-4 text-center text-base text-muted'>
                    {t('showcase.empty')}
                  </div>
                )}
              </figure>
            ))}
          </div>

          <p className='m-0 text-base leading-relaxed text-muted'>{t('showcase.note')}</p>
        </div>
      </section>

      <section className='mx-auto grid max-w-content gap-12 px-4 py-16 sm:px-8 lg:grid-cols-12 lg:px-20'>
        <div className='min-w-0 lg:col-span-5'>
          <p className='text-sm font-semibold text-brand'>{t('profile.bookingLabel')}</p>
          <h2 className='mt-4 font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl'>{t('profile.bookingTitle')}</h2>
          <p className='mt-5 text-base leading-relaxed text-muted'>{t('profile.bookingNote')}</p>
        </div>

        <div className='min-w-0 lg:col-span-7'>
          {/* Свой календарь — только если врач связан с CRM. Иначе остаётся
              кнопка на виджет: пустая форма хуже честной ссылки */}
          {doctor.crmSpecialistId ? (
            <DoctorBooking
              specialistId={doctor.crmSpecialistId}
              doctorName={text(`${doctor.id}.name`)}
              locale={locale}
            />
          ) : (
            <BookingWidget
              hint={booking('widget.doctorHint', {
                name: `${text(`${doctor.id}.name`)}, ${text(`${doctor.id}.role`).toLocaleLowerCase(locale)}`,
              })}
            />
          )}

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
