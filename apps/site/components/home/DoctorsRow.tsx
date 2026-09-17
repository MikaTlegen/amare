'use client'

/* eslint-disable @next/next/no-img-element -- перенос 1:1 из набросков; next/image — отдельная задача */
import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight, CalendarDays } from 'lucide-react'
import { SectionHeading } from '@amare/ui'
import { DOCTORS } from '@/data/doctors'
import { ROUTES } from '@/lib/clinic'

/**
 * Карусель врачей.
 *
 * Сделана нативным горизонтальным скроллом со scroll-snap, а не drag-слайдером
 * на JS. Так работают свайп на телефоне, колесо на трекпаде, Tab с клавиатуры
 * и скринридер — бесплатно. Стрелки просто прокручивают контейнер.
 */
export function DoctorsRow() {
  const trackRef = useRef<HTMLUListElement>(null)

  const scrollBy = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({ left: direction * 300, behavior: 'smooth' })
  }

  return (
    <section className="flex flex-col gap-7 py-16">
      <div className="container-content">
        <SectionHeading
          title="С пациентом работает команда"
          aside={
            <div className="flex items-center gap-3">
              <Link
                href={ROUTES.team}
                className="hidden items-center gap-2 text-base font-semibold no-underline hover:text-accent sm:inline-flex"
              >
                Все специалисты
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => scrollBy(-1)}
                  aria-label="Предыдущие специалисты"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl border-[1.5px] border-line transition-colors hover:border-ink"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollBy(1)}
                  aria-label="Следующие специалисты"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-bg"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          }
        />
      </div>

      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-8 lg:px-20 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {DOCTORS.map((doctor) => (
          <li key={doctor.id} className="w-[16rem] shrink-0 snap-start">
            <article className="gradient-border group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface">
              <div className="relative aspect-4/5 overflow-hidden bg-tint">
                {doctor.photo ? (
                  <img
                    src={doctor.photo}
                    alt={`${doctor.role} ${doctor.name}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted">
                    [ФОТО с сайта amare.kz]
                  </div>
                )}

                {/* Плашка с сертификатами и записью — по наведению и по фокусу */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-deep to-deep/0 p-4 pt-10 transition-transform duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0">
                  <Link
                    href={ROUTES.booking}
                    className="pointer-events-auto inline-flex min-h-[2.8rem] items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-ink no-underline"
                  >
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    Расписание
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-1 p-5">
                <h3 className="text-lg font-semibold">{doctor.name}</h3>
                <span className="text-base text-muted">{doctor.role}</span>
                <span className="text-base font-medium text-accent">{doctor.experience}</span>
              </div>
            </article>
          </li>
        ))}

        <li className="w-[16rem] shrink-0 snap-start">
          <img
            src="/photos/team.jpg"
            alt="Мультидисциплинарная команда клиники Amare"
            loading="lazy"
            decoding="async"
            className="h-full w-full rounded-3xl object-cover"
          />
        </li>
      </ul>
    </section>
  )
}
