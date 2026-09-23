'use client'

import { ArrowUpRight } from 'lucide-react'
import { useT } from '@amare/i18n/react'
import { CLINIC } from '@/lib/clinic'

/**
 * Онлайн-запись Tennet.
 *
 * Виджет ведёт человека по шагам (услуга → специалист → время → контакты)
 * и пишет визит в настоящее расписание клиники. До него здесь стоял
 * собственный календарь с выдуманными окнами: человек «выбирал время»,
 * которое никто не резервировал.
 *
 * Открываем в новой вкладке, а не в <iframe>: crm.tennet.kz отдаёт заголовок
 * X-Frame-Options: SAMEORIGIN, и браузер отказывается показывать виджет на
 * чужом домене — встроенная рамка осталась бы пустой. Когда Tennet разрешит
 * встраивание для amaru.tennet.kz, ссылка меняется на <iframe src={url}>.
 *
 * Адрес виджета — не секрет, он и так виден в коде страницы. В переменную
 * окружения вынесен, чтобы смена виджета не требовала правки компонента.
 */
export function BookingWidget({
  hint,
  /** Адрес виджета конкретного специалиста, когда Tennet их выдаст. */
  specialistUrl,
}: {
  hint?: string
  specialistUrl?: string
}) {
  const t = useT('booking')
  // Запасное значение — как у адресов кабинетов в lib/clinic.ts: иначе запись
  // молча исчезает в любой сборке, где забыли переменную
  const url =
    specialistUrl ??
    process.env.NEXT_PUBLIC_CRM_BOOKING_URL ??
    'https://crm.tennet.kz/booking/05a40895-39c2-4a5e-8b9d-21ec43b01bbb/'

  // Пустой адрес задали намеренно: честно отправляем звонить
  if (!url) {
    return (
      <p className="m-0 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-surface px-5 py-4 text-base leading-relaxed text-muted">
        {t('widget.unavailable')}
        <a href={CLINIC.phones[0].href} className="font-medium text-ink">
          {CLINIC.phones[0].label}
        </a>
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6">
      {hint && <p className="m-0 text-base leading-relaxed text-muted">{hint}</p>}

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[3.4rem] items-center justify-center gap-2 self-start rounded-xl bg-accent px-7 py-4 text-lg font-semibold text-accent-ink no-underline"
      >
        {t('widget.open')}
        <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
      </a>

      <p className="m-0 text-base leading-relaxed text-muted">{t('widget.openNote')}</p>
    </div>
  )
}
