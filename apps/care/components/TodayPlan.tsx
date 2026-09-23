'use client'

import { useEffect, useState } from 'react'
import { Check, Clock, Play, Info, PlayCircle } from 'lucide-react'
import type { DayPlan, Exercise, ExerciseDifficulty } from '@amare/api-client'
import { cn } from '@amare/ui'
import { useT } from '@amare/i18n/react'
import { completeExercise, getDayPlan, setExerciseFeedback } from '@/lib/mock'

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

  /** Оценка пациента: как далось упражнение. Менять можно сколько угодно. */
  const rate = async (id: string, level: ExerciseDifficulty) => {
    setPlan(await setExerciseFeedback(id, level))
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

      {/*
       * Сводка по оценкам «как далось упражнение» — только опекуну, рядом
       * со списком, тем же вариантом обратной связи, что видит пациент
       * построчно (см. ниже, {done && readOnly && exercise.feedback}).
       * Пациенту сводка не нужна: он и так видит и ставит каждую оценку сам.
       */}
      {readOnly && <FeedbackSummary exercises={plan.exercises} />}

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

                {exercise.videoUrl && (
                  <a
                    href={exercise.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center gap-1.5 text-base font-medium text-deep"
                  >
                    <PlayCircle className="h-4 w-4" aria-hidden="true" />
                    {t('plan.video')}
                  </a>
                )}

                {/*
                 * Как далось упражнение, отвечает сам пациент — врач этого
                 * не знает. Спрашиваем только после выполнения: до занятия
                 * вопрос бессмысленный. Ответ можно изменить.
                 */}
                {done && !readOnly && (
                  <span className="flex flex-wrap items-center gap-2 text-base text-muted">
                    {exercise.feedback
                      ? t('plan.feedbackDone', { level: t(`plan.difficulty${exercise.feedback}`) })
                      : t('plan.feedbackAsk')}
                    <span className="flex flex-wrap gap-1.5">
                      {([1, 2, 3] as const).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => void rate(exercise.id, level)}
                          aria-pressed={exercise.feedback === level}
                          className={cn(
                            'min-h-[2.4rem] rounded-xl border px-3 py-1.5 text-base',
                            exercise.feedback === level
                              ? 'border-deep bg-deep text-white'
                              : 'border-line bg-bg text-ink',
                          )}
                        >
                          {t(`plan.difficulty${level}`)}
                        </button>
                      ))}
                    </span>
                  </span>
                )}

                {/* Опекун и куратор оценку видят, но не ставят: она не их —
                    поэтому «Оценка пациента», а не «Ваша оценка» */}
                {done && readOnly && exercise.feedback && (
                  <span className="text-base text-muted">
                    {t('plan.feedbackPatient',{ level: t(`plan.difficulty${exercise.feedback}`) })}
                  </span>
                )}
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

const DIFFICULTY_LEVELS: readonly ExerciseDifficulty[] = [1, 2, 3]

/** Сводка «сколько упражнений какой оценки» — для опекуна, компактно, над списком. */
function FeedbackSummary({ exercises }: { exercises: Exercise[] }) {
  const t = useT('cabinet')
  const counts = exercises.reduce(
    (acc, exercise) => {
      if (exercise.feedback) acc[exercise.feedback] += 1
      return acc
    },
    { 1: 0, 2: 0, 3: 0 } as Record<ExerciseDifficulty, number>,
  )
  const total = counts[1] + counts[2] + counts[3]
  if (total === 0) return null

  return (
    <ul className="m-0 flex flex-wrap list-none gap-2.5 p-0">
      {DIFFICULTY_LEVELS.filter((level) => counts[level] > 0).map((level) => (
        <li
          key={level}
          className={cn(
            'flex items-center gap-2 rounded-xl px-3.5 py-2',
            level === 1 && 'bg-tint',
            level === 2 && 'bg-bg',
            level === 3 && 'bg-[rgb(253,238,237)]',
          )}
        >
          <span className="font-display text-lg font-semibold tracking-[-0.02em]">
            {t('guardian.feedback.count', { count: counts[level] })}
          </span>
          <span className="text-base">{t(`plan.difficulty${level}`)}</span>
        </li>
      ))}
    </ul>
  )
}
