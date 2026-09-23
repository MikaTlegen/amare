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
 * Пороги шапки заданы container-запросами, а не медиазапросами. Медиазапросы
 * считают rem от 16 px и про --font-scale не знают, поэтому на крупном кегле
 * шапка молча вылезала за край: при масштабе 1.3 бургер обрезался ровно у того
 * человека, который этот масштаб и включил. Container-запрос в rem меряется
 * корневым кеглем — тем самым, который двигает ползунок доступности.
 *
 * Отсюда три порога, все подобраны замером ширины строки при базовом кегле:
 *
 * 17rem — уходит словесный знак, остаётся марка.
 * 70rem (~1280 px) — появляется горизонтальное меню, уходит бургер. Шесть
 *   пунктов требуют 660 px, и на эту же ширину надо освободить место: до 86rem
 *   телефон уходит из шапки, а у «Кабинета» пропадает иконка (подпись
 *   остаётся). Целиком —
 *   логотип, меню и правый блок — строка занимает ~1500 px.
 * 86rem (~1570 px) — места хватает на всё: телефон и иконка «Кабинета»
 *   возвращаются.
 *
 * Бургер виден на всех ширинах до появления горизонтального меню
 * (@min-[58rem]) — включая телефон: нижняя навигация (BottomNav) больше
 * не дублирует эту панель, там теперь только вход в кабинет.
 *
 * Языковой переключатель и доступность на телефоне не прячутся ни при
 * каких обстоятельствах (см. их комментарий ниже и S-13) — а логотип,
 * они и бургер рядом уже не помещаются в одну строку на самых узких
 * экранах. Поэтому правый блок икон при нехватке места переносится под
 * логотип целиком (w-full), а не обрезается: 27rem подобраны по замеру
 * суммарной ширины языка + доступности + бургера.
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
      <div className="@container container-content flex flex-wrap items-center gap-3 py-3 lg:gap-6">
        <SiteLogo textClassName="@max-[17rem]:hidden @min-[58rem]:hidden @min-[78rem]:inline" />

        <nav aria-label={t('mainLabel')} className="hidden flex-1 gap-3 @min-[58rem]:flex">
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

        <div className="flex w-full items-center justify-end gap-2.5 @min-[27rem]:ml-auto @min-[27rem]:w-auto">
          {/* Телефон в шапке: главный вопрос посетителя в остром периоде —
              «куда звонить», а до правки номер на десктопе был только внутри
              плавающей кнопки связи и в подвале. Уходит дважды: на узкой строке
              (крупный кегль) и в диапазоне 70–86rem, где место забирает
              горизонтальное меню. В обоих случаях номер остаётся во вкладке
              «Позвонить», в круглой кнопке связи и в подвале. */}
          <a
            href={CLINIC.phones[0].href}
            className="hidden whitespace-nowrap text-base font-semibold text-ink no-underline transition-colors hover:text-brand @min-[34rem]:inline-flex @min-[58rem]:hidden @min-[78rem]:inline-flex"
          >
            {CLINIC.phones[0].label}
          </a>

          {/* Виден и на телефоне: иначе переключить язык можно было только
              через меню, и человек, попавший на казахскую версию, не находил
              обратной дороги */}
          <LanguageSwitch />
          <AccessibilityMenu />

          <CabinetLink />

          {/* Бургер — на телефоне и до появления горизонтального меню; выше
              @min-[58rem] пункты уже стоят в строку, панель не нужна */}
          <MobileMenu>
            <button
              type="button"
              aria-label={t('menuOpen')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-bg @min-[58rem]:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </MobileMenu>
        </div>
      </div>
    </header>
  )
}
