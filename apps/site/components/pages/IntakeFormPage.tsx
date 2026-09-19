'use client'

import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { CheckCircle2, Upload } from 'lucide-react'
import { PageCover } from '@/components/PageCover'
import { Button } from '@/components/Links'
import { submitLead, readUtm, type LeadPayload } from '@/lib/crm'
import { CLINIC, ROUTES } from '@/lib/clinic'
import { cn } from '@amare/ui'
import { useContent, useT } from '@amare/i18n/react'

// Подписи вариантов лежат в словаре forms по ключу `<группа>.<id>`
const WHEN = ['<1m', '1-6m', '6-12m', '>12m'] as const
const MOBILITY = ['bedridden', 'wheelchair', 'assisted', 'independent'] as const

/**
 * Предварительная анкета (требование S-04 ТЗ).
 *
 * Файл выписки здесь НЕ загружается и не будет до появления бэкенда:
 * выписка — это медицинский документ, её нельзя отправлять куда попало
 * и нельзя принимать до получения согласия. Поле оставлено выключенным,
 * чтобы было видно место в сценарии.
 */
export function IntakeFormPage() {
  const t = useT('forms')
  const text = useContent('forms')
  const contacts = useT('contacts')

  const [filledBy, setFilledBy] = useState<'patient' | 'relative'>('relative')
  const [when, setWhen] = useState<string>('')
  const [mobility, setMobility] = useState<string>('')
  const [speech, setSpeech] = useState(false)
  const [swallow, setSwallow] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!consent) return
    setSending(true)
    const result = await submitLead({
      filledBy,
      strokeAgo: (when || undefined) as LeadPayload['strokeAgo'],
      mobility: (mobility || undefined) as LeadPayload['mobility'],
      name,
      phone,
      source: 'form',
      utm: readUtm(),
      consent,
    })
    setSending(false)
    if (result.ok) setDone(true)
  }

  return (
    <>
      <PageCover
        crumb={t('cover.crumb')}
        title={t('cover.title')}
        note={t('cover.note')}
        image="/photos/intake-desk.jpg"
        alt={t('cover.alt')}
      />

      <section className="container-content py-12">
        {done ? (
          <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-3xl border border-line bg-surface p-8">
            <CheckCircle2 className="h-10 w-10 text-brand" aria-hidden="true" />
            <h2 className="m-0 font-display text-2xl font-medium tracking-[-0.04em]">
              {t('done.title')}
            </h2>
            <p className="m-0 text-lg leading-relaxed text-muted">
              {t('done.note', { hours: contacts('hours') })}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href={CLINIC.phones[0].href}>{CLINIC.phones[0].label}</Button>
              <Button to={ROUTES.home} variant="outline">
                {t('done.home')}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mx-auto flex max-w-3xl flex-col gap-8">
            <Group legend={t('filledBy.legend')}>
              <Choice
                options={[
                  { id: 'relative', label: t('filledBy.relative') },
                  { id: 'patient', label: t('filledBy.patient') },
                ]}
                value={filledBy}
                onChange={(v) => setFilledBy(v as 'patient' | 'relative')}
                name="filledBy"
              />
            </Group>

            <Group legend={t('when.legend')}>
              <Choice
                options={WHEN.map((id) => ({ id, label: text(`when.${id}`) }))}
                value={when}
                onChange={setWhen}
                name="when"
              />
              {when === '<1m' && (
                <p className="m-0 rounded-2xl border-[1.5px] border-accent bg-[rgb(253,238,237)] px-5 py-4 text-base leading-relaxed">
                  {t('when.acute')}{' '}
                  <a href={CLINIC.phones[0].href} className="font-semibold">
                    {CLINIC.phones[0].label}
                  </a>
                  .
                </p>
              )}
            </Group>

            <Group legend={t('mobility.legend')}>
              <Choice
                options={MOBILITY.map((id) => ({ id, label: text(`mobility.${id}`) }))}
                value={mobility}
                onChange={setMobility}
                name="mobility"
              />
            </Group>

            <Group legend={t('other.legend')}>
              <div className="flex flex-col gap-2.5">
                <Toggle label={t('other.speech')} checked={speech} onChange={setSpeech} />
                <Toggle label={t('other.swallow')} checked={swallow} onChange={setSwallow} />
              </div>
            </Group>

            <Group legend={t('discharge.legend')}>
              <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-line bg-bg p-6">
                <span className="flex items-center gap-3 text-base font-medium text-muted">
                  <Upload className="h-5 w-5" aria-hidden="true" />
                  {t('discharge.disabled')}
                </span>
                <p className="m-0 text-base leading-relaxed text-muted">
                  {t('discharge.note')}
                </p>
              </div>
            </Group>

            <Group legend={t('contacts.legend')}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-name" className="text-base font-medium">
                    {t('contacts.name')}
                  </label>
                  <input
                    id="f-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-base"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-phone" className="text-base font-medium">
                    {t('contacts.phone')}
                  </label>
                  <input
                    id="f-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder={t('contacts.phonePlaceholder')}
                    required
                    className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-base"
                  />
                </div>
              </div>
            </Group>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-surface p-5">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                className="mt-1 h-5 w-5 shrink-0 accent-[rgb(var(--c-accent))]"
              />
              <span className="text-base leading-relaxed text-muted">
                {t('contacts.consent')}
              </span>
            </label>

            <button
              type="submit"
              disabled={!consent || sending}
              className="min-h-[3.4rem] self-start rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-accent-ink disabled:opacity-50"
            >
              {sending ? t('submit.sending') : t('submit.label')}
            </button>
          </form>
        )}
      </section>
    </>
  )
}

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
      <legend className="mb-1 p-0 font-display text-xl font-medium tracking-[-0.035em]">
        {legend}
      </legend>
      {children}
    </fieldset>
  )
}

function Choice({
  options,
  value,
  onChange,
  name,
}: {
  options: { id: string; label: string }[]
  value: string
  onChange: (value: string) => void
  name: string
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2">
      {options.map((option) => (
        <label
          key={option.id}
          className={cn(
            'flex min-h-[3.4rem] cursor-pointer items-center rounded-2xl border-[1.5px] px-5 py-3.5 text-base transition-colors',
            value === option.id ? 'border-accent bg-[rgb(253,238,237)]' : 'border-line bg-surface',
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.id}
            checked={value === option.id}
            onChange={() => onChange(option.id)}
            className="sr-only"
          />
          {option.label}
        </label>
      ))}
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <label className="flex min-h-[3.4rem] cursor-pointer items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-3.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-[rgb(var(--c-accent))]"
      />
      <span className="text-base">{label}</span>
    </label>
  )
}
