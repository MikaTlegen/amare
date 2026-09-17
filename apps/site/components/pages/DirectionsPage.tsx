/* eslint-disable @next/next/no-img-element -- перенос 1:1 из набросков; next/image — отдельная задача */
import { PageCover } from '@/components/PageCover'
import { Reveal } from '@amare/ui'
import { Button } from '@amare/ui'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { DIRECTIONS } from '@/data/directions'
import { CONDITION_LIST, DOCTORS } from '@/data/doctors'
import { CLINIC, ROUTES } from '@/lib/clinic'
import { cn } from '@amare/ui'

/** Страница «Направления»: сюда ушли развёрнутые описания с главной. */
export function DirectionsPage() {
  return (
    <>
      <PageCover
        crumb="Направления"
        title="Что именно мы восстанавливаем"
        note="Каждое направление — бытовой навык, а не процедура. Прогресс по нему замеряется шкалой и виден в кабинете."
        image="/photos/equipment.jpg"
        alt="Реабилитационное оборудование в зале клиники"
      />

      <section className="container-content flex flex-col gap-5 py-14">
        {DIRECTIONS.map((direction, i) => {
          const Icon = direction.icon
          const wide = i === 0
          return (
            <Reveal
              as="article"
              key={direction.id}
              delay={i * 0.05}
              className={cn(
                'gradient-border overflow-hidden rounded-3xl border border-line bg-surface',
                wide ? 'grid lg:grid-cols-12' : '',
              )}
            >
              {wide && direction.photo && (
                <img
                  src={direction.photo}
                  alt={direction.photoAlt ?? ''}
                  loading="lazy"
                  decoding="async"
                  className="h-64 w-full object-cover lg:col-span-4 lg:h-full"
                />
              )}

              <div
                className={cn(
                  'flex flex-col justify-center gap-3 p-7 sm:p-8',
                  wide && 'lg:col-span-8',
                )}
              >
                <span className="flex items-center gap-2 font-display text-sm font-semibold text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {direction.method}
                </span>

                <h2 className="font-display text-2xl font-medium tracking-[-0.04em] sm:text-[1.7rem] leading-8">
                  {direction.title}
                </h2>

                <p className="max-w-[44em] text-lg leading-relaxed text-ink/80">{direction.full}</p>

                <ul className="flex flex-wrap gap-2">
                  {direction.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-tint px-3 py-1.5 text-sm font-medium text-deep"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )
        })}
      </section>

      {/*
        Каждое состояние — ссылка на врачей, которые с ним работают.
        Раньше это был мёртвый список: человек прочитал «ишемический
        инсульт» и не знал, что делать дальше. Теперь следующий шаг очевиден.
      */}
      <section className="container-content flex flex-col gap-5 pb-14">
        <h2 className="font-display text-3xl font-medium tracking-[-0.045em]">
          С какими состояниями работаем
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {CONDITION_LIST.map((condition) => {
            const count = DOCTORS.filter((d) => d.conditions.includes(condition.id)).length
            return (
              <li key={condition.id}>
                <Link
                  href={`${ROUTES.team}?condition=${condition.id}`}
                  className="group flex h-full flex-col justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-5 no-underline transition-colors hover:border-brand"
                >
                  <span className="text-base font-medium text-ink">{condition.label}</span>
                  <span className="inline-flex items-center gap-2 text-base font-semibold text-brand">
                    {count} специалиста
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="container-content pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl border border-tint bg-tint p-8 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="font-display text-2xl font-medium tracking-[-0.04em]">
              Не знаете, с чего начать?
            </h2>
            <p className="text-base text-ink/75">
              Опишите состояние в анкете — врач-реабилитолог предложит направление.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to={ROUTES.form}>Заполнить анкету</Button>
            <Button href={CLINIC.phones[0].href} variant="outline">
              {CLINIC.phones[0].label}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
