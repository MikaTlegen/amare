'use client'

import { useEffect, useState } from 'react'
import { Check, GraduationCap, PlayCircle } from 'lucide-react'
import type { GuardianLesson } from '@amare/api-client'
import { cn } from '@amare/ui'
import { useContentList, useT } from '@amare/i18n/react'
import { getGuardianLessons, toggleLesson } from '@/lib/mock'

/**
 * Школа опекуна (G-06 ТЗ).
 *
 * Уроки — не «полезный контент», а техника безопасности: неправильное
 * перемещение рвёт плечо пациенту и спину ухаживающему, неправильное
 * кормление при дисфагии заканчивается аспирацией. Поэтому уроки
 * отмечаются как пройденные, а рядом висит чек-лист квартиры.
 *
 * TODO CMS: видео и тексты уроков приходят из админки (M2), отметка
 * прохождения — на сервер, чтобы куратор видел, кто из родственников
 * готов забирать человека домой.
 */
export function GuardianSchool() {
  const t = useT('cabinet')
  // Чек-лист безопасной квартиры живёт в словаре: это текст, а не данные
  const checklist = useContentList('cabinet')('school.items')
  const [lessons, setLessons] = useState<GuardianLesson[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [checked, setChecked] = useState<string[]>([])

  /** Отметка чек-листа: повторное нажатие снимает её. */
  const toggleCheck = (item: string) =>
    setChecked((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    )

  useEffect(() => {
    void getGuardianLessons().then(setLessons)
  }, [])

  const mark = async (id: string) => {
    setBusy(id)
    setLessons(await toggleLesson(id))
    setBusy(null)
  }

  const done = lessons.filter((lesson) => lesson.done).length

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <section className="flex flex-col gap-4 lg:col-span-7">
        <div className="flex flex-wrap items-baseline justify-between gap-3 rounded-3xl border border-line bg-surface px-6 py-5">
          <h2 className="m-0 flex items-center gap-2 font-display text-xl font-medium tracking-[-0.035em]">
            <GraduationCap className="h-5 w-5 text-brand" aria-hidden="true" />
            {t('school.title')}
          </h2>
          <span className="text-base text-muted">
            {t('school.progress', { done, total: lessons.length })}
          </span>
        </div>

        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              className={cn(
                'flex flex-col gap-3 rounded-3xl border p-5 sm:flex-row sm:items-center sm:gap-5',
                lesson.done ? 'border-line bg-bg' : 'border-line bg-surface',
              )}
            >
              <span
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
                  lesson.done ? 'bg-tint' : 'bg-bg',
                )}
              >
                {lesson.done ? (
                  <Check className="h-6 w-6 text-brand" aria-hidden="true" />
                ) : (
                  <PlayCircle className="h-6 w-6 text-deep" aria-hidden="true" />
                )}
              </span>

              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-lg font-semibold">{lesson.title}</span>
                <span className="text-base leading-relaxed text-muted">{lesson.summary}</span>
                <span className="text-base text-muted">{t('school.lessonMinutes', { count: lesson.minutes })}</span>
              </div>

              <button
                type="button"
                onClick={() => void mark(lesson.id)}
                disabled={busy === lesson.id}
                className={cn(
                  'min-h-[3.2rem] shrink-0 rounded-xl px-5 py-3 text-base font-semibold disabled:opacity-60',
                  lesson.done ? 'border-[1.5px] border-line' : 'bg-deep text-white',
                )}
              >
                {lesson.done ? t('school.passed') : t('school.mark')}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex h-fit flex-col gap-3 rounded-3xl border border-line bg-surface p-6 lg:col-span-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
            {t('school.checklist')}
          </h2>
          <span className="text-base text-muted">
            {t('school.checked', { done: checked.length, total: checklist.length })}
          </span>
        </div>

        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {checklist.map((item) => {
            const isDone = checked.includes(item)
            return (
              <li key={item}>
                <label
                  className={cn(
                    'flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-base leading-relaxed transition-colors',
                    isDone ? 'bg-tint text-deep' : 'bg-bg hover:bg-tint',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => toggleCheck(item)}
                    className="h-6 w-6 shrink-0 accent-[rgb(var(--c-deep))]"
                  />
                  <span className={cn(isDone && 'line-through decoration-deep/40')}>{item}</span>
                </label>
              </li>
            )
          })}
        </ul>

        <p className="m-0 text-base leading-relaxed text-muted">
          {t('school.checklistNote')}
        </p>

        <p className="m-0 text-sm leading-relaxed text-muted">
          {/* TODO BACKEND: отметки чек-листа уходят на сервер и видны куратору */}
          {t('school.localNote')}
        </p>
      </section>
    </div>
  )
}
