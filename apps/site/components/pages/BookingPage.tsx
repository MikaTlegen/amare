'use client'

import { useSearchParams } from 'next/navigation'
import { MapPin, Video, Home } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { PageCover } from '@/components/PageCover'
import { BookingWidget } from '@/components/booking/BookingWidget'
import { DOCTORS } from '@/data/doctors'
import { CLINIC } from '@/lib/clinic'
import type { Locale } from '@amare/i18n'
import { useContent, useT } from '@amare/i18n/react'

/** Форматы приёма: подписи и цены лежат в словарях по ключу формата. */
const FORMATS: {
  id: 'clinic' | 'online' | 'home'
  priceKey: 'consultation' | 'online' | 'homeVisit'
  Icon: LucideIcon
}[] = [
  { id: 'clinic', priceKey: 'consultation', Icon: MapPin },
  { id: 'online', priceKey: 'online', Icon: Video },
  { id: 'home', priceKey: 'homeVisit', Icon: Home },
]

/**
 * Онлайн-запись на консультацию (требование S-03 ТЗ).
 *
 * Время и контакты собирает виджет CRM: он видит настоящее расписание
 * специалистов и создаёт визит. Свой календарь отсюда убран — он показывал
 * выдуманные окна, и человек уходил со страницы уверенным, что записан.
 *
 * Оплаты здесь нет и в моке быть не должно: предоплата через Kaspi —
 * это серверный сценарий с подтверждением платежа и фискальным чеком.
 */
export function BookingPage({ locale }: { locale: Locale }) {
  const t = useT('booking')
  const price = useT('prices')
  const doctorText = useContent('doctors')

  /*
   * ?doctor=<id> приходит с карточки врача. Специалиста виджет выбирает
   * своим вторым шагом, поэтому здесь остаётся только подсказка, кого
   * выбрать. Неизвестный id подсказку не показывает.
   */
  const params = useSearchParams()
  const doctor = DOCTORS.find((item) => item.id === params.get('doctor'))

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

      <section className="container-content flex flex-col gap-8 py-12">
        <div className="flex flex-col gap-3">
          <h2 className="m-0 font-display text-xl font-medium tracking-[-0.02em]">
            {t('formats.title')}
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {FORMATS.map(({ id, priceKey, Icon }) => (
              <div
                key={id}
                className="flex flex-col gap-2 rounded-2xl border-[1.5px] border-line bg-surface p-4"
              >
                <Icon className="h-5 w-5 text-deep" aria-hidden="true" />
                <span className="text-base font-semibold">{t(`format.${id}`)}</span>
                <span className="text-base text-muted">{price(priceKey)}</span>
              </div>
            ))}
          </div>
        </div>

        <BookingWidget
          hint={
            doctor
              ? t('widget.doctorHint', {
                  name: `${doctorText(`${doctor.id}.name`)}, ${doctorText(
                    `${doctor.id}.role`,
                  ).toLocaleLowerCase(locale)}`,
                })
              : t('widget.note')
          }
        />

        <p className="m-0 flex flex-wrap items-center gap-2 text-base leading-relaxed text-muted">
          {t('submit.note')}
          <a href={CLINIC.phones[0].href} className="font-medium text-ink">
            {CLINIC.phones[0].label}
          </a>
        </p>
      </section>
    </>
  )
}
