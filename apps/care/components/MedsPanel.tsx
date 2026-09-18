'use client'

import { useEffect, useState } from 'react'
import { Check, Clock, Pill, ShoppingCart, X } from 'lucide-react'
import type { Medication, MedicationState } from '@amare/api-client'
import { cn } from '@amare/ui'
import { getMedications, setMedicationState } from '@/lib/mock'

const STATE_LABEL: Record<MedicationState, string> = {
  pending: 'не отмечено',
  taken: 'принял',
  postponed: 'отложено на 15 минут',
  missed: 'пропущено',
}

/** Меньше этого остатка — пора покупать, иначе перерыв в приёме. */
const REFILL_DAYS = 7

/**
 * Лекарства (P-05 ТЗ).
 *
 * Три кнопки вместо одной галочки: «принял», «отложить», «пропустил».
 * Пропуск — это тоже информация, и куратору она нужнее, чем тишина.
 * Особенно по антиагрегантам: их пропуск входит в список алертов
 * опекуну (G-04), поэтому такие препараты помечены отдельно.
 *
 * `readOnly` — опекун видит расписание, но не отмечает приём за
 * пациента: отметка означает «таблетка выпита», а этого он не знает.
 */
export function MedsPanel({ readOnly = false }: { readOnly?: boolean }) {
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
              'flex flex-col gap-4 rounded-3xl border p-5 sm:flex-row sm:items-center sm:gap-5',
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
                {item.dose} · осталось на {item.daysLeft} дн.
              </span>
              {item.critical && (
                <span className="text-base font-medium text-accent">
                  Пропускать нельзя: препарат против повторного инсульта
                </span>
              )}
              <span className="text-base text-muted">Статус: {STATE_LABEL[item.state]}</span>
            </div>

            {!readOnly && (
              <div className="flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void mark(item.id, 'taken')}
                  disabled={busy === item.id}
                  className="inline-flex min-h-[3.2rem] items-center gap-2 rounded-xl bg-deep px-5 py-3 text-base font-semibold text-white disabled:opacity-60"
                >
                  <Check className="h-5 w-5" aria-hidden="true" />
                  Принял
                </button>
                <button
                  type="button"
                  onClick={() => void mark(item.id, 'postponed')}
                  disabled={busy === item.id}
                  className="inline-flex min-h-[3.2rem] items-center gap-2 rounded-xl border-[1.5px] border-line px-5 py-3 text-base font-semibold"
                >
                  <Clock className="h-5 w-5" aria-hidden="true" />
                  Позже
                </button>
                <button
                  type="button"
                  onClick={() => void mark(item.id, 'missed')}
                  disabled={busy === item.id}
                  className="inline-flex min-h-[3.2rem] items-center gap-2 rounded-xl border-[1.5px] border-line px-5 py-3 text-base font-semibold text-muted"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                  Пропустил
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="m-0 text-base leading-relaxed text-muted">
        {readOnly
          ? 'Отмечает приём сам пациент: отметка означает, что таблетка действительно выпита.'
          : 'Отмечайте честно. «Пропустил» — это не двойка, а сигнал куратору разобраться, почему не получилось.'}
      </p>
    </div>
  )
}
