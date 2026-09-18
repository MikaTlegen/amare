export interface RecoveryStory {
  id: string
  name: string
  age: number
  diagnosis: string
  /** Что было при поступлении — словами, понятными родственнику. */
  before: string
  /** Что стало после курса. */
  after: string
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
 * от объёма поражения, срока и сопутствующих болезней.
 */
export const RECOVERY_STORIES: RecoveryStory[] = [
  {
    id: 'dusenov',
    name: 'Ермек Г. Дюсенов',
    age: 72,
    diagnosis: 'Ишемический инсульт',
    before: 'Не ходил и не разговаривал, правая рука была парализована.',
    after: 'Ходит самостоятельно, вернулись речь и движения руки.',
    beforePhoto: '/stories/dusenov-before.webp',
    afterPhoto: '/stories/dusenov-after.webp',
  },
  {
    id: 'tankishev',
    name: 'Ермек А. Танкишев',
    age: 51,
    diagnosis: 'Ишемический инсульт',
    before: 'Асимметрия лица, нарушение речи, рука не слушалась.',
    after: 'Восстановились походка и речь, асимметрия ушла.',
    beforePhoto: '/stories/tankishev-before.webp',
    afterPhoto: '/stories/tankishev-after.webp',
  },
  {
    id: 'baymagambetov',
    name: 'Галымжан Баймагамбетов',
    age: 39,
    diagnosis: 'Геморрагический инсульт',
    before: 'Паралич правых конечностей, потеря памяти и мотивации.',
    after: 'Уверенная походка, контроль руки, вернулась память.',
    beforePhoto: '/stories/baymagambetov-before.webp',
    afterPhoto: '/stories/baymagambetov-after.webp',
  },
]
