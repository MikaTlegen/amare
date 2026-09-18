/** Пути кабинета. Совпадают с редиректами site → care в next.config.ts. */
export const ROUTES = {
  login: '/vhod',
  cabinet: '/kabinet',
  cabinetPatient: '/kabinet/pacient',
  cabinetGuardian: '/kabinet/opekun',
} as const

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
