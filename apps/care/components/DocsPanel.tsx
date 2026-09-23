'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown, Eye, FileSignature, FileText, ShieldCheck, X } from 'lucide-react'
import type { AccessLogEntry, Consent, PatientDocument } from '@amare/api-client'
import { useT } from '@amare/i18n/react'
import { getAccessLog, getConsents, getPatientDocuments } from '@/lib/mock'

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
 *
 * Всё, что выглядит как карточка, открывается: документ — в окне
 * просмотра, согласие и запись журнала — раскрываются на месте.
 */
export function DocsPanel() {
  const t = useT('cabinet')
  const [docs, setDocs] = useState<PatientDocument[]>([])
  const [consents, setConsents] = useState<Consent[]>([])
  const [log, setLog] = useState<AccessLogEntry[]>([])
  const [opened, setOpened] = useState<PatientDocument | null>(null)

  useEffect(() => {
    void getPatientDocuments().then(setDocs)
    void getConsents().then(setConsents)
    void getAccessLog().then(setLog)
  }, [])

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12">
      <section className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-4 sm:p-6 lg:col-span-12">
        <h2 className="m-0 flex items-center gap-2 font-display text-xl font-medium tracking-[-0.035em]">
          <FileText className="h-5 w-5 text-brand" aria-hidden="true" />
          {t('docs.mine')}
        </h2>

        <ul className="m-0 grid list-none grid-cols-1 gap-2.5 p-0 md:grid-cols-2">
          {docs.map((doc) => (
            <li key={doc.id}>
              <button
                type="button"
                onClick={() => setOpened(doc)}
                className="flex min-h-11 w-full items-start gap-3 rounded-2xl bg-bg px-4 py-3.5 text-left transition-colors hover:bg-tint"
              >
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-deep" aria-hidden="true" />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-base font-semibold leading-snug">{doc.title}</span>
                  <span className="text-base leading-snug text-muted">
                    {doc.issuedBy} · {doc.at}
                  </span>
                </span>
                <span className="shrink-0 text-base font-semibold text-deep">{t('docs.open')}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-4 sm:p-6 lg:col-span-6">
        <h2 className="m-0 flex items-center gap-2 font-display text-xl font-medium tracking-[-0.035em]">
          <FileSignature className="h-5 w-5 text-brand" aria-hidden="true" />
          {t('docs.consents')}
        </h2>

        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {consents.map((consent) => (
            <li key={consent.id}>
              <Expandable
                title={consent.title}
                meta={`${t('docs.signedAt', { date: consent.at })}${consent.required ? ` ${t('docs.required')}` : ''}`}
              >
                {consent.text && <p className="m-0 text-base leading-relaxed">{consent.text}</p>}
                <span className="text-base font-medium text-brand">{t('docs.active')}</span>
              </Expandable>
            </li>
          ))}
        </ul>

        <p className="m-0 text-base leading-relaxed text-muted">{t('docs.note')}</p>
      </section>

      <section className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-4 sm:p-6 lg:col-span-6">
        <h2 className="m-0 flex items-center gap-2 font-display text-xl font-medium tracking-[-0.035em]">
          <Eye className="h-5 w-5 text-brand" aria-hidden="true" />
          {t('docs.access')}
        </h2>

        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {log.map((entry) => (
            <li key={entry.id}>
              <Expandable title={entry.who} meta={`${entry.role} · ${entry.at}`}>
                <p className="m-0 text-base leading-relaxed">{entry.action}</p>
                {entry.source && (
                  <span className="text-base text-muted">{t('docs.source', { source: entry.source })}</span>
                )}
              </Expandable>
            </li>
          ))}
        </ul>

        <p className="m-0 flex items-start gap-2.5 rounded-2xl border border-line px-4 py-3.5 text-base leading-relaxed text-muted sm:px-5 sm:py-4">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-deep" aria-hidden="true" />
          {/* TODO BACKEND: журнал пишется на сервере, клиент его только читает */}
          {t('docs.logNote')}
        </p>
      </section>

      <DocumentViewer doc={opened} onClose={() => setOpened(null)} />
    </div>
  )
}

/** Карточка, которая раскрывается на месте: заголовок и строка сведений, внутри — подробности. */
function Expandable({ title, meta, children }: { title: string; meta: string; children: ReactNode }) {
  return (
    <details className="group rounded-2xl bg-bg">
      <summary className="flex min-h-11 cursor-pointer list-none items-start gap-3 rounded-2xl px-4 py-3.5 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-base font-medium leading-snug">{title}</span>
          <span className="text-base leading-snug text-muted">{meta}</span>
        </span>
        <ChevronDown
          className="mt-0.5 h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </summary>
      <div className="flex flex-col gap-2 px-4 pb-4">{children}</div>
    </details>
  )
}

/**
 * Просмотр документа в нативном <dialog>: фокус, Escape и затемнение
 * фона браузер делает сам. В демо внутри — текст документа; в бою
 * здесь будет файл по подписанной ссылке.
 */
function DocumentViewer({ doc, onClose }: { doc: PatientDocument | null; onClose: () => void }) {
  const t = useT('cabinet')
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (doc && !dialog.open) dialog.showModal()
    if (!doc && dialog.open) dialog.close()
  }, [doc])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(event) => {
        // Клик по затемнению вокруг окна закрывает его
        if (event.target === event.currentTarget) onClose()
      }}
      aria-labelledby="doc-viewer-title"
      className="m-auto w-[min(40rem,calc(100vw-2rem))] rounded-3xl border-0 bg-surface p-0 text-ink backdrop:bg-ink/50"
    >
      {doc && (
        <div className="flex flex-col gap-4 p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 id="doc-viewer-title" className="m-0 font-display text-xl font-semibold tracking-[-0.035em] sm:text-2xl">
                {doc.title}
              </h2>
              <span className="text-base text-muted">
                {doc.issuedBy} · {doc.at}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('docs.close')}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line text-muted hover:text-ink"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-bg p-4 sm:p-5">
            {doc.body.map((line) => (
              <p key={line} className="m-0 text-base leading-relaxed">
                {line}
              </p>
            ))}
          </div>

          <p className="m-0 text-base leading-relaxed text-muted">{t('docs.demoFile')}</p>
        </div>
      )}
    </dialog>
  )
}
