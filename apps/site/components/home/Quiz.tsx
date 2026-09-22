'use client'

import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Phone, Info, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Button, Link } from '@/components/Links'
import { CLINIC, ROUTES } from '@/lib/clinic'
import { readUtm, submitLead, type LeadPayload } from '@/lib/crm'
import { cn } from '@amare/ui'
import { useContent, useT } from '@amare/i18n/react'

type Step = 'when' | 'mobility' | 'contacts' | 'urgent' | 'done'

// Подписи вариантов и пояснения периодов лежат в словаре quiz
const WHEN_OPTIONS = ['<1m', '1-6m', '6-12m', '>12m'] as const
const MOBILITY_OPTIONS = ['bedridden', 'wheelchair', 'assisted', 'independent'] as const

/** У острого периода пояснения нет: эта ветка ведёт на экран со звонком. */
const PERIOD_KEYS = ['1-6m', '6-12m', '>12m'] as const

/**
 * Квиз «Оценка потребности в реабилитации» (S-05 ТЗ).
 *
 * ВАЖНОЕ РЕШЕНИЕ. Ответ «меньше месяца» не ведёт дальше по воронке.
 * Это острый период: у человека могут быть противопоказания, и решение
 * принимает врач, а не форма на сайте. Поэтому ветка обрывается экраном
 * со звонком. Продать курс важно, но не ценой вреда — и не ценой отзыва
 * «записали, а потом отказали».
 *
 * Квиз не ставит диагноз и не обещает результат — только объясняет,
 * в каком периоде находится человек.
 */
