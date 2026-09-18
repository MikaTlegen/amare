'use client'

import { useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DOCTORS } from '@/data/doctors'
import { ROUTES } from '@/lib/clinic'

const AUTO_SCROLL_INTERVAL = 3_000

/** Компактная бесконечная лента специалистов с ручным управлением. */
export function DoctorsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startAutoScroll = useCallback(() => {
    stopAutoScroll()
    if (reduced) return
    intervalRef.current = setInterval(() => move(1), AUTO_SCROLL_INTERVAL)
  }, [move, reduced, stopAutoScroll])

  useEffect(() => {
    startAutoScroll()
    return stopAutoScroll
  }, [startAutoScroll, stopAutoScroll])

  return (
    <div className='relative mt-9'>
      <div
        ref={trackRef}
        className='-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:-mx-20 lg:px-20 [&::-webkit-scrollbar]:hidden'
        aria-label='Карточки специалистов'
        onPointerEnter={stopAutoScroll}
        onPointerLeave={startAutoScroll}
        onTouchStart={stopAutoScroll}
        onTouchEnd={startAutoScroll}
        onFocus={stopAutoScroll}
        onBlur={startAutoScroll}
      >
        {doctors.map((doctor, index) => (
          <Link
            key={`${doctor.id}-${index}`}
        href={ROUTES.team + '/' + doctor.id}
        tabIndex={index >= DOCTORS.length ? -1 : undefined}
            data-doctor-card
            aria-hidden={index >= DOCTORS.length}
            className='group w-[calc((100%-3.75rem)/4)] min-w-[15rem] shrink-0 snap-start bg-bg no-underline xl:min-w-0'
          >
            <div className='relative aspect-[4/4.5] overflow-hidden bg-line'>
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
              <span className='absolute left-3 top-3 bg-bg px-2.5 py-1 text-xs font-medium text-ink'>{doctor.experience}</span>
            </div>

            <div className='flex min-h-36 flex-col p-4 sm:p-5'>
              <p className='m-0 text-xs font-medium uppercase tracking-[0.08em] text-brand'>{doctor.role}</p>
              <h3 className='mt-2 font-display text-xl font-semibold leading-tight tracking-[-0.035em] text-ink'>{doctor.name}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className='mt-2 flex justify-end gap-2'>
        <button type='button' onClick={() => move(-1)} className='inline-flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:border-brand hover:text-brand' aria-label='Предыдущий врач'>
          <ChevronLeft className='h-5 w-5' aria-hidden='true' />
        </button>
        <button type='button' onClick={() => move(1)} className='inline-flex h-10 w-10 items-center justify-center border border-line text-ink transition-colors hover:border-brand hover:text-brand' aria-label='Следующий врач'>
          <ChevronRight className='h-5 w-5' aria-hidden='true' />
        </button>
      </div>
    </div>
  )
}
