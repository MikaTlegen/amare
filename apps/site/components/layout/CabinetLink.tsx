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
 * Подпись «Кабинет» видна всегда: одна иконка человечка читалась как
 * «профиль» и не объясняла, куда ведёт. В тесном диапазоне 58–78rem, где в
 * шапке стоит горизонтальное меню, вместо подписи уходит иконка — по замеру
 * строка помещается и на пороге появления меню (пороги — в Header.tsx).
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
      <UserRound className="h-[1.1rem] w-[1.1rem] @min-[58rem]:hidden @min-[78rem]:inline" aria-hidden="true" />
      <span>{label}</span>
    </Link>
  )
}
