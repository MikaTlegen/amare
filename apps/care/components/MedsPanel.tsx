'use client'

import { useEffect, useState } from 'react'
import { Pill, ShoppingCart } from 'lucide-react'
import type { Medication, MedicationState } from '@amare/api-client'
import { cn } from '@amare/ui'
import { getMedications, setMedicationState } from '@/lib/mock'

/** Положения переключателя. Порядок — от «всё хорошо» к «не принял». */
const STATES: { id: MedicationState; label: string }[] = [
  { id: 'taken', label: 'Принял' },
  { id: 'postponed', label: 'Позже' },
  { id: 'missed', label: 'Пропустил' },
]

const STATE_NOTE: Record<MedicationState, string> = {
  pending: 'ещё не отмечено',
  taken: 'принято',
  postponed: 'отложено на 15 минут',
  missed: 'пропущено',
}

/** Меньше этого остатка — пора покупать, иначе перерыв в приёме. */
const REFILL_DAYS = 7

/**
 * Лекарства (P-05 ТЗ).
 *
 * Статус переключается сегментированным переключателем, а не галочкой:
 * «пропустил» — такая же нормальная отметка, как «принял», и она нужна
 * куратору. Галочка даёт только «принял / молчание», а молчание врач
 * прочитать не может.
 *
 * Опекун тоже переключает статусы: он и раскладывает таблетки по дням,
 * и часто единственный, кто вообще заходит в приложение. Отметка при
 * этом подписывается — кто именно её поставил (G-03 ТЗ).
 */
export function MedsPanel({ byGuardian = false }: { byGuardian?: boolean }) {
  const [items, setItems] = useState<Medication[]>([])
  const [busy, setBusy] = useState<string | null>(null)

  useEffect(() => {
    void getMedications().then(setItems)
  }, [])

  const mark = async (id: string, state: MedicationState) => {
    setBusy(id)
    setItems(await setMedicationState(id, state))
    setBusy(null)
  }

  const refill = items.filter((item) => item.daysLeft <= REFILL_DAYS)

  return (
    <div className="flex flex-col gap-5">
      {refill.length > 0 && (
        <p className="m-0 flex items-start gap-3 rounded-2xl border border-accent bg-[rgb(253,238,237)] px-5 py-4 text-base leading-relaxed">
          <ShoppingCart className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          Заканчивается: {refill.map((item) => item.title).join(', ')}. Купите заранее — перерыв в
          приёме опаснее, чем кажется.
        </p>
      )}

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              'flex flex-col gap-4 rounded-3xl border p-5 lg:flex-row lg:items-center lg:gap-5',
              item.state === 'taken' ? 'border-line bg-bg' : 'border-line bg-surface',
            )}
          >
            <span
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
                item.state === 'taken' ? 'bg-tint' : 'bg-bg',
              )}
            >
              <Pill
                className={cn('h-6 w-6', item.state === 'taken' ? 'text-brand' : 'text-deep')}
                aria-hidden="true"
              />
            </span>

            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-lg font-semibold">
                {item.at} · {item.title}
              </span>
              <span className="text-base text-muted">
                {item.dose} · осталось на {item.daysLeft} дн. · {STATE_NOTE[item.state]}
              </span>
              {item.critical && (
                <span className="text-base font-medium text-accent">
                  Пропускать нельзя: препарат против повторного инсульта
                </span>
              )}
            </div>

            <div
              role="group"
              aria-label={`Отметка приёма: ${item.title}`}
              className="flex shrink-0 overflow-hidden rounded-xl border-[1.5px] border-line"
            >
              {STATES.map((state) => {
                const active = item.state === state.id
                return (
                  <button
                    key={state.id}
                    type="button"
                    onClick={() => void mark(item.id, state.id)}
                    disabled={busy === item.id}
                    aria-pressed={active}
                    className={cn(
                      'min-h-[3.2rem] flex-1 px-4 py-3 text-base font-semibold transition-colors disabled:opacity-60',
                      active ? 'bg-deep text-white' : 'bg-surface text-muted hover:text-ink',
                    )}
                  >
                    {state.label}
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ul>

      <p className="m-0 text-base leading-relaxed text-muted">
        {byGuardian
          ? 'Ваши отметки уходят куратору с пометкой «введено опекуном». Отмечайте только то, что видели сами.'
          : 'Отмечайте честно. «Пропустил» — это не двойка, а сигнал куратору разобраться, почему не получилось.'}
      </p>
    </div>
  )
}
