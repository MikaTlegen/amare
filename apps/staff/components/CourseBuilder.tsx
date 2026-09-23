'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { ArrowLeft, Check, TriangleAlert } from 'lucide-react'
import type { CourseStatus, ProgramTemplate, StaffMember, StaffRole } from '@amare/api-client'
import { cn } from '@amare/ui'
import { useT } from '@amare/i18n/react'
import { getEditableTemplates, getStaffMembers, saveCourse } from '@/lib/mock'
import { DURATION_PRESETS, osmsWarning, type CourseIssue } from '@/lib/courses'
import { CourseStructureEditor, FIELD } from './CourseStructureEditor'

type Notice = 'savedDraft' | 'savedPublished' | 'savedUnpublished' | null

const EMPTY_COURSE: ProgramTemplate = {
  id: '',
  title: '',
  days: 30,
  durationMonths: 1,
  includes: [],
  note: '',
  status: 'draft',
  stages: [],
  curatorIds: [],
  moderatorIds: [],
}

/**
 * Конструктор курса (M4 ТЗ): ручная сборка курса модератором.
 *
 * Раскладка как в конструкторе TecHR: структура курса — большая колонка
 * слева, свойства и действия — справа, на телефоне одной колонкой.
 * Длительность задаётся пресетом (месяц, полгода, год) или своим числом
 * дней. Кураторы и модераторы назначаются здесь же: курс без куратора
 * опубликовать нельзя — вести людей по нему будет некому.
 */
