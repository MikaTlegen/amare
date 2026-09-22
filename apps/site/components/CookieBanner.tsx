'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/components/Links'
import { Cookie } from 'lucide-react'
import { useT } from '@amare/i18n/react'
import { ROUTES } from '@/lib/clinic'

const STORAGE_KEY = 'amare:cookie-choice'

/**
 * Баннер согласия на куки (требование S-10 ТЗ).
 *
 * Зачем он тут появился: карта 2ГИС грузится сразу, а это сторонний
 * ресурс с собственными куками. Плюс рано или поздно подключат аналитику.
 *
 * Важно: баннер даёт РЕАЛЬНЫЙ выбор, а не одну кнопку «принять» —
 * иначе он бесполезен юридически. Отказ запоминается и означает, что
 * необязательные скрипты подключать нельзя.
 *
 * TODO: связать выбор с загрузкой аналитики — пока подключать нечего,
 * поэтому решение только сохраняется.
 *
 * Габарит: карточка, а не полоса во всю ширину. Полоса с отступом под панель
 * действий закрывала на телефоне половину первого экрана — заголовок и кнопка
 * оказывались под ней. Ниже lg карточка стоит над нижней навигацией (отступ
 * снизу больше её высоты — сторожит mobile-layout.test.ts), с lg — в левом
 * нижнем углу: справа там висит круглая кнопка связи, и карточка её накрывала.
 */
export function CookieBanner() {
  const t = useT('common')
  const [choice, setChoice] = useState<string | null>('pending')

  useEffect(() => {
    try {
      setChoice(localStorage.getItem(STORAGE_KEY))
    } catch {
      setChoice(null)
    }
  }, [])

  const decide = (value: 'all' | 'necessary') => {
    setChoice(value)
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // приватный режим — решение просто не переживёт перезагрузку
    }
  }

  // 'pending' — первый рендер до чтения хранилища, баннер не мигает
  if (choice !== null) return null

  return (
    <div
      role="region"
      aria-label={t('cookie.region')}
      className="fixed left-4 right-4 bottom-[calc(5rem_+_env(safe-area-inset-bottom))] z-50 rounded-2xl border border-line bg-surface p-4 shadow-xl lg:right-auto lg:bottom-6 lg:left-6 lg:max-w-sm"
    >
      <div className="flex gap-3">
        <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />

        <p className="m-0 text-sm leading-snug text-muted">
          {t('cookie.text')}{' '}
          <Link href={ROUTES.privacy} className="tap-target font-semibold text-ink">
            {t('cookie.policy')}
          </Link>
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => decide('necessary')}
          className="min-h-11 flex-1 rounded-xl border-[1.5px] border-line-strong px-3 text-sm font-semibold"
        >
          {t('cookie.necessary')}
        </button>
        <button
          type="button"
          onClick={() => decide('all')}
          className="min-h-11 flex-1 rounded-xl bg-deep px-3 text-sm font-semibold text-white"
        >
          {t('cookie.acceptAll')}
        </button>
      </div>
    </div>
  )
}
