import {
  DEMO_DOCUMENTS,
  DEMO_MESSAGES,
  DEMO_PROGRAMS,
  DEMO_STAFF_PATIENTS,
  DEMO_STAFF_TASKS,
  DEMO_USERS,
  PROGRAM_TEMPLATES,
  detectKind,
  formatSize,
  type AssignedProgram,
  type Attachment,
  type Message,
  type PatientCard,
  type ProgramTemplate,
  type StaffTask,
  type User,
} from '@amare/api-client'

/**
 * Мок-клиент рабочего места специалиста.
 *
 * Перенос из api/client.ts наброска amare-site, часть про специалиста.
 * Состояние живёт в памяти вкладки и не сохраняется между приложениями:
 * staff и care — разные процессы, между ними нет общего бэкенда (см.
 * docs/DECISIONS.md). Назначение программы или сообщение из staff НЕ
 * появится в care без перезагрузки страницы care — это сознательное
 * ограничение демо-режима, а не баг.
 */

const LATENCY = 260

function delay<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

let staffTasks: StaffTask[] = structuredClone(DEMO_STAFF_TASKS)
let documents: Attachment[] = structuredClone(DEMO_DOCUMENTS)
let programs: AssignedProgram[] = structuredClone(DEMO_PROGRAMS)
/** Переписка по пациентам: id пациента → сообщения. У демо-пациента p-1 — та же история, что в care. */
let messagesByPatient: Record<string, Message[]> = { 'p-1': structuredClone(DEMO_MESSAGES) }

/** Сброс демо-данных при выходе, чтобы следующий показ начинался с нуля. */
export function resetMockState() {
  staffTasks = structuredClone(DEMO_STAFF_TASKS)
  documents = structuredClone(DEMO_DOCUMENTS)
  programs = structuredClone(DEMO_PROGRAMS)
  messagesByPatient = { 'p-1': structuredClone(DEMO_MESSAGES) }
}

/**
 * Демо-вход специалиста.
 *
 * TODO AUTH: заменить на вход по телефону с кодом из SMS, как в care.
 * Роль приходит с сервера, клиент её не выбирает.
 */
export async function signInAsStaff(): Promise<User> {
  const user = DEMO_USERS.staff
  if (!user) throw new Error('Нет демо-пользователя для роли staff')
  return delay(user)
}

export async function getStaffTasks(): Promise<StaffTask[]> {
  return delay(staffTasks)
}

export async function closeTask(id: string): Promise<StaffTask[]> {
  staffTasks = staffTasks.map((t) => (t.id === id ? { ...t, done: true } : t))
  return delay(staffTasks, 160)
}

export async function getStaffPatients(): Promise<PatientCard[]> {
  return delay(DEMO_STAFF_PATIENTS)
}

export async function getPatientDocuments(patientId: string): Promise<Attachment[]> {
  return delay(documents.filter((d) => d.patientId === patientId))
}

export async function uploadPatientDocument(patientId: string, files: File[]): Promise<Attachment[]> {
  const added: Attachment[] = files.map((file, i) => ({
    id: `a-${Date.now()}-${i}`,
    name: file.name,
    kind: detectKind(file),
    size: formatSize(file.size),
    at: 'только что',
    by: 'staff',
    patientId,
  }))
  documents = [...documents, ...added]
  return delay(
    documents.filter((d) => d.patientId === patientId),
    200,
  )
}

export async function getProgramTemplates(): Promise<ProgramTemplate[]> {
  return delay(PROGRAM_TEMPLATES)
}

export async function getPatientPrograms(patientId: string): Promise<AssignedProgram[]> {
  return delay(programs.filter((p) => p.patientId === patientId))
}

/**
 * Назначение программы пациенту.
 *
 * TODO BACKEND: назначать курс вправе только специалист с нужной ролью,
 * и проверять это обязан сервер. Плюс сервер пишет, кто и когда назначил:
 * это медицинская запись, она должна быть неизменяемой и с историей.
 */
export async function assignProgram(input: {
  patientId: string
  templateId: string
  startAt: string
  comment: string
  assignedBy: string
}): Promise<AssignedProgram[]> {
  const template = PROGRAM_TEMPLATES.find((t) => t.id === input.templateId)
  if (!template) return delay(programs.filter((p) => p.patientId === input.patientId))

  programs = [
    ...programs,
    {
      id: `pr-${Date.now()}`,
      patientId: input.patientId,
      title: template.title,
      days: template.days,
      startAt: input.startAt || 'дата не указана',
      comment: input.comment,
      assignedBy: input.assignedBy,
      assignedAt: 'только что',
    },
  ]

  return delay(
    programs.filter((p) => p.patientId === input.patientId),
    350,
  )
}

export async function getPatientMessages(patientId: string): Promise<Message[]> {
  return delay(messagesByPatient[patientId] ?? [])
}

export async function sendPatientMessage(
  patientId: string,
  text: string,
  files: File[] = [],
): Promise<Message[]> {
  const attachments = files.map((file, i) => ({
    id: `a-${Date.now()}-${i}`,
    name: file.name,
    kind: detectKind(file),
    size: formatSize(file.size),
    at: 'только что',
    by: 'staff' as const,
    patientId,
  }))

  // Файлы, присланные в переписке, попадают и в документы пациента —
  // специалист не должен листать переписку, чтобы найти выписку.
  documents = [...documents, ...attachments]

  const current = messagesByPatient[patientId] ?? []
  const next = [
    ...current,
    {
      id: `m-${Date.now()}`,
      author: 'me' as const,
      authorName: 'Вы',
      text,
      at: 'только что',
      ...(attachments.length ? { attachments } : {}),
    },
  ]
  messagesByPatient = { ...messagesByPatient, [patientId]: next }
  return delay(next, 160)
}
