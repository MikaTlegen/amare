'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Check, LibraryBig, Plus, TriangleAlert } from 'lucide-react'
import type { ProgramTemplate } from '@amare/api-client'
import { cn } from '@amare/ui'
import { addTemplate, getEditableTemplates } from '@/lib/mock'

/** Минимальная длительность курса по стандарту РК для II и III этапов. */
const OSMS_MIN_DAYS = 14

/**
 * Библиотека курсов (M4 ТЗ) — рабочий экран администратора.
 *
 * Курсы заводит администратор, а не куратор: куратор ведёт людей и
 * правит шаблон между двумя звонками, а шаблон — это то, по чему потом
 * занимаются десятки пациентов.
 *
 * Предупреждение про 14 дней показывается до сохранения: узнать о
 * несоответствии стандарту после того, как курс уже в библиотеке,
 * бесполезно.
 */
export function CourseLibrary() {
  const [items, setItems] = useState<ProgramTemplate[]>([])
  const [title, setTitle] = useState('')
  const [days, setDays] = useState('14')
  const [includes, setIncludes] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    void getEditableTemplates().then(setItems)
  }, [])

  const dayCount = Number(days)
  const tooShort = dayCount > 0 && dayCount < OSMS_MIN_DAYS

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim() || !dayCount) return

    setSaving(true)
    setItems(
      await addTemplate({
        title: title.trim(),
        days: dayCount,
        includes: includes
          .split(',')
          .map((part) => part.trim())
          .filter(Boolean),
        note: note.trim(),
      }),
    )
    setSaving(false)
    setSaved(true)
    setTitle('')
    setIncludes('')
    setNote('')
  }

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <form
        onSubmit={submit}
        className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 lg:col-span-5"
      >
        <h2 className="m-0 flex items-center gap-2 font-display text-xl font-medium tracking-[-0.035em]">
          <Plus className="h-5 w-5 text-brand" aria-hidden="true" />
          Новый шаблон курса
        </h2>

        <Field id="tpl-title" label="Название" value={title} onChange={setTitle} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="tpl-days" className="text-base font-medium">
            Длительность, дней
          </label>
          <input
            id="tpl-days"
            inputMode="numeric"
            value={days}
            onChange={(event) => setDays(event.target.value.replace(/\D/g, '').slice(0, 2))}
            className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line bg-bg px-4 py-3 text-base"
          />
        </div>

        {tooShort && (
          <p className="m-0 flex items-start gap-3 rounded-2xl border border-accent bg-[rgb(253,238,237)] px-5 py-4 text-base leading-relaxed">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            Курс короче {OSMS_MIN_DAYS} дней не соответствует стандарту РК для II и III этапов.
            Для оплаты по ОСМС такой шаблон не подойдёт.
          </p>
        )}

        <Field
          id="tpl-includes"
          label="Состав, через запятую"
          value={includes}
          onChange={setIncludes}
          placeholder="Кинезиотерапия, ЛФК, Массаж"
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="tpl-note" className="text-base font-medium">
            Примечание для специалистов
          </label>
          <textarea
            id="tpl-note"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Кому подходит, чего избегать"
            className="rounded-xl border-[1.5px] border-line bg-bg px-4 py-3 text-base"
          />
        </div>

        <button
          type="submit"
          disabled={!title.trim() || !dayCount || saving}
          className="min-h-[3.2rem] self-start rounded-xl bg-deep px-6 py-3 text-base font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Сохраняем…' : 'Добавить в библиотеку'}
        </button>

        {saved && (
          <p className="m-0 flex items-center gap-2 text-base font-medium text-brand">
            <Check className="h-5 w-5" aria-hidden="true" />
            Шаблон добавлен и доступен при назначении программы
          </p>
        )}
      </form>

      <section className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-6 lg:col-span-7">
        <h2 className="m-0 flex items-center gap-2 font-display text-xl font-medium tracking-[-0.035em]">
          <LibraryBig className="h-5 w-5 text-brand" aria-hidden="true" />
          Библиотека курсов
        </h2>

        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {items.map((template) => (
            <li
              key={template.id}
              className={cn(
                'flex flex-col gap-1 rounded-2xl border-[1.5px] p-5',
                template.days < OSMS_MIN_DAYS ? 'border-accent bg-bg' : 'border-line bg-bg',
              )}
            >
              <span className="text-base font-semibold">{template.title}</span>
              <span className="text-base text-muted">
                {template.days} дней · {template.includes.join(' · ')}
              </span>
              {template.note && (
                <span className="text-base leading-relaxed text-ink/80">{template.note}</span>
              )}
            </li>
          ))}
        </ul>

        <p className="m-0 text-sm leading-relaxed text-muted">
          {/* TODO BACKEND: библиотека и версии шаблонов хранятся на сервере */}
          Изменения живут до перезагрузки: хранилище появится вместе с бэкендом.
        </p>
      </section>
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (next: string) => void
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-base font-medium">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line bg-bg px-4 py-3 text-base"
      />
    </div>
  )
}
