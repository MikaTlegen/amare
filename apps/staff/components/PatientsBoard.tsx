'use client'

import { useState } from 'react'
import { TriangleAlert } from 'lucide-react'
import type { PatientCard } from '@amare/api-client'
import { cn } from '@amare/ui'
import { useContent, useT } from '@amare/i18n/react'
import {
  STATUS_KEY,
  STATUS_ORDER,
  STATUS_STYLE,
  patientStatus,
  type PatientStatus,
} from './patient-status'

type Filter = PatientStatus | 'all'

/** Фильтры светофора. Подписи берутся из словаря staff. */
const FILTERS: { id: Filter; key: string }[] = [
  { id: 'all', key: 'board.all' },
  { id: 'red', key: STATUS_KEY.red },
  { id: 'orange', key: STATUS_KEY.orange },
  { id: 'green', key: STATUS_KEY.green },
]

/**
 * Дашборд «Мои пациенты» со светофором (W-01 ТЗ).
 *
 * Сортировка по срочности жёсткая и не настраивается: у куратора
 * двадцать человек, и если красный уедет вниз алфавитом, смысл
 * светофора пропадает.
 */
export function PatientsBoard({
  patients,
  onOpen,
}: {
  patients: PatientCard[]
  onOpen: (id: string) => void
}) {
  const t = useT('staff')
  const text = useContent('staff')
  const [filter, setFilter] = useState<Filter>('all')

  const rows = patients
    .map((patient) => ({ patient, status: patientStatus(patient) }))
    .filter((row) => filter === 'all' || row.status === filter)
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])

  return (
    <div className="flex flex-col gap-5">
      <div role="group" aria-label={t('board.filter')} className="flex flex-wrap gap-2">
        {FILTERS.map((item) => {
          const count =
            item.id === 'all'
              ? patients.length
              : patients.filter((patient) => patientStatus(patient) === item.id).length
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={filter === item.id}
              className={cn(
                'inline-flex min-h-[2.9rem] items-center gap-2 rounded-xl px-5 py-2.5 text-base font-medium transition-colors',
                filter === item.id
                  ? 'bg-deep text-white'
                  : 'border border-line text-muted hover:border-ink hover:text-ink',
              )}
            >
              {item.id !== 'all' && (
                <span
                  aria-hidden="true"
                  className={cn('h-2.5 w-2.5 rounded-full', STATUS_STYLE[item.id].dot)}
                />
              )}
              {text(item.key)} · {count}
            </button>
          )
        })}
      </div>

      {rows.length === 0 ? (
        <p className="m-0 rounded-3xl border border-line bg-surface p-6 text-lg text-muted">
          {t('board.empty')}
        </p>
      ) : (
        <ul className="m-0 grid list-none gap-4 p-0 lg:grid-cols-2">
          {rows.map(({ patient, status }) => {
            const last = patient.barthel[patient.barthel.length - 1]
            const first = patient.barthel[0]
            const gain = last && first ? last.barthel - first.barthel : 0

            return (
              <li
                key={patient.id}
                className={cn(
                  'flex flex-col gap-3 rounded-3xl border-[1.5px] bg-surface p-6',
                  STATUS_STYLE[status].border,
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-2.5 text-lg font-semibold">
                      <span
                        aria-hidden="true"
                        className={cn('h-3 w-3 rounded-full', STATUS_STYLE[status].dot)}
                      />
                      {patient.name}, {patient.age}
                    </span>
                    <span className="text-base text-muted">{patient.diagnosis}</span>
                    <span className="text-base text-muted">{text(STATUS_KEY[status])}</span>
                  </div>
                  <span className="shrink-0 rounded-full bg-tint px-3 py-1.5 text-sm font-medium text-deep">
                    {t('board.courseDay', { day: patient.courseDay, total: patient.courseLength })}
                  </span>
                </div>

                <div className="flex flex-wrap gap-6">
                  <Metric label={t('board.barthel')} value={String(last?.barthel ?? '—')} />
                  <Metric label={t('board.gain')} value={`+${gain}`} accent />
                  <Metric
                    label={t('board.practice')}
                    value={t('board.weekMinutes', { count: patient.weekMinutes.reduce((a, b) => a + b, 0) })}
                  />
                </div>

                {patient.alerts.map((alert) => (
                  <p
                    key={alert.id}
                    className="m-0 flex items-start gap-2 rounded-2xl bg-bg px-4 py-3 text-base"
                  >
                    <TriangleAlert
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    {alert.text}
                  </p>
                ))}

                <button
                  type="button"
                  onClick={() => onOpen(patient.id)}
                  className="mt-auto min-h-[3rem] rounded-xl bg-deep px-5 py-3 text-base font-semibold text-white"
                >
                  {t('board.open')}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <span className="block text-sm text-muted">{label}</span>
      <span
        className={cn(
          'font-display text-xl font-semibold tracking-[-0.04em]',
          accent && 'text-brand',
        )}
      >
        {value}
      </span>
    </div>
  )
}
