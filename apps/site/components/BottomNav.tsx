'use client'

import { UserRound } from 'lucide-react'
import { useT } from '@amare/i18n/react'
import { InstallPwaBadge } from '@amare/ui'
import { Link } from '@/components/Links'
import { ROUTES } from '@/lib/clinic'

/**
 * Высота панели. Задана явно, а не содержимым: её же должна занять распорка
 * в потоке, и от неё считается отступ карточки куки.
 *
 * Значение в rem, поэтому панель растёт вместе с ползунком доступности
 * (--font-scale), а не остаётся на месте, пока текст внутри распухает.
 *
 * Над панелью стоит карточка куки — её отступ снизу должен быть больше этой
 * высоты. Числа держит врозь сторож mobile-layout.test.ts: свести их в одну
 * константу нельзя, Tailwind собирает классы по тексту исходников.
 */
const SHELL_H = 'h-[calc(4.5rem_+_env(safe-area-inset-bottom))]'

/**
 * Нижняя панель — только вход в кабинет.
 *
 * Раньше здесь была строка из пяти вкладок (главная, направления, запись,
 * звонок, меню). По отзыву панель мешала и дублировала бургер в шапке —
 * теперь всю остальную навигацию открывает он (виден на телефоне,
 * см. Header.tsx), а внизу остаётся только самое частое действие с
 * телефона, которому раньше было некуда деться без лишнего экрана.
 *
 * Установка PWA — значком у кнопки, не внутри неё: кнопка внутри ссылки
 * (`<button>` в `<a>`) — невалидный HTML, браузер ломает такую ссылку и
 * перестаёт по ней переходить. Бейдж и ссылка — соседние элементы в общей
 * рамке, каждый кликабелен сам по себе.
 *
 * Показывается до lg. Выше работает шапка целиком.
 */
export function BottomNav() {
  const nav = useT('nav')

  return (
    <>
      {/* Распорка в потоке: без неё панель накрывает юрблок подвала
          с лицензией и политикой обработки данных */}
      <div aria-hidden="true" className={`${SHELL_H} lg:hidden`} />

      <nav
        aria-label={nav('bottomLabel')}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden ${SHELL_H}`}
      >
        <div className="container-content flex h-full items-center justify-center">
          <div className="relative w-full max-w-sm">
            <Link
              href={ROUTES.login}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-deep px-6 text-base font-semibold text-white no-underline shadow-md shadow-ink/10 transition-shadow hover:ring-4 hover:ring-deep/20"
            >
              <UserRound className="h-5 w-5" aria-hidden="true" />
              {nav('cabinetEnter')}
            </Link>
            <InstallPwaBadge className="absolute -right-2 -top-2" />
          </div>
        </div>
      </nav>
    </>
  )
}
