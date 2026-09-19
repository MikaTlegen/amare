'use client'

import { useEffect, useState } from 'react'
import { Check, PlayCircle } from 'lucide-react'
import { VERDICT_KEY, type VideoReview, type VideoVerdict } from '@amare/api-client'
import { cn } from '@amare/ui'
import { useContent, useT } from '@amare/i18n/react'
import { getVideoReviews, reviewVideo } from '@/lib/mock'

const VERDICTS: VideoVerdict[] = ['ok', 'partial', 'wrong']

/** Быстрые ответы: 80% комментариев — это одно из четырёх предложений. */
const QUICK_KEYS = ['verdict.amplitude', 'verdict.tempo', 'verdict.support', 'verdict.ok'] as const

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
  const t = useT('staff')
  const text = useContent('staff')
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
          {t('video.pending', { pending: pending.length, total: items.length })}
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
                  {item.at} · {t('video.recorded', { duration: duration(item.seconds) })}
                </span>
                {item.verdict && (
                  <span className="text-base font-medium text-brand">
                    {text(VERDICT_KEY[item.verdict])}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => (openId === item.id ? setOpenId(null) : open(item))}
                className="min-h-[3.2rem] shrink-0 rounded-xl border-[1.5px] border-line px-5 py-3 text-base font-semibold transition-colors hover:border-ink"
              >
                {openId === item.id
                  ? t('video.collapse')
                  : item.verdict
                    ? t('video.edit')
                    : t('video.rate')}
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
                      {text(VERDICT_KEY[value])}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {QUICK_KEYS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setComment(t(key))}
                      className="min-h-11 max-w-full rounded-2xl border border-line px-4 py-2.5 text-left text-sm text-muted [overflow-wrap:anywhere] hover:border-ink hover:text-ink sm:rounded-full"
                    >
                      {t(key)}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder={t('video.technique')}
                  aria-label={t('video.comment')}
                  className="rounded-xl border-[1.5px] border-line bg-bg px-4 py-3 text-base"
                />

                <button
                  type="button"
                  onClick={() => void save(item.id)}
                  disabled={busy}
                  className="inline-flex min-h-[3.2rem] w-fit items-center gap-2 rounded-xl bg-deep px-6 py-3 text-base font-semibold text-white disabled:opacity-60"
                >
                  <Check className="h-5 w-5" aria-hidden="true" />
                  {busy ? t('video.saving') : t('video.send')}
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
