'use client'

import { useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useReducedMotion } from 'motion/react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { DOCTORS } from '@/data/doctors'
import { bookingLink } from '@/lib/clinic'

/** Первый сдвиг — через секунду после загрузки, дальше раз в три секунды. */
const AUTO_SCROLL_DELAY = 1_000
const AUTO_SCROLL_INTERVAL = 3_000

/** Компактная бесконечная лента специалистов с ручным управлением. */
export function DoctorsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const reduced = useReducedMotion()
  const doctors = [...DOCTORS, ...DOCTORS]

  const getStep = useCallback(() => {
    const track = trackRef.current
    const card = track?.querySelector<HTMLElement>('[data-doctor-card]')
    return card ? card.offsetWidth + 20 : track?.clientWidth ?? 0
  }, [])

  const move = useCallback((direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return

    const step = getStep()
    const loopWidth = track.scrollWidth / 2

    if (direction === 1 && track.scrollLeft >= loopWidth - step / 2) {
      track.scrollLeft -= loopWidth
    } else if (direction === -1 && track.scrollLeft <= step / 2) {
      track.scrollLeft += loopWidth
    }

    track.scrollBy({ left: step * direction, behavior: 'smooth' })
  }, [getStep])

  const stopAutoScroll = useCallback(() => {
    if (delayRef.current) {
      clearTimeout(delayRef.current)
      delayRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startAutoScroll = useCallback(() => {
    stopAutoScroll()
    if (reduced) return
    // Секунда паузы перед первым сдвигом: страница успевает дорисоваться,
    // и лента не дёргается прямо под курсором читающего.
    delayRef.current = setTimeout(() => {
      move(1)
      intervalRef.current = setInterval(() => move(1), AUTO_SCROLL_INTERVAL)
    }, AUTO_SCROLL_DELAY)
  }, [move, reduced, stopAutoScroll])

  useEffect(() => {
    startAutoScroll()
    return stopAutoScroll
  }, [startAutoScroll, stopAutoScroll])

  return (
    <div className='relative mt-9'>
      <div
        ref={trackRef}
        className='-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden'
        aria-label='Карточки специалистов'
        onPointerEnter={stopAutoScroll}
        onPointerLeave={startAutoScroll}
        onTouchStart={stopAutoScroll}
        onTouchEnd={startAutoScroll}
        onFocus={stopAutoScroll}
        onBlur={startAutoScroll}
      >
        {doctors.map((doctor, index) => (
          <article
            key={`${doctor.id}-${index}`}
            data-doctor-card
            aria-hidden={index >= DOCTORS.length}
            className='gradient-border group relative flex w-[calc((100%-3.75rem)/4)] min-w-[15rem] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-line bg-surface lg:min-w-0'
          >
            <div className='aspect-4/5 overflow-hidden bg-tint'>
              {doctor.photo ? (
                <img
                  src={doctor.photo}
                  alt={index < DOCTORS.length ? `${doctor.role} ${doctor.name}` : ''}
                  loading={index > 2 ? 'lazy' : 'eager'}
                  decoding='async'
                  className='h-full w-full object-cover object-top transition duration-700 ease-out motion-reduce:transition-none group-hover:scale-105'
                />
              ) : (
                <div className='flex h-full items-center justify-center px-4 text-center text-sm text-muted'>Фото специалиста</div>
              )}
            </div>

            <div className='flex flex-1 flex-col gap-1.5 p-5'>
              <h3 className='m-0 text-lg font-semibold leading-snug'>{doctor.name}</h3>
              <span className='text-base text-muted'>{doctor.role}</span>
              <span className='text-base font-medium text-accent'>{doctor.experience}</span>

              {/* Растянутая ссылка: нажатие в любом месте карточки ведёт на запись к этому врачу. */}
              <Link
                href={bookingLink(doctor.id)}
                tabIndex={index >= DOCTORS.length ? -1 : undefined}
                className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 pt-3 text-base font-semibold text-accent-ink no-underline after:absolute after:inset-0 after:content-['']"
              >
                <CalendarDays className='h-4 w-4' aria-hidden='true' />
                Записаться
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className='mt-2 flex justify-end gap-2'>
        <button type='button' onClick={() => move(-1)} className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-brand hover:text-brand' aria-label='Предыдущий врач'>
          <ChevronLeft className='h-5 w-5' aria-hidden='true' />
        </button>
        <button type='button' onClick={() => move(1)} className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-brand hover:text-brand' aria-label='Следующий врач'>
          <ChevronRight className='h-5 w-5' aria-hidden='true' />
        </button>
      </div>
    </div>
  )
}
