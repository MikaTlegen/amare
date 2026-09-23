'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, FileText, PlayCircle, Video } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { SessionReport, SessionReportKind } from '@amare/api-client'
import { useT } from '@amare/i18n/react'
import { getSessionReports } from '@/lib/mock'

const KIND_ICON: Record<SessionReportKind, LucideIcon> = {
  video: Video,
  homework: Video,
  week: FileText,
}

/**
 * Отчёты куратора с занятий (G-02, P-09 ТЗ).
 *
 * Каждый отчёт раскрывается по нажатию: в списке — что за занятие и
 * одна строка итога, внутри — подробности, рекомендации и запись
 * занятия. <details> вместо самописного аккордеона: работает с
 * клавиатурой и экранным диктором без единой строки скрипта.
 */
export function SessionReports() {
  const t = useT('cabinet')
  const [reports, setReports] = useState<SessionReport[]>([])

  useEffect(() => {
    void getSessionReports().then(setReports)
  }, [])

  return (
    <section className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-4 sm:p-6">
      <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">{t('guardian.reports')}</h2>

      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {reports.map((report) => {
          const Icon = KIND_ICON[report.kind]
          return (
            <li key={report.id}>
              <details className="group rounded-2xl bg-bg">
                <summary className="flex min-h-11 cursor-pointer list-none items-start gap-3 rounded-2xl px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-base font-semibold leading-snug">{report.title}</span>
                    <span className="text-base leading-snug text-muted">{report.summary}</span>
                    <span className="text-sm text-muted">
                      {t(`reports.kind.${report.kind}`)} · {report.at}
                    </span>
                  </span>
                  <ChevronDown
                    className="mt-0.5 h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </summary>

                <div className="flex flex-col gap-3 px-4 pb-4 sm:pl-12">
                  <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-base leading-relaxed">
                    {report.details.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <span className="text-base text-muted">{t('reports.curator', { name: report.curator })}</span>
                  {report.videoUrl && (
                    <a
                      href={report.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 w-fit items-center gap-2 text-base font-semibold text-deep"
                    >
                      <PlayCircle className="h-5 w-5" aria-hidden="true" />
                      {t('reports.video')}
                    </a>
                  )}
                </div>
              </details>
            </li>
          )
        })}
      </ul>

      <p className="m-0 text-base leading-relaxed text-muted">
        {/* TODO BACKEND: выдача файлов только по подписанной ссылке с коротким сроком жизни */}
        {t('guardian.reportsNote')}
      </p>
    </section>
  )
}
