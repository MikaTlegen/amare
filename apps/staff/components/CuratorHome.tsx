'use client'

import { useEffect, useState } from 'react'
import { FileCheck2, Gauge, ListTodo, TriangleAlert, Users, Video } from 'lucide-react'
import type { PatientCard, StaffTask, VideoReview } from '@amare/api-client'
import { DashCard, DashGrid } from '@amare/ui'
import { useT } from '@amare/i18n/react'
import { getContentReviews, getVideoReviews, type ContentReviewItem } from '@/lib/mock'
import type { Section } from './PatientDetail'

/** Минут в неделю в среднем по пациентам — округлённо, для одной строки. */
function averageWeekMinutes(patients: PatientCard[]): number {
  if (patients.length === 0) return 0
  const total = patients.reduce((sum, patient) => sum + patient.weekMinutes.reduce((a, b) => a + b, 0), 0)
  return Math.round(total / patients.length)
}

/**
 * Главная куратора: шесть карточек о том, что ждёт решения сегодня.
 *
 * Каждая карточка — одно число и строка, нажатие ведёт в раздел с
 * подробностями: задачи — в очередь, видео — в проверку, «тяжело» —
 * прямо в карточку пациента на его оценки. Цифры считаются из тех же
 * данных, что показывают разделы, — выдуманной статистики здесь нет.
 */
export function CuratorHome({
  tasks,
  patients,
  onOpen,
  onOpenPatient,
}: {
  tasks: StaffTask[]
  patients: PatientCard[]
  onOpen: (tab: string) => void
  onOpenPatient: (id: string, section: Section) => void
}) {
  const t = useT('staff')
  const [videos, setVideos] = useState<VideoReview[]>([])
  const [content, setContent] = useState<ContentReviewItem[]>([])

  useEffect(() => {
    void getVideoReviews().then(setVideos)
    void getContentReviews().then(setContent)
  }, [])

  const open = tasks.filter((task) => !task.done)
  const urgent = open.filter((task) => task.kind === 'alert').length
  const alarmed = patients.filter((patient) => patient.alerts.some((alert) => alert.level !== 'info'))
  const pendingVideos = videos.filter((video) => !video.verdict).length
  const pendingContent = content.filter((item) => item.status === 'На проверке').length
  const hard = patients.flatMap((patient) =>
    (patient.feedback ?? []).filter((item) => item.level === 3).map((item) => ({ patient, item })),
  )
  const firstHard = hard[0]

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 font-display text-xl font-semibold tracking-[-0.035em] sm:text-2xl">{t('home.headline')}</h2>
        <p className="m-0 text-base leading-snug text-muted">{t('home.lead')}</p>
      </div>

      <DashGrid>
        <DashCard
          tone="dark"
          icon={ListTodo}
          label={t('home.tasks')}
          value={open.length}
          note={t('home.tasksNote', { count: urgent })}
          onClick={() => onOpen('queue')}
        />
        <DashCard
          tone={alarmed.length > 0 ? 'alert' : 'default'}
          icon={TriangleAlert}
          label={t('home.alerts')}
          value={alarmed.length}
          note={alarmed.length > 0 ? alarmed.map((patient) => patient.name).join(', ') : t('home.alertsNone')}
          onClick={() => onOpen('patients')}
        />
        <DashCard
          icon={Video}
          label={t('home.videos')}
          value={pendingVideos}
          note={t('home.videosNote')}
          onClick={() => onOpen('video')}
        />
        <DashCard
          icon={FileCheck2}
          label={t('home.content')}
          value={pendingContent}
          note={t('home.contentNote')}
          onClick={() => onOpen('content-review')}
        />
        <DashCard
          tone={hard.length > 0 ? 'alert' : 'default'}
          icon={Gauge}
          label={t('home.hard')}
          value={hard.length}
          note={
            firstHard
              ? t('home.hardNote', { name: firstHard.patient.name, exercise: firstHard.item.exercise })
              : t('home.hardNone')
          }
          onClick={firstHard ? () => onOpenPatient(firstHard.patient.id, 'feedback') : () => onOpen('patients')}
        />
        <DashCard
          icon={Users}
          label={t('home.patients')}
          value={patients.length}
          note={t('home.patientsNote', { minutes: averageWeekMinutes(patients) })}
          onClick={() => onOpen('patients')}
        />
      </DashGrid>
    </div>
  )
}
