export interface Doctor {
  id: string
  name: string
  role: string
  experience: string
  /** Одно-два предложения о квалификации. */
  about?: string
  /** Фото с сайта клиники. null — портрета пока нет, рисуем плейсхолдер. */
  photo: string | null
  /** TODO CRM: сертификаты приходят из карточки сотрудника (M2). */
  certificates: string[]
  /**
   * Состояния, с которыми работает специалист.
   * По этим меткам блок «С какими состояниями работаем» ведёт
   * на карточки нужных врачей.
   */
  conditions: ConditionId[]
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
    about: 'Магистр в сфере здравоохранения, более 15 лет в реабилитации.',
    photo: '/photos/doctor-kuspanova.jpg',
    certificates: ['[СЕРТИФИКАТ]'],
    conditions: ['ischemic', 'hemorrhagic', 'tbi', 'postop'],
  },
  {
    id: 'ahaaga',
    name: 'Ахаага Сайра',
    role: 'Невропатолог',
    experience: '25 лет стажа',
    about:
      'Врач-невролог высшей квалификационной категории. Диагностика, лечение и профилактика заболеваний нервной системы у взрослых.',
    photo: '/photos/doctor-ahaaga.jpg',
    certificates: ['[СЕРТИФИКАТ]'],
    conditions: ['ischemic', 'hemorrhagic', 'tbi'],
  },
  {
    id: 'zhumabekova',
    name: 'Индира Жумабекова',
    role: 'Врач-реабилитолог',
    experience: '10+ лет стажа',
    photo: '/photos/doctor-zhumabekova.jpg',
    certificates: ['[СЕРТИФИКАТ]'],
    conditions: ['ischemic', 'hemorrhagic', 'postop', 'cp'],
  },
  {
    id: 'moldabekov',
    name: 'Айдос Молдабеков',
    role: 'Нейрохирург',
    experience: '18 лет стажа',
    photo: '/photos/doctor-moldabekov.jpg',
    certificates: ['[СЕРТИФИКАТ]'],
    conditions: ['hemorrhagic', 'tbi', 'postop'],
  },
  {
    id: 'niyazbekova',
    name: 'Каламкас Ниязбекова',
    role: 'Нейропсихолог-дефектолог',
    experience: '10 лет стажа',
    photo: '/photos/doctor-niyazbekova.jpg',
    certificates: ['[СЕРТИФИКАТ]'],
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
