'use client'

import { useState } from 'react'
import { Check, PhoneCall, TriangleAlert, Video } from 'lucide-react'
import { formatKzPhone } from '@amare/ui'
import { useLocale, useT } from '@amare/i18n/react'
import { useAuth } from '@/auth/AuthContext'
import { submitUpsellRequest } from '@/lib/crm'

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

type Status = 'idle' | 'sending' | 'done' | 'failed'

/**
 * Доп. услуги в дополнение к уже идущему курсу (не отдельная воронка):
 * разовая консультация и удалённая реабилитация. Заявка уходит в ту же
 * лид-форму CRM Tennet, что и заявки с сайта (см. lib/crm.ts) — плюсом
 * к уже идущей воронке пациента, а не отдельным пайплайном.
 */
export function UpsellPanel() {
  const t = useT('cabinet')
  const locale = useLocale()
  const { user } = useAuth()
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<Record<string, Status>>({})

  const request = async (id: string, offerTitle: string) => {
    if (!phone.trim()) return
    setStatus((prev) => ({ ...prev, [id]: 'sending' }))
    const result = await submitUpsellRequest({
      offerTitle,
      patientName: user?.name ?? '',
      phone,
      locale,
    })
    setStatus((prev) => ({ ...prev, [id]: result.ok ? 'done' : 'failed' }))
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-1.5">
        <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">{t('upsell.title')}</h2>
        <p className="m-0 text-base text-muted">{t('upsell.subtitle')}</p>
      </div>

      <div className="flex flex-col gap-2 rounded-3xl border border-line bg-surface p-4 sm:p-6 sm:max-w-sm">
        <label htmlFor="upsell-phone" className="text-base font-medium">
          {t('upsell.phone')}
        </label>
        <input
          id="upsell-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(formatKzPhone(e.target.value))}
          placeholder={t('upsell.phonePlaceholder')}
          className="min-h-12 rounded-xl border border-line bg-bg px-4 text-base"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {OFFERS.map(({ id, Icon, titleKey, priceKey, textKey }) => {
          const offerStatus = status[id] ?? 'idle'
          return (
            <section key={id} className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-6">
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
                onClick={() => void request(id, t(titleKey))}
                disabled={offerStatus === 'sending' || offerStatus === 'done' || !phone.trim()}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-deep px-5 py-3 text-base font-semibold text-white disabled:opacity-70"
              >
                {offerStatus === 'done' ? (
                  <>
                    <Check className="h-5 w-5" aria-hidden="true" />
                    {t('upsell.requested')}
                  </>
                ) : offerStatus === 'sending' ? (
                  t('upsell.sending')
                ) : (
                  t('upsell.request')
                )}
              </button>

              {offerStatus === 'failed' && (
                <p className="m-0 flex items-start gap-2 text-base leading-relaxed text-accent">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {t('upsell.failed')}
                </p>
              )}
            </section>
          )
        })}
      </div>

      <p className="m-0 text-base leading-relaxed text-muted">{t('upsell.note')}</p>
    </div>
  )
}
