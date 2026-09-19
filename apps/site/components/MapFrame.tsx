'use client'

import { useState } from 'react'
import { MousePointerClick } from 'lucide-react'
import { MAP } from '@/lib/clinic'

/**
 * Карта 2ГИС с «замком» до первого клика.
 *
 * Зачем замок: пока карта активна, колесо мыши над ней масштабирует
 * карту, а не листает страницу — человек прокручивает и застревает
 * посреди контактов. Поэтому карта включается по клику, а до этого
 * поверх лежит прозрачный слой.
 *
 * После клика карта работает полностью: зум колесом, перетаскивание,
 * полноэкранный режим. Слой убирается насовсем — второй раз объяснять
 * человеку то же самое не нужно.
 *
 * sandbox ограничивает фрейм: скрипты и формы ему нужны для работы карты,
 * а увести пользователя со страницы он может только по его же действию.
 */
export function MapFrame({ title }: { title: string }) {
  const [active, setActive] = useState(false)
  const src = `https://makemap.2gis.ru/widget?data=${MAP.widgetData}`

  return (
    <div className="relative h-full min-h-80 w-full overflow-hidden sm:min-h-112 rounded-3xl border border-line bg-tint">
      <iframe
        title={title}
        src={src}
        loading="lazy"
        allowFullScreen
        sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
        className="absolute inset-0 h-full w-full border-0"
      />

      {!active && (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="absolute inset-0 flex items-end justify-center bg-transparent pb-6 transition-colors hover:bg-[rgba(8,58,66,0.12)]"
        >
          <span className="inline-flex items-center gap-2 rounded-xl bg-deep/90 px-5 py-3 text-base font-semibold text-white shadow-lg">
            <MousePointerClick className="h-5 w-5" aria-hidden="true" />
            Нажмите, чтобы двигать и масштабировать карту
          </span>
        </button>
      )}
    </div>
  )
}
