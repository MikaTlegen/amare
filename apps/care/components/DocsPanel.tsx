'use client'

import { useEffect, useState } from 'react'
import { Eye, FileSignature, ShieldCheck } from 'lucide-react'
import type { AccessLogEntry, Consent } from '@amare/api-client'
import { useT } from '@amare/i18n/react'
import { getAccessLog, getConsents } from '@/lib/mock'

/**
 * Документы, согласия и журнал доступа (P-14, P-15 ТЗ).
 *
 * Журнал просмотров стоит рядом с согласиями намеренно. По разделу 6 ТЗ
 * каждый просмотр медданных пишется в журнал и доступен пациенту — это
 * и есть механизм, который делает фразу «доступ только лечащей команде»
 * проверяемой, а не декларацией.
 *
 * Отзыв согласия здесь не кнопка: согласие на обработку медданных
 * отзывается заявлением, и обязательное согласие нельзя отозвать
 * одним нажатием, не остановив лечение. Поэтому — объяснение и
 * обращение к администратору.
 */
export function DocsPanel() {
  const t = useT('cabinet')
  const [consents, setConsents] = useState<Consent[]>([])
  const [log, setLog] = useState<AccessLogEntry[]>([])

  useEffect(() => {
    void getConsents().then(setConsents)
    void getAccessLog().then(setLog)
  }, [])

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <section className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 lg:col-span-6">
        <h2 className="m-0 flex items-center gap-2 font-display text-xl font-medium tracking-[-0.035em]">
          <FileSignature className="h-5 w-5 text-brand" aria-hidden="true" />
          {t('docs.consents')}
        </h2>

        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {consents.map((consent) => (
            <li key={consent.id} className="flex flex-col gap-1 rounded-2xl bg-bg px-5 py-4">
              <span className="text-base font-medium leading-relaxed">{consent.title}</span>
              <span className="text-base text-muted">
                {t('docs.signedAt', { date: consent.at })}
                {consent.required ? ` ${t('docs.required')}` : ''}
              </span>
            </li>
          ))}
        </ul>

        <p className="m-0 text-base leading-relaxed text-muted">
          {t('docs.note')}
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 lg:col-span-6">
        <h2 className="m-0 flex items-center gap-2 font-display text-xl font-medium tracking-[-0.035em]">
          <Eye className="h-5 w-5 text-brand" aria-hidden="true" />
          {t('docs.access')}
        </h2>

        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {log.map((entry) => (
            <li key={entry.id} className="flex flex-col gap-0.5 rounded-2xl bg-bg px-5 py-4">
              <span className="text-base font-medium">{entry.who}</span>
              <span className="text-base text-muted">{entry.role}</span>
              <span className="text-base leading-relaxed">{entry.action}</span>
              <span className="text-sm text-muted">{entry.at}</span>
            </li>
          ))}
        </ul>

        <p className="m-0 flex items-start gap-2.5 rounded-2xl border border-line px-5 py-4 text-base leading-relaxed text-muted">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-deep" aria-hidden="true" />
          {/* TODO BACKEND: журнал пишется на сервере, клиент его только читает */}
          {t('docs.logNote')}
        </p>
      </section>
    </div>
  )
}
