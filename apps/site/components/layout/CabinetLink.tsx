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
 *
 * В диапазоне 70–86rem кнопка сжимается до иконки: там в шапке стоит
 * горизонтальное меню, и подписи места не остаётся (пороги — в Header.tsx).
 * Подпись уходит в aria-label, а не пропадает совсем.
 */
export function CabinetLink() {
  const t = useT('nav')
  const label = t('cabinet')

  return (
    <Link
      href={ROUTES.login}
      aria-label={label}
      className="hidden min-h-12 items-center gap-2 rounded-xl bg-deep px-5 py-3 text-base font-medium text-white no-underline transition-shadow hover:ring-4 hover:ring-deep/20 sm:inline-flex @min-[58rem]:px-3 @min-[78rem]:px-5"
    >
      <UserRound className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
      <span className="@min-[58rem]:hidden @min-[78rem]:inline">{label}</span>
    </Link>
  )
}
