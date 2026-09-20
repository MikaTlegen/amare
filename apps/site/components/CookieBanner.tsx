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
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface px-4 pt-4 pb-[calc(6rem_+_env(safe-area-inset-bottom))] shadow-2xl sm:px-8 md:pb-4"
    >
      <div className="mx-auto flex max-w-content flex-col gap-4 lg:flex-row lg:items-center">
        <Cookie className="h-6 w-6 shrink-0 text-brand" aria-hidden="true" />

        <p className="m-0 flex-1 text-base leading-relaxed">
          {t('cookie.text')}{' '}
          <Link href={ROUTES.privacy} className="tap-target font-semibold">
            {t('cookie.policy')}
          </Link>
        </p>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => decide('necessary')}
            className="min-h-12 rounded-xl border-[1.5px] border-line-strong px-5 py-3 text-base font-semibold"
          >
            {t('cookie.necessary')}
          </button>
          <button
            type="button"
            onClick={() => decide('all')}
            className="min-h-12 rounded-xl bg-deep px-5 py-3 text-base font-semibold text-white"
          >
            {t('cookie.acceptAll')}
          </button>
        </div>
      </div>
    </div>
  )
}
