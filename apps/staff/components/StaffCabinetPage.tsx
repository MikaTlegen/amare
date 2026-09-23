"use client"

import { useEffect, useState } from "react"
import type { PatientCard, StaffTask } from "@amare/api-client"
import { CabinetShell, DemoNotice, StatBarChart, type Tab } from "@amare/ui"
import { useContent, useT } from "@amare/i18n/react"
import { STAFF_ROLE_KEY, useAuth } from "@/auth/AuthContext"
import { getStaffPatients, getStaffTasks } from "@/lib/mock"
import { ContentApprovalPanel } from "./ContentApprovalPanel"
import { ModeratorContentPanel } from "./ModeratorContentPanel"
import { PatientDetail } from "./PatientDetail"
import { PatientsBoard } from "./PatientsBoard"
import { TaskQueue } from "./TaskQueue"
import { VideoReviewPanel } from "./VideoReviewPanel"

/** Вкладки куратора: подписи берутся из словаря staff. */
const CURATOR_TAB_KEYS = [["queue", "tab.queue"], ["patients", "tab.patients"], ["video", "tab.video"], ["content-review", "tab.contentReview"]] as const
const MODERATOR_TABS: Tab[] = [{ id: "dashboard", label: "Сводка" }, { id: "library", label: "Контент и шаблоны" }, { id: "review", label: "На проверке" }, { id: "archive", label: "Архив" }]

export function StaffCabinetPage() {
  const t = useT("staff")
  const text = useContent("staff")
  const { user, signOut } = useAuth()
  const role = user?.staffRole ?? "curator"
  const isModerator = role === "moderator"
  const curatorTabs: Tab[] = CURATOR_TAB_KEYS.map(([id, key]) => ({ id, label: t(key) }))
  const tabs = isModerator ? MODERATOR_TABS : curatorTabs
  const [tab, setTab] = useState(tabs[0]?.id ?? "queue")
  const [tasks, setTasks] = useState<StaffTask[]>([])
  const [patients, setPatients] = useState<PatientCard[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  useEffect(() => { if (!isModerator) { void getStaffPatients().then(setPatients); void getStaffTasks().then(setTasks) } }, [isModerator])
  const selected = patients.find((patient) => patient.id === selectedId) ?? null
  const openPatient = (id: string) => { setSelectedId(id); setTab("patients") }
  const subtitle = isModerator
    ? t("subtitle.moderator")
    : t("subtitle.curator", { tasks: tasks.filter((task) => !task.done).length, patients: patients.length })
  return <CabinetShell title={t(isModerator ? "title.moderator" : "title.curator")} subtitle={subtitle} tabs={tabs} active={tab} onTabChange={setTab} userName={user?.name ?? ""} roleLabel={text(STAFF_ROLE_KEY[role])} homeHref={process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"} onSignOut={signOut}>
    <DemoNotice />
    {isModerator && tab === "dashboard" && <ModeratorDashboard />}
    {isModerator && tab !== "dashboard" && <ModeratorContentPanel view={tab as "library" | "review" | "archive"} />}
    {!isModerator && tab === "queue" && <TaskQueue tasks={tasks} onTasksChange={setTasks} onOpenPatient={openPatient} />}
    {!isModerator && tab === "video" && <VideoReviewPanel />}
    {!isModerator && tab === "content-review" && <ContentApprovalPanel />}
    {!isModerator && tab === "patients" && (selected ? <PatientDetail patient={selected} canAssign onBack={() => setSelectedId(null)} /> : <PatientsBoard patients={patients} onOpen={setSelectedId} />)}
  </CabinetShell>
}

function ModeratorDashboard() {
  const items = [{ label: "Черновики", value: 4, note: "требуют подготовки" }, { label: "На проверке", value: 2, note: "ожидают врача-куратора" }, { label: "Утверждено", value: 12, note: "доступно для курсов" }, { label: "Новые версии", value: 1, note: "создана сегодня" }]
  return <div className="grid gap-5"><section className="rounded-3xl border border-line bg-surface p-6"><h2 className="m-0 font-display text-xl font-medium">Контент по статусам</h2><div className="mt-4"><StatBarChart data={items.map(({ label, value }) => ({ label, value }))} /></div><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{items.map((item) => <div key={item.label} className="rounded-2xl bg-bg p-4"><p className="m-0 text-2xl font-semibold">{item.value}</p><p className="mb-0 mt-1 text-sm font-medium">{item.label}</p><p className="mb-0 mt-1 text-xs text-muted">{item.note}</p></div>)}</div></section><div className="grid gap-5 xl:grid-cols-2"><section className="rounded-3xl border border-line bg-surface p-6"><h2 className="m-0 font-display text-xl font-medium">Ближайшие действия</h2><div className="mt-4 grid gap-3"><p className="m-0 rounded-2xl bg-bg p-4"><strong>Речь и глотание v1.0</strong><br /><span className="text-sm text-muted">Отправлено врачу на проверку сегодня.</span></p><p className="m-0 rounded-2xl bg-bg p-4"><strong>Комплексный курс v1.1</strong><br /><span className="text-sm text-muted">Черновик: добавить упражнения второй недели.</span></p></div></section><section className="rounded-3xl border border-line bg-surface p-6"><h2 className="m-0 font-display text-xl font-medium">Статус библиотеки</h2><dl className="mt-4 grid gap-3"><div className="flex justify-between rounded-2xl bg-bg p-4"><dt>Упражнений в библиотеке</dt><dd className="m-0 font-semibold">38</dd></div><div className="flex justify-between rounded-2xl bg-bg p-4"><dt>Материалов для пациентов</dt><dd className="m-0 font-semibold">16</dd></div><div className="flex justify-between rounded-2xl bg-bg p-4"><dt>Версий в архиве</dt><dd className="m-0 font-semibold">7</dd></div></dl></section></div></div>
}
