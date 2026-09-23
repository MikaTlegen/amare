'use client'

import { useEffect, useState } from 'react'
import {
  CalendarCheck,
  ClipboardList,
  FileText,
  GraduationCap,
  HeartPulse,
  MessageCircle,
  Pill,
  TrendingUp,
} from 'lucide-react'
import type {
  CareTask,
  DayPlan,
  GuardianLesson,
  Medication,
  MedicationLog,
  Message,
  PatientCard,
  SessionReport,
  VitalEntry,
} from '@amare/api-client'
import { DashCard, DashGrid } from '@amare/ui'
import { useT } from '@amare/i18n/react'
import {
  getCareTasks,
  getDayPlan,
  getGuardianLessons,
  getMedHistory,
  getMedications,
  getMessages,
  getPatientCard,
  getSessionReports,
  getVitals,
} from '@/lib/mock'
import {
  barthelSummary,
  careSummary,
  isAboveTarget,
  lastCuratorMessage,
  lastVital,
  medsSummary,
  planSummary,
  schoolSummary,
} from '@/lib/summary'

interface Snapshot {
  plan: DayPlan
  meds: Medication[]
  history: MedicationLog[]
  vitals: VitalEntry[]
  card: PatientCard
  messages: Message[]
  reports: SessionReport[]
  care: CareTask[]
  lessons: GuardianLesson[]
}

async function loadSnapshot(): Promise<Snapshot> {
  const [plan, meds, history, vitals, card, messages, reports, care, lessons] = await Promise.all([
    getDayPlan(),
    getMedications(),
    getMedHistory(),
    getVitals(),
    getPatientCard(),
    getMessages(),
    getSessionReports(),
    getCareTasks(),
    getGuardianLessons(),
  ])
  return { plan, meds, history, vitals, card, messages, reports, care, lessons }
}

/**
 * Сводка кабинета пациента и опекуна: шесть карточек «всё ли в порядке».
 *
 * Карточка — это коротко, одно число и строка. Нажатие открывает раздел
 * меню, где лежит всё подробно: пропущенное лекарство ведёт в
 * «Лекарства», где видно, какое, когда и во сколько. Набор карточек у
 * ролей разный: пациенту — своё лечение и связь с куратором, опекуну —
 * ещё его собственные отметки ухода и школа.
 */
export function CareDashboard({ role, onOpen }: { role: 'patient' | 'guardian'; onOpen: (tab: string) => void }) {
  const t = useT('cabinet')
  const [data, setData] = useState<Snapshot | null>(null)

  useEffect(() => {
    void loadSnapshot().then(setData)
  }, [])

  if (!data) return <p className="m-0 text-base text-muted">{t('progress.loading')}</p>

  const plan = planSummary(data.plan)
  const meds = medsSummary(data.meds, data.history, t('home.today'))
  const missed = meds.missed[0]
  const vital = lastVital(data.vitals)
  const high = vital ? isAboveTarget(vital) : false
  const barthel = barthelSummary(data.card)

  const planCard = (
    <DashCard
      tone="dark"
      icon={CalendarCheck}
      label={t('home.plan')}
      value={t('home.planValue', { done: plan.done, total: plan.total })}
      note={plan.minutesLeft > 0 ? t('home.planLeft', { minutes: plan.minutesLeft }) : t('home.planDone')}
      onClick={() => onOpen('plan')}
    />
  )

  const medsCard = missed ? (
    <DashCard
      tone="alert"
      icon={Pill}
      label={t('home.medsMissed')}
      value={meds.missed.length}
      note={t('home.medsMissedNote', { title: missed.title, day: missed.day, time: missed.planned })}
      onClick={() => onOpen('meds')}
    />
  ) : (
    <DashCard
      icon={Pill}
      label={t('home.meds')}
      value={t('home.medsValue', { taken: meds.taken, total: meds.total })}
      note={t('home.medsNote')}
      onClick={() => onOpen('meds')}
    />
  )

  const pressureCard = (
    <DashCard
      tone={high ? 'alert' : 'default'}
      icon={HeartPulse}
      label={t('home.pressure')}
      value={vital ? `${vital.systolic}/${vital.diastolic}` : '—'}
      note={
        vital
          ? t('home.pressureNote', {
              at: vital.at,
              state: t(high ? 'diary.aboveTarget' : 'diary.withinTarget'),
            })
          : t('home.pressureEmpty')
      }
      onClick={() => onOpen('diary')}
    />
  )

  const barthelCard = barthel && (
    <DashCard
      icon={TrendingUp}
      label={t('home.barthel')}
      value={barthel.last}
      note={t('home.barthelNote', { gain: barthel.gain })}
      onClick={() => onOpen('progress')}
    />
  )

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 font-display text-xl font-semibold tracking-[-0.035em] sm:text-2xl">
          {t('home.title', { day: data.plan.day, total: data.plan.courseLength })}
        </h2>
        <p className="m-0 text-base leading-snug text-muted">{t('home.lead')}</p>
      </div>

      <DashGrid>
        {planCard}
        {medsCard}
        {pressureCard}
        {role === 'patient' ? <PatientCards data={data} onOpen={onOpen} /> : <GuardianCards data={data} onOpen={onOpen} />}
        {barthelCard}
      </DashGrid>
    </div>
  )
}

function PatientCards({ data, onOpen }: { data: Snapshot; onOpen: (tab: string) => void }) {
  const t = useT('cabinet')
  const message = lastCuratorMessage(data.messages)
  const curatorCount = data.messages.filter((item) => item.author === 'curator').length
  const report = data.reports[0]

  return (
    <>
      <DashCard
        icon={MessageCircle}
        label={t('home.chat')}
        value={curatorCount}
        note={message ? message.text : t('home.chatEmpty')}
        onClick={() => onOpen('chat')}
      />
      <DashCard
        icon={FileText}
        label={t('home.reports')}
        value={data.reports.length}
        note={report?.title}
        onClick={() => onOpen('progress')}
      />
    </>
  )
}

function GuardianCards({ data, onOpen }: { data: Snapshot; onOpen: (tab: string) => void }) {
  const t = useT('cabinet')
  const care = careSummary(data.care)
  const school = schoolSummary(data.lessons)

  return (
    <>
      <DashCard
        icon={ClipboardList}
        label={t('home.care')}
        value={t('home.planValue', { done: care.done, total: care.total })}
        note={t('home.careNote')}
        onClick={() => onOpen('care')}
      />
      <DashCard
        icon={GraduationCap}
        label={t('home.school')}
        value={t('home.planValue', { done: school.done, total: school.total })}
        note={t('home.schoolNote')}
        onClick={() => onOpen('school')}
      />
    </>
  )
}
