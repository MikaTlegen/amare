import type {
  CareTask,
  DayPlan,
  GuardianLesson,
  Medication,
  MedicationLog,
  Message,
  PatientCard,
  VitalEntry,
} from '@amare/api-client'

/**
 * Расчёты для карточек сводки («Главная» пациента и «Подопечный» опекуна).
 *
 * Карточка показывает коротко одно главное число, а полная картина —
 * в разделе, куда она ведёт. Поэтому здесь только чистые функции
 * от тех же данных, что видят разделы: сводка не может разойтись
 * с тем, что человек увидит, открыв раздел.
 */

/** Целевой коридор давления. TODO M8: индивидуальные цели задаёт врач. */
export const PRESSURE_TARGET = { systolic: 140, diastolic: 90 } as const

export function isAboveTarget(entry: Pick<VitalEntry, 'systolic' | 'diastolic'>): boolean {
  return entry.systolic > PRESSURE_TARGET.systolic || entry.diastolic > PRESSURE_TARGET.diastolic
}

export interface PlanSummary {
  done: number
  total: number
  minutesLeft: number
}

export function planSummary(plan: DayPlan): PlanSummary {
  const done = plan.exercises.filter((e) => e.status === 'done')
  const minutesLeft = plan.exercises
    .filter((e) => e.status !== 'done')
    .reduce((sum, e) => sum + e.minutes, 0)
  return { done: done.length, total: plan.exercises.length, minutesLeft }
}

export interface MissedDose {
  title: string
  /** «сегодня» / «вчера» — как в истории приёмов. */
  day: string
  planned: string
}

export interface MedsSummary {
  taken: number
  total: number
  /** Пропуски сегодня и за прошлые дни — всё, о чём стоит сказать куратору. */
  missed: MissedDose[]
}

export function medsSummary(today: Medication[], history: MedicationLog[], todayLabel: string): MedsSummary {
  const missedToday = today
    .filter((item) => item.state === 'missed')
    .map((item) => ({ title: item.title, day: todayLabel, planned: item.at }))
  const missedBefore = history
    .filter((log) => log.state === 'missed')
    .map((log) => ({ title: log.title, day: log.day, planned: log.planned }))

  return {
    taken: today.filter((item) => item.state === 'taken').length,
    total: today.length,
    missed: [...missedToday, ...missedBefore],
  }
}

export function lastVital(vitals: VitalEntry[]): VitalEntry | null {
  return vitals[0] ?? null
}

export interface BarthelSummary {
  last: number
  gain: number
}

export function barthelSummary(card: PatientCard): BarthelSummary | null {
  const first = card.barthel[0]
  const last = card.barthel.at(-1)
  if (!first || !last) return null
  return { last: last.barthel, gain: last.barthel - first.barthel }
}

/** Последнее сообщение куратора — «есть ли что прочитать». */
export function lastCuratorMessage(messages: Message[]): Message | null {
  return messages.findLast((message) => message.author === 'curator') ?? null
}

export function careSummary(tasks: CareTask[]): { done: number; total: number } {
  return { done: tasks.filter((task) => task.doneAt).length, total: tasks.length }
}

export function schoolSummary(lessons: GuardianLesson[]): { done: number; total: number } {
  return { done: lessons.filter((lesson) => lesson.done).length, total: lessons.length }
}
