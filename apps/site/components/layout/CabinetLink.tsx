import Link from 'next/link'
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
  return (
    <Link
      href={ROUTES.login}
      className="hidden min-h-12 items-center gap-2 rounded-xl bg-deep px-5 py-3 text-base font-medium text-white no-underline transition-shadow hover:shadow-[0_0_0_4px_rgba(11,58,74,0.18)] sm:inline-flex"
    >
      <UserRound className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
      Кабинет
    </Link>
  )
}
