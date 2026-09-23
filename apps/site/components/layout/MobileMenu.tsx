'use client'

import { useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { stripLocale } from '@amare/i18n/locales'
import { useT } from '@amare/i18n/react'
import { InstallPwaButton, LanguageSwitch, cn } from '@amare/ui'
import { Link } from '@/components/Links'
import { ROUTES } from '@/lib/clinic'

// Подпись каждого пункта берётся из словаря по ключу с тем же именем, что и маршрут
export const NAV = [
  { to: ROUTES.directions, key: 'directions' },
  { to: ROUTES.course, key: 'course' },
  { to: ROUTES.team, key: 'team' },
  { to: ROUTES.results, key: 'results' },
  { to: ROUTES.knowledge, key: 'knowledge' },
  { to: ROUTES.contacts, key: 'contacts' },
] as const

/**
 * Выдвижная панель меню — один экран на два входа.
 *
 * Вход зависит от ширины: до lg это вкладка «Меню» нижней навигации,
 * с lg до 2xl — бургер в шапке. Раньше панель жила внутри шапки, и второй
 * триггер пришлось бы связывать с ней общим состоянием. Вместо этого панель
 * принимает свой триггер через children: экземпляров два, но одновременно на
 * экране их не бывает — второй всегда скрыт по CSS.
 *
 * Состояние открытия держит сама панель, снаружи им никто не управляет.
 */
export function MobileMenu({ children }: { children: ReactNode }) {
  const t = useT('nav')
  const [open, setOpen] = useState(false)
  // Маршруты в ROUTES без префикса локали: на /kk/ его надо снять
  const pathname = stripLocale(usePathname())

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-xs" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-[min(22rem,88vw)] flex-col gap-6 overflow-y-auto overscroll-contain border-l border-line bg-bg p-6 pb-[calc(1.5rem_+_env(safe-area-inset-bottom))] shadow-2xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-display text-xl font-semibold tracking-[-0.02em]">
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
                onClick={() => setOpen(false)}
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

          {/* Входа в кабинет здесь нет: на телефоне он всегда виден в нижней
              панели (BottomNav), на планшете — в шапке. Дубль в меню убран
              по просьбе. Установка PWA остаётся — другого места у неё в меню нет */}
          <InstallPwaButton />

          <div className="mt-auto">
            <LanguageSwitch />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
