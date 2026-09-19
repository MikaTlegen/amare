export interface KnowledgeArticle {
  /** Ключи текста в словаре knowledge — `<id>.title`, `<id>.summary`. */
  id: string
  /** Есть готовые к публикации тезисы: ключ `<id>.points`. */
  hasPoints?: boolean
  /** Требует утверждения мультидисциплинарной группой клиники. */
  needsReview?: boolean
  /** Иллюстрация к теме. Не медицинская схема — просто якорь для взгляда. */
  photo: string
}

export interface KnowledgeSection {
  /** Ключи текста — `section.<id>.title` и `section.<id>.note`. */
  id: string
  articles: KnowledgeArticle[]
}

/**
 * База знаний (S-07 ТЗ).
 *
 * Здесь два разных типа материалов, и путать их нельзя:
 *
 * 1. Признаки инсульта — общепринятый алгоритм УДАР / BE FAST из
 *    руководств по инсульту. Это информация о вызове скорой, а не
 *    лечение, поэтому публикуется сразу: её задача — сократить время
 *    до звонка 103.
 * 2. Всё остальное (уход, питание при дисфагии, профилактика падений) —
 *    клинические рекомендации. Их тексты пишет и утверждает МДГ клиники
 *    [ВАЛИДАЦИЯ]. До утверждения показываем только тему и отправляем
 *    к специалисту, а не пересказываем интернет.
 *
 * TODO CMS: статьи ведутся в админке (M2), оттуда же приходят в кабинет
 * пациента (P-11). Текст переехал в @amare/i18n (namespace knowledge).
 */
export const KNOWLEDGE: KnowledgeSection[] = [
  {
    id: 'emergency',
    articles: [{ id: 'be-fast', hasPoints: true, photo: '/photos/hospital-drip.jpg' }],
  },
  {
    id: 'care',
    articles: [
      { id: 'moving', needsReview: true, photo: '/photos/hospital-ward.jpg' },
      { id: 'pressure-sores', needsReview: true, photo: '/photos/equipment.jpg' },
      { id: 'falls', needsReview: true, photo: '/photos/walk-bars.jpg' },
    ],
  },
  {
    id: 'nutrition',
    articles: [
      { id: 'dysphagia', needsReview: true, photo: '/photos/healthy-plate.jpg' },
      { id: 'diet', needsReview: true, photo: '/photos/vegetables.jpg' },
    ],
  },
  {
    id: 'communication',
    articles: [
      { id: 'aphasia', needsReview: true, photo: '/photos/doctor-patient.jpg' },
      { id: 'mood', needsReview: true, photo: '/photos/lobby.jpg' },
    ],
  },
]
