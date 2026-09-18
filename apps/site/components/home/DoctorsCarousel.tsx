'use client'

import { useCallback, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Award, ChevronLeft, ChevronRight } from 'lucide-react'
import { DOCTORS } from '@/data/doctors'

const IDLE_DELAY = 3_000

/** Горизонтальная лента специалистов с ручным управлением и мягким автопереходом. */
export function DoctorsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isAutoScrollingRef = useRef(false)
  const reduced = useReducedMotion()

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const move = useCallback((direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return

    const card = track.querySelector<HTMLElement>('[data-doctor-card]')
    const distance = card ? card.offsetWidth + 24 : track.clientWidth * 0.85
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4

    if (direction === 1 && atEnd) {
      track.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }

    track.scrollBy({ left: distance * direction, behavior: 'smooth' })
  }, [])

  const scheduleAutoScroll = useCallback(() => {
    clearTimer()
    if (reduced) return

    timerRef.current = setTimeout(() => {
      isAutoScrollingRef.current = true
      move(1)
      window.setTimeout(() => {
        isAutoScrollingRef.current = false
      }, 500)
    }, IDLE_DELAY)
  }, [clearTimer, move, reduced])

  useEffect(() => {
    scheduleAutoScroll()
    return clearTimer
  }, [clearTimer, scheduleAutoScroll])

  return (
    <div className='relative mt-12'>
      <div
        ref={trackRef}
        className='-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:-mx-20 lg:px-20 [&::-webkit-scrollbar]:hidden'
        aria-label='Карточки специалистов'
        onPointerDown={scheduleAutoScroll}
        onTouchStart={scheduleAutoScroll}
        onWheel={scheduleAutoScroll}
        onKeyDown={scheduleAutoScroll}
        onScroll={() => {
          if (!isAutoScrollingRef.current) scheduleAutoScroll()
        }}
      >
        {DOCTORS.map((doctor, index) => (
          <motion.article
            key={doctor.id}
            data-doctor-card
            initial={reduced ? false : { opacity: 0, y: 26, scale: 0.98 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ amount: 0.55 }}
            transition={{ duration: 0.45, delay: index * 0.05, ease: 'easeOut' }}
            className='w-[min(20.5rem,82vw)] shrink-0 snap-start bg-bg sm:w-[22rem]'
          >
            <div className='group relative aspect-[4/4.7] overflow-hidden bg-line'>
              {doctor.photo ? (
                <img
                  src={doctor.photo}
                  alt={`${doctor.role} ${doctor.name}`}
                  loading={index > 1 ? 'lazy' : 'eager'}
                  decoding='async'
                  className='h-full w-full object-cover object-top transition duration-700 ease-out motion-reduce:transition-none group-hover:scale-105'
                />
              ) : (
                <div className='flex h-full items-center justify-center px-4 text-center text-sm text-muted'>Фото специалиста</div>
              )}
              <span className='absolute left-4 top-4 bg-bg px-3 py-1.5 text-sm font-medium text-ink'>{doctor.experience}</span>
            </div>

            <div className='flex min-h-68 flex-col p-5 sm:p-6'>
              <p className='m-0 text-sm font-medium uppercase tracking-[0.08em] text-brand'>{doctor.role}</p>
              <h3 className='mt-3 font-display text-2xl font-semibold leading-tight tracking-[-0.035em] text-ink'>{doctor.name}</h3>
              <p className='mt-4 text-base leading-relaxed text-muted'>{doctor.about}</p>
              <div className='mt-auto pt-6'>
                {doctor.certificates.length > 0 ? (
                  <div className='flex flex-wrap gap-3'>
                    {doctor.certificates.map((certificate) => (
                      <a
                        key={certificate.href}
                        href={certificate.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 text-sm font-semibold text-ink no-underline hover:text-brand'
                      >
                        <Award className='h-4 w-4' aria-hidden='true' />
                        {certificate.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className='m-0 text-sm text-muted'>Сертификат предоставляется по запросу</p>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className='mt-3 flex justify-end gap-2'>
        <button type='button' onClick={() => { move(-1); scheduleAutoScroll() }} className='inline-flex h-11 w-11 items-center justify-center border border-line text-ink transition-colors hover:border-brand hover:text-brand' aria-label='Предыдущий врач'>
          <ChevronLeft className='h-5 w-5' aria-hidden='true' />
        </button>
        <button type='button' onClick={() => { move(1); scheduleAutoScroll() }} className='inline-flex h-11 w-11 items-center justify-center border border-line text-ink transition-colors hover:border-brand hover:text-brand' aria-label='Следующий врач'>
          <ChevronRight className='h-5 w-5' aria-hidden='true' />
        </button>
      </div>
    </div>
  )
}
