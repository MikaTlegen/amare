'use client'

import { useEffect, useState } from 'react'
import { FileText, PlayCircle } from 'lucide-react'
import type { Material } from '@amare/api-client'
import { useT } from '@amare/i18n/react'
import { getMaterials } from '@/lib/mock'

/**
 * Материалы (P-11 ТЗ).
 *
 * Показываем только то, что назначил специалист, и подписываем кем.
 * Общая библиотека «на почитать» здесь не нужна: у человека после
 * инсульта ограничен ресурс внимания, и лишние карточки уводят от
 * того, что ему действительно велели посмотреть.
 *
 * TODO CMS: материалы приходят из базы знаний сайта (S-07) через
 * админку модуля M2, а не лежат в моке.
 */
export function MaterialsPanel() {
  const t = useT('cabinet')
  const [items, setItems] = useState<Material[]>([])

  useEffect(() => {
    void getMaterials().then(setItems)
  }, [])

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <ul className="m-0 grid list-none gap-3 p-0 sm:gap-4 lg:grid-cols-2">
        {items.map((item) => {
          const Icon = item.kind === 'video' ? PlayCircle : FileText
          return (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-4 sm:p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint">
                <Icon className="h-6 w-6 text-deep" aria-hidden="true" />
              </span>

              <h2 className="m-0 text-lg font-semibold leading-snug">{item.title}</h2>
              <p className="m-0 text-base leading-relaxed text-muted">{item.note}</p>

              <span className="mt-auto text-base text-muted">
                {item.kind === 'video' ? t('materials.video') : t('materials.article')} ·{' '}
                {t('materials.minutes', { count: item.minutes })} ·{' '}
                {item.assignedBy}
              </span>

              {/* Статья без внешней ссылки читается прямо здесь; без ссылки и
                  без текста материал виден, но открыть его нечем — кнопка гаснет */}
              {!item.url && item.text ? (
                <ArticleReader id={item.id} text={item.text} />
              ) : item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[3.2rem] items-center justify-center rounded-xl bg-deep px-5 py-3 text-base font-semibold text-white no-underline"
                >
                  {item.kind === 'video' ? t('materials.watch') : t('materials.read')}
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="min-h-[3.2rem] rounded-xl bg-deep px-5 py-3 text-base font-semibold text-white opacity-50"
                >
                  {item.kind === 'video' ? t('materials.watch') : t('materials.read')}
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <p className="m-0 text-base leading-relaxed text-muted">
        {t('materials.note')}
      </p>
    </div>
  )
}

/** Статья, которая раскрывается на месте: без перехода на другой сайт. */
function ArticleReader({ id, text }: { id: string; text: string[] }) {
  const t = useT('cabinet')
  const [open, setOpen] = useState(false)
  const bodyId = `article-${id}`

  return (
    <>
      {open && (
        <div id={bodyId} className="flex flex-col gap-2.5 rounded-2xl bg-bg p-4">
          {text.map((line) => (
            <p key={line} className="m-0 text-base leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="min-h-[3.2rem] rounded-xl bg-deep px-5 py-3 text-base font-semibold text-white"
      >
        {open ? t('materials.close') : t('materials.read')}
      </button>
    </>
  )
}
