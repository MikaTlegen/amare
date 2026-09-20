'use client'

import { Link } from '@/components/Links'
import { useT } from '@amare/i18n/react'
import { UserRound } from 'lucide-react'
import { ROUTES } from '@/lib/clinic'

/**
 * Правая часть шапки: вход в кабинет.
 *
 * На сайте посетитель всегда гость — кабинеты живут в приложении care,
 * а /vhod перенаправляет туда (next.config.ts). Имя вошедшего и меню
 * с выходом вернутся, когда у site и care появится общая сессия.
 */
export function CabinetLink() {
  const t = useT('nav')

  return (
    <Link
      href={ROUTES.login}
      className="hidden min-h-12 items-center gap-2 rounded-xl bg-deep px-5 py-3 text-base font-medium text-white no-underline transition-shadow hover:ring-4 hover:ring-deep/20 sm:inline-flex"
    >
      <UserRound className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
      {t('cabinet')}
    </Link>
  )
}
