export interface Doctor {
  id: string
  name: string
  role: string
  experience: string
  /** Одно-два предложения о квалификации. */
  about?: string
  /** Фото с сайта клиники. null — портрета пока нет, рисуем плейсхолдер. */
  photo: string | null
  /** Опубликованные клиникой документы. */
  certificates: DoctorCertificate[]
  /**
   * Состояния, с которыми работает специалист.
   * По этим меткам блок «С какими состояниями работаем» ведёт
   * на карточки нужных врачей.
   */
  conditions: ConditionId[]
}

export interface DoctorCertificate {
  label: string
  href: string
}

export type ConditionId = 'ischemic' | 'hemorrhagic' | 'tbi' | 'postop' | 'cp'

/**
 * TODO CRM: заменить на `fetch('/api/doctors')` — список, стаж, сертификаты
 * и расписание ведутся в админке (модуль M2 ТЗ), а не в коде.
 * Пока это фолбэк-данные из открытых источников клиники.
 */
export const DOCTORS: Doctor[] = [
  {
    id: 'kuspanova',
    name: 'Куспанова Айгуль Нургалиевна',
    role: 'Врач-реабилитолог',
    experience: '15 лет стажа',
    about: 'Врач-реабилитолог с более чем 15-летним опытом работы, магистр в сфере здравоохранения.',
    photo: '/photos/doctor-kuspanova.webp',
    certificates: [{ label: 'Сертификат', href: '/certificates/kuspanova.webp' }],
    conditions: ['ischemic', 'hemorrhagic', 'tbi', 'postop'],
  },
  {
    id: 'ahaaga',
    name: 'Ахаага Сайра',
    role: 'Невропатолог',
    experience: '25 лет стажа',
    about:
      'Врач-невролог высшей квалификационной категории. Диагностика, лечение и профилактика заболеваний нервной системы у взрослых.',
    photo: '/photos/doctor-ahaaga.webp',
    certificates: [{ label: 'Сертификат высшей категории', href: '/certificates/ahaaga.pdf' }],
    conditions: ['ischemic', 'hemorrhagic', 'tbi'],
  },
  {
    id: 'zhumabekova',
    name: 'Жумабекова Индира Кайратовна',
    role: 'Врач-реабилитолог',
    experience: '10+ лет стажа',
    about:
      'Магистр медицинских наук, реабилитолог второй квалификационной категории и преподаватель кафедры реабилитологии и спортивной медицины МУА.',
    photo: '/photos/doctor-zhumabekova.png',
    certificates: [{ label: 'Сертификат', href: '/certificates/zhumabekova.pdf' }],
    conditions: ['ischemic', 'hemorrhagic', 'postop', 'cp'],
  },
  {
    id: 'moldabekov',
    name: 'Молдабеков Айдос Есимханович',
    role: 'Нейрохирург',
    experience: '18 лет стажа',
    about: 'Врач-нейрохирург высшей квалификационной категории. Общий практический стаж работы — 18 лет.',
    photo: '/photos/doctor-moldabekov.png',
    certificates: [],
    conditions: ['hemorrhagic', 'tbi', 'postop'],
  },
  {
    id: 'niyazbekova',
    name: 'Ниязбекова Каламкас Артыкбаевна',
    role: 'Психолог, дефектолог, нейропсихолог',
    experience: '10 лет стажа',
    about:
      'Проводит индивидуальную работу по психологическому, дефектологическому и нейропсихологическому направлениям с учётом особенностей пациента.',
    photo: '/photos/doctor-niyazbekova.png',
    certificates: [],
    conditions: ['ischemic', 'hemorrhagic', 'tbi', 'cp'],
  },
]

/**
 * Состояния пациентов. Каждое ведёт на страницу врачей
 * с фильтром по этому состоянию.
 */
export const CONDITION_LIST: { id: ConditionId; label: string }[] = [
  { id: 'ischemic', label: 'Ишемический инсульт' },
  { id: 'hemorrhagic', label: 'Геморрагический инсульт' },
  { id: 'tbi', label: 'Черепно-мозговая травма' },
  { id: 'postop', label: 'После операций' },
  { id: 'cp', label: 'ДЦП и другие нарушения' },
]

/** Роли без персональных карточек — состав МДГ. */
export const TEAM_ROLES = [
  'Кинезиотерапевты',
  'Инструкторы ЛФК',
  'Логопеды',
  'Эрготерапевты',
  'Массажисты',
  'Кардиолог',
]
