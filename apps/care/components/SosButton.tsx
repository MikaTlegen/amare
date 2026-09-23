'use client'

import { useEffect, useRef, useState } from 'react'
import { Phone, TriangleAlert, X } from 'lucide-react'
import { useContent, useContentList, useT } from '@amare/i18n/react'

/** Порядок признаков. Буквы и тексты лежат в словаре: мнемоника у каждого языка своя. */
const SIGN_IDS = ['smile', 'move', 'speech', 'act'] as const

/** Единый номер скорой помощи в Казахстане. */
const EMERGENCY_PHONE = '103'

/**
 * Кнопка SOS (P-06 ТЗ).
 *
 * Требования, из которых вырос этот компонент:
 *   — кнопка постоянная, видна с любого экрана кабинета;
 *   — первый экран после нажатия — признаки инсульта, а не форма;
 *   — звонок 103 в одно касание;
 *   — есть экран «что делать до приезда скорой».
 *
 * Раньше кнопка плавала поверх контента (fixed, правый нижний угол) и
 * перекрывала нижние элементы форм — по отзыву перенесена в шапку
 * CabinetShell, рядом с переключателем языка и доступностью: она всё ещё
 * видна с любого экрана кабинета, но больше не мешает контенту под собой.
 *
 * Диалог сделан на нативном <dialog>: он сам ставит фокус, запирает его
 * внутри и закрывается по Escape. Для аудитории 55+ важнее, что это
 * работает даже если JS-обработчики где-то отвалятся, чем красота.
 *
 * TODO BACKEND: по ТЗ нажатие SOS уведомляет опекуна и куратора с
 * отметкой времени. Пока уведомлять некого — бэкенда нет, и делать вид,
 * что сигнал ушёл, опаснее, чем честно об этом написать.
 */
export function SosButton() {
  const t = useT('cabinet')
  const text = useContent('cabinet')
  const list = useContentList('cabinet')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <>
      {/*
       * Иконка-кнопка среди обычных элементов шапки (язык, доступность) —
       * тот же размер и стиль контурной кнопки, не тревожный сплошной
       * красный: кнопка стоит на экране постоянно, и агрессивный вид на
       * каждом шаге приучает его не замечать. Смысл (признаки инсульта,
       * звонок 103) не меняется — это внутри диалога, и там звонок
       * остаётся заметно красным.
       */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t('sos.open')}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line text-accent transition-colors hover:border-ink"
      >
        <TriangleAlert className="h-5 w-5" aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        aria-label={t('sos.open')}
        className="m-auto max-h-[90dvh] w-[min(40rem,92vw)] overflow-y-auto overscroll-contain rounded-3xl border border-line bg-bg p-0 text-ink backdrop:bg-ink/60"
      >
        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 className="m-0 font-display text-2xl font-semibold tracking-[-0.04em]">
              {t('sos.signs')}
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('sos.close')}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <a
            href={`tel:${EMERGENCY_PHONE}`}
            className="flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-[rgb(179,38,30)] px-6 text-2xl font-bold text-white no-underline"
          >
            <Phone className="h-7 w-7" aria-hidden="true" />
            {t('sos.call', { phone: EMERGENCY_PHONE })}
          </a>

          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {SIGN_IDS.map((id) => (
              <li key={id} className="flex gap-4 rounded-2xl bg-surface px-5 py-4">
                <span className="font-display text-3xl font-bold leading-none text-[rgb(179,38,30)]">
                  {text(`sos.sign.${id}.letter`)}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-lg font-semibold">{text(`sos.sign.${id}.title`)}</span>
                  <span className="text-base leading-relaxed text-muted">
                    {text(`sos.sign.${id}.text`, { phone: EMERGENCY_PHONE })}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <details className="rounded-2xl border border-line px-5 py-4">
            <summary className="cursor-pointer text-lg font-semibold">
              {t('sos.before')}
            </summary>
            <ul className="mt-3 flex list-none flex-col gap-2 p-0">
              {list('sos.steps').map((item) => (
                <li key={item} className="text-base leading-relaxed text-ink/85">
                  — {item}
                </li>
              ))}
            </ul>
          </details>

          <p className="m-0 rounded-2xl border border-accent bg-[rgb(253,238,237)] px-5 py-4 text-base leading-relaxed">
            {t('sos.demo', { phone: EMERGENCY_PHONE })}
          </p>
        </div>
      </dialog>
    </>
  )
}