export function Quiz() {
  const t = useT('quiz')
  const text = useContent('quiz')
  const contacts = useT('contacts')
  const reduced = useReducedMotion()
  const [step, setStep] = useState<Step>('when')
  /** История шагов — чтобы можно было вернуться и исправить ответ. */
  const [history, setHistory] = useState<Step[]>([])
  const [answers, setAnswers] = useState<Partial<LeadPayload>>({})
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState(false)
  const common = useT('common')

  const progress = { when: 20, mobility: 50, contacts: 80, urgent: 100, done: 100 }[step]

  /** Переход вперёд с запоминанием, откуда пришли. */
  const go = (next: Step) => {
    setHistory((h) => [...h, step])
    setStep(next)
  }

  const back = () => {
    const prev = history[history.length - 1]
    if (!prev) return
    setStep(prev)
    setHistory(history.slice(0, -1))
  }

  const chooseWhen = (id: (typeof WHEN_OPTIONS)[number]) => {
    setAnswers((a) => ({ ...a, strokeAgo: id }))
    go(id === '<1m' ? 'urgent' : 'mobility')
  }

  const chooseMobility = (id: (typeof MOBILITY_OPTIONS)[number]) => {
    setAnswers((a) => ({ ...a, mobility: id }))
    go('contacts')
  }

  const send = async (event: FormEvent) => {
    event.preventDefault()
    if (!consent) return
    setSending(true)

    // TODO CRM: submitLead уходит на собственный бэкенд, оттуда — в воронку
    // «Первичное обращение» с приоритетом по ответам (модуль M2, C-03/C-04).
    const result = await submitLead({
      ...answers,
      filledBy: 'relative',
      name,
      phone,
      source: 'quiz',
      utm: readUtm(),
      consent,
    } as LeadPayload)

    setSending(false)
    // Отказ нельзя проглатывать: без этой ветки опросник просто замирает
    // на последнем шаге, а человек считает, что заявка ушла
    if (result.ok) setStep('done')
    else setFailed(true)
  }

  const slide = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: 28 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -28 },
      }

  return (
    <section id="quiz" className="container-content py-16">
      <div className="grid gap-10 rounded-3xl border border-line bg-surface p-7 sm:p-10 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-5">
          <span className="text-sm font-semibold text-accent">
            {t('label')}
          </span>
          <h2 className="font-display text-2xl font-medium leading-[1.24] sm:text-3xl sm:leading-[1.18] tracking-[-0.02em]">
            {t('title')}
          </h2>
          <p className="text-base leading-relaxed text-muted">
            {t('note')}
          </p>
        </div>

        <div className="flex flex-col gap-5 lg:col-span-7">
          <div
            className="flex gap-1.5"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t('progress')}
          >
            {[20, 40, 60, 80, 100].map((mark) => (
              <span
                key={mark}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors duration-300',
                  progress >= mark ? 'bg-accent' : 'bg-line',
                )}
              />
            ))}
          </div>

          {/* Вернуться и исправить ответ можно с любого шага, кроме финального */}
          {history.length > 0 && step !== 'done' && (
            <button
              type="button"
              onClick={back}
              className="inline-flex min-h-[2.8rem] w-fit items-center gap-2 rounded-xl px-3 py-2 text-base font-medium text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              {t('back')}
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              {...slide}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-4"
            >
              {step === 'when' && (
                <>
                  <h3 className="text-2xl font-semibold">{t('when.title')}</h3>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {WHEN_OPTIONS.map((id) => (
                      <OptionButton
                        key={id}
                        label={text(`when.${id}`)}
                        onClick={() => chooseWhen(id)}
                      />
                    ))}
                  </div>
                </>
              )}

              {step === 'mobility' && (
                <>
                  <h3 className="text-2xl font-semibold">{t('mobility.title')}</h3>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {MOBILITY_OPTIONS.map((id) => (
                      <OptionButton
                        key={id}
                        label={text(`mobility.${id}`)}
                        onClick={() => chooseMobility(id)}
                      />
                    ))}
                  </div>
                  {answers.strokeAgo &&
                    (PERIOD_KEYS as readonly string[]).includes(answers.strokeAgo) && (
                      <Note>{text(`period.${answers.strokeAgo}`)}</Note>
                    )}
                </>
              )}

              {step === 'urgent' && (
                <div className="flex flex-col gap-4 rounded-2xl border-[1.5px] border-accent bg-[rgb(253,238,237)] p-6">
                  <h3 className="text-2xl font-semibold">{t('urgent.title')}</h3>
                  <p className="text-base leading-relaxed text-ink/80">
                    {t('urgent.note')}
                  </p>
                  <Button href={CLINIC.phones[0].href} size="lg" className="self-start">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                    {CLINIC.phones[0].label}
                  </Button>
                </div>
              )}

              {step === 'contacts' && (
                <form onSubmit={send} className="flex flex-col gap-4">
                  <h3 className="text-2xl font-semibold">{t('contacts.title')}</h3>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      id="quiz-name"
                      label={t('contacts.name')}
                      value={name}
                      onChange={setName}
                      autoComplete="name"
                    />
                    <Field
                      id="quiz-phone"
                      label={t('contacts.phone')}
                      type="tel"
                      value={phone}
                      onChange={setPhone}
                      autoComplete="tel"
                      placeholder={t('contacts.phonePlaceholder')}
                      required
                    />
                  </div>

                  {/*
                    Согласие — обязательное поле, а не галочка по умолчанию.
                    Здесь собираются данные о здоровье, это особая категория ПД.
                  */}
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line p-4">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-5 w-5 shrink-0 accent-[rgb(var(--c-accent))]"
                      required
                    />
                    {/* Ссылка на политику обязана стоять рядом с согласием:
                        иначе человек соглашается на обработку медданных, не
                        имея под рукой документа, на который соглашается */}
                    <span className="text-base leading-relaxed text-muted">
                      {t('contacts.consent')}{' '}
                      <Link href={ROUTES.privacy} className="tap-target font-semibold text-ink">
                        {common('policy')}
                      </Link>
                    </span>
                  </label>

                  {failed && (
                    <p
                      role="alert"
                      className="m-0 rounded-2xl border-[1.5px] border-accent bg-accent/10 px-4 py-3 text-base leading-relaxed text-ink"
                    >
                      {common('form.error')}
                    </p>
                  )}

                  <Button onClick={() => undefined} type="submit" size="lg" className="self-start">
                    {sending ? t('contacts.sending') : t('contacts.submit')}
                  </Button>
                </form>
              )}

              {step === 'done' && (
                <div role="status" className="flex flex-col gap-3 rounded-2xl bg-tint p-6">
                  <CheckCircle2 className="h-8 w-8 text-brand" aria-hidden="true" />
                  <h3 className="text-2xl font-semibold">{t('done.title')}</h3>
                  <p className="text-base leading-relaxed text-ink/80">
                    {t('done.note', { hours: contacts('hours') })}
                  </p>
                  <Button href={CLINIC.phones[0].href} variant="outline" className="self-start">
                    {CLINIC.phones[0].label}
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function OptionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-[3.4rem] rounded-2xl border-[1.5px] border-line-strong bg-bg px-5 py-4 text-left text-base transition-colors hover:border-accent hover:bg-accent/8"
    >
      {label}
    </button>
  )
}

function Note({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-tint p-5">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-deep" aria-hidden="true" />
      <p className="text-base leading-relaxed text-deep">{children}</p>
    </div>
  )
}

interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
}

function Field({ id, label, value, onChange, type = 'text', ...rest }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-base font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line-strong bg-bg px-4 py-3 text-base"
        {...rest}
      />
    </div>
  )
}
