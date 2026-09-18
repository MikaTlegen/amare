import {
  DEMO_DAY_PLAN,
  DEMO_MESSAGES,
  DEMO_PATIENT,
  DEMO_USERS,
  detectKind,
  formatSize,
  type DayPlan,
  type Message,
  type PatientCard,
  type Role,
  type User,
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
