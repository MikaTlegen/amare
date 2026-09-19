export interface Doctor {
  /** Ключи текста в словаре doctors — `<id>.name`, `<id>.role` и т. д. */
  id: string
  /** Фото с сайта клиники. null — портрета пока нет, рисуем плейсхолдер. */
  photo: string | null
  /** Опубликованные клиникой документы: подпись лежит в словаре по ключу. */
  certificates: DoctorCertificate[]
  /**
   * Состояния, с которыми работает специалист.
   * По этим меткам блок «С какими состояниями работаем» ведёт
   * на карточки нужных врачей.
   */
  conditions: ConditionId[]
}

export interface DoctorCertificate {
  /** Ключ подписи в словаре doctors. */
  labelKey: string
  href: string
}

export type ConditionId = 'ischemic' | 'hemorrhagic' | 'tbi' | 'postop' | 'cp'

/**
 * TODO CRM: заменить на `fetch('/api/doctors')` — список, стаж, сертификаты
 * и расписание ведутся в админке (модуль M2 ТЗ), а не в коде.
 * Пока это фолбэк-данные из открытых источников клиники.
 *
 * Текст переехал в @amare/i18n (namespace doctors): здесь остались порядок,
 * фотографии и связь со состояниями.
 */
export const DOCTORS: Doctor[] = [
  {
    id: 'kuspanova',
    photo: '/photos/doctor-kuspanova.webp',
    certificates: [{ labelKey: 'kuspanova.cert', href: '/certificates/kuspanova.webp' }],
    conditions: ['ischemic', 'hemorrhagic', 'tbi', 'postop'],
  },
  {
    id: 'ahaaga',
    photo: '/photos/doctor-ahaaga.webp',
    certificates: [{ labelKey: 'ahaaga.cert', href: '/certificates/ahaaga.pdf' }],
    conditions: ['ischemic', 'hemorrhagic', 'tbi'],
  },
  {
    id: 'zhumabekova',
    photo: '/photos/doctor-zhumabekova.png',
    certificates: [{ labelKey: 'zhumabekova.cert', href: '/certificates/zhumabekova.pdf' }],
    conditions: ['ischemic', 'hemorrhagic', 'postop', 'cp'],
  },
  {
    id: 'moldabekov',
    photo: '/photos/doctor-moldabekov.png',
    certificates: [],
    conditions: ['hemorrhagic', 'tbi', 'postop'],
  },
  {
    id: 'niyazbekova',
    photo: '/photos/doctor-niyazbekova.png',
    certificates: [],
    conditions: ['ischemic', 'hemorrhagic', 'tbi', 'cp'],
  },
]

/**
 * Состояния пациентов. Каждое ведёт на страницу врачей
 * с фильтром по этому состоянию.
 */
export const CONDITION_LIST: ConditionId[] = [
  'ischemic',
  'hemorrhagic',
  'tbi',
  'postop',
  'cp',
]
