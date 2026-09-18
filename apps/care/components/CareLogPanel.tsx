'use client'

import { useEffect, useState } from 'react'
import { Check, Clock } from 'lucide-react'
import type { CareTask } from '@amare/api-client'
import { cn } from '@amare/ui'
import { getCareTasks, toggleCareTask } from '@/lib/mock'

/** Время отметки. В бою его ставит сервер — здесь показываем локальное. */
function nowLabel(): string {
  return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Отметки ухода за лежачим пациентом (G-03 ТЗ).
 *
 * Это единственное место, где опекун ДЕЙСТВУЕТ, а не смотрит: повороты,
 * осмотр кожи и кормление делает он, и отмечает их он же. Пролежень
 * образуется за часы, поэтому чек-лист смены важнее красивой ленты.
 */
export function CareLogPanel() {
  const [tasks, setTasks] = useState<CareTask[]>([])
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    void getCareTasks().then(setTasks)
  }, [])

  const toggle = async (id: string) => {
    setBusy(id)
    setTasks(await toggleCareTask(id, nowLabel()))
    setBusy(null)
  }

  const done = tasks.filter((task) => task.doneAt).length

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3 rounded-3xl border border-line bg-surface px-6 py-5">
        <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
          Уход за сегодня
        </h2>
        <span className="text-base text-muted">
          отмечено {done} из {tasks.length}
        </span>
      </div>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {tasks.map((task) => {
          const isDone = Boolean(task.doneAt)
          return (
            <li
              key={task.id}
              className={cn(
                'flex flex-col gap-3 rounded-3xl border p-5 sm:flex-row sm:items-center sm:gap-5',
                isDone ? 'border-line bg-bg' : 'border-line bg-surface',
              )}
            >
              <span
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
                  isDone ? 'bg-tint' : 'bg-bg',
                )}
              >
                {isDone ? (
                  <Check className="h-6 w-6 text-brand" aria-hidden="true" />
                ) : (
                  <Clock className="h-6 w-6 text-muted" aria-hidden="true" />
                )}
              </span>

              <div className="flex flex-1 flex-col gap-0.5">
                <span className={cn('text-lg font-semibold', isDone && 'text-muted')}>
                  {task.title}
                </span>
                <span className="text-base text-muted">
                  {task.period}
                  {task.doneAt ? ` · отмечено в ${task.doneAt}` : ''}
                </span>
              </div>

              <button
                type="button"
                onClick={() => void toggle(task.id)}
                disabled={busy === task.id}
                className={cn(
                  'min-h-[3.2rem] shrink-0 rounded-xl px-5 py-3 text-base font-semibold disabled:opacity-60',
                  isDone
                    ? 'border-[1.5px] border-line'
                    : 'bg-deep text-white',
                )}
              >
                {isDone ? 'Снять отметку' : 'Отметить'}
              </button>
            </li>
          )
        })}
      </ul>

      <p className="m-0 text-base leading-relaxed text-muted">
        Отметки видит лечащая команда. Если что-то сделать не удалось — не ставьте отметку: пустая
        строка честнее и полезнее, чем закрытый для вида чек-лист.
      </p>
    </div>
  )
}
