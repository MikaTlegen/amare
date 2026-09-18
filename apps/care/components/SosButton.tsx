'use client'

import { useEffect, useRef, useState } from 'react'
import { Phone, TriangleAlert, X } from 'lucide-react'

const SIGNS = [
  { letter: 'У', title: 'Улыбка', text: 'Попросите улыбнуться. Один угол рта не поднимается.' },
  { letter: 'Д', title: 'Движение', text: 'Попросите поднять обе руки. Одна опускается.' },
  { letter: 'А', title: 'Артикуляция', text: 'Попросите повторить фразу. Речь невнятная.' },
  { letter: 'Р', title: 'Решение', text: 'Есть хоть один признак — звоните 103 немедленно.' },
]

const BEFORE_AMBULANCE = [
  'Уложите человека, приподняв голову и плечи. Не давайте вставать.',
  'Не давайте еду, питьё и лекарства — при инсульте нарушено глотание.',
  'Расстегните тесную одежду, откройте окно.',
  'Если рвота — поверните голову набок.',
  'Запомните время, когда человек был в норме последний раз: врачи считают срок от него.',
  'Соберите документы и список принимаемых лекарств к приезду бригады.',
]

/**
 * Кнопка SOS (P-06 ТЗ).
 *
 * Требования, из которых вырос этот компонент:
 *   — кнопка постоянная, видна с любого экрана кабинета;
 *   — первый экран после нажатия — признаки инсульта, а не форма;
 *   — звонок 103 в одно касание;
 *   — есть экран «что делать до приезда скорой».
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex min-h-16 items-center gap-3 rounded-full bg-[rgb(179,38,30)] px-7 text-xl font-bold text-white shadow-[0_14px_34px_rgba(179,38,30,0.45)]"
      >
        <TriangleAlert className="h-7 w-7" aria-hidden="true" />
        SOS
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        aria-label="Признаки инсульта и вызов скорой"
        className="m-auto w-[min(40rem,92vw)] rounded-3xl border border-line bg-bg p-0 text-ink backdrop:bg-ink/60"
      >
        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 className="m-0 font-display text-2xl font-semibold tracking-[-0.04em]">
              Признаки инсульта
            </h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Закрыть"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <a
            href="tel:103"
            className="flex min-h-16 items-center justify-center gap-3 rounded-2xl bg-[rgb(179,38,30)] px-6 text-2xl font-bold text-white no-underline"
          >
            <Phone className="h-7 w-7" aria-hidden="true" />
            Позвонить 103
          </a>

          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {SIGNS.map((sign) => (
              <li key={sign.letter} className="flex gap-4 rounded-2xl bg-surface px-5 py-4">
                <span className="font-display text-3xl font-bold leading-none text-[rgb(179,38,30)]">
                  {sign.letter}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-lg font-semibold">{sign.title}</span>
                  <span className="text-base leading-relaxed text-muted">{sign.text}</span>
                </span>
              </li>
            ))}
          </ul>

          <details className="rounded-2xl border border-line px-5 py-4">
            <summary className="cursor-pointer text-lg font-semibold">
              Что делать до приезда скорой
            </summary>
            <ul className="mt-3 flex list-none flex-col gap-2 p-0">
              {BEFORE_AMBULANCE.map((item) => (
                <li key={item} className="text-base leading-relaxed text-ink/85">
                  — {item}
                </li>
              ))}
            </ul>
          </details>

          <p className="m-0 rounded-2xl border border-accent bg-[rgb(253,238,237)] px-5 py-4 text-base leading-relaxed">
            Демонстрационный режим: уведомление куратору и опекуну отсюда пока не уходит. Звоните
            103 — это работает всегда.
          </p>
        </div>
      </dialog>
    </>
  )
}
