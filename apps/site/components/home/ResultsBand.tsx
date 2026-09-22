'use client'

import { ParallaxBand } from '@amare/ui'
import { Button } from '@/components/Links'
import { Reveal } from '@amare/ui'
import { BarthelChart } from '@amare/ui'
import { DEMO_PROGRESS_VALUES, PROGRESS_SUMMARY } from '@/data/progress'
import { useContentList, useT } from '@amare/i18n/react'
import { ROUTES } from '@/lib/clinic'

/**
 * Блок результатов.
 *
 * Здесь принципиальна честность: цифры демонстрационные и подписаны как
 * демонстрационные, а реальные истории публикуются только с согласия
 * пациента (S-08 ТЗ). Красивый график с выдуманными данными в медицине —
 * это не маркетинг, а повод для претензии.
 *
 * Агрегаты по клинике рисуются только когда они заполнены: строка
 * «+[X] баллов» на публичной странице выглядит как сломанный шаблон.
 */
export function ResultsBand() {
  const t = useT('progress')
  const list = useContentList('progress')

  // Подписи дней переводятся, значения остаются демонстрационными
  const data = list('days').map((day, i) => ({ day, barthel: DEMO_PROGRESS_VALUES[i] ?? 0 }))

  const hasAggregates = PROGRESS_SUMMARY.averageGain || PROGRESS_SUMMARY.completionRate

  return (
    <ParallaxBand
      id="results"
      image="/photos/lobby.jpg"
      alt={t('band.alt')}
      scrim="strong"
      strength={22}
    >
      <div className="container-content grid items-center gap-10 py-16 lg:grid-cols-12">
        <Reveal className="flex flex-col gap-5 lg:col-span-5">
          <h2 className="font-display text-3xl font-medium leading-[1.15] tracking-[-0.02em] text-white sm:text-4xl sm:leading-10">
            {t('band.title')}
          </h2>
          <p className="text-lg leading-relaxed text-white/75">
            {t('band.note')}
          </p>

          {hasAggregates && (
            <dl className="flex flex-wrap gap-8">
              {PROGRESS_SUMMARY.averageGain && (
                <div>
                  <dt className="text-sm text-white/60">{t('band.averageGain')}</dt>
                  <dd className="font-display text-2xl font-semibold tracking-[-0.02em] text-white">
                    {PROGRESS_SUMMARY.averageGain}
                  </dd>
                </div>
              )}
              {PROGRESS_SUMMARY.completionRate && (
                <div>
                  <dt className="text-sm text-white/60">{t('band.completionRate')}</dt>
                  <dd className="font-display text-2xl font-semibold tracking-[-0.02em] text-white">
                    {PROGRESS_SUMMARY.completionRate}
                  </dd>
                </div>
              )}
            </dl>
          )}

          <Button to={ROUTES.results} size="lg" className="self-start">
            {t('band.stories')}
          </Button>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-5 lg:col-span-7">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-semibold text-white">{t('band.chartTitle')}</span>
            <span className="text-sm text-white/55">{t('band.demo')}</span>
          </div>

          <BarthelChart onDark data={data} />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/20 px-5 py-4">
              <span className="text-sm text-white/60">{t('band.beforeLabel')}</span>
              <p className="m-0 text-base font-semibold text-white">{t('before')}</p>
            </div>
            <div className="rounded-2xl border border-accent/50 bg-accent/10 px-5 py-4">
              <span className="text-sm text-white">{t('band.afterLabel')}</span>
              <p className="m-0 text-base font-semibold text-white">{t('after')}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </ParallaxBand>
  )
}
