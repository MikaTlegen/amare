export interface RecoveryStory {
  /** Ключи текста в словаре stories — `<id>.name`, `<id>.before`, `<id>.after`. */
  id: string
  age: number
  beforePhoto: string
  afterPhoto: string
}

/**
 * Истории восстановления (S-08 ТЗ).
 *
 * ВНИМАНИЕ. Это реальные пациенты, а не демо-данные. Материалы взяты
 * с сайта клиники, где они уже опубликованы самой клиникой.
 *
 * Прежде чем добавлять сюда новую историю, убедитесь, что на неё есть
 * письменное согласие пациента или его законного представителя на
 * публикацию фото и сведений о лечении. Без согласия это разглашение
 * врачебной тайны, а не маркетинг.
 *
 * Формулировки результата не обещают того же другим: результат зависит
 * от объёма поражения, срока и сопутствующих болезней. Текст переехал
 * в @amare/i18n (namespace stories) и требует вычитки врачом на каждом языке.
 */
export const RECOVERY_STORIES: RecoveryStory[] = [
  {
    id: 'dusenov',
    age: 72,
    beforePhoto: '/stories/dusenov-before.webp',
    afterPhoto: '/stories/dusenov-after.webp',
  },
  {
    id: 'tankishev',
    age: 51,
    beforePhoto: '/stories/tankishev-before.webp',
    afterPhoto: '/stories/tankishev-after.webp',
  },
  {
    id: 'baymagambetov',
    age: 39,
    beforePhoto: '/stories/baymagambetov-before.webp',
    afterPhoto: '/stories/baymagambetov-after.webp',
  },
]
