import type { PatientCard } from '@amare/api-client'

/** Светофор из W-01 ТЗ. */
export type PatientStatus = 'red' | 'orange' | 'green'

/** Дней без занятий в неделю, после которых пациент перестаёт быть «по плану». */
const MISSED_DAYS_LIMIT = 2

export const STATUS_LABEL: Record<PatientStatus, string> = {
  red: 'Критический сигнал',
  orange: 'Требует внимания',
  green: 'По плану',
}

/** Цвет рамки карточки и точки в списке. Держим рядом, чтобы не разъехались. */
export const STATUS_STYLE: Record<PatientStatus, { border: string; dot: string }> = {
  red: { border: 'border-[rgb(179,38,30)]', dot: 'bg-[rgb(179,38,30)]' },
  orange: { border: 'border-accent', dot: 'bg-accent' },
  green: { border: 'border-line', dot: 'bg-brand' },
}

/**
 * Статус пациента для дашборда «Мои пациенты» (W-01 ТЗ).
 *
 * Красный — критический алерт: им занимаются сейчас. Оранжевый —
 * предупреждение или пропуски: разбирают в течение дня. Зелёный — по
 * плану. Правило намеренно простое и читается с одного взгляда; тонкая
 * настройка порогов — дело движка правил (M8), а не дашборда.
 */
export function patientStatus(patient: PatientCard): PatientStatus {
  if (patient.alerts.some((alert) => alert.level === 'danger')) return 'red'

  const missedDays = patient.weekMinutes.filter((minutes) => minutes === 0).length
  if (patient.alerts.some((alert) => alert.level === 'warn')) return 'orange'
  if (missedDays >= MISSED_DAYS_LIMIT) return 'orange'

  return 'green'
}

/** Порядок сортировки: срочные наверх. */
export const STATUS_ORDER: Record<PatientStatus, number> = { red: 0, orange: 1, green: 2 }
