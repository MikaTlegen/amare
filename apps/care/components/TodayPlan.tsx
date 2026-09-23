'use client'

import { useEffect, useState } from 'react'
import { Check, Clock, Play, Info, PlayCircle } from 'lucide-react'
import type { DayPlan, Exercise, ExerciseDifficulty } from '@amare/api-client'
import { cn } from '@amare/ui'
import { useT } from '@amare/i18n/react'
import { completeExercise, getDayPlan, setExerciseFeedback } from '@/lib/mock'

/**
 * Порядок показа: сначала текущее упражнение, затем оставшиеся, внизу
 * выполненные. Раньше список шёл в порядке плана, и на телефоне первая
 * кнопка «Выполнено» оказывалась на третьем экране под уже сделанным.
 * Сортировка стабильная — внутри каждой группы порядок плана сохраняется.
 */
const SHOW_ORDER: Record<Exercise['status'], number> = { now: 0, todo: 1, done: 2 }

const DIFFICULTY_LEVELS: readonly ExerciseDifficulty[] = [1, 2, 3]

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
  /** Упражнение, по которому сейчас спрашиваем «как далось». */
  const [asking, setAsking] = useState<string | null>(null)

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

  const markDone = async (id: string, feedback?: ExerciseDifficulty) => {
    setBusy(id)
    setPlan(await completeExercise(id, feedback))
    setBusy(null)
    setAsking(null)
  }

  /** Оценка пациента: как далось упражнение. Менять можно сколько угодно. */
  const rate = async (id: string, level: ExerciseDifficulty) => {
    setPlan(await setExerciseFeedback(id, level))
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-4 sm:p-6">
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
          {/* Бирюза, а не красный: прогресс — хорошая новость, красным
              он читался как «опасно, мало». scaleX вместо width — анимация
              без пересчёта раскладки */}
          <div
            className="h-full origin-left rounded-full bg-brand transition-transform duration-500"
            style={{ transform: `scaleX(${Math.min(percent, 100) / 100})` }}
          />
        </div>

        {percent >= 100 && (
          <p className="m-0 text-base font-medium text-brand">
            {t('plan.allDone')}
          </p>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        {[...plan.exercises]
          .sort((a, b) => SHOW_ORDER[a.status] - SHOW_ORDER[b.status])
          .map((exercise) => {
          const done = exercise.status === 'done'
          const now = exercise.status === 'now'
          return (
            <li
              key={exercise.id}
              className={cn(
                // На телефоне иконка, название и минуты — одной строкой, кнопка
                // переносится под них на всю ширину: так «Выполнено» текущего
                // упражнения помещается в первый экран над нижней панелью
                'flex flex-wrap items-start gap-3 rounded-3xl border p-4 sm:flex-nowrap sm:items-center sm:gap-5 sm:p-5',
                // Вопрос «как далось» встаёт отдельной строкой под упражнением
                asking === exercise.id && 'sm:flex-wrap',
                done && 'border-line bg-bg',
                now && 'border-[1.5px] border-brand bg-surface',
                !done && !now && 'border-line bg-surface',
              )}
            >
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                  done ? 'bg-tint' : now ? 'bg-brand' : 'bg-bg',
                )}
              >
                {done ? (
                  <Check className="h-5 w-5 text-brand" aria-hidden="true" />
                ) : now ? (
                  <Play className="h-5 w-5 text-white" aria-hidden="true" />
                ) : (
                  <Clock className="h-5 w-5 text-muted" aria-hidden="true" />
                )}
              </span>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {/* Без зачёркивания: при нарушениях зрения оно съедает буквы,
                    «выполнено» и так видно по галочке и приглушённому цвету */}
                <span className="flex items-baseline justify-between gap-3">
                  <span className={cn('text-lg font-semibold', done && 'text-muted')}>{exercise.title}</span>
                  {/* На телефоне минуты — в строке названия: отдельной колонкой
                      они сужали текст, и подсказка расползалась на полэкрана */}
                  <span className="shrink-0 text-base text-muted sm:hidden">
                    {t('plan.exerciseMinutes', { count: exercise.minutes })}
                  </span>
                </span>
                {exercise.hint && !done && (
                  <span className="flex items-start gap-2 text-base leading-snug text-muted">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {exercise.hint}
                  </span>
                )}

                {exercise.videoUrl && (
                  <a
                    href={exercise.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 w-fit items-center gap-1.5 text-base font-medium text-deep"
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
                            'min-h-11 rounded-xl border px-3 py-1.5 text-base',
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

              </div>

              <span className="hidden shrink-0 text-base text-muted sm:block sm:w-20 sm:text-right">
                {t('plan.exerciseMinutes', { count: exercise.minutes })}
              </span>

              {!readOnly && !done && asking !== exercise.id && (
                <button
                  type="button"
                  onClick={() => setAsking(exercise.id)}
                  className="min-h-[3rem] w-full shrink-0 rounded-xl bg-deep px-5 py-3 text-base font-semibold text-white sm:w-auto"
                >
                  {t('plan.done')}
                </button>
              )}

              {/*
               * «Как далось?» — в момент отметки, а не потом: после занятия
               * человек помнит, чего оно стоило, а назавтра уже нет. Ответ
               * уходит куратору вместе с отметкой. Пропустить можно — отметка
               * всё равно ставится, выдумывать оценку за человека нельзя.
               */}
              {!readOnly && !done && asking === exercise.id && (
                <div className="flex w-full flex-col gap-3 border-t border-line pt-4">
                  <span className="text-base font-semibold">{t('plan.feedbackAsk')}</span>
                  {/* Столбиком на узком экране: «нормально» не помещается в треть
                      ширины, а уменьшать кегль для 55+ нельзя */}
                  <div className="grid gap-2 min-[26rem]:grid-cols-3">
                    {DIFFICULTY_LEVELS.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => void markDone(exercise.id, level)}
                        disabled={busy === exercise.id}
                        className="min-h-[3rem] rounded-xl bg-deep px-2 py-3 text-base font-semibold text-white disabled:opacity-60"
                      >
                        {t(`plan.difficulty${level}`)}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <button
                      type="button"
                      onClick={() => void markDone(exercise.id)}
                      disabled={busy === exercise.id}
                      className="min-h-11 text-base font-medium text-deep underline-offset-4 hover:underline disabled:opacity-60"
                    >
                      {busy === exercise.id ? t('plan.marking') : t('plan.skipRating')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAsking(null)}
                      className="min-h-11 text-base font-medium text-muted hover:text-ink"
                    >
                      {t('plan.cancel')}
                    </button>
                  </div>
                  <span className="text-base leading-snug text-muted">{t('plan.ratingNote')}</span>
                </div>
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

