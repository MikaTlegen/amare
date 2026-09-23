'use client'

import { Plus, Trash2 } from 'lucide-react'
import type { CourseExercise, CourseStage } from '@amare/api-client'
import { useT } from '@amare/i18n/react'

/** Поле ввода: рамка line-strong — единственный признак элемента управления (DESIGN.md). */
const FIELD_BASE = 'min-h-[3.2rem] w-full rounded-xl border-[1.5px] border-line-strong px-4 py-3 text-base'
/** Поле на белой карточке — «углубление» цвета фона страницы. */
export const FIELD = `${FIELD_BASE} bg-bg`
/** Поле на подложке bg — наоборот, белое. */
const FIELD_ON_BG = `${FIELD_BASE} bg-surface`

/** Уникальный id нового этапа или упражнения — до сервера, который выдаст свой. */
export function localId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Структура курса: этапы → упражнения.
 *
 * Как «модули → уроки» в конструкторе TecHR, но в словах реабилитации:
 * этап — неделя или месяц курса, упражнение — то, что пациент увидит
 * в плане дня (название, минуты, подсказка, видео). Все изменения —
 * новые массивы, исходный курс не мутируется.
 */
export function CourseStructureEditor({
  stages,
  onChange,
}: {
  stages: CourseStage[]
  onChange: (next: CourseStage[]) => void
}) {
  const t = useT('staff')

  const mapStage = (stageId: string, update: (stage: CourseStage) => CourseStage) =>
    onChange(stages.map((stage) => (stage.id === stageId ? update(stage) : stage)))

  const updateExercise = (stageId: string, exerciseId: string, patch: Partial<CourseExercise>) =>
    mapStage(stageId, (stage) => ({
      ...stage,
      exercises: stage.exercises.map((exercise) => (exercise.id === exerciseId ? { ...exercise, ...patch } : exercise)),
    }))

  const addStage = () => onChange([...stages, { id: localId('st'), title: t('builder.newStage'), exercises: [] }])

  const addExercise = (stageId: string) =>
    mapStage(stageId, (stage) => ({
      ...stage,
      exercises: [...stage.exercises, { id: localId('ce'), title: t('builder.newExercise'), minutes: 10 }],
    }))

  const removeExercise = (stageId: string, exerciseId: string) =>
    mapStage(stageId, (stage) => ({
      ...stage,
      exercises: stage.exercises.filter((exercise) => exercise.id !== exerciseId),
    }))

  return (
    <div className="flex flex-col gap-4">
      {stages.map((stage, stageIndex) => {
        const n = stageIndex + 1
        return (
          <fieldset key={stage.id} className="m-0 flex min-w-0 flex-col gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-5">
            <legend className="sr-only">{t('builder.stage', { n })}</legend>
            <div className="flex items-end gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <label htmlFor={`${stage.id}-title`} className="text-base font-medium text-muted">
                  {t('builder.stage', { n })}
                </label>
                <input
                  id={`${stage.id}-title`}
                  value={stage.title}
                  onChange={(event) => mapStage(stage.id, (item) => ({ ...item, title: event.target.value }))}
                  className={`${FIELD} font-display font-semibold`}
                />
              </div>
              <RemoveButton
                label={t('builder.removeStage', { n })}
                onClick={() => onChange(stages.filter((item) => item.id !== stage.id))}
              />
            </div>

            <ol className="m-0 flex list-none flex-col gap-3 p-0">
              {stage.exercises.map((exercise, exerciseIndex) => {
                const m = exerciseIndex + 1
                return (
                  <li key={exercise.id} className="flex flex-col gap-3 rounded-2xl bg-bg p-4">
                    <div className="flex items-end gap-3">
                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <label htmlFor={`${exercise.id}-title`} className="text-base font-medium">
                          {t('builder.exercise', { n: m })}
                        </label>
                        <input
                          id={`${exercise.id}-title`}
                          value={exercise.title}
                          onChange={(event) => updateExercise(stage.id, exercise.id, { title: event.target.value })}
                          className={FIELD_ON_BG}
                        />
                      </div>
                      <div className="flex w-24 shrink-0 flex-col gap-1.5">
                        <label htmlFor={`${exercise.id}-min`} className="text-base font-medium">
                          {t('builder.minutes')}
                        </label>
                        <input
                          id={`${exercise.id}-min`}
                          inputMode="numeric"
                          value={exercise.minutes || ''}
                          onChange={(event) =>
                            updateExercise(stage.id, exercise.id, {
                              minutes: Number(event.target.value.replace(/\D/g, '').slice(0, 3)),
                            })
                          }
                          className={FIELD_ON_BG}
                        />
                      </div>
                      <RemoveButton
                        label={t('builder.removeExercise', { n: m })}
                        onClick={() => removeExercise(stage.id, exercise.id)}
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor={`${exercise.id}-hint`} className="text-base font-medium text-muted">
                          {t('builder.hint')}
                        </label>
                        <input
                          id={`${exercise.id}-hint`}
                          value={exercise.hint ?? ''}
                          onChange={(event) =>
                            updateExercise(stage.id, exercise.id, { hint: event.target.value || undefined })
                          }
                          className={FIELD_ON_BG}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor={`${exercise.id}-video`} className="text-base font-medium text-muted">
                          {t('builder.video')}
                        </label>
                        <input
                          id={`${exercise.id}-video`}
                          type="url"
                          inputMode="url"
                          value={exercise.videoUrl ?? ''}
                          onChange={(event) =>
                            updateExercise(stage.id, exercise.id, { videoUrl: event.target.value || undefined })
                          }
                          className={FIELD_ON_BG}
                        />
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>

            <button
              type="button"
              onClick={() => addExercise(stage.id)}
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl px-1 text-base font-semibold text-deep"
            >
              <Plus className="h-5 w-5" aria-hidden="true" />
              {t('builder.addExercise')}
            </button>
          </fieldset>
        )
      })}

      <button
        type="button"
        onClick={addStage}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-line-strong px-5 text-base font-semibold text-deep transition-colors hover:border-deep"
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
        {t('builder.addStage')}
      </button>
    </div>
  )
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-[3.2rem] w-12 shrink-0 items-center justify-center rounded-xl border-[1.5px] border-line-strong text-muted transition-colors hover:border-ink hover:text-ink"
    >
      <Trash2 className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}
