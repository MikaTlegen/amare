'use client'

import type { ReactNode } from 'react'
import { House, LogOut, UserRound } from 'lucide-react'
import { useT } from '@amare/i18n/react'
import { AccessibilityMenu } from './accessibility-menu'
import { useSetCabinetLocale } from './cabinet-locale'
import { LanguageSwitch } from './language-switch'
import { cn } from './cn'

export interface Tab {
  id: string
  label: string
}

interface Props {
  title: string
  subtitle?: string
  tabs: Tab[]
  active: string
  onTabChange: (id: string) => void
  userName: string
  roleLabel: string
  homeHref: string
  onSignOut: () => void
  /** Доп. кнопка рядом с языком и доступностью — например, вызов SOS в care. */
  headerExtra?: ReactNode
  children: ReactNode
}

/**
 * Активная вкладка не должна оставаться за краем скролл-трека: вкладок 7–8,
 * на телефоне они не помещаются в строку. block: 'nearest' — чтобы страница
 * не прыгала по вертикали при первом рендере.
 */
function keepTabVisible(node: HTMLButtonElement | null) {
  node?.scrollIntoView({ inline: 'nearest', block: 'nearest' })
}

/**
 * Каркас кабинета: шапка с пользователем и вкладки.
 *
 * Вкладки — настоящие кнопки с role="tab", а не div'ы: по ним ходят
 * стрелками, их читает скринридер. Для пациента после инсульта
 * клавиатура часто удобнее мыши, и это не теория.
 *
 * На телефоне вкладки не переносятся, а прокручиваются вбок: перенос
 * 7–8 вкладок съедал треть экрана до начала содержимого.
 *
 * Имя, роль и выход приходят пропами, а не из контекста авторизации:
 * у care (пациент/опекун) и staff (специалист) разные AuthContext.
 */
export function CabinetShell({
  title,
  subtitle,
  tabs,
  active,
  onTabChange,
  userName,
  roleLabel,
  homeHref,
  onSignOut,
  headerExtra,
  children,
}: Props) {
  const t = useT('ui')
  const setLocale = useSetCabinetLocale()

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <div className="border-b border-line bg-surface">
        <div className="container-content flex flex-col gap-6 py-8">
          <div className="flex flex-wrap items-start justify-between gap-4 sm:gap-5">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <h1 className="font-display text-2xl font-medium leading-tight tracking-[-0.045em] sm:text-3xl">{title}</h1>
              {subtitle && <p className="m-0 text-base text-muted">{subtitle}</p>}
            </div>

            {/*
             * Размер шрифта, контраст и язык нужны в кабинете не меньше, чем на
             * сайте: этим кабинетом пользуется сам пациент после инсульта (S-13).
             * Язык здесь переключается без смены адреса — кабинет за логином.
             *
             * w-full на мобильном: с headerExtra (например, SOS) тут три
             * иконки, и без своей строки им не хватало ширины — заголовок
             * рядом сжимался в вертикальный столбец в одну букву. С sm
             * снова врастает в общую строку с заголовком, места хватает.
             */}
            <div className="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto">
              <LanguageSwitch onChange={setLocale} />
              <AccessibilityMenu />
              {headerExtra}
            </div>

            {/* min-w-0 и truncate: без них карточка не сжимается ниже своего
                содержимого и выталкивает страницу вбок на экране 360 px */}
            <div className="flex w-full min-w-0 items-center gap-2 rounded-2xl border border-line px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3 lg:w-auto">
            <a href={homeHref} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line text-ink transition-colors hover:border-ink" aria-label={t('cabinet.home')}>
              <House className="h-5 w-5" aria-hidden="true" />
            </a>
              {/* Аватар декоративный: на телефоне уступает место имени, роль написана словами */}
              <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tint sm:flex">
                <UserRound className="h-5 w-5 text-deep" aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-base font-semibold">{userName}</span>
                <span className="truncate text-sm text-muted">{roleLabel}</span>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                aria-label={t('cabinet.signOut')}
                className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line transition-colors hover:border-ink sm:ml-2"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            role="tablist"
            aria-label={t('cabinet.tabs')}
            className="-mx-4 flex snap-x gap-2 overflow-x-auto scroll-px-4 px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((tab) => {
              const selected = tab.id === active
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  ref={selected ? keepTabVisible : undefined}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'min-h-12 shrink-0 snap-start whitespace-nowrap rounded-xl px-4 py-2.5 text-base font-medium transition-colors sm:px-5',
                    selected
                      ? 'bg-deep text-white'
                      : 'border border-line text-muted hover:border-ink hover:text-ink',
                  )}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="container-content flex-1 py-10">{children}</div>
    </div>
  )
}

/** Демо-полоса: чтобы никто не принял мок-данные за настоящие. */
export function DemoNotice() {
  const t = useT('ui')

  return (
    <p className="m-0 mb-6 rounded-2xl border border-accent bg-[rgb(253,238,237)] px-5 py-4 text-base leading-relaxed text-ink">
      {t('cabinet.demoNotice')}
    </p>
  )
}
