'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { ArrowLeft, Upload, ClipboardPlus, TriangleAlert, Check } from 'lucide-react'
import { AttachmentChip, BarthelChart, ChatPanel, useKindLabel, cn } from '@amare/ui'
import type { AssignedProgram, Attachment, PatientCard, ProgramTemplate } from '@amare/api-client'
import {
  assignProgram,
  getPatientDocuments,
  getPatientMessages,
  getPatientPrograms,
  getProgramTemplates,
  sendPatientMessage,
  uploadPatientDocument,
} from '@/lib/mock'
import { useT } from '@amare/i18n/react'
import { WeeklyReviewSection } from './WeeklyReviewSection'
import { useAuth } from '@/auth/AuthContext'

export type Section = 'program' | 'feedback' | 'docs' | 'progress' | 'weekly' | 'chat'

/**
 * Разделы карточки.
 *
 * Администратору доступны только программа и документы: переписка,
 * динамика по шкалам и разбор недели — клинические данные, и по
 * разделу 6 ТЗ они не входят в его роль.
 */
const CURATOR_SECTIONS: { id: Section; label: string }[] = [
  { id: 'program', label: 'Программа' },
  { id: 'feedback', label: 'Как даются упражнения' },
  { id: 'progress', label: 'Динамика' },
  { id: 'weekly', label: 'Разбор недели' },
  { id: 'chat', label: 'Переписка' },
  { id: 'docs', label: 'Документы' },
]

const ADMIN_SECTIONS: { id: Section; label: string }[] = [
  { id: 'program', label: 'Программа' },
  { id: 'docs', label: 'Документы' },
]

/**
 * Карточка пациента в рабочем месте специалиста.
 *
 * Здесь специалист делает то, ради чего вообще заходит: смотрит динамику,
 * назначает программу и работает с документами конкретного человека.
 * Документы хранятся по пациентам — общего списка файлов нет и быть
 * не должно.
 */
