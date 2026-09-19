'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { LOCALES, localeHref, stripLocale, writeStoredLocale, type Locale } from '@amare/i18n/locales'
import { useLocale, useT } from '@amare/i18n/react'
import { cn } from './cn'

/**
 * Переключатель языка.
 *
 * По ТЗ (S-01, S-12) языки живут на отдельных адресах: русский в корне,
 * казахский под /kk/. Поэтому это не кнопки с состоянием, а настоящие
 * ссылки — их видит поисковик, их можно открыть в новой вкладке, и
 * hreflang на них указывает на ту же страницу в другом языке.
 *
 * Полная перезагрузка при переключении — следствие двух корневых макетов
 * (у каждого свой <html lang>), поэтому <a>, а не router.push: так честнее
 * и без неочевидной задержки.
 *
 * Параметры и якорь дописываются после гидратации из window.location:
 * useSearchParams потребовал бы обернуть в Suspense всю шапку, а без них
 * переключение языка на /zapis?doctor=kuspanova теряло бы выбранного врача.
 */
const LABEL = { ru: 'lang.ru', kk: 'lang.kk' } as const

export function LanguageSwitch({
  onDark = false,
  onChange,
}: {
  onDark?: boolean
  /** Кабинеты живут без префикса локали: там язык переключается, а адрес нет. */
  onChange?: (locale: Locale) => void
}) {
  const active = useLocale()
  const pathname = usePathname()
  const t = useT('ui')
  const [tail, setTail] = useState('')

  useEffect(() => {
    setTail(window.location.search + window.location.hash)
  }, [pathname])

  const path = stripLocale(pathname) + tail

  return (
    <div
      className={cn(
        'flex overflow-hidden rounded-xl border',
        onDark ? 'border-white/30' : 'border-line',
      )}
      role="group"
      aria-label={t('lang.group')}
    >
      {LOCALES.map((code) => {
        const current = code === active
        const className = cn(
          'px-3 py-2.5 text-[0.85rem] font-medium transition-colors',
          current
            ? 'bg-ink text-bg'
            : onDark
              ? 'text-white/75 hover:text-white'
              : 'text-muted hover:text-ink',
        )

        if (onChange) {
          return (
            <button
              key={code}
              type="button"
              onClick={() => onChange(code)}
              aria-current={current ? 'true' : undefined}
              className={className}
            >
              {t(LABEL[code])}
            </button>
          )
        }

        return (
          <a
            key={code}
            href={localeHref(code, path)}
            // Кабинеты живут без префикса локали и читают выбор из хранилища
            onClick={() => writeStoredLocale(code)}
            hrefLang={code}
            aria-current={current ? 'page' : undefined}
            className={cn(className, 'no-underline')}
          >
            {t(LABEL[code])}
          </a>
        )
      })}
    </div>
  )
}
