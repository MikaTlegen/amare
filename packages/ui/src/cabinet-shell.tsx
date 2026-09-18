'use client'

import type { ReactNode } from 'react'
import { LogOut, UserRound } from 'lucide-react'
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
  onSignOut: () => void
  children: ReactNode
}

/**
 * Каркас кабинета: шапка с пользователем и вкладки.
 *
 * Вкладки — настоящие кнопки с role="tab", а не div'ы: по ним ходят
 * стрелками, их читает скринридер. Для пациента после инсульта
 * клавиатура часто удобнее мыши, и это не теория.
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
  onSignOut,
  children,
}: Props) {
  return (
    <div className="bg-bg">
      <div className="border-b border-line bg-surface">
        <div className="container-content flex flex-col gap-6 py-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex flex-col gap-1.5">
              <h1 className="font-display text-3xl font-medium tracking-[-0.045em]">{title}</h1>
              {subtitle && <p className="m-0 text-base text-muted">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-tint">
                <UserRound className="h-5 w-5 text-deep" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <span className="text-base font-semibold">{userName}</span>
                <span className="text-sm text-muted">{roleLabel}</span>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                aria-label="Выйти из кабинета"
                className="ml-2 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line transition-colors hover:border-ink"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div role="tablist" aria-label="Разделы кабинета" className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const selected = tab.id === active
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'min-h-[2.9rem] rounded-xl px-5 py-2.5 text-base font-medium transition-colors',
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

      <div className="container-content py-10">{children}</div>
    </div>
  )
}

/** Демо-полоса: чтобы никто не принял мок-данные за настоящие. */
export function DemoNotice() {
  return (
    <p className="m-0 mb-6 rounded-2xl border border-accent bg-[rgb(253,238,237)] px-5 py-4 text-base leading-relaxed text-ink">
      Демонстрационный режим. Все данные вымышлены, ничего никуда не отправляется. Реальные
      медицинские сведения появятся только после подключения бэкенда с хранением в РК.
    </p>
  )
}