export function PatientDetail({
  patient,
  onBack,
  canAssign = false,
  clinical = true,
  initialSection = 'program',
}: {
  patient: PatientCard
  onBack: () => void
  /** Может ли этот сотрудник назначать программу. */
  canAssign?: boolean
  /**
   * Видны ли клинические разделы (динамика, оценки, разбор, переписка).
   * Раньше это решал canAssign, и куратор, которому дали право назначать
   * курс, терял свои же клинические разделы. Теперь это два разных права.
   */
  clinical?: boolean
  /** С какого раздела открыть — например, со сводки по «тяжело» сразу на оценки. */
  initialSection?: Section
}) {
  const sections = clinical ? CURATOR_SECTIONS : ADMIN_SECTIONS
  const [section, setSection] = useState<Section>(
    sections.some((item) => item.id === initialSection) ? initialSection : 'program',
  )

  // Стабильная ссылка на api для ChatPanel: без useMemo объект пересоздавался бы
  // на каждый ре-рендер и эффект внутри ChatPanel перезапрашивал бы сообщения заново.
  const chatApi = useMemo(
    () => ({
      getMessages: () => getPatientMessages(patient.id),
      sendMessage: (text: string, files: File[]) => sendPatientMessage(patient.id, text, files),
    }),
    [patient.id],
  )

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex w-fit items-center gap-2 text-base font-medium text-muted hover:text-ink"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            Все пациенты
          </button>
          <h2 className="m-0 font-display text-2xl font-medium tracking-[-0.04em]">
            {patient.name}, {patient.age}
          </h2>
          <p className="m-0 text-base text-muted">{patient.diagnosis}</p>
        </div>

        <span className="rounded-full bg-tint px-4 py-2 text-base font-medium text-deep">
          день {patient.courseDay} из {patient.courseLength}
        </span>
      </div>

      {patient.alerts.length > 0 && (
        <ul className="flex flex-col gap-2">
          {patient.alerts.map((alert) => (
            <li
              key={alert.id}
              className="flex items-start gap-3 rounded-2xl border border-accent bg-[rgb(253,238,237)] px-4 py-3.5 sm:px-5 sm:py-4"
            >
              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5"><span className="text-base leading-snug">{alert.text}</span><span className="text-sm text-muted">{alert.at}</span></span>
            </li>
          ))}
        </ul>
      )}

      <div role="tablist" aria-label="Разделы карточки пациента" className="flex flex-wrap gap-2">
        {sections.map((item) => {
          const on = item.id === section
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setSection(item.id)}
              className={cn(
                'min-h-[2.9rem] rounded-xl px-5 py-2.5 text-base font-medium transition-colors',
                on
                  ? 'bg-deep text-white'
                  : 'border border-line text-muted hover:border-ink hover:text-ink',
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {section === 'program' && <ProgramSection patient={patient} canAssign={canAssign} />}
      {section === 'feedback' && <FeedbackSection patient={patient} />}
      {section === 'docs' && <DocumentsSection patient={patient} />}
      {section === 'weekly' && <WeeklyReviewSection patient={patient} />}
      {section === 'chat' && <ChatPanel api={chatApi} />}
      {section === 'progress' && (
        <div className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-6">
          <h3 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
            Индекс Бартел
          </h3>
          <BarthelChart data={patient.barthel} height="16rem" />
          <p className="m-0 text-base leading-relaxed text-muted">
            Практика за неделю: {patient.weekMinutes.reduce((a, b) => a + b, 0)} минут. Куратор:{' '}
            {patient.curator}.
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Оценки пациента «как далось» — главный сигнал, где менять нагрузку.
 * «Тяжело» выделено: два таких ответа подряд по одному упражнению —
 * повод снизить повторы до следующего занятия, не дожидаясь разбора.
 */
function FeedbackSection({ patient }: { patient: PatientCard }) {
  const t = useT('staff')
  const items = patient.feedback ?? []
  const hard = items.filter((item) => item.level === 3).length

  return (
    <section className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">{t('detail.feedback')}</h3>
        {items.length > 0 && (
          <span className="text-base text-muted">{t('detail.hardCount', { count: hard, total: items.length })}</span>
        )}
      </div>
      <p className="m-0 text-base leading-relaxed text-muted">{t('detail.feedbackNote')}</p>

      {items.length === 0 ? (
        <p className="m-0 text-base text-muted">{t('detail.feedbackEmpty')}</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {items.map((item) => (
            <li
              key={item.id}
              className={cn(
                'flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl px-4 py-3',
                item.level === 3 ? 'border-[1.5px] border-accent bg-[rgb(253,238,237)]' : 'bg-bg',
              )}
            >
              <span className="min-w-0 flex-1 text-base font-medium">{item.exercise}</span>
              <span className={cn('text-base font-semibold', item.level === 3 ? 'text-accent' : 'text-deep')}>
                {t(`difficulty.${item.level}`)}
              </span>
              <span className="text-base text-muted">{item.at}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

/** Назначение курса и список уже назначенных программ. */
function ProgramSection({ patient, canAssign }: { patient: PatientCard; canAssign: boolean }) {
  const { user } = useAuth()
  const [templates, setTemplates] = useState<ProgramTemplate[]>([])
  const [assigned, setAssigned] = useState<AssignedProgram[]>([])
  const [templateId, setTemplateId] = useState('')
  const [startAt, setStartAt] = useState('')
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    void getProgramTemplates().then(setTemplates)
    void getPatientPrograms(patient.id).then(setAssigned)
  }, [patient.id])

  const chosen = templates.find((t) => t.id === templateId)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!templateId) return
    setSaving(true)
    setAssigned(
      await assignProgram({
        patientId: patient.id,
        templateId,
        startAt,
        comment,
        assignedBy: user?.name ?? 'Специалист',
      }),
    )
    setSaving(false)
    setSaved(true)
    setTemplateId('')
    setComment('')
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12">
      {!canAssign && (
        <p className="m-0 rounded-3xl border border-line bg-bg px-6 py-5 text-base leading-relaxed text-muted lg:col-span-7">
          Курс назначает администратор клиники. Если программу нужно изменить — напишите ему,
          указав, что именно и почему: назначение попадёт в карту пациента и в его кабинет.
        </p>
      )}

      {canAssign && (
      <form
        onSubmit={submit}
        className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-6 lg:col-span-7"
      >
        <h3 className="m-0 flex items-center gap-2 font-display text-xl font-medium tracking-[-0.035em]">
          <ClipboardPlus className="h-5 w-5 text-brand" aria-hidden="true" />
          Назначить программу
        </h3>

        <fieldset className="m-0 flex flex-col gap-2.5 border-0 p-0">
          <legend className="mb-1 p-0 text-base font-medium">Шаблон курса</legend>
          {templates.map((template) => (
            <label
              key={template.id}
              className={cn(
                'flex cursor-pointer flex-col gap-1.5 rounded-2xl border-[1.5px] p-4 transition-colors',
                templateId === template.id
                  ? 'border-accent bg-[rgb(253,238,237)]'
                  : 'border-line bg-bg',
              )}
            >
              <input
                type="radio"
                name="template"
                value={template.id}
                checked={templateId === template.id}
                onChange={() => {
                  setTemplateId(template.id)
                  setSaved(false)
                }}
                className="sr-only"
              />
              <span className="text-base font-semibold">{template.title}</span>
              <span className="text-base text-muted">{template.includes.join(' · ')}</span>
              <span className="text-base text-muted">{template.note}</span>
            </label>
          ))}
        </fieldset>

        {/*
          Предупреждение по стандарту РК: на II–III этапах курс не короче
          14 дней. Показываем его до сохранения, а не после — иначе врач
          узнает о проблеме, когда уже назначил.
        */}
        {chosen && chosen.days < 14 && (
          <p className="m-0 flex items-start gap-3 rounded-2xl border border-accent bg-[rgb(253,238,237)] px-5 py-4 text-base leading-relaxed">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            Курс короче 14 дней не соответствует стандарту РК для II и III этапов. Для оплаты по
            ОСМС такой курс не подойдёт.
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="start-at" className="text-base font-medium">
            Дата начала
          </label>
          <input
            id="start-at"
            type="date"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line bg-bg px-4 py-3 text-base"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="program-comment" className="text-base font-medium">
            Комментарий для команды
          </label>
          <textarea
            id="program-comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="На что обратить внимание, чего избегать"
            className="rounded-xl border-[1.5px] border-line bg-bg px-4 py-3 text-base"
          />
        </div>

        <button
          type="submit"
          disabled={!templateId || saving}
          className="min-h-[3.2rem] self-start rounded-xl bg-deep px-6 py-3 text-base font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Назначаем…' : 'Назначить курс'}
        </button>

        {saved && (
          <p className="m-0 flex items-center gap-2 text-base font-medium text-brand">
            <Check className="h-5 w-5" aria-hidden="true" />
            Программа назначена и видна пациенту в кабинете
          </p>
        )}
      </form>
      )}

      <section className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-4 sm:p-6 lg:col-span-5">
        <h3 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
          Назначенные программы
        </h3>

        {assigned.length === 0 ? (
          <p className="m-0 text-base text-muted">Программ пока нет.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {assigned.map((program) => (
              <li key={program.id} className="flex flex-col gap-1 rounded-2xl bg-bg p-4">
                <span className="text-base font-semibold">{program.title}</span>
                <span className="text-base text-muted">
                  Начало: {program.startAt} · {program.days} дней
                </span>
                {program.comment && (
                  <span className="text-base leading-relaxed text-ink/80">{program.comment}</span>
                )}
                <span className="text-sm text-muted">
                  Назначил: {program.assignedBy}, {program.assignedAt}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

/** Документы конкретного пациента: то, что прислали, и то, что выдала клиника. */
function DocumentsSection({ patient }: { patient: PatientCard }) {
  const kindLabel = useKindLabel()
  const [docs, setDocs] = useState<Attachment[]>([])
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void getPatientDocuments(patient.id).then(setDocs)
  }, [patient.id])

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return
    setBusy(true)
    setDocs(await uploadPatientDocument(patient.id, files))
    setBusy(false)
    event.target.value = ''
  }

  const fromPatient = docs.filter((d) => d.by === 'patient')
  const fromStaff = docs.filter((d) => d.by === 'staff')

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <DocumentList
        title="Прислал пациент"
        empty="Пациент пока ничего не прислал."
        items={fromPatient}
      />

      <section className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-4 sm:p-6">
        <h3 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
          Документы клиники
        </h3>

        {fromStaff.length === 0 ? (
          <p className="m-0 text-base text-muted">Заключений пока нет.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {fromStaff.map((item) => (
              <li key={item.id} className="flex flex-col gap-1">
                <AttachmentChip attachment={item} />
                <span className="pl-1 text-sm text-muted">
                  {kindLabel[item.kind]} · {item.at}
                </span>
              </li>
            ))}
          </ul>
        )}

        <input id="staff-upload" type="file" multiple onChange={upload} className="sr-only" />
        <label
          htmlFor="staff-upload"
          className="inline-flex min-h-[3.2rem] w-fit cursor-pointer items-center gap-2 rounded-xl bg-deep px-5 py-3 text-base font-semibold text-white"
        >
          <Upload className="h-5 w-5" aria-hidden="true" />
          {busy ? 'Загружаем…' : 'Добавить заключение'}
        </label>

        <p className="m-0 text-sm leading-relaxed text-muted">
          {/* TODO BACKEND: хранилище в РК, антивирус, выдача по подписанной ссылке */}
          Файл не покидает эту вкладку: хранилище появится вместе с бэкендом.
        </p>
      </section>
    </div>
  )
}

function DocumentList({
  title,
  items,
  empty,
}: {
  title: string
  items: Attachment[]
  empty: string
}) {
  const kindLabel = useKindLabel()

  return (
    <section className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-4 sm:p-6">
      <h3 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">{title}</h3>

      {items.length === 0 ? (
        <p className="m-0 text-base text-muted">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-1">
              <AttachmentChip attachment={item} />
              <span className="pl-1 text-sm text-muted">
                {kindLabel[item.kind]} · {item.at}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
