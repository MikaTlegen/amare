import {
  DEMO_ACCESS_LOG,
  DEMO_CARE_TASKS,
  DEMO_CONSENTS,
  DEMO_DAY_PLAN,
  DEMO_GUARDIAN_LESSONS,
  DEMO_MATERIALS,
  DEMO_MEDICATIONS,
  DEMO_MESSAGES,
  DEMO_PATIENT,
  DEMO_USERS,
  DEMO_VITALS,
  detectKind,
  formatSize,
  type AccessLogEntry,
  type CareTask,
  type Consent,
  type DayPlan,
  type GuardianLesson,
  type Material,
  type Medication,
  type MedicationState,
  type Message,
  type PatientCard,
  type Role,
  type User,
  type VitalEntry,
} from '@amare/api-client'

/**
 * Мок-клиент кабинета пациента и опекуна.
 *
 * Перенос из api/client.ts наброска amare-site, урезанный до того, что
 * нужно care (без рабочего места специалиста — оно в apps/staff).
 *
 * Состояние живёт в памяти вкладки и не сохраняется между приложениями:
 * care и staff — разные процессы, между ними нет общего бэкенда (см.
 * docs/DECISIONS.md). Медицинские данные не оседают в localStorage —
 * там хранится только факт демо-сессии (см. auth/AuthContext.tsx).
 */

const LATENCY = 260

function delay<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

let dayPlan: DayPlan = structuredClone(DEMO_DAY_PLAN)
let messages: Message[] = structuredClone(DEMO_MESSAGES)

/** Сброс демо-данных при выходе, чтобы следующий показ начинался с нуля. */
export function resetMockState() {
  dayPlan = structuredClone(DEMO_DAY_PLAN)
  messages = structuredClone(DEMO_MESSAGES)
  vitals = structuredClone(DEMO_VITALS)
  medications = structuredClone(DEMO_MEDICATIONS)
  careTasks = structuredClone(DEMO_CARE_TASKS)
  lessons = structuredClone(DEMO_GUARDIAN_LESSONS)
}

export type CareRole = Extract<Role, 'patient' | 'guardian'>

/**
 * Демо-вход по роли.
 *
 * TODO AUTH: заменить на вход по телефону с кодом из SMS. Токен должен
 * приходить в httpOnly-cookie, а не в localStorage — иначе его достанет
 * любой XSS. Роль приходит с сервера, клиент её не выбирает: сейчас это
 * допустимо только потому, что данных нет.
 */
export async function signInAs(role: CareRole): Promise<User> {
  const user = DEMO_USERS[role]
  if (!user) throw new Error(`Нет демо-пользователя для роли ${role}`)
  return delay(user)
}

export async function getDayPlan(): Promise<DayPlan> {
  return delay(dayPlan)
}

/** Отметить упражнение выполненным. Возвращает обновлённый план. */
export async function completeExercise(id: string): Promise<DayPlan> {
  const exists = dayPlan.exercises.some((e) => e.id === id)
  if (exists) {
    // Следующее невыполненное становится текущим.
    let promoteNext = true
    const exercises = dayPlan.exercises.map((e) => {
      if (e.id === id) return { ...e, status: 'done' as const }
      if (promoteNext && e.status === 'todo') {
        promoteNext = false
        return { ...e, status: 'now' as const }
      }
      return e
    })
    dayPlan = { ...dayPlan, exercises }
  }
  return delay(dayPlan)
}

export async function getPatientCard(): Promise<PatientCard> {
  return delay(DEMO_PATIENT)
}

export async function getMessages(): Promise<Message[]> {
  return delay(messages)
}

/**
 * Отправка сообщения куратору с вложениями.
 *
 * TODO BACKEND: сейчас файл никуда не уходит — берём только имя, размер
 * и тип. В бою: загрузка на собственное хранилище в РК, проверка типа
 * и размера НА СЕРВЕРЕ (клиентскую проверку легко обойти), антивирус,
 * а выдача — по временной подписанной ссылке, не по прямому URL.
 */
export async function sendMessage(text: string, files: File[] = []): Promise<Message[]> {
  const attachments = files.map((file, i) => ({
    id: `a-${Date.now()}-${i}`,
    name: file.name,
    kind: detectKind(file),
    size: formatSize(file.size),
    at: 'только что',
    by: 'patient' as const,
    patientId: DEMO_PATIENT.id,
  }))

  messages = [
    ...messages,
    {
      id: `m-${Date.now()}`,
      author: 'me',
      authorName: 'Вы',
      text,
      at: 'только что',
      ...(attachments.length ? { attachments } : {}),
    },
  ]
  return delay(messages, 160)
}

/* ------------------------------------------------------------------ *
 * Дневник, лекарства, материалы, документы (M5) и кабинет опекуна (M6)
 * ------------------------------------------------------------------ */

let vitals: VitalEntry[] = structuredClone(DEMO_VITALS)
let medications: Medication[] = structuredClone(DEMO_MEDICATIONS)
let careTasks: CareTask[] = structuredClone(DEMO_CARE_TASKS)
let lessons: GuardianLesson[] = structuredClone(DEMO_GUARDIAN_LESSONS)

export async function getVitals(): Promise<VitalEntry[]> {
  return delay(vitals)
}

/**
 * Новая запись дневника.
 *
 * `byGuardian` — не косметика: по G-03 ТЗ видно, кто внёс значение.
 * Показатель, измеренный родственником по телефону, и показатель,
 * снятый самим пациентом, врач читает по-разному.
 */
export async function addVital(
  entry: Omit<VitalEntry, 'id' | 'at'>,
  byGuardian = false,
): Promise<VitalEntry[]> {
  vitals = [
    {
      ...entry,
      id: `v-${Date.now()}`,
      at: 'только что',
      ...(byGuardian ? { byGuardian: true } : {}),
    },
    ...vitals,
  ]
  return delay(vitals, 160)
}

export async function getMedications(): Promise<Medication[]> {
  return delay(medications)
}

export async function setMedicationState(
  id: string,
  state: MedicationState,
): Promise<Medication[]> {
  medications = medications.map((item) => (item.id === id ? { ...item, state } : item))
  return delay(medications, 140)
}

export async function getMaterials(): Promise<Material[]> {
  return delay(DEMO_MATERIALS)
}

export async function getConsents(): Promise<Consent[]> {
  return delay(DEMO_CONSENTS)
}

export async function getAccessLog(): Promise<AccessLogEntry[]> {
  return delay(DEMO_ACCESS_LOG)
}

export async function getCareTasks(): Promise<CareTask[]> {
  return delay(careTasks)
}

/** Отметка ухода. Повторная отметка снимает предыдущую — это чек-лист смены. */
export async function toggleCareTask(id: string, at: string): Promise<CareTask[]> {
  careTasks = careTasks.map((task) =>
    task.id === id ? { ...task, doneAt: task.doneAt ? null : at } : task,
  )
  return delay(careTasks, 140)
}

export async function getGuardianLessons(): Promise<GuardianLesson[]> {
  return delay(lessons)
}

export async function toggleLesson(id: string): Promise<GuardianLesson[]> {
  lessons = lessons.map((lesson) =>
    lesson.id === id ? { ...lesson, done: !lesson.done } : lesson,
  )
  return delay(lessons, 140)
}
