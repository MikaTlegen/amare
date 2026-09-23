'use client'

import { useState } from 'react'
import { Check, PhoneCall, Video } from 'lucide-react'
import { useT } from '@amare/i18n/react'

interface Offer {
  id: string
  Icon: typeof PhoneCall
  titleKey: 'upsell.consultationTitle' | 'upsell.remoteTitle'
  priceKey: 'upsell.consultationPrice' | 'upsell.remotePrice'
  textKey: 'upsell.consultationText' | 'upsell.remoteText'
}

const OFFERS: Offer[] = [
  { id: 'consultation', Icon: PhoneCall, titleKey: 'upsell.consultationTitle', priceKey: 'upsell.consultationPrice', textKey: 'upsell.consultationText' },
  { id: 'remote', Icon: Video, titleKey: 'upsell.remoteTitle', priceKey: 'upsell.remotePrice', textKey: 'upsell.remoteText' },
]

/**
 * Доп. услуги в дополнение к уже идущему курсу (не отдельная воронка):
 * разовая консультация и удалённая реабилитация. Заявка уходит куратору —
 * оплаты и подтверждения через кабинет пока нет, как и у остальных
 * действий кабинета без бэкенда.
 */
export function UpsellPanel() {
  const t = useT('cabinet')
  const [requested, setRequested] = useState<Set<string>>(new Set())

  const request = (id: string) => {
    setRequested((prev) => new Set(prev).add(id))
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">{t('upsell.title')}</h2>
        <p className="m-0 text-base text-muted">{t('upsell.subtitle')}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {OFFERS.map(({ id, Icon, titleKey, priceKey, textKey }) => {
          const done = requested.has(id)
          return (
            <section key={id} className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-tint">
                <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
              </span>

              <div className="flex flex-col gap-1">
                <h3 className="m-0 text-lg font-semibold">{t(titleKey)}</h3>
                <span className="font-display text-2xl font-semibold tracking-[-0.03em] text-deep">
                  {t(priceKey)}
                </span>
              </div>

              <p className="m-0 flex-1 text-base leading-relaxed text-muted">{t(textKey)}</p>

              <button
                type="button"
                onClick={() => request(id)}
                disabled={done}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-deep px-5 py-3 text-base font-semibold text-white disabled:opacity-70"
              >
                {done ? (
                  <>
                    <Check className="h-5 w-5" aria-hidden="true" />
                    {t('upsell.requested')}
                  </>
                ) : (
                  t('upsell.request')
                )}
              </button>
            </section>
          )
        })}
      </div>

      <p className="m-0 text-base leading-relaxed text-muted">
        {/* TODO BACKEND: заявка сейчас нигде не сохраняется — уходить она должна в CRM куратору */}
        {t('upsell.note')}
      </p>
    </div>
  )
}
