/**
 * Основатель клиники.
 *
 * TODO ФОТО: положите портрет в `apps/site/public/photos/founder.jpg`
 * и укажите путь в `photo`. Пока там null, блок рисует аккуратную
 * плашку с инициалами — это лучше, чем битая картинка.
 *
 * TODO CMS: после подключения админки (M2) текст и портрет приходят
 * оттуда, а файл остаётся фолбэком. Текст переехал в @amare/i18n
 * (namespace progress, ключи founder.*).
 */
export const FOUNDER = {
  photo: '/photos/founder.jpg',
  /** Инициалы для плашки, пока нет портрета. */
  initials: 'АА',
} as const
