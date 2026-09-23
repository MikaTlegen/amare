'use client'

import { useEffect, useState } from 'react'
import { CalendarX, CircleCheck, Info, LibraryBig, TriangleAlert, Users, Video } from 'lucide-react'
import type { PatientCard, ProgramTemplate } from '@amare/api-client'
import { cn, DashCard, DashGrid } from '@amare/ui'
import { useT } from '@amare/i18n/react'
import { getEditableTemplates, getStaffPatients } from '@/lib/mock'
import { isPublished } from '@/lib/courses'

type Period = 'week' | 'month' | 'quarter' | 'year'

const PERIODS: Period[] = ['week', 'month', 'quarter', 'year']

interface CuratorStats {
  name: string
  patients: number
  adherence: number
  reviews: number
}

interface PeriodStats {
  active: number
  adherence: number
  missed: number
  videos: number
  /** Оценки пациентов после занятий: легко, нормально, тяжело. */
  feedback: [number, number, number]
  curators: CuratorStats[]
}

/**
 * Статистика клиники за период — демонстрационная.
 *
 * TODO BACKEND: считать на сервере по занятиям и оценкам пациентов.
 * Пока бэкенда нет, цифры заданы здесь и честно подписаны на экране
 * (dash.demo): делать вид, что это живая статистика, нельзя.
 */
const DEMO_STATS: Record<Period, PeriodStats> = {
  week: {
    active: 18,
    adherence: 82,
    missed: 6,
    videos: 4,
    feedback: [21, 34, 9],
    curators: [
      { name: 'Индира Жумабекова', patients: 8, adherence: 86, reviews: 2 },
      { name: 'Ержан Касымов', patients: 6, adherence: 79, reviews: 1 },
      { name: 'Динара Оспанова', patients: 4, adherence: 74, reviews: 1 },
    ],
  },
  month: {
    active: 24,
    adherence: 78,
    missed: 27,
    videos: 11,
    feedback: [88, 131, 41],
    curators: [
      { name: 'Индира Жумабекова', patients: 10, adherence: 83, reviews: 5 },
      { name: 'Ержан Касымов', patients: 8, adherence: 76, reviews: 4 },
      { name: 'Динара Оспанова', patients: 6, adherence: 71, reviews: 2 },
    ],
  },
  quarter: {
    active: 41,
    adherence: 75,
    missed: 96,
    videos: 29,
    feedback: [244, 390, 131],
    curators: [
      { name: 'Индира Жумабекова', patients: 17, adherence: 80, reviews: 12 },
      { name: 'Ержан Касымов', patients: 14, adherence: 74, reviews: 10 },
      { name: 'Динара Оспанова', patients: 10, adherence: 69, reviews: 7 },
    ],
  },
  year: {
    active: 112,
    adherence: 73,
    missed: 402,
    videos: 118,
    feedback: [1020, 1544, 530],
    curators: [
      { name: 'Индира Жумабекова', patients: 46, adherence: 78, reviews: 47 },
      { name: 'Ержан Касымов', patients: 38, adherence: 72, reviews: 41 },
      { name: 'Динара Оспанова', patients: 28, adherence: 68, reviews: 30 },
    ],
  },
}

/** Цвета оценок сложности: только бирюза — это не тревога, а распределение. */
const FEEDBACK_TONES = ['bg-brand-bright', 'bg-brand', 'bg-deep'] as const
const DIFFICULTY_KEYS = ['difficulty.1', 'difficulty.2', 'difficulty.3'] as const

/**
 * Сводка модератора: как идут занятия по всей клинике.
 *
 * Раскладка как у рабочих дашбордов (TecHR): заголовок-вывод, фильтр
 * периода, сетка показателей, ниже — что требует решения и как ведут
 * занятия кураторы. Одна тёмная карточка — главный показатель, она же
 * связывает сводку с тёмным меню слева.
 */
