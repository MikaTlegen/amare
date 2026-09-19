/**
 * Единственная точка правды по клинике: контакты, режим работы, цены.
 * Всё, что может измениться, правится здесь, а не в разметке.
 *
 * Текст (адрес словами, режим работы, название ТОО, цены) переехал
 * в @amare/i18n: он переводится, а телефоны и координаты — нет.
 *
 * TODO CMS: после подключения админки (модуль M2 ТЗ) эти данные приходят
 * из API, а файл остаётся фолбэком на случай недоступности бэкенда.
 */

export const CLINIC = {
  name: 'Amare.kz',
  bin: '', // TODO: подставить реальный БИН перед публикацией
  license: '', // TODO: номер, дата и орган выдачи
  address: {
    mapUrl: 'https://2gis.kz/astana/geo/70030076192243869',
  },
  phones: [
    { label: '+7 700 525 25 77', href: 'tel:+77005252577', primary: true },
    { label: '+7 7172 25 25 77', href: 'tel:+77172252577', primary: false },
  ],
  whatsapp: 'https://wa.me/77005252577',
  instagram: 'https://instagram.com/', // TODO: реальный аккаунт клиники
  rating: { value: '5,0', reviews: 87 },
} as const

/*
 * Цены живут в словаре @amare/i18n (namespace prices): валюта и «от» —
 * часть смысла, а в казахском «от 250 000 ₸» строится иначе.
 *
 * TODO: дневной стационар — уточнить цену у клиники.
 */

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
 * Координаты здания по адресу клиники подтверждены в 2ГИС.
 */
export const MAP = {
  lat: 51.1073,
  lon: 71.430416,
  zoom: 17,
  widgetData:
    'eJxFUFtvgjAU_i_d44gpASWS7IGVyDRIbNziZfGBQad1hUNKUYH431fAZX0657ul52sRyJRJlgYMMqYkZyVyP1uk6oIhF81YrCrJkIEKCQWTqudblIAAqfmn2WziWb7mFVeic9CNeUqyjyq24EXDKSsTyQvFIdfk6s17xgtJqymxcWjRKiITHHrHblYpGeOdTy8q8HC4pWVEbjg8D9pdqPcg6Hf_xpOzQ3-i4HXAyVRnlPOIJHicr2FKGrz_0r5gg0M44sWWVrVXL9dXPVs0r71m-X69JL7dfbCZ5ym7IdfEf-9uoONQRt2d-mhiBTxXWp-ALoznseqLcsyRbWHbnBhjc2RixzpoN0913P1goCwuVlDy4fgWiVgh96EzkOjAfz9qADLtc3SArgyE2JwYE_se_Y5Fye6_bDKGMw',
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

/** Запись к конкретному специалисту: страница записи с преднастроенным врачом. */
export function bookingLink(doctorId: string): string {
  return `${ROUTES.booking}?doctor=${encodeURIComponent(doctorId)}`
}
