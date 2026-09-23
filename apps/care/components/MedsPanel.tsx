'use client'

import { useEffect, useState } from 'react'
import { Check, Clock, Pill, ShoppingCart, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Medication, MedicationLog, MedicationState } from '@amare/api-client'
import { cn } from '@amare/ui'
import type { MessageKey } from '@amare/i18n'
import { useT } from '@amare/i18n/react'
import { getMedHistory, getMedications, setMedicationState } from '@/lib/mock'

/** Положения переключателя. Порядок — от «всё хорошо» к «не принял». */
const STATES: { id: MedicationState; key: MessageKey<'cabinet'> }[] = [
  { id: 'taken', key: 'meds.taken' },
  { id: 'postponed', key: 'meds.later' },
  { id: 'missed', key: 'meds.skipped' },
]

const STATE_NOTE: Record<MedicationState, MessageKey<'cabinet'>> = {
  pending: 'meds.pending',
  taken: 'meds.doneTaken',
  postponed: 'meds.donePostponed',
  missed: 'meds.doneSkipped',
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
  const t = useT('cabinet')
  const [items, setItems] = useState<Medication[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [history, setHistory] = useState<MedicationLog[]>([])

  useEffect(() => {
    void getMedications().then(setItems)
    void getMedHistory().then(setHistory)
  }, [])

  const mark = async (id: string, state: MedicationState) => {
    setBusy(id)
    setItems(await setMedicationState(id, state))
    setBusy(null)
  }

  const refill = items.filter((item) => item.daysLeft <= REFILL_DAYS)
  const missed = history.filter((entry) => entry.state === 'missed')

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* Пропуск — первым делом: сюда ведёт карточка «Пропущен приём» со сводки,
          и человек должен увидеть, что и когда пропущено, не листая вниз */}
      {missed.length > 0 && (
        <a
          href="#med-history"
          className="flex items-start gap-3 rounded-2xl border-[1.5px] border-accent bg-[rgb(253,238,237)] px-4 py-3.5 text-base leading-snug text-ink no-underline sm:px-5 sm:py-4"
        >
          <X className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          <span className="flex flex-col gap-0.5">
            <span className="font-semibold">{t('home.medsMissed')}</span>
            {missed.map((entry) => (
              <span key={entry.id}>
                {entry.title}, {entry.dose} — {t('meds.logPlanned', { day: entry.day, time: entry.planned })}
              </span>
            ))}
          </span>
        </a>
      )}

      {refill.length > 0 && (
        <p className="m-0 flex items-start gap-3 rounded-2xl border border-accent bg-[rgb(253,238,237)] px-5 py-4 text-base leading-relaxed">
          <ShoppingCart className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          {t('meds.refill', { list: refill.map((item) => item.title).join(', ') })}
        </p>
      )}

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              'flex flex-col gap-4 rounded-3xl border p-4 sm:p-5 lg:flex-row lg:items-center lg:gap-5',
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
                {t('meds.dose', { dose: item.dose, days: item.daysLeft })} · {t(STATE_NOTE[item.state])}
              </span>
              {item.critical && (
                <span className="text-base font-medium text-accent">
                  {t('meds.critical')}
                </span>
              )}
            </div>

            <div
              role="group"
              aria-label={t('meds.aria', { title: item.title })}
              className="flex w-full overflow-hidden rounded-xl border-[1.5px] border-line lg:w-auto lg:shrink-0"
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
                      'min-h-[3.2rem] min-w-0 flex-1 px-1 py-3 text-[0.95rem] font-semibold transition-colors disabled:opacity-60 sm:px-4 sm:text-base',
                      active ? 'bg-deep text-white' : 'bg-surface text-muted hover:text-ink',
                    )}
                  >
                    {t(state.key)}
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ul>

      <p className="m-0 text-base leading-relaxed text-muted">
        {byGuardian
          ? t('meds.guardianNote')
          : t('meds.patientNote')}
      </p>

      <MedHistory log={history} />
    </div>
  )
}

const LOG_TONE: Record<MedicationLog['state'], { icon: LucideIcon; className: string }> = {
  taken: { icon: Check, className: 'text-brand' },
  late: { icon: Clock, className: 'text-muted' },
  missed: { icon: X, className: 'text-accent' },
}

/**
 * История приёмов за последние дни (P-05). Сюда ведёт карточка
 * «Пропущен приём» со сводки: какое лекарство, в какой день, во сколько
 * должно было быть и во сколько приняли на деле.
 */
function MedHistory({ log }: { log: MedicationLog[] }) {
  const t = useT('cabinet')

  if (log.length === 0) return null

  return (
    <section id="med-history" className="flex scroll-mt-24 flex-col gap-3 rounded-3xl border border-line bg-surface p-4 sm:p-6">
      <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">{t('meds.history')}</h2>
      <ul className="m-0 flex list-none flex-col p-0">
        {log.map((entry) => {
          const tone = LOG_TONE[entry.state]
          const Icon = tone.icon
          return (
            <li
              key={entry.id}
              className={cn(
                'flex items-start gap-3 border-t border-line py-3 first:border-t-0 first:pt-0',
                entry.state === 'missed' && 'font-medium',
              )}
            >
              <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', tone.className)} aria-hidden="true" />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-base">
                  {entry.title}, {entry.dose}
                </span>
                <span className="text-base text-muted">
                  {t('meds.logPlanned', { day: entry.day, time: entry.planned })}
                </span>
              </span>
              <span className={cn('shrink-0 text-right text-base', entry.state === 'missed' ? 'text-accent' : 'text-muted')}>
                {entry.state === 'missed'
                  ? t('meds.logMissed')
                  : t(entry.state === 'late' ? 'meds.logLate' : 'meds.logTaken', { time: entry.takenAt ?? '' })}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="m-0 text-base leading-relaxed text-muted">{t('meds.historyNote')}</p>
    </section>
  )
}
