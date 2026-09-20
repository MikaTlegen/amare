'use client'

import { useEffect, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Eye, Type, Contrast } from 'lucide-react'
import { useT } from '@amare/i18n/react'
import { cn } from './cn'

const SCALES = [1, 1.15, 1.3] as const
const STORAGE_KEY = 'amare:a11y'

interface Prefs {
  scaleIndex: number
  highContrast: boolean
}

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Prefs
  } catch {
    // приватный режим или заблокированное хранилище — не повод падать
  }
  return { scaleIndex: 0, highContrast: false }
}

/**
 * Виджет доступности: размер шрифта и контрастная тема (S-13 ТЗ).
 *
 * Обе настройки меняют не классы компонентов, а две вещи на <html>:
 * переменную --font-scale и атрибут data-contrast. Поэтому весь сайт
 * масштабируется и перекрашивается целиком, включая блоки, которые
 * появятся позже, — про них не нужно помнить.
 *
 * Выбор сохраняется в localStorage: человек, которому нужен крупный шрифт,
 * не должен включать его при каждом заходе.
 */
export function AccessibilityMenu({ onDark = false }: { onDark?: boolean }) {
  const t = useT('ui')
  const [prefs, setPrefs] = useState<Prefs>({ scaleIndex: 0, highContrast: false })

  useEffect(() => {
    setPrefs(loadPrefs())
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--font-scale', String(SCALES[prefs.scaleIndex] ?? 1))
    if (prefs.highContrast) root.setAttribute('data-contrast', 'high')
    else root.removeAttribute('data-contrast')

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {
      // см. выше
    }
  }, [prefs])

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={t('a11y.trigger')}
          className={cn(
            'inline-flex h-11 items-center gap-2 rounded-xl border-[1.5px] px-3 text-base font-medium transition-colors',
            onDark
              ? 'border-white/40 text-white hover:bg-white/10'
              : 'border-line-strong text-ink hover:border-ink',
          )}
        >
          <Eye className="h-5 w-5" aria-hidden="true" />
          <span aria-hidden="true">А+</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={10}
          align="end"
          collisionPadding={16}
          className="z-50 w-[min(19rem,calc(100vw_-_2rem))] rounded-2xl border border-line bg-surface p-4 text-ink shadow-2xl sm:p-5"
        >
          <h2 className="font-display text-lg font-medium tracking-tight">{t('a11y.title')}</h2>

          <div className="mt-4">
            <label htmlFor="a11y-scale" className="flex items-center gap-2 text-base font-medium">
              <Type className="h-5 w-5 text-brand" aria-hidden="true" />
              {t('a11y.textSize')}
            </label>
            <input
              id="a11y-scale"
              type="range"
              min={0}
              max={SCALES.length - 1}
              step={1}
              value={prefs.scaleIndex}
              onChange={(e) => setPrefs((p) => ({ ...p, scaleIndex: Number(e.target.value) }))}
              className="mt-3 w-full accent-[rgb(var(--c-accent))]"
            />
            <div className="mt-1 flex justify-between text-sm text-muted">
              <span>{t('a11y.scaleNormal')}</span>
              <span>{t('a11y.scaleLarger')}</span>
              <span>{t('a11y.scaleMax')}</span>
            </div>
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-line p-3">
            <input
              type="checkbox"
              checked={prefs.highContrast}
              onChange={(e) => setPrefs((p) => ({ ...p, highContrast: e.target.checked }))}
              className="h-5 w-5 accent-[rgb(var(--c-accent))]"
            />
            <Contrast className="h-5 w-5 text-brand" aria-hidden="true" />
            <span className="text-base font-medium">{t('a11y.highContrast')}</span>
          </label>

          <p className="mt-4 text-sm leading-relaxed text-muted">
            {t('a11y.motionNote')}
          </p>

          <Popover.Arrow className="fill-[rgb(var(--c-line))]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
