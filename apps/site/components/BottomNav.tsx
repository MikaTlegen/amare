'use client'

import { usePathname } from 'next/navigation'
import { Activity, CalendarCheck, House, Menu, Phone } from 'lucide-react'
import { stripLocale } from '@amare/i18n/locales'
import { useT } from '@amare/i18n/react'
import { cn } from '@amare/ui'
import { Link } from '@/components/Links'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { BOOKING_URL, CLINIC, ROUTES } from '@/lib/clinic'

/**
 * Высота панели. Задана явно, а не содержимым: её же должна занять распорка
 * в потоке, и от неё считается отступ карточки куки.
 *
 * Прежняя панель из двух кнопок высоту фиксировать не могла — на крупном кегле
 * кнопки переносились на второй ряд. У вкладок переноса нет по построению:
 * подпись в одну строку, а когда она перестаёт помещаться, уходит в sr-only.
 * Значение в rem, поэтому панель растёт вместе с ползунком доступности
 * (--font-scale), а не остаётся на месте, пока текст внутри распухает.
 *
 * Над панелью стоит карточка куки — её отступ снизу должен быть больше этой
 * высоты. Числа держит врозь сторож mobile-layout.test.ts: свести их в одну
 * константу нельзя, Tailwind собирает классы по тексту исходников.
 */
const SHELL_H = 'h-[calc(4.25rem_+_env(safe-area-inset-bottom))]'

/*
 * Подпись прячется по container-запросу, а не по ширине экрана: медиазапросы
 * считают rem от 16 px и про --font-scale не знают. 18.5rem подобраны так,
 * что на обычном телефоне при базовом кегле подписи стоят, а начиная со
 * среднего деления ползунка доступности остаются одни иконки.
 *
 * sr-only, а не hidden: без подписи у вкладки не остаётся доступного имени.
 */
const LABEL = 'max-w-full truncate text-[0.625rem] font-medium tracking-[-0.015em] @max-[18.5rem]:sr-only'

const tabClass = (active: boolean) =>
  cn(
    'flex min-w-0 flex-col items-center justify-center gap-1 text-center no-underline transition-colors',
    active ? 'font-semibold text-brand' : 'text-muted',
  )

const iconClass = (accent: boolean) => cn('h-6 w-6 shrink-0', accent && 'text-accent')

/**
 * Нижняя навигация, как в мобильном приложении.
 *
 * Была панель из двух кнопок «Позвонить» и «Записаться» во всю ширину: она
 * съедала 6rem высоты, а перейти с телефона хоть куда-то можно было только
 * через бургер в шапке. Пять вкладок занимают меньше места и дают собственно
 * навигацию, а оба прежних действия среди вкладок сохранились.
 *
 * Показывается до lg. Выше работает шапка: с lg до 2xl бургер, с 2xl пункты
 * в строку. По той же границе поднята и плавающая кнопка связи — иначе на
 * планшете она висела бы поверх панели.
 */
export function BottomNav() {
  const nav = useT('nav')
  const common = useT('common')
  // Маршруты в ROUTES без префикса локали: на /kk/ его надо снять
  const pathname = stripLocale(usePathname())

  const links = [
    { to: ROUTES.home, Icon: House, label: nav('home'), active: pathname === ROUTES.home, accent: false },
    {
      to: ROUTES.directions,
      Icon: Activity,
      label: nav('directions'),
      active: pathname.startsWith(ROUTES.directions),
      accent: false,
    },
  ]

  return (
    <>
      {/* Распорка в потоке: без неё панель накрывает юрблок подвала
          с лицензией и политикой обработки данных */}
      <div aria-hidden="true" className={`${SHELL_H} lg:hidden`} />

      <nav
        aria-label={nav('bottomLabel')}
        className={cn(
          '@container fixed inset-x-0 bottom-0 z-40 grid grid-cols-5',
          'border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden',
          SHELL_H,
        )}
      >
        {links.map(({ to, Icon, label, active, accent }) => (
          <Link key={to} href={to} aria-current={active ? 'page' : undefined} className={tabClass(active)}>
            <Icon className={iconClass(accent)} aria-hidden="true" />
            <span className={LABEL}>{label}</span>
          </Link>
        ))}

        {/* Запись ведёт прямо в календарь CRM, а не на свою страницу:
            лишний шаг между решением и выбором времени теряет людей.
            Единственное цветное пятно панели — ради этого сюда и пришли */}
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={tabClass(false)}
        >
          <CalendarCheck className={iconClass(true)} aria-hidden="true" />
          <span className={LABEL}>{common('book')}</span>
        </a>

        <a href={CLINIC.phones[0].href} className={tabClass(false)}>
          <Phone className={iconClass(false)} aria-hidden="true" />
          <span className={LABEL}>{common('call')}</span>
        </a>

        <MobileMenu>
          <button type="button" className={tabClass(false)}>
            <Menu className={iconClass(false)} aria-hidden="true" />
            <span className={LABEL}>{nav('menuTitle')}</span>
          </button>
        </MobileMenu>
      </nav>
    </>
  )
}
