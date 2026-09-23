import type { ProgramTemplate } from '@amare/api-client'

/** Минимальная длительность курса по стандарту РК для II и III этапов. */
export const OSMS_MIN_DAYS = 14

/**
 * Пресеты длительности курса восстановления: месяц, полгода, год.
 * Дни — календарные, от них считается «день N из M» у пациента.
 */
export const DURATION_PRESETS = [
  { months: 1, days: 30 },
  { months: 6, days: 182 },
  { months: 12, days: 365 },
] as const

/** Что мешает опубликовать курс. Ключи — в словаре staff (course.issue.*). */
export type CourseIssue = 'title' | 'days' | 'exercises' | 'curators'

/**
 * Проверка курса перед публикацией.
 *
 * Черновик можно сохранить каким угодно — его никто, кроме модератора,
 * не видит. Опубликованный курс куратор назначает пациенту, поэтому у
 * него обязаны быть название, длительность, хотя бы одно упражнение и
 * хотя бы один куратор, который будет вести людей.
 *
 * Короче 14 дней — не ошибка, а предупреждение (osmsWarning): такой курс
 * бывает нужен платно, но под ОСМС не подходит.
 */
export function courseIssues(course: ProgramTemplate): CourseIssue[] {
  const issues: CourseIssue[] = []
  if (!course.title.trim()) issues.push('title')
  if (!(course.days > 0)) issues.push('days')
  if (exerciseCount(course) === 0) issues.push('exercises')
  if (!course.curatorIds?.length) issues.push('curators')
  return issues
}

export function osmsWarning(days: number): boolean {
  return days > 0 && days < OSMS_MIN_DAYS
}

/** Сколько упражнений в курсе — для карточки в библиотеке. */
export function exerciseCount(course: ProgramTemplate): number {
  return (course.stages ?? []).reduce((sum, stage) => sum + stage.exercises.length, 0)
}

/** Курс без статуса — из библиотеки до конструктора, он уже в работе. */
export function isPublished(course: ProgramTemplate): boolean {
  return course.status !== 'draft'
}
