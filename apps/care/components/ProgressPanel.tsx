'use client'

import { useEffect, useState } from 'react'
import { TriangleAlert, Info } from 'lucide-react'
import type { PatientCard } from '@amare/api-client'
import { BarthelChart, cn } from '@amare/ui'
import { useContentList, useT } from '@amare/i18n/react'
import { getPatientCard } from '@/lib/mock'


/** Прогресс: шкалы, минуты практики за неделю, уведомления куратора. */
export function ProgressPanel() {
  const t = useT('cabinet')
  const days = useContentList('cabinet')('weekdays')
  const [card, setCard] = useState<PatientCard | null>(null)

  useEffect(() => {
    void getPatientCard().then(setCard)
  }, [])

  if (!card) return <p className="text-lg text-muted">{t('progress.loading')}</p>

  const weekTotal = card.weekMinutes.reduce((a, b) => a + b, 0)
  const maxMinutes = Math.max(...card.weekMinutes, 60)

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <section className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 lg:col-span-7">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
            {t('progress.barthel')}
          </h2>
          <span className="text-base text-muted">{t('progress.barthelNote')}</span>
        </div>

        <BarthelChart data={card.barthel} height="14rem" />

        <p className="m-0 text-base leading-relaxed text-muted">
          {t('progress.barthelHint')}
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 lg:col-span-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
            {t('progress.week')}
          </h2>
          <span className="font-display text-xl font-semibold tracking-[-0.04em]">
            {t('progress.weekMinutes', { count: weekTotal })}
          </span>
        </div>

        {/* Столбики по дням: главная метрика платформы — набранные минуты */}
        <ul className="flex h-40 items-end gap-2">
          {card.weekMinutes.map((minutes, i) => (
            <li key={days[i]} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-sm text-muted">{minutes || ''}</span>
              <div
                className={cn(
                  'w-full rounded-t-lg',
                  minutes === 0 ? 'bg-line' : 'bg-brand',
                  minutes === 0 && 'h-1',
                )}
                style={minutes === 0 ? undefined : { height: `${(minutes / maxMinutes) * 100}%` }}
                aria-hidden="true"
              />
              <span className="text-sm text-muted">{days[i]}</span>
            </li>
          ))}
        </ul>

        <p className="m-0 text-base leading-relaxed text-muted">
          {t('progress.weekHint')}
        </p>
      </section>

      {card.alerts.length > 0 && (
        <section className="flex flex-col gap-3 lg:col-span-12">
          <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">{t('progress.notifications')}</h2>
          <ul className="flex flex-col gap-2.5">
            {card.alerts.map((alert) => (
              <li
                key={alert.id}
                className={cn(
                  'flex items-start gap-3 rounded-2xl border p-4',
                  alert.level === 'info' && 'border-line bg-surface',
                  alert.level === 'warn' && 'border-accent bg-[rgb(253,238,237)]',
                  alert.level === 'danger' && 'border-[rgb(179,38,30)] bg-[rgb(255,235,233)]',
                )}
              >
                {alert.level === 'info' ? (
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-deep" aria-hidden="true" />
                ) : (
                  <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                )}
                <span className="flex-1 text-base leading-relaxed">{alert.text}</span>
                <span className="shrink-0 text-sm text-muted">{alert.at}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
