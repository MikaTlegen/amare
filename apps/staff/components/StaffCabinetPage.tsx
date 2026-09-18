'use client'

import { useEffect, useState } from 'react'
import { Video, Phone, ClipboardCheck, TriangleAlert, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { CabinetShell, DemoNotice, cn, type Tab } from '@amare/ui'
import type { PatientCard, StaffTask } from '@amare/api-client'
import { PatientDetail } from './PatientDetail'
import { closeTask, getStaffPatients, getStaffTasks } from '@/lib/mock'
import { useAuth } from '@/auth/AuthContext'

const TABS: Tab[] = [
  { id: 'queue', label: 'Очередь задач' },
  { id: 'patients', label: 'Мои пациенты' },
]

const TASK_ICON: Record<StaffTask['kind'], LucideIcon> = {
  video: Video,
  call: Phone,
  assessment: ClipboardCheck,
  alert: TriangleAlert,
}

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
  const [busy, setBusy] = useState<string | null>(null)
  /** Открытая карточка пациента. null — показываем список. */
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    void getStaffTasks().then(setTasks)
    void getStaffPatients().then(setPatients)
  }, [])

  const done = async (id: string) => {
    setBusy(id)
    setTasks(await closeTask(id))
    setBusy(null)
  }

  const open = tasks.filter((t) => !t.done)
  const closed = tasks.filter((t) => t.done)
  const selected = patients.find((p) => p.id === selectedId) ?? null

  /** Переход из очереди задач сразу в карточку нужного пациента. */
  const openPatient = (id: string) => {
    setSelectedId(id)
    setTab('patients')
  }

  return (
    <CabinetShell
      title="Рабочее место специалиста"
      subtitle={`Открытых задач: ${open.length} · пациентов на курсе: ${patients.length}`}
      tabs={TABS}
      active={tab}
      onTabChange={setTab}
      userName={user?.name ?? ''}
      roleLabel={user?.speciality ?? 'Специалист'}
      onSignOut={signOut}
    >
      <DemoNotice />

      {tab === 'queue' && (
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-3">
            {open.map((task) => {
              const Icon = TASK_ICON[task.kind]
              const urgent = task.kind === 'alert'
              return (
                <li
                  key={task.id}
                  className={cn(
                    'flex flex-col gap-3 rounded-3xl border p-5 sm:flex-row sm:items-center sm:gap-5',
                    urgent ? 'border-accent bg-[rgb(253,238,237)]' : 'border-line bg-surface',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                      urgent ? 'bg-accent' : 'bg-tint',
                    )}
                  >
                    <Icon
                      className={cn('h-5 w-5', urgent ? 'text-accent-ink' : 'text-deep')}
                      aria-hidden="true"
                    />
                  </span>

                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-lg font-semibold">{task.title}</span>
                    <span className="text-base text-muted">
                      {task.patientName} · срок: {task.due}
                    </span>
                  </div>

                  <div className="flex shrink-0 gap-2.5">
                    <button
                      type="button"
                      onClick={() => openPatient(task.patientId)}
                      className="min-h-[3rem] rounded-xl border-[1.5px] border-line px-5 py-3 text-base font-semibold transition-colors hover:border-ink"
                    >
                      Открыть карточку
                    </button>
                    <button
                      type="button"
                      onClick={() => void done(task.id)}
                      disabled={busy === task.id}
                      className="min-h-[3rem] rounded-xl bg-deep px-5 py-3 text-base font-semibold text-white disabled:opacity-60"
                    >
                      {busy === task.id ? 'Закрываем…' : 'Выполнено'}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>

          {open.length === 0 && (
            <p className="m-0 rounded-3xl border border-line bg-surface p-6 text-lg text-muted">
              Открытых задач нет.
            </p>
          )}

          {closed.length > 0 && (
            <section className="flex flex-col gap-2.5">
              <h2 className="m-0 font-display text-lg font-medium tracking-[-0.035em] text-muted">
                Закрытые сегодня
              </h2>
              <ul className="flex flex-col gap-2">
                {closed.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center gap-3 rounded-2xl border border-line px-5 py-3.5"
                  >
                    <Check className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                    <span className="flex-1 text-base text-muted line-through">{task.title}</span>
                    <span className="text-sm text-muted">{task.patientName}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {tab === 'patients' && selected && (
        <PatientDetail patient={selected} onBack={() => setSelectedId(null)} />
      )}

      {tab === 'patients' && !selected && (
        <ul className="grid gap-4 lg:grid-cols-2">
          {patients.map((patient) => {
            const last = patient.barthel[patient.barthel.length - 1]
            const first = patient.barthel[0]
            const gain = last && first ? last.barthel - first.barthel : 0
            const silent = patient.alerts.some((a) => a.level === 'danger')

            return (
              <li
                key={patient.id}
                className={cn(
                  'flex flex-col gap-3 rounded-3xl border bg-surface p-6',
                  silent ? 'border-[rgb(179,38,30)]' : 'border-line',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-lg font-semibold">
                      {patient.name}, {patient.age}
                    </span>
                    <span className="text-base text-muted">{patient.diagnosis}</span>
                  </div>
                  <span className="shrink-0 rounded-full bg-tint px-3 py-1.5 text-sm font-medium text-deep">
                    день {patient.courseDay}/{patient.courseLength}
                  </span>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div>
                    <span className="block text-sm text-muted">Бартел сейчас</span>
                    <span className="font-display text-xl font-semibold tracking-[-0.04em]">
                      {last?.barthel ?? '—'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm text-muted">Прирост за курс</span>
                    <span className="font-display text-xl font-semibold tracking-[-0.04em] text-brand">
                      +{gain}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm text-muted">Практика за неделю</span>
                    <span className="font-display text-xl font-semibold tracking-[-0.04em]">
                      {patient.weekMinutes.reduce((a, b) => a + b, 0)} мин
                    </span>
                  </div>
                </div>

                {patient.alerts.map((alert) => (
                  <p
                    key={alert.id}
                    className="m-0 flex items-start gap-2 rounded-2xl bg-bg px-4 py-3 text-base"
                  >
                    <TriangleAlert
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    {alert.text}
                  </p>
                ))}

                <button
                  type="button"
                  onClick={() => setSelectedId(patient.id)}
                  className="mt-auto min-h-[3rem] rounded-xl bg-deep px-5 py-3 text-base font-semibold text-white"
                >
                  Открыть карточку
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </CabinetShell>
  )
}
