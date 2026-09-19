'use client'

import { useState } from 'react'
import { Check, ClipboardCheck, Phone, TriangleAlert, Video } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { StaffTask } from '@amare/api-client'
import { cn } from '@amare/ui'
import { closeTask } from '@/lib/mock'

const TASK_ICON: Record<StaffTask['kind'], LucideIcon> = {
  video: Video,
  call: Phone,
  assessment: ClipboardCheck,
  alert: TriangleAlert,
}

/** Очередь задач куратора (W-02 ТЗ). Срочное — сверху. */
export function TaskQueue({
  tasks,
  onTasksChange,
  onOpenPatient,
}: {
  tasks: StaffTask[]
  onTasksChange: (next: StaffTask[]) => void
  onOpenPatient: (patientId: string) => void
}) {
  const [busy, setBusy] = useState<string | null>(null)

  const done = async (id: string) => {
    setBusy(id)
    onTasksChange(await closeTask(id))
    setBusy(null)
  }

  const open = tasks.filter((task) => !task.done)
  const closed = tasks.filter((task) => task.done)

  return (
    <div className="flex flex-col gap-6">
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {open.map((task) => {
          const Icon = TASK_ICON[task.kind]
          const urgent = task.kind === 'alert'
          return (
            <li
              key={task.id}
              className={cn(
                'flex flex-col gap-3 rounded-3xl border p-5 sm:flex-row sm:items-center sm:gap-5',
                urgent ? 'border-accent bg-[rgb(253,238,237)]' : 'border-line bg-surface',
              )}
            >
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                  urgent ? 'bg-accent' : 'bg-tint',
                )}
              >
                <Icon
                  className={cn('h-5 w-5', urgent ? 'text-accent-ink' : 'text-deep')}
                  aria-hidden="true"
                />
              </span>

              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-lg font-semibold">{task.title}</span>
                <span className="text-base text-muted">
                  {task.patientName} · срок: {task.due}
                </span>
              </div>

              <div className="flex w-full flex-wrap gap-2.5 sm:w-auto sm:shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenPatient(task.patientId)}
                  className="min-h-[3rem] flex-1 rounded-xl border-[1.5px] border-line px-4 py-3 text-base font-semibold transition-colors hover:border-ink sm:flex-none sm:px-5"
                >
                  Открыть карточку
                </button>
                <button
                  type="button"
                  onClick={() => void done(task.id)}
                  disabled={busy === task.id}
                  className="min-h-[3rem] flex-1 rounded-xl bg-deep px-4 py-3 text-base font-semibold text-white disabled:opacity-60 sm:flex-none sm:px-5"
                >
                  {busy === task.id ? 'Закрываем…' : 'Выполнено'}
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      {open.length === 0 && (
        <p className="m-0 rounded-3xl border border-line bg-surface p-6 text-lg text-muted">
          Открытых задач нет.
        </p>
      )}

      {closed.length > 0 && (
        <section className="flex flex-col gap-2.5">
          <h2 className="m-0 font-display text-lg font-medium tracking-[-0.035em] text-muted">
            Закрытые сегодня
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {closed.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 rounded-2xl border border-line px-5 py-3.5"
              >
                <Check className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                <span className="flex-1 text-base text-muted line-through">{task.title}</span>
                <span className="text-sm text-muted">{task.patientName}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
