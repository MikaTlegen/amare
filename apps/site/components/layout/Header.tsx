'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X, UserRound } from 'lucide-react'
import { SiteLogo } from './SiteLogo'
import { LanguageSwitch } from '@amare/ui'
import { AccessibilityMenu } from '@amare/ui'
import { CabinetLink } from './CabinetLink'
import { ROUTES } from '@/lib/clinic'
import { cn } from '@amare/ui'

const NAV = [
  { to: ROUTES.directions, label: 'Направления' },
  { to: ROUTES.course, label: 'Курс и цены' },
  { to: ROUTES.team, label: 'Врачи' },
  { to: ROUTES.results, label: 'Результаты' },
]

/**
 * Шапка: липкая, с размытием фона.
 *
 * Размытие включается только после прокрутки — над первым экраном
 * шапка прозрачная и не режет фотографию. Порог в 24 px, чтобы состояние
 * не мигало при инерционном скролле на трекпаде.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

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
      <div className="container-content flex items-center gap-8 py-3">
        <SiteLogo />

        <nav aria-label="Основная навигация" className="hidden flex-1 gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={
                cn(
                  'relative py-1 text-base no-underline transition-colors',
                  'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left',
                  'after:scale-x-0 after:bg-accent after:transition-transform after:duration-300',
                  'hover:after:scale-x-100',
                  pathname === item.to ? 'font-semibold text-ink after:scale-x-100' : 'text-muted hover:text-ink',
                )
              }
            >
              {item.label}
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
                aria-label="Открыть меню"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-bg lg:hidden"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-xs" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(22rem,88vw)] flex-col gap-6 border-l border-line bg-bg p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-display text-xl font-semibold tracking-tight">
                    Меню
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Закрыть меню"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav className="flex flex-col gap-1" aria-label="Мобильная навигация">
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
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <Link
                  href={ROUTES.login}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-deep px-5 py-3.5 text-base font-semibold text-white no-underline"
                >
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                  Войти в кабинет
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
