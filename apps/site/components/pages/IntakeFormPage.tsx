'use client'

import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { CheckCircle2, Upload } from 'lucide-react'
import { PageCover } from '@/components/PageCover'
import { Button } from '@/components/Links'
import { submitLead, readUtm, type LeadPayload } from '@/lib/crm'
import { CLINIC, ROUTES } from '@/lib/clinic'
import { cn } from '@amare/ui'

const WHEN = [
  { id: '<1m', label: 'Меньше месяца' },
  { id: '1-6m', label: '1–6 месяцев' },
  { id: '6-12m', label: '6–12 месяцев' },
  { id: '>12m', label: 'Больше года' },
] as const

const MOBILITY = [
  { id: 'bedridden', label: 'Лежит, не садится' },
  { id: 'wheelchair', label: 'Сидит, коляска' },
  { id: 'assisted', label: 'Ходит с поддержкой' },
  { id: 'independent', label: 'Ходит сам' },
] as const

/**
 * Предварительная анкета (требование S-04 ТЗ).
 *
 * Файл выписки здесь НЕ загружается и не будет до появления бэкенда:
 * выписка — это медицинский документ, её нельзя отправлять куда попало
 * и нельзя принимать до получения согласия. Поле оставлено выключенным,
 * чтобы было видно место в сценарии.
 */
export function IntakeFormPage() {
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
        crumb="Анкета"
        title="Расскажите о состоянии"
        note="Пять вопросов. Врач-реабилитолог посмотрит ответы и перезвонит с предварительным планом."
        image="/photos/intake-desk.jpg"
        alt="Заполнение медицинских документов"
      />

      <section className="container-content py-12">
        {done ? (
          <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-3xl border border-line bg-surface p-8">
            <CheckCircle2 className="h-10 w-10 text-brand" aria-hidden="true" />
            <h2 className="m-0 font-display text-2xl font-medium tracking-[-0.04em]">
              Анкета отправлена
            </h2>
            <p className="m-0 text-lg leading-relaxed text-muted">
              Врач перезвонит в рабочее время: {CLINIC.hours}.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href={CLINIC.phones[0].href}>{CLINIC.phones[0].label}</Button>
              <Button to={ROUTES.home} variant="outline">
                На главную
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mx-auto flex max-w-3xl flex-col gap-8">
            <Group legend="Кто заполняет анкету">
              <Choice
                options={[
                  { id: 'relative', label: 'Родственник' },
                  { id: 'patient', label: 'Сам пациент' },
                ]}
                value={filledBy}
                onChange={(v) => setFilledBy(v as 'patient' | 'relative')}
                name="filledBy"
              />
            </Group>

            <Group legend="Сколько времени прошло после инсульта или травмы">
              <Choice
                options={WHEN.map((w) => ({ id: w.id, label: w.label }))}
                value={when}
                onChange={setWhen}
                name="when"
              />
              {when === '<1m' && (
                <p className="m-0 rounded-2xl border-[1.5px] border-accent bg-[rgb(253,238,237)] px-5 py-4 text-base leading-relaxed">
                  Это острый период — программу назначает врач по выписке из стационара. Анкету
                  можно не заполнять, быстрее позвонить:{' '}
                  <a href={CLINIC.phones[0].href} className="font-semibold">
                    {CLINIC.phones[0].label}
                  </a>
                  .
                </p>
              )}
            </Group>

            <Group legend="Как человек сейчас передвигается">
              <Choice
                options={MOBILITY.map((m) => ({ id: m.id, label: m.label }))}
                value={mobility}
                onChange={setMobility}
                name="mobility"
              />
            </Group>

            <Group legend="Что ещё нарушено">
              <div className="flex flex-col gap-2.5">
                <Toggle label="Трудности с речью" checked={speech} onChange={setSpeech} />
                <Toggle label="Трудности с глотанием" checked={swallow} onChange={setSwallow} />
              </div>
            </Group>

            <Group legend="Выписка из стационара">
              <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-line bg-bg p-6">
                <span className="flex items-center gap-3 text-base font-medium text-muted">
                  <Upload className="h-5 w-5" aria-hidden="true" />
                  Загрузка файла появится вместе с защищённым хранилищем
                </span>
                <p className="m-0 text-base leading-relaxed text-muted">
                  Выписка — медицинский документ. Принимать её можно только на собственный сервер
                  в РК и только после согласия на обработку. Пока опишите главное в разговоре
                  с врачом.
                </p>
              </div>
            </Group>

            <Group legend="Контакты">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-name" className="text-base font-medium">
                    Как к вам обращаться
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
                    Телефон
                  </label>
                  <input
                    id="f-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    placeholder="+7 ___ ___ __ __"
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
                Согласен на обработку персональных данных, включая сведения о здоровье, и на звонок
                от клиники. Данные хранятся на территории Республики Казахстан.
              </span>
            </label>

            <button
              type="submit"
              disabled={!consent || sending}
              className="min-h-[3.4rem] self-start rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-accent-ink disabled:opacity-50"
            >
              {sending ? 'Отправляем…' : 'Отправить анкету'}
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
