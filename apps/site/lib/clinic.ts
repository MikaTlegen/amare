/**
 * Единственная точка правды по клинике: контакты, режим работы, цены.
 * Всё, что может измениться, правится здесь, а не в разметке.
 *
 * TODO CMS: после подключения админки (модуль M2 ТЗ) эти данные приходят
 * из API, а файл остаётся фолбэком на случай недоступности бэкенда.
 */

export const CLINIC = {
  name: 'Amare.kz',
  legalName: 'ТОО «AMARE.KZ»',
  bin: '', // TODO: подставить реальный БИН перед публикацией
  license: '', // TODO: номер, дата и орган выдачи
  address: {
    full: 'Астана, проспект Мәңгілік Ел 21, НП 31',
    city: 'Астана',
    street: 'проспект Мәңгілік Ел 21, НП 31',
    mapUrl: 'https://2gis.kz/astana', // TODO: прямая ссылка на карточку 2ГИС
  },
  hours: 'Пн–Пт 9:00–18:00 · Сб 9:00–14:00 по записи',
  phones: [
    { label: '+7 700 525 25 77', href: 'tel:+77005252577', primary: true },
    { label: '+7 7172 25 25 77', href: 'tel:+77172252577', primary: false },
  ],
  whatsapp: 'https://wa.me/77005252577',
  instagram: 'https://instagram.com/', // TODO: реальный аккаунт клиники
  rating: { value: '5,0', source: '2ГИС', reviews: 87 },
} as const

/** Цены. Держим строками: валюта и «от» — часть смысла, а не форматирование. */
export const PRICES = {
  consultation: '18 000 ₸',
  course: 'от 250 000 ₸',
  homeVisit: '41 000 ₸',
  online: '18 000 ₸',
  dayHospital: 'по запросу', // TODO: уточнить у клиники
  freeIntro: 'Первые 15 минут консультации — бесплатно',
} as const

/**
 * Адреса кабинетов.
 *
 * Кабинеты — отдельные приложения (care для пациента и опекуна, staff для
 * сотрудника). Ссылка «Сотруднику» обязана вести именно в staff: в care
 * роли специалиста нет, и человек упирался в чужую форму входа.
 */
export const CABINETS = {
  care: process.env.NEXT_PUBLIC_CARE_URL ?? 'http://localhost:3002',
  staff: process.env.NEXT_PUBLIC_STAFF_URL ?? 'http://localhost:3003',
} as const

/**
 * Маршруты сайта — чтобы ссылки не разъезжались по файлам.
 * Каждый путь отсюда обязан существовать в app/, иначе ссылка
 * молча ведёт на 404 (проверяется тестом app/routes.test.ts).
 */
export const ROUTES = {
  home: '/',
  directions: '/napravleniya',
  course: '/kurs-i-ceny',
  team: '/vrachi',

  // Кабинеты. Специалист заходит напрямую в приложение staff, не через сайт.
  login: '/vhod',
  cabinet: '/kabinet',
  cabinetPatient: '/kabinet/pacient',
  cabinetGuardian: '/kabinet/opekun',

  // Заявки
  booking: '/zapis',
  form: '/anketa',

  // Обязательные разделы по S-02 ТЗ
  remote: '/distancionno',
  knowledge: '/baza-znaniy',
  faq: '/voprosy',
  reviews: '/otzyvy',
  contacts: '/kontakty',

  // Страницы-заглушки: содержимого ещё нет, но ссылка не должна быть битой
  results: '/rezultaty',
  relatives: '/rodstvennikam',
  about: '/o-klinike',
  jobs: '/vakansii',
  offer: '/oferta',
  privacy: '/politika-personalnyh-dannyh',
  license: '/licenziya',
} as const

/**
 * Точка на карте 2ГИС.
 *
 * `widgetData` — строка параметра `data` виджета. Формат внутренний и
 * недокументированный: 2ГИС может поменять его без предупреждения.
 * Если карта перестанет открываться, пересоберите строку скриптом
 * `scripts/make-2gis-widget.mjs` или возьмите готовый iframe из
 * официального конструктора 2ГИС.
 *
 * TODO: координаты приблизительные — снять точную точку входа
 * в карточке клиники на 2ГИС и заменить здесь.
 */
export const MAP = {
  lat: 51.0905,
  lon: 71.4188,
  zoom: 17,
  title: 'Amare.kz',
  description: 'Клиника нейрореабилитации, Мәңгілік Ел 21, НП 31',
  widgetData:
    'eJw1UF1vgkAQ_C_bx17MEUSFpA8UItUg8WIbPxof6HHFs8CRu0MFw39vAN2n3dmZZGbuIGTCJEsCJnKmJWcKnO876Lpk4MCcxbqSDBCUUpRM6v5_ByoyIcGBl_l84po-INBcZ52CbI0Tzb-q2BRvgCBhikpeai4KcGD94b7ipSSV7Y1xaJIq8iY4dNNu14ln4b1PLjpwcbgjKvJuODwP3H1IVBQE_e3fOD1PyV8UvA-4Z-PQVYvIo9gqNsL2Gnz4IZUdbHEoUrzckap269XmmuKlSYrabVaf1wv1x53BZlEk7AaOgZ_TIkiHMuou6qOJteCFBgRUCJnwItZ9UVNjNDZmM2QZI2xj69gi4Ak4RntEkMflWig-RL9DFmtwHjwEWQc-1dAIkYNjTFsEikqRZdsTY9mhR3_jTLH2H3qIhX8',
} as const

/**
 * Ссылка в WhatsApp с заготовленным текстом.
 *
 * Текст подставляется в поле ввода, но НЕ отправляется — человек видит
 * его и может стереть. Поэтому в сообщении нет ничего о здоровье:
 * только то, о чём человек хочет спросить. Диагноз в предзаполненном
 * тексте был бы медданными, ушедшими в мессенджер до всякого согласия.
 */
export function whatsappLink(text?: string): string {
  return text ? `${CLINIC.whatsapp}?text=${encodeURIComponent(text)}` : CLINIC.whatsapp
}
