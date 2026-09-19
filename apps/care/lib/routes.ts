/** Пути кабинета. Совпадают с редиректами site → care в next.config.ts. */
export const ROUTES = {
  login: '/vhod',
  cabinet: '/kabinet',
  cabinetPatient: '/kabinet/pacient',
  cabinetGuardian: '/kabinet/opekun',
} as const

/** Роли сотрудников: их рабочее место живёт в отдельном приложении staff. */
export const STAFF_ROLES = ['curator', 'moderator', 'admin'] as const

export type StaffRoleId = (typeof STAFF_ROLES)[number]

/** Адрес рабочего места. Публичный, не секрет — как и адрес care на сайте. */
const STAFF_URL = (process.env.NEXT_PUBLIC_STAFF_URL ?? 'http://localhost:3003').replace(/\/+$/, '')

/**
 * Ссылка на вход сотрудника с выбранной ролью.
 *
 * Вход у клиники один — этот экран. Рабочее место при этом остаётся отдельным
 * приложением со своим периметром доступа, поэтому роль передаётся параметром,
 * а не общей сессией: общая сессия появится вместе с бэкендом.
 *
 * Роль берётся из белого списка: значение уходит в адресную строку, и
 * произвольная строка попадать туда не должна.
 */
export function staffLoginUrl(role: StaffRoleId): string {
  const safe: StaffRoleId = STAFF_ROLES.includes(role) ? role : 'curator'
  return `${STAFF_URL}${ROUTES.login}?role=${safe}`
}

/**
 * Проверка `?from=` перед редиректом после входа.
 *
 * `from` приходит из query — это ввод пользователя (или ссылки), а не
 * внутреннее состояние. Без проверки `/vhod?from=https://evil.tld` увёл бы
 * прямо на чужой домен после «настоящего» входа в кабинет — аудитория 55+
 * особенно уязвима для такого фишинга. Пускаем только одиночный
 * относительный путь: `/что-то`, но не `//host` и не `/\host`.
 */
export function safeRedirectPath(from: string | null): string | null {
  if (!from) return null
  if (!from.startsWith('/')) return null
  if (from.startsWith('//') || from.startsWith('/\\')) return null
  return from
}
