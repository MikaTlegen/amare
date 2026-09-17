'use client'

import { useState } from 'react'
import { cn } from './cn'

type Lang = 'kk' | 'ru'

/**
 * Переключатель языка.
 *
 * Сейчас только меняет визуальное состояние и lang у документа.
 *
 * TODO i18n: по ТЗ (S-01, S-12) языки живут на отдельных URL — /kk/ и /ru/,
 * с hreflang для поисковиков. Значит переключатель должен не хранить язык
 * в состоянии, а переходить по адресу: navigate(`/${lang}${pathname}`).
 * Делать это до появления самих переводов бессмысленно, поэтому пока заглушка.
 */
export function LanguageSwitch({ onDark = false }: { onDark?: boolean }) {
  const [lang, setLang] = useState<Lang>('ru')

  const choose = (next: Lang) => {
    setLang(next)
    document.documentElement.lang = next
  }

  return (
    <div
      className={cn(
        'flex overflow-hidden rounded-xl border',
        onDark ? 'border-white/30' : 'border-line',
      )}
      role="group"
      aria-label="Язык сайта"
    >
      {(['kk', 'ru'] as const).map((code) => {
        const active = lang === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => choose(code)}
            aria-pressed={active}
            className={cn(
              'px-3 py-2.5 text-[0.85rem] font-medium transition-colors',
              active
                ? 'bg-ink text-bg'
                : onDark
                  ? 'text-white/75 hover:text-white'
                  : 'text-muted hover:text-ink',
            )}
          >
            {code === 'kk' ? 'ҚАЗ' : 'РУС'}
          </button>
        )
      })}
    </div>
  )
}
