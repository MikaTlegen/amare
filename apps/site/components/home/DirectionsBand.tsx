import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ParallaxBand } from '@amare/ui'
import { SectionHeading } from '@amare/ui'
import { Reveal } from '@amare/ui'
import { DIRECTIONS } from '@/data/directions'
import { ROUTES } from '@/lib/clinic'

/**
 * Направления на фото-подложке.
 *
 * На главной — только названия: подробности живут на отдельной странице.
 * Пять плиток в ряд на десктопе, две колонки на планшете, одна на телефоне.
 */
export function DirectionsBand() {
  return (
    <ParallaxBand
      id="directions"
      image="/photos/walk-bars.jpg"
      alt="Пациент тренирует ходьбу на брусьях вместе со специалистом"
      scrim="medium"
      strength={24}
    >
      <div className="container-content flex flex-col gap-8 py-16">
        <SectionHeading
          onDark
          title="Что восстанавливаем"
          aside={
            <Link
              href={ROUTES.directions}
              className="inline-flex items-center gap-2 text-base font-semibold text-accent no-underline hover:text-white"
            >
              Все направления
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          }
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DIRECTIONS.map((direction, i) => {
            const Icon = direction.icon
            return (
              <Reveal as="li" key={direction.id} delay={i * 0.06}>
                <Link
                  href={ROUTES.directions}
                  className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-white/20 bg-white/10 p-6 no-underline backdrop-blur-xs transition-colors hover:border-white/45 hover:bg-white/16"
                >
                  <Icon className="h-7 w-7 text-sky transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  <span className="font-display text-lg font-medium leading-tight tracking-[-0.035em] text-white">
                    {direction.title}
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </ParallaxBand>
  )
}
