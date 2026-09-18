'use client'

import { useEffect, useState } from 'react'
import { Check, Send } from 'lucide-react'
import type { PatientCard, WeeklyReview } from '@amare/api-client'
import { getWeeklyReview, sendWeeklyReview } from '@/lib/mock'

/**
 * Еженедельный разбор (W-05 ТЗ).
 *
 * Черновик собирается автоматически из фактов недели, но отправляет его
 * человек и после правки. Полностью автоматическое письмо от имени
 * специалиста — это обещание внимания, которого не было; пациент
 * замечает такое быстро и перестаёт читать вообще.
 */
export function WeeklyReviewSection({ patient }: { patient: PatientCard }) {
  const [review, setReview] = useState<WeeklyReview | null>(null)
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void getWeeklyReview(patient).then((next) => {
      setReview(next)
      setText(next.draft)
    })
  }, [patient])

  if (!review) return <p className="text-lg text-muted">Собираем сводку…</p>

  const send = async () => {
    setBusy(true)
    const at = await sendWeeklyReview(patient.id)
    setReview({ ...review, sentAt: at })
    setBusy(false)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <section className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-6 lg:col-span-5">
        <h3 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
          Что было на неделе
        </h3>

        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {review.facts.map((fact) => (
            <li key={fact} className="rounded-2xl bg-bg px-4 py-3 text-base leading-relaxed">
              {fact}
            </li>
          ))}
        </ul>

        <p className="m-0 text-base leading-relaxed text-muted">
          Факты собраны из карты автоматически. Если цифра выглядит неверной — это повод проверить
          отметки, а не переписать письмо.
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 lg:col-span-7">
        <h3 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
          Письмо пациенту и опекуну
        </h3>

        <textarea
          rows={12}
          value={text}
          onChange={(event) => setText(event.target.value)}
          aria-label="Текст еженедельного разбора"
          className="rounded-xl border-[1.5px] border-line bg-bg px-4 py-3 text-base leading-relaxed"
        />

        <button
          type="button"
          onClick={() => void send()}
          disabled={busy}
          className="inline-flex min-h-[3.2rem] w-fit items-center gap-2 rounded-xl bg-deep px-6 py-3 text-base font-semibold text-white disabled:opacity-60"
        >
          <Send className="h-5 w-5" aria-hidden="true" />
          {busy ? 'Отправляем…' : 'Отправить разбор'}
        </button>

        {review.sentAt && (
          <p className="m-0 flex items-center gap-2 text-base font-medium text-brand">
            <Check className="h-5 w-5" aria-hidden="true" />
            Разбор отправлен {review.sentAt}
          </p>
        )}
      </section>
    </div>
  )
}
