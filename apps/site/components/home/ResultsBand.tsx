import { ParallaxBand } from '@amare/ui'
import { Button } from '@amare/ui'
import { Reveal } from '@amare/ui'
import { BarthelChart } from '@amare/ui'
import { DEMO_PROGRESS, PROGRESS_SUMMARY } from '@/data/progress'
import { ROUTES } from '@/lib/clinic'

/**
 * Блок результатов.
 *
 * Здесь принципиальна честность: цифры демонстрационные и подписаны как
 * демонстрационные, а реальные истории публикуются только с согласия
 * пациента (S-08 ТЗ). Красивый график с выдуманными данными в медицине —
 * это не маркетинг, а повод для претензии.
 */
export function ResultsBand() {
  return (
    <ParallaxBand
      id="results"
      image="/photos/lobby.jpg"
      alt="Зона ожидания клиники Amare"
      scrim="strong"
      strength={22}
    >
      <div className="container-content grid items-center gap-10 py-16 lg:grid-cols-12">
        <Reveal className="flex flex-col gap-5 lg:col-span-5">
          <h2 className="font-display text-3xl font-medium leading-[1.15] tracking-[-0.045em] text-white sm:text-4xl sm:leading-10">
            Прогресс видно в цифрах
          </h2>
          <p className="text-lg leading-relaxed text-white/75">
            Индекс Бартел показывает бытовую самостоятельность: 0 — полная зависимость от
            посторонней помощи, 100 — человек справляется сам.
          </p>

          <dl className="flex flex-wrap gap-8">
            <div>
              <dt className="text-sm text-white/60">Средний рост за курс</dt>
              <dd className="font-display text-2xl font-semibold tracking-[-0.04em] text-white">
                {PROGRESS_SUMMARY.averageGain}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/60">Доходят до конца курса</dt>
              <dd className="font-display text-2xl font-semibold tracking-[-0.04em] text-white">
                {PROGRESS_SUMMARY.completionRate}
              </dd>
            </div>
          </dl>

          <Button to={ROUTES.results} size="lg" className="self-start">
            Истории восстановления
          </Button>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-5 lg:col-span-7">
          <div className="flex items-baseline justify-between">
            <span className="text-base font-semibold text-white">Индекс Бартел за 20 дней</span>
            <span className="text-sm text-white/55">демонстрационные данные</span>
          </div>

          <BarthelChart onDark data={DEMO_PROGRESS} />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/20 px-5 py-4">
              <span className="text-sm text-white/60">Было</span>
              <p className="m-0 text-base font-semibold text-white">{PROGRESS_SUMMARY.before}</p>
            </div>
            <div className="rounded-2xl border border-accent/50 bg-accent/10 px-5 py-4">
              <span className="text-sm text-[rgb(248,180,175)]">Стало</span>
              <p className="m-0 text-base font-semibold text-white">{PROGRESS_SUMMARY.after}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </ParallaxBand>
  )
}
