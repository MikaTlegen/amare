'use client'

import { useEffect, useState } from 'react'
import { Check, PlayCircle } from 'lucide-react'
import { VERDICT_LABEL, type VideoReview, type VideoVerdict } from '@amare/api-client'
import { cn } from '@amare/ui'
import { getVideoReviews, reviewVideo } from '@/lib/mock'

const VERDICTS: VideoVerdict[] = ['ok', 'partial', 'wrong']

/** Быстрые ответы: 80% комментариев — это одно из четырёх предложений. */
const QUICK = [
  'Амплитуда меньше нужной — доводите движение до конца.',
  'Темп слишком быстрый, делайте медленнее и без рывков.',
  'Обязательно рядом с опорой и в присутствии близкого.',
  'Всё верно, продолжайте в том же объёме.',
]

function duration(seconds: number): string {
  const min = Math.floor(seconds / 60)
  const sec = String(seconds % 60).padStart(2, '0')
  return `${min}:${sec}`
}

/**
 * Проверка видео (W-03 ТЗ).
 *
 * Плеера здесь пока нет: видео пациента — медицинские данные, они
 * появятся вместе с хранилищем в РК и выдачей по подписанной ссылке.
 * Всё остальное из требования работает уже сейчас: вердикт по шаблону,
 * быстрые ответы и комментарий.
 */
export function VideoReviewPanel() {
  const [items, setItems] = useState<VideoReview[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [verdict, setVerdict] = useState<VideoVerdict>('ok')
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void getVideoReviews().then(setItems)
  }, [])

  const open = (item: VideoReview) => {
    setOpenId(item.id)
    setVerdict(item.verdict ?? 'ok')
    setComment(item.comment)
  }

  const save = async (id: string) => {
    setBusy(true)
    setItems(await reviewVideo(id, verdict, comment))
    setBusy(false)
    setOpenId(null)
  }

  const pending = items.filter((item) => !item.verdict)

  return (
    <div className="flex flex-col gap-5">
      <p className="m-0 text-base text-muted">
        Непроверенных видео: {pending.length} из {items.length}
      </p>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              'flex flex-col gap-4 rounded-3xl border p-5',
              item.verdict ? 'border-line bg-bg' : 'border-accent bg-surface',
            )}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tint">
                <PlayCircle className="h-6 w-6 text-deep" aria-hidden="true" />
              </span>

              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-lg font-semibold">
                  {item.patientName} · {item.exercise}
                </span>
                <span className="text-base text-muted">
                  {item.at} · запись {duration(item.seconds)}
                </span>
                {item.verdict && (
                  <span className="text-base font-medium text-brand">
                    {VERDICT_LABEL[item.verdict]}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => (openId === item.id ? setOpenId(null) : open(item))}
                className="min-h-[3.2rem] shrink-0 rounded-xl border-[1.5px] border-line px-5 py-3 text-base font-semibold transition-colors hover:border-ink"
              >
                {openId === item.id ? 'Свернуть' : item.verdict ? 'Изменить' : 'Оценить'}
              </button>
            </div>

            {item.comment && openId !== item.id && (
              <p className="m-0 rounded-2xl bg-bg px-5 py-4 text-base leading-relaxed">
                {item.comment}
              </p>
            )}

            {openId === item.id && (
              <div className="flex flex-col gap-4 border-t border-line pt-4">
                <div className="flex flex-wrap gap-2">
                  {VERDICTS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setVerdict(value)}
                      aria-pressed={verdict === value}
                      className={cn(
                        'min-h-[3rem] rounded-xl px-5 py-2.5 text-base font-medium transition-colors',
                        verdict === value
                          ? 'bg-deep text-white'
                          : 'border border-line text-muted hover:border-ink hover:text-ink',
                      )}
                    >
                      {VERDICT_LABEL[value]}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {QUICK.map((text) => (
                    <button
                      key={text}
                      type="button"
                      onClick={() => setComment(text)}
                      className="rounded-full border border-line px-4 py-2 text-sm text-muted hover:border-ink hover:text-ink"
                    >
                      {text}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Что исправить в технике"
                  aria-label="Комментарий пациенту"
                  className="rounded-xl border-[1.5px] border-line bg-bg px-4 py-3 text-base"
                />

                <button
                  type="button"
                  onClick={() => void save(item.id)}
                  disabled={busy}
                  className="inline-flex min-h-[3.2rem] w-fit items-center gap-2 rounded-xl bg-deep px-6 py-3 text-base font-semibold text-white disabled:opacity-60"
                >
                  <Check className="h-5 w-5" aria-hidden="true" />
                  {busy ? 'Сохраняем…' : 'Отправить пациенту'}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      <p className="m-0 text-base leading-relaxed text-muted">
        {/* TODO BACKEND: плеер появится вместе с хранилищем видео в РК */}
        Просмотр записи подключается вместе с хранилищем: видео пациента нельзя отдавать по прямой
        ссылке.
      </p>
    </div>
  )
}
