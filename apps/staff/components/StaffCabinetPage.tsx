'use client'

import { useEffect, useState } from 'react'
import { CabinetShell, DemoNotice, type Tab } from '@amare/ui'
import type { PatientCard, StaffTask } from '@amare/api-client'
import { PatientDetail } from './PatientDetail'
import { PatientsBoard } from './PatientsBoard'
import { TaskQueue } from './TaskQueue'
import { VideoReviewPanel } from './VideoReviewPanel'
import { getStaffPatients, getStaffTasks } from '@/lib/mock'
import { useAuth } from '@/auth/AuthContext'

const TABS: Tab[] = [
  { id: 'queue', label: 'Очередь задач' },
  { id: 'patients', label: 'Мои пациенты' },
  { id: 'video', label: 'Видео на проверку' },
]

/**
 * Рабочее место специалиста и куратора (модуль M7 ТЗ).
 *
 * Главный экран — не список пациентов, а очередь задач: у куратора
 * двадцать человек, и ему важно не «посмотреть всех», а не пропустить
 * тех, у кого что-то пошло не так. Поэтому тревожные сигналы сверху.
 */
export function StaffCabinetPage() {
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState('queue')
  const [tasks, setTasks] = useState<StaffTask[]>([])
  const [patients, setPatients] = useState<PatientCard[]>([])
  /** Открытая карточка пациента. null — показываем список. */
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    void getStaffTasks().then(setTasks)
    void getStaffPatients().then(setPatients)
  }, [])

  const openCount = tasks.filter((task) => !task.done).length
  const selected = patients.find((patient) => patient.id === selectedId) ?? null

  /** Переход из очереди задач сразу в карточку нужного пациента. */
  const openPatient = (id: string) => {
    setSelectedId(id)
    setTab('patients')
  }

  return (
    <CabinetShell
      title="Рабочее место специалиста"
      subtitle={`Открытых задач: ${openCount} · пациентов на курсе: ${patients.length}`}
      tabs={TABS}
      active={tab}
      onTabChange={setTab}
      userName={user?.name ?? ''}
      roleLabel={user?.speciality ?? 'Специалист'}
      onSignOut={signOut}
    >
      <DemoNotice />

      {tab === 'queue' && (
        <TaskQueue tasks={tasks} onTasksChange={setTasks} onOpenPatient={openPatient} />
      )}

      {tab === 'video' && <VideoReviewPanel />}

      {tab === 'patients' &&
        (selected ? (
          <PatientDetail patient={selected} onBack={() => setSelectedId(null)} />
        ) : (
          <PatientsBoard patients={patients} onOpen={setSelectedId} />
        ))}
    </CabinetShell>
  )
}
