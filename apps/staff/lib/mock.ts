import {
  DEMO_DOCUMENTS,
  DEMO_MESSAGES,
  DEMO_PROGRAMS,
  DEMO_STAFF_PATIENTS,
  DEMO_STAFF_TASKS,
  DEMO_USERS,
  DEMO_VIDEO_REVIEWS,
  PROGRAM_TEMPLATES,
  detectKind,
  formatSize,
  type AssignedProgram,
  type Attachment,
  type Message,
  type PatientCard,
  type ProgramTemplate,
  type StaffRole,
  type StaffTask,
  type User,
  type VideoReview,
  type VideoVerdict,
  type WeeklyReview,
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
  videoReviews = structuredClone(DEMO_VIDEO_REVIEWS)
  weeklySent = {}
  templates = structuredClone(PROGRAM_TEMPLATES)
}

/**
 * Демо-вход специалиста.
 *
 * Роль выбирается кнопкой только в демо. В бою она приходит с сервера:
 * клиент не должен иметь возможности назвать себя админом.
 *
 * TODO AUTH: заменить на вход по телефону с кодом из SMS, как в care.
 */
export async function signInAsStaff(role: StaffRole): Promise<User> {
  const user = role === 'admin' ? DEMO_USERS.admin : DEMO_USERS.staff
  if (!user) throw new Error(`Нет демо-пользователя для роли `)
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

/* ------------------------------------------------------------------ *
 * Проверка видео (W-03) и еженедельный разбор (W-05)
 * ------------------------------------------------------------------ */

let videoReviews: VideoReview[] = structuredClone(DEMO_VIDEO_REVIEWS)
/** Отправленные разборы: id пациента → когда отправлен. */
let weeklySent: Record<string, string> = {}

export async function getVideoReviews(): Promise<VideoReview[]> {
  return delay(videoReviews)
}

/**
 * Оценка техники по видео.
 *
 * Вердикт и комментарий сохраняются вместе: «неверно» без объяснения
 * человек после инсульта читает как «у меня не получается», и это
 * прямой путь к тому, что он бросит заниматься.
 */
export async function reviewVideo(
  id: string,
  verdict: VideoVerdict,
  comment: string,
): Promise<VideoReview[]> {
  videoReviews = videoReviews.map((item) =>
    item.id === id ? { ...item, verdict, comment } : item,
  )
  return delay(videoReviews, 160)
}

/**
 * Черновик еженедельного разбора (W-05).
 *
 * Факты собираются автоматически из того, что уже есть в карте:
 * выполнение плана, минуты практики, тревожные сигналы. Текст письма
 * специалист дописывает сам — автоматическое письмо пациенту от имени
 * врача отправлять нельзя.
 */
export async function getWeeklyReview(patient: PatientCard): Promise<WeeklyReview> {
  const minutes = patient.weekMinutes.reduce((sum, value) => sum + value, 0)
  const missedDays = patient.weekMinutes.filter((value) => value === 0).length
  const first = patient.barthel[0]
  const last = patient.barthel[patient.barthel.length - 1]
  const gain = first && last ? last.barthel - first.barthel : 0

  const facts = [
    `Практика за неделю: ${minutes} минут`,
    missedDays === 0 ? 'Пропусков нет' : `Дней без занятий: ${missedDays}`,
    `Индекс Бартел: ${last?.barthel ?? '—'} (${gain >= 0 ? '+' : ''}${gain} за курс)`,
    `День курса: ${patient.courseDay} из ${patient.courseLength}`,
    ...patient.alerts.map((alert) => `Сигнал: ${alert.text}`),
  ]

  return delay({
    patientId: patient.id,
    facts,
    draft: [
      `${patient.name}, здравствуйте. Итоги недели:`,
      '',
      ...facts.map((fact) => `— ${fact}`),
      '',
      'Что меняем на следующей неделе: ',
    ].join('\n'),
    sentAt: weeklySent[patient.id] ?? null,
  })
}

export async function sendWeeklyReview(patientId: string): Promise<string> {
  const at = 'только что'
  weeklySent = { ...weeklySent, [patientId]: at }
  return delay(at, 200)
}

/* ------------------------------------------------------------------ *
 * Шаблоны курсов: их ведёт администратор (M4 ТЗ)
 * ------------------------------------------------------------------ */

let templates: ProgramTemplate[] = structuredClone(PROGRAM_TEMPLATES)

export async function getEditableTemplates(): Promise<ProgramTemplate[]> {
  return delay(templates)
}

/**
 * Добавление шаблона курса.
 *
 * Проверка длительности живёт здесь, а не только в форме: по стандарту
 * РК курс короче 14 дней не годится для II и III этапов, и шаблон на
 * 10 дней обязан нести об этом пометку, в какой бы форме его ни завели.
 */
export async function addTemplate(
  draft: Omit<ProgramTemplate, 'id'>,
): Promise<ProgramTemplate[]> {
  const note =
    draft.days < 14 && !draft.note
      ? 'Вне ОСМС: стандарт РК требует не менее 14 дней на II–III этапах.'
      : draft.note

  templates = [...templates, { ...draft, note, id: `tpl-${Date.now()}` }]
  return delay(templates, 200)
}
