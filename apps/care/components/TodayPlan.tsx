'use client'

import { useEffect, useState } from 'react'
import { Check, Clock, Play, Info, PlayCircle } from 'lucide-react'
import type { DayPlan } from '@amare/api-client'
import { cn } from '@amare/ui'
import { useT } from '@amare/i18n/react'
import { completeExercise, getDayPlan } from '@/lib/mock'

/**
 * План дня.
 *
 * `readOnly` — режим опекуна: он видит план подопечного, но не может
 * отмечать упражнения за него. Это не техническое ограничение, а смысловое:
 * отметка «выполнено» — это медицинская запись о пациенте, и ставит её тот,
 * кто занимался.
 */
export function TodayPlan({ readOnly = false }: { readOnly?: boolean }) {
  const t = useT('cabinet')
  const [plan, setPlan] = useState<DayPlan | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    void getDayPlan().then(setPlan)
  }, [])

  if (!plan) {
    return <p className="text-lg text-muted">{t('plan.loading')}</p>
  }

  const doneMinutes = plan.exercises
    .filter((e) => e.status === 'done')
    .reduce((sum, e) => sum + e.minutes, 0)
  const percent = Math.round((doneMinutes / plan.planMinutes) * 100)

  const markDone = async (id: string) => {
    setBusy(id)
    setPlan(await completeExercise(id))
    setBusy(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <span className="font-display text-xl font-medium tracking-[-0.035em]">
            {t('plan.day', { day: plan.day, total: plan.courseLength })}
          </span>
          <span className="text-base text-muted">
            {t('plan.minutes', { done: doneMinutes, total: plan.planMinutes })}
          </span>
        </div>

        <div
          className="h-2.5 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('plan.percent', { percent })}
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        {percent >= 100 && (
          <p className="m-0 text-base font-medium text-brand">
            {t('plan.allDone')}
          </p>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        {plan.exercises.map((exercise) => {
          const done = exercise.status === 'done'
          const now = exercise.status === 'now'
          return (
            <li
              key={exercise.id}
              className={cn(
                'flex flex-col gap-3 rounded-3xl border p-5 sm:flex-row sm:items-center sm:gap-5',
                done && 'border-line bg-bg',
                now && 'border-accent bg-surface',
                !done && !now && 'border-line bg-surface',
              )}
            >
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                  done ? 'bg-tint' : now ? 'bg-accent' : 'bg-bg',
                )}
              >
                {done ? (
                  <Check className="h-5 w-5 text-brand" aria-hidden="true" />
                ) : now ? (
                  <Play className="h-5 w-5 text-accent-ink" aria-hidden="true" />
                ) : (
                  <Clock className="h-5 w-5 text-muted" aria-hidden="true" />
                )}
              </span>

              <div className="flex flex-1 flex-col gap-1">
                <span className={cn('text-lg font-semibold', done && 'text-muted line-through')}>
                  {exercise.title}
                </span>
                {exercise.hint && !done && (
                  <span className="flex items-start gap-2 text-base text-muted">
                    <Info className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                    {exercise.hint}
                  </span>
                )}

                <span className="flex flex-wrap items-center gap-3 text-base text-muted">
                  {/*
                   * Сложность подписана словом, а не только точками: форма и
                   * цвет — не признак для того, кто их не различает.
                   */}
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <span
                          key={level}
                          className={cn(
                            'h-2 w-2 rounded-full',
                            level <= exercise.difficulty ? 'bg-deep' : 'bg-line',
                          )}
                        />
                      ))}
                    </span>
                    {t('plan.difficulty', { level: t(`plan.difficulty${exercise.difficulty}`) })}
                  </span>

                  {exercise.videoUrl && (
                    <a
                      href={exercise.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-deep"
                    >
                      <PlayCircle className="h-4 w-4" aria-hidden="true" />
                      {t('plan.video')}
                    </a>
                  )}
                </span>
              </div>

              <span className="text-base text-muted sm:w-20 sm:text-right">
                {t('plan.exerciseMinutes', { count: exercise.minutes })}
              </span>

              {!readOnly && !done && (
                <button
                  type="button"
                  onClick={() => void markDone(exercise.id)}
                  disabled={busy === exercise.id}
                  className="min-h-[3rem] shrink-0 rounded-xl bg-deep px-5 py-3 text-base font-semibold text-white disabled:opacity-60"
                >
                  {busy === exercise.id ? t('plan.marking') : t('plan.done')}
                </button>
              )}
            </li>
          )
        })}
      </ul>

      {readOnly && (
        <p className="m-0 text-base text-muted">
          {t('plan.patientOnly')}
        </p>
      )}
    </div>
  )
}
