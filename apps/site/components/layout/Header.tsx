'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/components/Links'
import { usePathname } from 'next/navigation'
import { stripLocale } from '@amare/i18n/locales'
import { useT } from '@amare/i18n/react'
import { Menu } from 'lucide-react'
import { SiteLogo } from './SiteLogo'
import { MobileMenu, NAV } from './MobileMenu'
import { LanguageSwitch } from '@amare/ui'
import { AccessibilityMenu } from '@amare/ui'
import { CabinetLink } from './CabinetLink'
import { CLINIC } from '@/lib/clinic'
import { cn } from '@amare/ui'

/**
 * Шапка: липкая, с размытием фона.
 *
 * Размытие включается только после прокрутки — над первым экраном
 * шапка прозрачная и не режет фотографию. Порог в 24 px, чтобы состояние
 * не мигало при инерционном скролле на трекпаде.
 *
 * Горизонтальное меню появляется только с 2xl: при базовом кегле 18 px шесть
 * пунктов, логотип и правый блок требуют ~1300 px, и на 1024–1500 px кнопка
 * «Кабинет» уезжала за край экрана. До 2xl работает бургер, но не ниже lg:
 * там то же меню открывает вкладка нижней навигации (BottomNav), и два входа
 * в одну панель были бы дублем.
 *
 * Словесный знак прячется по container-запросу, а не по ширине экрана.
 * Медиазапросы считают rem от 16 px и про --font-scale не знают, поэтому на
 * крупном кегле шапка молча вылезала за край: при масштабе 1.3 бургер
 * обрезался ровно у того человека, который этот масштаб и включил.
 * Container-запрос в rem меряется корневым кеглем — тем самым, который двигает
 * ползунок доступности. 17rem подобраны так, чтобы надпись уходила начиная со
 * среднего деления, а марка с кнопками помещалась на любом.
 */
export function Header() {
  const t = useT('nav')
  const [scrolled, setScrolled] = useState(false)
  // Маршруты в ROUTES без префикса локали: на /kk/ его надо снять
  const pathname = stripLocale(usePathname())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-30 transition-colors duration-300',
        scrolled ? 'border-b border-line bg-bg/85 backdrop-blur-xl' : 'bg-bg',
      )}
    >
      <div className="@container container-content flex items-center gap-3 py-3 lg:gap-8">
        <SiteLogo textClassName="@max-[17rem]:hidden" />

        <nav aria-label={t('mainLabel')} className="hidden flex-1 gap-4 2xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={
                cn(
                  'relative whitespace-nowrap py-1 text-base no-underline transition-colors',
                  'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left',
                  'after:scale-x-0 after:bg-accent after:transition-transform after:duration-300',
                  'hover:after:scale-x-100',
                  pathname === item.to ? 'font-semibold text-ink after:scale-x-100' : 'text-muted hover:text-ink',
                )
              }
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          {/* Телефон в шапке: главный вопрос посетителя в остром периоде —
              «куда звонить», а до правки номер на десктопе был только внутри
              плавающей кнопки связи и в подвале. Показываем по container-запросу,
              а не по ширине экрана: так он сам уходит, когда шапке не хватает
              места из-за крупного кегля, и не выталкивает бургер за край. */}
          <a
            href={CLINIC.phones[0].href}
            className="hidden whitespace-nowrap text-base font-semibold text-ink no-underline transition-colors hover:text-brand @min-[34rem]:inline-flex"
          >
            {CLINIC.phones[0].label}
          </a>

          <div className="hidden sm:block">
            <LanguageSwitch />
          </div>
          <AccessibilityMenu />

          <CabinetLink />

          {/* Бургер — только между lg и 2xl: ниже lg ту же панель открывает
              вкладка нижней навигации, выше 2xl пункты стоят в строку */}
          <MobileMenu>
            <button
              type="button"
              aria-label={t('menuOpen')}
              className="hidden h-11 w-11 items-center justify-center rounded-xl bg-ink text-bg lg:inline-flex 2xl:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </MobileMenu>
        </div>
      </div>
    </header>
  )
}
