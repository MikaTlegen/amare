export interface Doctor {
  /** Ключи текста в словаре doctors — `<id>.name`, `<id>.role` и т. д. */
  id: string
  /** Фото с сайта клиники. null — портрета пока нет, рисуем плейсхолдер. */
  photo: string | null
  /** Опубликованные клиникой документы: подпись лежит в словаре по ключу. */
  /**
   * Снимки «до курса» и «после курса» для блока в профиле.
   *
   * Сейчас это фотографии самой клиники из public/photos — показать, как блок
   * выглядит. Снимков пациентов здесь быть не может без письменного согласия,
   * поэтому блок подписан «пример оформления».
   */
  showcase?: { before: string; after: string }
  /**
   * Тот же человек в CRM: по нему берутся свободные окна и создаётся запись.
   * Список id — GET /api/public/booking/<uuid>/, поле specialists.
   */
  crmSpecialistId?: number
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
    crmSpecialistId: 364667,
    showcase: { before: '/photos/hand-therapy.jpg', after: '/photos/fine-motor.jpg' },
    photo: '/photos/doctor-kuspanova.webp',
    certificates: [{ labelKey: 'kuspanova.cert', href: '/certificates/kuspanova.webp' }],
    conditions: ['ischemic', 'hemorrhagic', 'tbi', 'postop'],
  },
  {
    id: 'ahaaga',
    crmSpecialistId: 364668,
    showcase: { before: '/photos/hospital-drip.jpg', after: '/photos/equipment.jpg' },
    photo: '/photos/doctor-ahaaga.webp',
    certificates: [{ labelKey: 'ahaaga.cert', href: '/certificates/ahaaga.pdf' }],
    conditions: ['ischemic', 'hemorrhagic', 'tbi'],
  },
  {
    id: 'zhumabekova',
    crmSpecialistId: 364664,
    showcase: { before: '/photos/hand-device.jpg', after: '/photos/hand-therapy.jpg' },
    photo: '/photos/doctor-zhumabekova.png',
    certificates: [{ labelKey: 'zhumabekova.cert', href: '/certificates/zhumabekova.pdf' }],
    conditions: ['ischemic', 'hemorrhagic', 'postop', 'cp'],
  },
  {
    id: 'moldabekov',
    crmSpecialistId: 364669,
    showcase: { before: '/photos/equipment.jpg', after: '/photos/hand-device.jpg' },
    photo: '/photos/doctor-moldabekov.png',
    certificates: [],
    conditions: ['hemorrhagic', 'tbi', 'postop'],
  },
  {
    id: 'niyazbekova',
    crmSpecialistId: 364665,
    showcase: { before: '/photos/fine-motor.jpg', after: '/photos/healthy-plate.jpg' },
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
