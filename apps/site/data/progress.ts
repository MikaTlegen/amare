/**
 * Динамика индекса Бартел за курс.
 *
 * ВАЖНО. Это демонстрационный ряд для вёрстки, а не данные пациента.
 * Публиковать реальную динамику можно только с письменного согласия
 * на использование кейса (требование S-08 ТЗ).
 *
 * TODO CRM: подставить агрегаты и конкретные истории из модуля M10.
 */
export interface ProgressPoint {
  day: string
  barthel: number
}

export const DEMO_PROGRESS: ProgressPoint[] = [
  { day: 'День 1', barthel: 25 },
  { day: 'День 5', barthel: 40 },
  { day: 'День 10', barthel: 55 },
  { day: 'День 15', barthel: 70 },
  { day: 'День 20', barthel: 80 },
]

export const PROGRESS_SUMMARY = {
  before: 'Не садился без помощи',
  after: 'Ходит с тростью, ест сам',
  averageGain: '+[X] баллов',
  completionRate: '[X]%',
}
