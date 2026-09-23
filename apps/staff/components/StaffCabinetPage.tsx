"use client"

import { useEffect, useState } from "react"
import {
  Archive,
  Blocks,
  BookOpen,
  ClipboardCheck,
  FileCheck2,
  LayoutDashboard,
  LibraryBig,
  ListTodo,
  Users,
  UsersRound,
  Video,
} from "lucide-react"
import type { PatientCard, StaffTask } from "@amare/api-client"
import { CabinetShell, DemoNotice, useCabinetTab, type Tab, type TabGroup } from "@amare/ui"
import { useContent, useT } from "@amare/i18n/react"
import { STAFF_ROLE_KEY, useAuth } from "@/auth/AuthContext"
import { getStaffPatients, getStaffTasks } from "@/lib/mock"
import { ContentApprovalPanel } from "./ContentApprovalPanel"
import { CourseBuilder } from "./CourseBuilder"
import { CuratorHome } from "./CuratorHome"
import { CourseLibrary } from "./CourseLibrary"
import { ModeratorContentPanel } from "./ModeratorContentPanel"
import { ModeratorDashboard } from "./ModeratorDashboard"
import { PatientDetail, type Section } from "./PatientDetail"
import { PatientsBoard } from "./PatientsBoard"
import { TaskQueue } from "./TaskQueue"
import { TeamPanel } from "./TeamPanel"
import { VideoReviewPanel } from "./VideoReviewPanel"

/** Разделы куратора: подписи берутся из словаря staff. */
const CURATOR_TABS = [
  ["home", "tab.home", LayoutDashboard],
  ["queue", "tab.queue", ListTodo],
  ["patients", "tab.patients", Users],
  ["video", "tab.video", Video],
  ["content-review", "tab.contentReview", FileCheck2],
] as const

/**
 * Разделы модератора — как меню TecHR: обзор, курсы (библиотека и
 * конструктор), контент (прежние экраны модерации без изменений) и команда.
 */
const MODERATOR_TABS = [
  ["dashboard", "tab.dashboard", LayoutDashboard],
  ["courses", "tab.courses", LibraryBig],
  ["builder", "tab.builder", Blocks],
  ["library", "tab.contentLibrary", BookOpen],
  ["review", "tab.moderation", ClipboardCheck],
  ["archive", "tab.archive", Archive],
  ["team", "tab.team", UsersRound],
] as const

const CURATOR_GROUPS = [["group.work", ["home", "queue", "patients", "video", "content-review"]]] as const
const MODERATOR_GROUPS = [
  ["group.overview", ["dashboard"]],
  ["group.courses", ["courses", "builder"]],
  ["group.content", ["library", "review", "archive"]],
  ["group.team", ["team"]],
] as const

const CURATOR_IDS = CURATOR_TABS.map(([id]) => id)
const MODERATOR_IDS = MODERATOR_TABS.map(([id]) => id)

export function StaffCabinetPage() {
  const t = useT("staff")
  const text = useContent("staff")
  const { user, signOut } = useAuth()
  const role = user?.staffRole ?? "curator"
  const isModerator = role === "moderator"

  const source = isModerator ? MODERATOR_TABS : CURATOR_TABS
  const tabs: Tab[] = source.map(([id, key, icon]) => ({ id, label: t(key), icon }))
  const groups: TabGroup[] = (isModerator ? MODERATOR_GROUPS : CURATOR_GROUPS).map(([key, ids]) => ({ label: t(key), ids }))
  const [tab, setTab] = useCabinetTab(isModerator ? MODERATOR_IDS : CURATOR_IDS, isModerator ? "dashboard" : "home")

  const [tasks, setTasks] = useState<StaffTask[]>([])
  const [patients, setPatients] = useState<PatientCard[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  /** С какого раздела открыть карточку пациента: со сводки по «тяжело» — сразу на оценки. */
  const [detailSection, setDetailSection] = useState<Section>("program")
  /** Какой курс открыт в конструкторе; null — новый курс. */
  const [editingId, setEditingId] = useState<string | null>(null)
  useEffect(() => { if (!isModerator) { void getStaffPatients().then(setPatients); void getStaffTasks().then(setTasks) } }, [isModerator])
  const selected = patients.find((patient) => patient.id === selectedId) ?? null
  const openPatient = (id: string, section: Section = "program") => { setSelectedId(id); setDetailSection(section); setTab("patients") }
  const openCourse = (id: string | null) => { setEditingId(id); setTab("builder") }
  // Пункт «Конструктор» в меню — всегда новый курс; правка открывается из библиотеки
  const changeTab = (id: string) => { if (id === "builder") setEditingId(null); setTab(id) }

  const subtitle = isModerator
    ? t("subtitle.moderator")
    : t("subtitle.curator", { tasks: tasks.filter((task) => !task.done).length, patients: patients.length })

  return <CabinetShell title={t(isModerator ? "title.moderator" : "title.curator")} subtitle={subtitle} tabs={tabs} groups={groups} active={tab} onTabChange={changeTab} userName={user?.name ?? ""} roleLabel={text(STAFF_ROLE_KEY[role])} homeHref={process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"} onSignOut={signOut}>
    <DemoNotice />
    {isModerator && tab === "dashboard" && <ModeratorDashboard onOpenCourses={() => setTab("courses")} />}
    {isModerator && tab === "courses" && <CourseLibrary onEdit={openCourse} />}
    {isModerator && tab === "builder" && <CourseBuilder key={editingId ?? "new"} courseId={editingId} onBack={() => setTab("courses")} />}
    {isModerator && tab === "team" && <TeamPanel />}
    {isModerator && (tab === "library" || tab === "review" || tab === "archive") && <ModeratorContentPanel view={tab} />}
    {!isModerator && tab === "home" && <CuratorHome tasks={tasks} patients={patients} onOpen={changeTab} onOpenPatient={openPatient} />}
    {!isModerator && tab === "queue" && <TaskQueue tasks={tasks} onTasksChange={setTasks} onOpenPatient={openPatient} />}
    {!isModerator && tab === "video" && <VideoReviewPanel />}
    {!isModerator && tab === "content-review" && <ContentApprovalPanel />}
    {!isModerator && tab === "patients" && (selected ? <PatientDetail key={`${selected.id}-${detailSection}`} patient={selected} canAssign initialSection={detailSection} onBack={() => { setSelectedId(null); setDetailSection("program") }} /> : <PatientsBoard patients={patients} onOpen={(id) => openPatient(id)} />)}
  </CabinetShell>
}
