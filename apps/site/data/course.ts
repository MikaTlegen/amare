import { CLINIC, PRICES } from '@/lib/clinic'

export interface CourseStep {
  n: string
  title: string
  short: string
  full: string
  price?: string
}

/** Пять шагов — как клиника описывает процесс на своём сайте. */
export const COURSE_STEPS: CourseStep[] = [
  {
    n: '01',
    title: 'Диагностика',
    short: 'Осмотр МДГ, шкалы',
    full: 'Осмотр мультидисциплинарной группы, международные шкалы, оценка реабилитационного потенциала.',
    price: PRICES.consultation,
  },
  {
    n: '02',
    title: 'Программа',
    short: 'Цели и расписание',
    full: 'Цели по МКФ, расписание процедур на каждый день, состав специалистов под конкретные дефициты.',
  },
  {
    n: '03',
    title: 'Курс 10–20 дней',
    short: 'Разбор динамики',
    full: 'Занятия по расписанию и еженедельный разбор динамики с куратором. Родственники получают фото- и видеоотчёты.',
    price: PRICES.course,
  },
  {
    n: '04',
    title: 'Оценка результата',
    short: 'Заключение на руки',
    full: 'Повторные шкалы, письменное заключение и рекомендации на руки — с ними можно идти дальше по маршруту.',
  },
  {
    n: '05',
    title: 'Поддержка после курса',
    short: 'Программа и куратор',
    full: 'Домашняя программа в кабинете, чат с куратором, видеоразбор упражнений и напоминание о переоценке.',
  },
]

export interface Format {
  title: string
  price: string
  note: string
  /** Какой формат приёма предвыбрать на странице записи. */
  bookingFormat: 'clinic' | 'online' | 'home'
}

export const FORMATS: Format[] = [
  {
    title: 'Амбулаторно',
    price: PRICES.course,
    note: 'Основной формат: приходите на занятия по расписанию.',
    bookingFormat: 'clinic',
  },
  {
    title: 'Дневной стационар',
    price: PRICES.dayHospital,
    note: 'Палата на день, если нужен отдых между процедурами.',
    bookingFormat: 'clinic',
  },
  {
    title: 'Выезд на дом',
    price: PRICES.homeVisit,
    note: 'Для лежачих пациентов и тех, кому тяжело добраться.',
    bookingFormat: 'home',
  },
  {
    title: 'Онлайн-консультация',
    price: PRICES.online,
    note: 'Для иногородних: оценка и домашняя программа.',
    bookingFormat: 'online',
  },
]

/** Короткие факты для полосы под первым экраном. */
export const FACTS = [
  {
    value: `${CLINIC.rating.value} на ${CLINIC.rating.source}`,
    note: `${CLINIC.rating.reviews} оценок`,
  },
  { value: '10 специалистов', note: 'одна команда' },
  { value: PRICES.course, note: 'курс 10–14 дней' },
  { value: 'ОСМС и ДМС', note: 'или платно' },
]
