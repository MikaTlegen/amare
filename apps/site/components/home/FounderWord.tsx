/* eslint-disable @next/next/no-img-element -- один портрет; next/image — отдельная задача */
'use client'

import { Quote } from 'lucide-react'
import { useT } from '@amare/i18n/react'
import { Reveal } from '@amare/ui'
import { FOUNDER } from '@/data/founder'

/**
 * Слово основателя.
 *
 * Блок намеренно спокойный: без счётчиков и достижений. Решение о курсе
 * чаще принимают дети пациента, и им важнее увидеть живого человека,
 * который отвечает за клинику, чем ещё один список регалий.
 */
export function FounderWord() {
  const t = useT('progress')

  return (
    <section className="bg-bg px-4 py-20 sm:px-8 lg:px-20">
      <Reveal className="mx-auto grid max-w-content items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          {FOUNDER.photo ? (
            <img
              src={FOUNDER.photo}
              alt={t('founder.photoAlt')}
              loading="lazy"
              decoding="async"
              className="mx-auto w-full max-w-sm rounded-3xl object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="mx-auto flex aspect-square w-full max-w-sm items-center justify-center rounded-3xl bg-tint"
            >
              <span className="font-display text-6xl font-semibold tracking-[-0.02em] text-deep">
                {FOUNDER.initials}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5 lg:col-span-7 lg:col-start-6">
          <Quote className="h-8 w-8 text-brand" aria-hidden="true" />

          <p className="m-0 font-display text-2xl font-medium leading-[1.3] tracking-[-0.02em] text-ink sm:text-3xl">
            {t('founder.quote')}
          </p>

          <p className="m-0 text-base leading-relaxed text-muted">
            {t('founder.credit', { name: t('founder.name'), role: t('founder.roleInline') })}
          </p>
        </div>
      </Reveal>
    </section>
  )
}
