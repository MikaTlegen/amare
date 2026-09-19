'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/components/Links'
import { usePathname } from 'next/navigation'
import { stripLocale } from '@amare/i18n/locales'
import { useT } from '@amare/i18n/react'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X, UserRound } from 'lucide-react'
import { SiteLogo } from './SiteLogo'
import { LanguageSwitch } from '@amare/ui'
import { AccessibilityMenu } from '@amare/ui'
import { CabinetLink } from './CabinetLink'
import { ROUTES } from '@/lib/clinic'
import { cn } from '@amare/ui'

// Подпись каждого пункта берётся из словаря по ключу с тем же именем, что и маршрут
const NAV = [
  { to: ROUTES.directions, key: 'directions' },
  { to: ROUTES.course, key: 'course' },
  { to: ROUTES.team, key: 'team' },
  { to: ROUTES.results, key: 'results' },
  { to: ROUTES.knowledge, key: 'knowledge' },
  { to: ROUTES.contacts, key: 'contacts' },
] as const

/**
 * Шапка: липкая, с размытием фона.
 *
 * Размытие включается только после прокрутки — над первым экраном
 * шапка прозрачная и не режет фотографию. Порог в 24 px, чтобы состояние
 * не мигало при инерционном скролле на трекпаде.
 *
 * Горизонтальное меню появляется только с 2xl: при базовом кегле 18 px шесть
 * пунктов, логотип и правый блок требуют ~1300 px, и на 1024–1500 px кнопка
 * «Кабинет» уезжала за край экрана. До 2xl работает бургер.
 */
export function Header() {
  const t = useT('nav')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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
      <div className="container-content flex items-center gap-3 py-3 lg:gap-8">
        <SiteLogo />

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
          <div className="hidden sm:block">
            <LanguageSwitch />
          </div>
          <AccessibilityMenu />

          <CabinetLink />

          {/* Бургер — только на узких экранах */}
          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label={t('menuOpen')}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-bg 2xl:hidden"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-xs" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(22rem,88vw)] flex-col gap-6 overflow-y-auto overscroll-contain border-l border-line bg-bg p-6 pb-[calc(1.5rem_+_env(safe-area-inset-bottom))] shadow-2xl">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-display text-xl font-semibold tracking-tight">
                    {t('menuTitle')}
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label={t('menuClose')}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav className="flex flex-col gap-1" aria-label={t('mobileLabel')}>
                  {NAV.map((item) => (
                    <Link
                      key={item.to}
                      href={item.to}
                      onClick={() => setMenuOpen(false)}
                      className={
                        cn(
                          'rounded-xl px-4 py-3.5 text-lg no-underline',
                          pathname === item.to ? 'bg-tint font-semibold text-deep' : 'text-ink',
                        )
                      }
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                </nav>

                <Link
                  href={ROUTES.login}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-deep px-5 py-3.5 text-base font-semibold text-white no-underline"
                >
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                  {t('cabinetEnter')}
                </Link>

                <div className="mt-auto">
                  <LanguageSwitch />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  )
}
