export interface CourseStep {
  /** Номер шага. Он же часть ключа в словаре course: `step.<n>.title`. */
  n: string
  /** Ключ цены в словаре prices. Без него шаг входит в стоимость курса. */
  priceKey?: 'consultation' | 'course'
}

/**
 * Пять шагов — как клиника описывает процесс на своём сайте.
 * Текст переехал в @amare/i18n (namespace course).
 */
export const COURSE_STEPS: CourseStep[] = [
  { n: '01', priceKey: 'consultation' },
  { n: '02' },
  { n: '03', priceKey: 'course' },
  { n: '04' },
  { n: '05' },
]

export interface Format {
  /** Он же часть ключа в словаре course: `format.<id>.title`. */
  id: 'clinic' | 'dayHospital' | 'home' | 'online'
  priceKey: 'course' | 'dayHospital' | 'homeVisit' | 'online'
  /** Какой формат приёма предвыбрать на странице записи. */
  bookingFormat: 'clinic' | 'online' | 'home'
}

export const FORMATS: Format[] = [
  { id: 'clinic', priceKey: 'course', bookingFormat: 'clinic' },
  { id: 'dayHospital', priceKey: 'dayHospital', bookingFormat: 'clinic' },
  { id: 'home', priceKey: 'homeVisit', bookingFormat: 'home' },
  { id: 'online', priceKey: 'online', bookingFormat: 'online' },
]
