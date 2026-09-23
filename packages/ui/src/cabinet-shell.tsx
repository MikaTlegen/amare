'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, Info, LogOut, Menu, MoreHorizontal, X } from 'lucide-react'
import { useT } from '@amare/i18n/react'
import { AccessibilityMenu } from './accessibility-menu'
import { useSetCabinetLocale } from './cabinet-locale'
import { resolveGroups, type ResolvedGroup, type Tab, type TabGroup } from './cabinet-nav'
import { LanguageSwitch } from './language-switch'
import { Logo, LogoMark } from './logo'
import { cn } from './cn'

export type { Tab, TabGroup } from './cabinet-nav'

interface Props {
  title: string
  subtitle?: string
  tabs: Tab[]
  /** Группы бокового меню. Без них все разделы идут одним списком. */
  groups?: TabGroup[]
  /**
   * Разделы нижней панели на телефоне (до трёх) — остальное уходит в «Ещё».
   * Без этого пропа на телефоне меню открывает бургер в верхней строке.
   */
  mobileBar?: string[]
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

/** Сколько разделов помещается в нижнюю панель рядом с «Ещё». */
const MOBILE_BAR_LIMIT = 3

/**
 * Каркас кабинета: боковое меню, верхняя строка и содержимое раздела.
 *
 * Раскладка повторяет рабочие места вроде TecHR — тёмное меню слева с
 * группами разделов, справа рабочая область, — но в палитре сайта:
 * меню глубокой бирюзы (deep), как тёмные развороты главной, и тот же
 * логотип. Человек переходит с сайта в кабинет и не должен решить, что
 * попал на чужой сервис.
 *
 * Телефон — отдельный сценарий, а не сжатый десктоп. Пациент почти
 * всегда заходит с телефона, и меню за бургером для него — спрятанное
 * меню. Поэтому у пациента и опекуна (mobileBar) главные разделы стоят
 * внизу, под большим пальцем, а остальные открывает «Ещё». Персоналу
 * хватает бургера: они работают с компьютера.
 *
 * Меню — это навигация (nav + aria-current), а не role="tab": разделы
 * живут в адресе (?tab=, см. useCabinetTab) и работают с «Назад».
 *
 * Язык, доступность и SOS видны всегда, на любой ширине (S-13, P-06).
 * Имя, роль и выход приходят пропами: у care и staff разные AuthContext.
 */
export function CabinetShell({
  title,
  subtitle,
  tabs,
  groups,
  mobileBar,
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
  const [menuOpen, setMenuOpen] = useState(false)

  const resolved = resolveGroups(tabs, groups)
  const activeTab = tabs.find((tab) => tab.id === active)
  const activeGroup = resolved.find((group) => group.tabs.some((tab) => tab.id === active))
  const barTabs = (mobileBar ?? [])
    .slice(0, MOBILE_BAR_LIMIT)
    .flatMap((id) => tabs.filter((tab) => tab.id === id))

  const select = (id: string) => {
    setMenuOpen(false)
    onTabChange(id)
  }

  const userCard = (
    <UserCard name={userName} role={roleLabel} signOutLabel={t('cabinet.signOut')} onSignOut={onSignOut} />
  )

  return (
    <div className="min-h-dvh bg-bg lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col gap-8 overflow-y-auto bg-deep px-4 py-6 text-white lg:flex">
        <a
          href={homeHref}
          aria-label={t('cabinet.home')}
          className="rounded-xl px-2 py-1 text-white no-underline"
        >
          <Logo onDark markClassName="h-7" textClassName="text-lg" />
        </a>

        <CabinetNav groups={resolved} active={active} label={t('cabinet.tabs')} onSelect={select} />

        <div className="mt-auto">{userCard}</div>
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur-md">
          <div className="flex min-h-16 items-center gap-2 px-4 py-2 sm:px-8 lg:px-10">
            {/* На самых узких экранах логотип уступает место языку, доступности
                и SOS — они обязаны быть видны; путь на сайт остаётся в меню */}
            <a
              href={homeHref}
              aria-label={t('cabinet.home')}
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl min-[25rem]:inline-flex lg:hidden"
            >
              <LogoMark className="h-7" />
            </a>

            {/* Где я: группа и раздел. Меню слева показывает то же, но на
                широком экране взгляд живёт справа, в рабочей области */}
            <p className="m-0 hidden min-w-0 truncate text-base text-muted lg:block">
              {activeGroup?.label && <span>{activeGroup.label} · </span>}
              <span className="font-semibold text-ink">{activeTab?.label}</span>
            </p>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              <LanguageSwitch onChange={setLocale} />
              <AccessibilityMenu />
              {headerExtra}
              {!mobileBar && (
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  aria-label={t('cabinet.menuOpen')}
                  aria-expanded={menuOpen}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-deep text-white lg:hidden"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </header>

        <main
          className={cn(
            'flex-1 px-4 pb-12 pt-4 sm:px-8 sm:pt-6 lg:px-10 lg:pt-10',
            // Место под нижнюю панель: без него она накрывает последний блок раздела
            mobileBar && 'pb-[calc(6rem_+_env(safe-area-inset-bottom))] lg:pb-12',
          )}
        >
          <div className="mx-auto flex max-w-[76rem] flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-1.5">
              <h1 className="m-0 font-display text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                {title}
              </h1>
              {subtitle && <p className="m-0 text-base text-muted">{subtitle}</p>}
            </div>
            <div>{children}</div>
          </div>
        </main>
      </div>

      {mobileBar && (
        <MobileBar
          tabs={barTabs}
          active={active}
          moreActive={!barTabs.some((tab) => tab.id === active)}
          moreLabel={t('cabinet.more')}
          label={t('cabinet.mobileNav')}
          menuOpen={menuOpen}
          onSelect={select}
          onMore={() => setMenuOpen(true)}
        />
      )}

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        closeLabel={t('cabinet.menuClose')}
        home={
          <a href={homeHref} aria-label={t('cabinet.home')} className="rounded-xl px-2 py-1 text-white no-underline">
            <Logo onDark markClassName="h-7" textClassName="text-lg" />
          </a>
        }
      >
        <CabinetNav groups={resolved} active={active} label={t('cabinet.tabs')} onSelect={select} />
        <div className="mt-auto">{userCard}</div>
      </MenuDrawer>
    </div>
  )
}

function CabinetNav({
  groups,
  active,
  label,
  onSelect,
}: {
  groups: ResolvedGroup[]
  active: string
  label: string
  onSelect: (id: string) => void
}) {
  return (
    <nav aria-label={label} className="flex flex-col gap-6">
      {groups.map((group, index) => (
        <div key={group.label ?? `rest-${index}`} className="flex flex-col gap-1">
          {group.label && (
            <p className="m-0 px-3 pb-1 text-sm font-medium tracking-[0.02em] text-white/65">{group.label}</p>
          )}
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {group.tabs.map((tab) => {
              const current = tab.id === active
              const Icon = tab.icon
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(tab.id)}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-base transition-colors',
                      current
                        ? 'bg-sky font-semibold text-deep'
                        : 'text-white/85 hover:bg-white/10 hover:text-white',
                    )}
                  >
                    {Icon && <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />}
                    <span className="min-w-0">{tab.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function UserCard({
  name,
  role,
  signOutLabel,
  onSignOut,
}: {
  name: string
  role: string
  signOutLabel: string
  onSignOut: () => void
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-white/5 px-3 py-3">
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky font-display text-base font-semibold text-deep"
      >
        {initials}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-base font-semibold text-white">{name}</span>
        <span className="truncate text-sm text-white/70">{role}</span>
      </div>
      <button
        type="button"
        onClick={onSignOut}
        aria-label={signOutLabel}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white/85 transition-colors hover:bg-white/10 hover:text-white"
      >
        <LogOut className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
}

/**
 * Нижняя панель пациента и опекуна: до трёх главных разделов и «Ещё».
 *
 * Подписи обязательны: иконка без слова для человека после инсульта —
 * загадка, а не навигация. Высота считается от safe-area, иначе на
 * iPhone панель уходит под системную полоску.
 */
function MobileBar({
  tabs,
  active,
  moreActive,
  moreLabel,
  label,
  menuOpen,
  onSelect,
  onMore,
}: {
  tabs: Tab[]
  active: string
  moreActive: boolean
  moreLabel: string
  label: string
  menuOpen: boolean
  onSelect: (id: string) => void
  onMore: () => void
}) {
  const item = 'flex min-h-[4.25rem] flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 text-sm font-medium transition-colors'

  return (
    <nav
      aria-label={label}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-2 pb-[calc(0.25rem_+_env(safe-area-inset-bottom))] pt-1 backdrop-blur-md lg:hidden"
    >
      <ul className="m-0 flex list-none gap-1 p-0">
        {tabs.map((tab) => {
          const current = tab.id === active
          const Icon = tab.icon
          return (
            <li key={tab.id} className="flex flex-1">
              <button
                type="button"
                onClick={() => onSelect(tab.id)}
                aria-current={current ? 'page' : undefined}
                className={cn(item, current ? 'bg-tint text-deep' : 'text-muted hover:text-ink')}
              >
                {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
                <span className="max-w-full truncate">{tab.label}</span>
              </button>
            </li>
          )
        })}
        <li className="flex flex-1">
          <button
            type="button"
            onClick={onMore}
            aria-expanded={menuOpen}
            className={cn(item, moreActive ? 'bg-tint text-deep' : 'text-muted hover:text-ink')}
          >
            <MoreHorizontal className="h-6 w-6" aria-hidden="true" />
            <span>{moreLabel}</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}

/**
 * Выдвижное меню на нативном <dialog>: фокус внутри, Escape закрывает,
 * фон недоступен — без сторонней библиотеки, как диалог SOS.
 */
function MenuDrawer({
  open,
  onClose,
  closeLabel,
  home,
  children,
}: {
  open: boolean
  onClose: () => void
  closeLabel: string
  /** Логотип-ссылка на сайт: на узком телефоне её нет в верхней строке. */
  home: ReactNode
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // Клик по вуали (сам <dialog>, а не его содержимое) закрывает меню
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-0 ml-auto h-dvh max-h-none w-[min(20rem,88vw)] max-w-none bg-deep p-0 text-white backdrop:bg-ink/50 lg:hidden"
    >
      <div className="flex h-full flex-col gap-6 overflow-y-auto px-4 pb-[calc(1.5rem_+_env(safe-area-inset-bottom))] pt-4">
        <div className="flex items-center justify-between gap-3">
          {home}
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white/85 hover:bg-white/10"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  )
}

/**
 * Демо-полоса: чтобы никто не принял мок-данные за настоящие.
 *
 * Нейтральная, а не красная: она стоит на каждом экране, и красная
 * рамка приучала не замечать красный там, где он действительно нужен.
 */
export function DemoNotice() {
  const t = useT('ui')

  // Свёрнута в одну строку: полный текст занимал на телефоне треть экрана
  // над планом дня. Главное видно сразу, подробности — по нажатию.
  return (
    <details className="group mb-4 rounded-2xl sm:mb-6 border border-line bg-surface text-base text-muted">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-3 py-1.5 [&::-webkit-details-marker]:hidden">
        <Info className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
        <span className="flex-1 leading-snug">{t('cabinet.demoShort')}</span>
        <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <p className="m-0 px-3 pb-3 pl-10 leading-snug">{t('cabinet.demoNotice')}</p>
    </details>
  )
}