export function ModeratorDashboard({ onOpenCourses }: { onOpenCourses: () => void }) {
  const t = useT('staff')
  const [period, setPeriod] = useState<Period>('month')
  const [patients, setPatients] = useState<PatientCard[]>([])
  const [courses, setCourses] = useState<ProgramTemplate[]>([])

  useEffect(() => {
    void getStaffPatients().then(setPatients)
    void getEditableTemplates().then(setCourses)
  }, [])

  const stats = DEMO_STATS[period]
  const attention = patients.flatMap((patient) =>
    patient.alerts.filter((alert) => alert.level !== 'info').map((alert) => ({ patient, alert })),
  )
  const published = courses.filter(isPublished).length

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-1.5">
          <h2 className="m-0 font-display text-xl font-semibold tracking-[-0.035em] sm:text-3xl sm:tracking-[-0.04em]">{t('dash.headline')}</h2>
          <p className="m-0 text-base text-muted">
            {t('dash.summary', { patients: stats.active, attention: attention.length })}
          </p>
        </div>

        <div role="group" aria-label={t('dash.period')} className="flex rounded-2xl border border-line bg-surface p-1">
          {PERIODS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              aria-pressed={period === item}
              className={cn(
                'min-h-11 min-w-0 flex-1 rounded-xl px-2 text-base font-medium transition-colors sm:px-4',
                period === item ? 'bg-deep text-white' : 'text-muted hover:text-ink',
              )}
            >
              {t(`period.${item}`)}
            </button>
          ))}
        </div>
      </div>

      <DashGrid className="lg:grid-cols-2 xl:grid-cols-4">
        <DashCard tone="dark" icon={Users} label={t('kpi.active')} value={stats.active} note={t('kpi.activeNote')} />
        <DashCard icon={CircleCheck} label={t('kpi.adherence')} value={`${stats.adherence}%`} note={t('kpi.adherenceNote')} />
        <DashCard icon={CalendarX} label={t('kpi.missed')} value={stats.missed} note={t('kpi.missedNote')} />
        <DashCard icon={Video} label={t('kpi.videos')} value={stats.videos} note={t('kpi.videosNote')} />
      </DashGrid>

      <div className="grid gap-3 sm:gap-4 xl:grid-cols-3">
        <FeedbackCard feedback={stats.feedback} />

        <DashCard
          icon={LibraryBig}
          label={t('kpi.courses')}
          value={courses.length}
          note={t('kpi.coursesNote', { published, drafts: courses.length - published })}
          onClick={onOpenCourses}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-6">
          <h3 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">{t('dash.attention')}</h3>
          {attention.length === 0 ? (
            <p className="m-0 text-base text-muted">{t('dash.attentionEmpty')}</p>
          ) : (
            <ul className="m-0 flex list-none flex-col p-0">
              {attention.map(({ patient, alert }) => (
                <li key={alert.id} className="flex items-start gap-3 border-t border-line py-4 first:border-t-0 first:pt-0">
                  <TriangleAlert
                    className={cn('mt-0.5 h-5 w-5 shrink-0', alert.level === 'danger' ? 'text-accent' : 'text-brand')}
                    aria-hidden="true"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-base font-semibold">{patient.name}</span>
                    <span className="text-base leading-relaxed">{alert.text}</span>
                    <span className="text-base text-muted">
                      {patient.curator} · {alert.at}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-6">
          <h3 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">{t('dash.curators')}</h3>
          <ul className="m-0 flex list-none flex-col p-0">
            {stats.curators.map((curator) => (
              <li key={curator.name} className="flex flex-col gap-2 border-t border-line py-4 first:border-t-0 first:pt-0">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-base font-semibold">{curator.name}</span>
                  <span className="text-base tabular-nums text-muted">
                    {t('dash.curatorPatients', { count: curator.patients })} ·{' '}
                    {t('dash.curatorReviews', { count: curator.reviews })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full origin-left rounded-full bg-brand"
                      style={{ transform: `scaleX(${curator.adherence / 100})` }}
                    />
                  </div>
                  <span className="shrink-0 text-base tabular-nums">
                    {t('dash.curatorAdherence', { percent: curator.adherence })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="m-0 flex items-start gap-2 text-base text-muted">
        <Info className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
        {t('dash.demo')}
      </p>
    </div>
  )
}

/**
 * Как даются упражнения: распределение оценок пациентов одной полосой.
 * Цвет не единственный признак — у каждой доли подпись и число.
 */
function FeedbackCard({ feedback }: { feedback: [number, number, number] }) {
  const t = useT('staff')
  const total = feedback.reduce((sum, value) => sum + value, 0) || 1

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-6 xl:col-span-2">
      <div className="flex flex-col gap-0.5">
        <h3 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">{t('kpi.feedback')}</h3>
        <p className="m-0 text-base text-muted">{t('kpi.feedbackNote')}</p>
      </div>

      <div className="flex h-4 overflow-hidden rounded-full bg-line" aria-hidden="true">
        {feedback.map((value, index) => (
          <div key={DIFFICULTY_KEYS[index]} className={FEEDBACK_TONES[index]} style={{ width: `${(value / total) * 100}%` }} />
        ))}
      </div>

      <dl className="m-0 grid gap-3 sm:grid-cols-3">
        {feedback.map((value, index) => (
          <div key={DIFFICULTY_KEYS[index]} className="flex items-center gap-3">
            <span className={cn('h-3 w-3 shrink-0 rounded-full', FEEDBACK_TONES[index])} aria-hidden="true" />
            <dt className="text-base">{t(DIFFICULTY_KEYS[index] ?? 'difficulty.1')}</dt>
            <dd className="m-0 ml-auto text-base font-semibold tabular-nums sm:ml-0">
              {Math.round((value / total) * 100)}%
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
