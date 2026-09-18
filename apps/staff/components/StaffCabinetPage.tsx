'use client'

import { useEffect, useState } from 'react'
import { CabinetShell, DemoNotice, type Tab } from '@amare/ui'
import type { PatientCard, StaffTask } from '@amare/api-client'
import { CourseLibrary } from './CourseLibrary'
import { PatientDetail } from './PatientDetail'
import { PatientsBoard } from './PatientsBoard'
import { TaskQueue } from './TaskQueue'
import { VideoReviewPanel } from './VideoReviewPanel'
import { getStaffPatients, getStaffTasks } from '@/lib/mock'
import { STAFF_ROLE_LABEL, useAuth } from '@/auth/AuthContext'

/**
 * Вкладки по роли.
 *
 * У куратора работа с людьми, у администратора — с содержимым.
 * Пересечение одно: список пациентов, он нужен обоим, но админу без
 * очереди задач и тревожных сигналов.
 */
const CURATOR_TABS: Tab[] = [
  { id: 'queue', label: 'Очередь задач' },
  { id: 'patients', label: 'Мои пациенты' },
  { id: 'video', label: 'Видео на проверку' },
]

const ADMIN_TABS: Tab[] = [
  { id: 'library', label: 'Курсы и шаблоны' },
  { id: 'patients', label: 'Пациенты и назначения' },
]

/**
 * Рабочее место специалиста и куратора (модуль M7 ТЗ).
 *
 * Главный экран куратора — не список пациентов, а очередь задач: у него
 * двадцать человек, и важно не «посмотреть всех», а не пропустить тех,
 * у кого что-то пошло не так. Поэтому тревожные сигналы сверху.
 */
export function StaffCabinetPage() {
  const { user, signOut } = useAuth()
  const isAdmin = user?.staffRole === 'admin'
  const tabs = isAdmin ? ADMIN_TABS : CURATOR_TABS

  const [tab, setTab] = useState(tabs[0]!.id)
  const [tasks, setTasks] = useState<StaffTask[]>([])
  const [patients, setPatients] = useState<PatientCard[]>([])
  /** Открытая карточка пациента. null — показываем список. */
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    void getStaffPatients().then(setPatients)
    if (!isAdmin) void getStaffTasks().then(setTasks)
  }, [isAdmin])

  const openCount = tasks.filter((task) => !task.done).length
  const selected = patients.find((patient) => patient.id === selectedId) ?? null

  /** Переход из очереди задач сразу в карточку нужного пациента. */
  const openPatient = (id: string) => {
    setSelectedId(id)
    setTab('patients')
  }

  const subtitle = isAdmin
    ? `Пациентов на курсе: ${patients.length}`
    : `Открытых задач: ${openCount} · пациентов на курсе: ${patients.length}`

  return (
    <CabinetShell
      title={isAdmin ? 'Администрирование курсов' : 'Рабочее место куратора'}
      subtitle={subtitle}
      tabs={tabs}
      active={tab}
      onTabChange={setTab}
      userName={user?.name ?? ''}
      roleLabel={user?.staffRole ? STAFF_ROLE_LABEL[user.staffRole] : 'Сотрудник'}
      onSignOut={signOut}
    >
      <DemoNotice />

      {tab === 'library' && <CourseLibrary />}

      {tab === 'queue' && (
        <TaskQueue tasks={tasks} onTasksChange={setTasks} onOpenPatient={openPatient} />
      )}

      {tab === 'video' && <VideoReviewPanel />}

      {tab === 'patients' &&
        (selected ? (
          <PatientDetail
            patient={selected}
            canAssign={isAdmin}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <PatientsBoard patients={patients} onOpen={setSelectedId} />
        ))}
    </CabinetShell>
  )
}
