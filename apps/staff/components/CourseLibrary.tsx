'use client'

import { useEffect, useState } from 'react'
import { CalendarRange, ListChecks, Pencil, Plus, TriangleAlert } from 'lucide-react'
import type { ProgramTemplate, StaffMember } from '@amare/api-client'
import { cn } from '@amare/ui'
import { useT } from '@amare/i18n/react'
import { getEditableTemplates, getStaffMembers } from '@/lib/mock'
import { exerciseCount, isPublished, osmsWarning } from '@/lib/courses'
import { StatusChip } from './CourseBuilder'

type Filter = 'all' | 'published' | 'draft'

const FILTERS: Filter[] = ['all', 'published', 'draft']

/**
 * Библиотека курсов (M4 ТЗ) — рабочий экран модератора.
 *
 * Как «Курсы» в TecHR: сводка сверху, фильтр по статусу, карточки курсов
 * с длительностью, числом упражнений, командой и кнопкой правки. Сами
 * курсы собираются в конструкторе (CourseBuilder).
 *
 * Курсы заводит модератор, а не куратор: куратор ведёт людей и правит
 * шаблон между двумя звонками, а шаблон — это то, по чему потом
 * занимаются десятки пациентов.
 */
export function CourseLibrary({ onEdit }: { onEdit: (courseId: string | null) => void }) {
  const t = useT('staff')
  const [items, setItems] = useState<ProgramTemplate[]>([])
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    void getEditableTemplates().then(setItems)
    void getStaffMembers().then(setStaff)
  }, [])

  const published = items.filter(isPublished).length
  const shown = items.filter((item) =>
    filter === 'all' ? true : filter === 'published' ? isPublished(item) : !isPublished(item),
  )
  const names = (ids: string[] | undefined) =>
    staff.filter((member) => ids?.includes(member.id)).map((member) => member.name)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <h2 className="m-0 font-display text-3xl font-semibold tracking-[-0.04em]">{t('tab.courses')}</h2>
          <p className="m-0 text-base text-muted">
            {t('courses.summary', { total: items.length, published, drafts: items.length - published })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onEdit(null)}
          className="inline-flex min-h-12 w-fit items-center gap-2 rounded-xl bg-deep px-5 text-base font-semibold text-white transition-colors hover:bg-deep2"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          {t('courses.new')}
        </button>
      </div>

      <div role="group" aria-label={t('courses.filter')} className="flex rounded-2xl border border-line bg-surface p-1 sm:w-fit">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
            className={cn(
              'min-h-11 min-w-0 flex-1 rounded-xl px-2.5 text-base font-medium transition-colors sm:flex-none sm:px-4',
              filter === item ? 'bg-deep text-white' : 'text-muted hover:text-ink',
            )}
          >
            {t(`courses.filter.${item}`)}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="m-0 text-base text-muted">{t('courses.empty')}</p>
      ) : (
        <ul className="m-0 grid list-none gap-4 p-0 lg:grid-cols-2">
          {shown.map((course) => {
            const curators = names(course.curatorIds)
            const moderators = names(course.moderatorIds)
            return (
              <li key={course.id} className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="m-0 min-w-0 flex-1 font-display text-xl font-semibold tracking-[-0.035em]">
                    {course.title}
                  </h3>
                  <StatusChip status={isPublished(course) ? 'published' : 'draft'} />
                </div>

                <p className="m-0 flex flex-wrap gap-x-5 gap-y-1 text-base text-muted">
                  <span className="inline-flex items-center gap-2">
                    <CalendarRange className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {course.durationMonths
                      ? t(`course.months.${course.durationMonths}` as 'course.months.1')
                      : t('course.days', { count: course.days })}
                  </span>
                  {course.stages && (
                    <span className="inline-flex items-center gap-2">
                      <ListChecks className="h-5 w-5 shrink-0" aria-hidden="true" />
                      {t('course.exercises', { count: exerciseCount(course) })}
                    </span>
                  )}
                </p>

                {course.includes.length > 0 && <p className="m-0 text-base">{course.includes.join(' · ')}</p>}
                {course.note && <p className="m-0 text-base leading-relaxed text-muted">{course.note}</p>}

                {osmsWarning(course.days) && (
                  <p className="m-0 flex items-center gap-2 text-base font-medium text-accent">
                    <TriangleAlert className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {t('course.osms')}
                  </p>
                )}

                <dl className="m-0 grid gap-2 border-t border-line pt-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-base text-muted">{t('course.curators')}</dt>
                    <dd className="m-0 text-base font-medium">{curators.join(', ') || t('course.nobody')}</dd>
                  </div>
                  <div>
                    <dt className="text-base text-muted">{t('course.moderators')}</dt>
                    <dd className="m-0 text-base font-medium">{moderators.join(', ') || t('course.nobody')}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => onEdit(course.id)}
                  className="mt-auto inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border-[1.5px] border-deep px-4 text-base font-semibold text-deep transition-colors hover:bg-deep hover:text-white"
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  {t('courses.edit')}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