export function CourseBuilder({ courseId, onBack }: { courseId: string | null; onBack: () => void }) {
  const t = useT('staff')
  const [course, setCourse] = useState<ProgramTemplate | null>(courseId ? null : EMPTY_COURSE)
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [includes, setIncludes] = useState('')
  const [issues, setIssues] = useState<CourseIssue[]>([])
  const [notice, setNotice] = useState<Notice>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void getStaffMembers().then(setStaff)
    if (!courseId) return
    void getEditableTemplates().then((items) => {
      const found = items.find((item) => item.id === courseId) ?? EMPTY_COURSE
      setCourse(found)
      setIncludes(found.includes.join(', '))
    })
  }, [courseId])

  if (!course) return <p className="text-lg text-muted">{t('builder.saving')}</p>

  const update = (patch: Partial<ProgramTemplate>) => {
    setCourse({ ...course, ...patch })
    setNotice(null)
  }

  const save = async (status: CourseStatus) => {
    setSaving(true)
    const draft: ProgramTemplate = {
      ...course,
      status,
      includes: includes.split(',').map((part) => part.trim()).filter(Boolean),
    }
    const result = await saveCourse(draft)
    setSaving(false)
    setIssues(result.issues)
    if (result.issues.length) return

    // Новый курс получает id при первом сохранении — дальше правится он же
    const saved = draft.id ? draft : result.templates.at(-1)
    if (saved) setCourse(saved)
    const wasPublished = course.status === 'published'
    setNotice(status === 'published' ? 'savedPublished' : wasPublished ? 'savedUnpublished' : 'savedDraft')
  }

  const toggleMember = (role: StaffRole, id: string) => {
    const key = role === 'curator' ? 'curatorIds' : 'moderatorIds'
    const current = course[key] ?? []
    update({ [key]: current.includes(id) ? current.filter((item) => item !== id) : [...current, id] })
  }

  const published = course.status !== 'draft'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 w-fit items-center gap-2 text-base font-medium text-deep"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          {t('builder.back')}
        </button>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="m-0 font-display text-3xl font-semibold tracking-[-0.04em]">
            {course.title.trim() || t('builder.new')}
          </h2>
          <StatusChip status={published ? 'published' : 'draft'} />
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-12">
        <section className="flex min-w-0 flex-col gap-4 lg:col-span-7">
          <h3 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">{t('builder.structure')}</h3>
          <CourseStructureEditor stages={course.stages ?? []} onChange={(stages) => update({ stages })} />
        </section>

        <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:col-span-5">
          <section className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-5">
            <h3 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">{t('builder.about')}</h3>

            <Field id="course-title" label={t('builder.name')}>
              <input
                id="course-title"
                value={course.title}
                onChange={(event) => update({ title: event.target.value })}
                className={FIELD}
              />
            </Field>

            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
              <legend className="mb-1.5 text-base font-medium">{t('builder.duration')}</legend>
              <div className="flex flex-wrap gap-2">
                {DURATION_PRESETS.map((preset) => (
                  <Choice
                    key={preset.months}
                    selected={course.durationMonths === preset.months}
                    onClick={() => update({ durationMonths: preset.months, days: preset.days })}
                  >
                    {t(`course.months.${preset.months}`)}
                  </Choice>
                ))}
                <Choice selected={!course.durationMonths} onClick={() => update({ durationMonths: undefined })}>
                  {t('builder.customDays')}
                </Choice>
              </div>
              {!course.durationMonths && (
                <Field id="course-days" label={t('builder.days')}>
                  <input
                    id="course-days"
                    inputMode="numeric"
                    value={course.days || ''}
                    onChange={(event) => update({ days: Number(event.target.value.replace(/\D/g, '').slice(0, 3)) })}
                    className={cn(FIELD, 'w-32')}
                  />
                </Field>
              )}
              {osmsWarning(course.days) && (
                <p className="m-0 flex items-start gap-3 rounded-2xl border border-accent px-4 py-3 text-base leading-relaxed">
                  <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  {t('builder.osms')}
                </p>
              )}
            </fieldset>

            <Field id="course-includes" label={t('builder.includes')}>
              <input
                id="course-includes"
                value={includes}
                onChange={(event) => {
                  setIncludes(event.target.value)
                  setNotice(null)
                }}
                className={FIELD}
              />
            </Field>

            <Field id="course-note" label={t('builder.note')}>
              <textarea
                id="course-note"
                rows={3}
                value={course.note}
                onChange={(event) => update({ note: event.target.value })}
                className={FIELD}
              />
            </Field>
          </section>

          <section className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-5">
            <h3 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">{t('builder.team')}</h3>
            <MemberPicker
              legend={t('course.curators')}
              hint={t('builder.curatorsHint')}
              members={staff.filter((member) => member.staffRole === 'curator')}
              selected={course.curatorIds ?? []}
              onToggle={(id) => toggleMember('curator', id)}
            />
            <MemberPicker
              legend={t('course.moderators')}
              hint={t('builder.moderatorsHint')}
              members={staff.filter((member) => member.staffRole === 'moderator')}
              selected={course.moderatorIds ?? []}
              onToggle={(id) => toggleMember('moderator', id)}
            />
          </section>

          {/* Действия — тёмной карточкой, как главный показатель на сводке:
              взгляд находит их сразу, даже когда структура курса длинная */}
          <section className="flex flex-col gap-3 rounded-3xl bg-deep p-5 text-white">
            {issues.length > 0 && (
              <div role="alert" className="flex flex-col gap-1.5 rounded-2xl bg-white px-4 py-3 text-ink">
                <p className="m-0 text-base font-semibold">{t('builder.issues')}</p>
                <ul className="m-0 flex flex-col gap-1 pl-5 text-base">
                  {issues.map((issue) => (
                    <li key={issue}>{t(`course.issue.${issue}`)}</li>
                  ))}
                </ul>
              </div>
            )}
            {notice && (
              <p role="status" className="m-0 flex items-start gap-2 text-base font-medium text-sky">
                <Check className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                {t(`builder.${notice}`)}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <ActionButton primary disabled={saving} onClick={() => void save('published')}>
                {saving ? t('builder.saving') : t('builder.publish')}
              </ActionButton>
              <ActionButton primary={false} disabled={saving} onClick={() => void save('draft')}>
                {published ? t('builder.unpublish') : t('builder.saveDraft')}
              </ActionButton>
            </div>
            <p className="m-0 text-base text-white/75">{t('builder.demoNote')}</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export function StatusChip({ status }: { status: CourseStatus }) {
  const t = useT('staff')
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-base font-medium',
        status === 'published' ? 'bg-tint text-deep' : 'border border-line-strong text-muted',
      )}
    >
      {t(`course.status.${status}`)}
    </span>
  )
}

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-base font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'min-h-11 rounded-xl border-[1.5px] px-4 text-base font-medium transition-colors',
        selected ? 'border-deep bg-deep text-white' : 'border-line-strong text-ink hover:border-ink',
      )}
    >
      {children}
    </button>
  )
}

function MemberPicker({
  legend,
  hint,
  members,
  selected,
  onToggle,
}: {
  legend: string
  hint: string
  members: StaffMember[]
  selected: string[]
  onToggle: (id: string) => void
}) {
  return (
    <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
      <legend className="text-base font-medium">{legend}</legend>
      <p className="m-0 text-base text-muted">{hint}</p>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {members.map((member) => (
          <li key={member.id}>
            <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-[1.5px] border-line px-4 py-2.5 has-[:checked]:border-deep has-[:checked]:bg-tint">
              <input
                type="checkbox"
                checked={selected.includes(member.id)}
                onChange={() => onToggle(member.id)}
                className="h-5 w-5 shrink-0 accent-deep"
              />
              <span className="flex min-w-0 flex-col">
                <span className="text-base font-semibold">{member.name}</span>
                <span className="text-base text-muted">{member.speciality}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  )
}

function ActionButton({
  primary,
  disabled,
  onClick,
  children,
}: {
  primary: boolean
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'min-h-12 rounded-xl px-5 text-base font-semibold transition-colors disabled:opacity-60',
        primary ? 'bg-sky text-deep hover:bg-white' : 'border-[1.5px] border-white/45 text-white hover:bg-white/10',
      )}
    >
      {children}
    </button>
  )
}
