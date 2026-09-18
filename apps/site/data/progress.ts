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

/**
 * Агрегаты по клинике.
 *
 * null означает «цифры ещё нет» — блок с ней не рисуется. Раньше здесь
 * стояли строки «+[X] баллов» и «[X]%», и они доезжали до посетителя:
 * на медицинском сайте это выглядит как неработающий шаблон, а не как
 * заметка для разработчика.
 */
export const PROGRESS_SUMMARY: {
  before: string
  after: string
  averageGain: string | null
  completionRate: string | null
} = {
  before: 'Не садился без помощи',
  after: 'Ходит с тростью, ест сам',
  averageGain: null, // TODO M10: средний прирост индекса Бартел за курс
  completionRate: null, // TODO M10: доля пациентов, дошедших до конца курса
}
