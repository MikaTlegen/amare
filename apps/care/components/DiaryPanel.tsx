'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Check, TriangleAlert } from 'lucide-react'
import { VITALS_SANITY, type VitalEntry } from '@amare/api-client'
import { cn } from '@amare/ui'
import type { MessageKey } from '@amare/i18n'
import { useT } from '@amare/i18n/react'
import { addVital, getVitals } from '@/lib/mock'

const MOODS: { value: number; face: string; key: MessageKey<'cabinet'> }[] = [
  { value: 2, face: '🙁', key: 'diary.bad' },
  { value: 3, face: '😐', key: 'diary.normal' },
  { value: 4, face: '🙂', key: 'diary.good' },
]

/** Целевой коридор давления. TODO M8: индивидуальные цели задаёт врач. */
const TARGET = { systolic: 140, diastolic: 90 }

function isSuspicious(entry: { systolic: number; diastolic: number; pulse: number }): boolean {
  const { systolic, diastolic, pulse } = VITALS_SANITY
  return (
    entry.systolic < systolic.min ||
    entry.systolic > systolic.max ||
    entry.diastolic < diastolic.min ||
    entry.diastolic > diastolic.max ||
    entry.pulse < pulse.min ||
    entry.pulse > pulse.max ||
    entry.systolic <= entry.diastolic
  )
}

/**
 * Мой дневник (P-04 ТЗ).
 *
 * Поля крупные, клавиатура числовая, подписи короткие — по U-01 и U-07.
 * Аномальное значение не отвергается, а переспрашивается: у человека
 * после инсульта давление 210/110 бывает по-настоящему, и молча
 * отказать во вводе нельзя. Задача проверки — поймать опечатку.
 *
 * `readOnly` — режим опекуна в кабинете пациента: он видит дневник,
 * но вносит показатели в своём кабинете, с пометкой «введено опекуном».
 */
export function DiaryPanel({
  readOnly = false,
  byGuardian = false,
}: {
  readOnly?: boolean
  byGuardian?: boolean
}) {
  const t = useT('cabinet')
  const [entries, setEntries] = useState<VitalEntry[]>([])
  const [systolic, setSystolic] = useState('')
  const [diastolic, setDiastolic] = useState('')
  const [pulse, setPulse] = useState('')
  const [mood, setMood] = useState(4)
  const [confirming, setConfirming] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void getVitals().then(setEntries)
  }, [])

  const draft = { systolic: Number(systolic), diastolic: Number(diastolic), pulse: Number(pulse) }
  const filled = systolic !== '' && diastolic !== '' && pulse !== ''

  const save = async () => {
    setSaving(true)
    setEntries(await addVital({ ...draft, mood }, byGuardian))
    setSaving(false)
    setConfirming(false)
    setSystolic('')
    setDiastolic('')
    setPulse('')
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!filled) return
    if (isSuspicious(draft)) {
      setConfirming(true)
      return
    }
    void save()
  }

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      {!readOnly && (
        <form
          onSubmit={submit}
          className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 lg:col-span-5"
        >
          <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
            {t('diary.title')}
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <NumberField id="sys" label={t('diary.systolic')} value={systolic} onChange={setSystolic} />
            <NumberField id="dia" label={t('diary.diastolic')} value={diastolic} onChange={setDiastolic} />
          </div>
          <NumberField id="pulse" label={t('diary.pulse')} value={pulse} onChange={setPulse} />

          <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
            <legend className="mb-1 p-0 text-base font-medium">{t('diary.wellbeing')}</legend>
            <div className="flex gap-2.5">
              {MOODS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMood(item.value)}
                  aria-pressed={mood === item.value}
                  className={cn(
                    'flex min-h-16 flex-1 flex-col items-center justify-center gap-1 rounded-2xl border-[1.5px] text-base',
                    mood === item.value ? 'border-accent bg-[rgb(253,238,237)]' : 'border-line',
                  )}
                >
                  <span className="text-2xl leading-none" aria-hidden="true">
                    {item.face}
                  </span>
                  {t(item.key)}
                </button>
              ))}
            </div>
          </fieldset>

          {confirming ? (
            <div className="flex flex-col gap-3 rounded-2xl border-[1.5px] border-accent bg-[rgb(253,238,237)] p-5">
              <p className="m-0 flex items-start gap-2.5 text-base leading-relaxed">
                <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                {t('diary.check', {
                  systolic: draft.systolic,
                  diastolic: draft.diastolic,
                  pulse: draft.pulse,
                })}
              </p>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => void save()}
                  disabled={saving}
                  className="min-h-[3.2rem] rounded-xl bg-deep px-6 py-3 text-base font-semibold text-white disabled:opacity-60"
                >
                  {saving ? t('diary.saving') : t('diary.confirm')}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirming(false)}
                  className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line px-6 py-3 text-base font-semibold"
                >
                  {t('diary.fix')}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!filled || saving}
              className="min-h-[3.4rem] rounded-xl bg-deep px-6 py-3 text-lg font-semibold text-white disabled:opacity-50"
            >
              {saving ? t('diary.saving') : t('diary.save')}
            </button>
          )}
        </form>
      )}

      <section
        className={cn(
          'flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6',
          readOnly ? 'lg:col-span-12' : 'lg:col-span-7',
        )}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
            {t('diary.recent')}
          </h2>
          <span className="text-base text-muted">
            {t('diary.target', { systolic: TARGET.systolic, diastolic: TARGET.diastolic })}
          </span>
        </div>

        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {entries.map((entry) => {
            const high = entry.systolic > TARGET.systolic || entry.diastolic > TARGET.diastolic
            return (
              <li
                key={entry.id}
                className={cn(
                  'flex flex-wrap items-center gap-x-5 gap-y-1 rounded-2xl px-5 py-4',
                  high ? 'bg-[rgb(253,238,237)]' : 'bg-bg',
                )}
              >
                <span className="font-display text-xl font-semibold tracking-[-0.04em]">
                  {entry.systolic}/{entry.diastolic}
                </span>
                <span className="text-base text-muted">{t('diary.pulseValue', { value: entry.pulse })}</span>
                <span className="text-base text-muted">{entry.at}</span>
                {entry.byGuardian && (
                  <span className="rounded-full bg-tint px-3 py-1 text-sm font-medium text-deep">
                    {t('diary.byGuardian')}
                  </span>
                )}
                {high ? (
                  <TriangleAlert className="ml-auto h-5 w-5 text-accent" aria-label={t('diary.aboveTarget')} />
                ) : (
                  <Check className="ml-auto h-5 w-5 text-brand" aria-label={t('diary.withinTarget')} />
                )}
              </li>
            )
          })}
        </ul>

        <p className="m-0 text-base leading-relaxed text-muted">
          {t('diary.note')}
        </p>
      </section>
    </div>
  )
}

function NumberField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (next: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-base font-medium">
        {label}
      </label>
      <input
        id={id}
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, 3))}
        className="min-h-16 rounded-2xl border-[1.5px] border-line bg-bg px-4 text-center font-display text-3xl font-semibold tracking-[-0.04em]"
      />
    </div>
  )
}
