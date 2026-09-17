'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react'
import { ArrowDownRight, Menu, Phone, X } from 'lucide-react'
import { SiteLogo } from '@/components/layout/SiteLogo'
import { CLINIC, ROUTES } from '@/lib/clinic'

const NAVIGATION = [
  { to: ROUTES.about, label: 'О клинике' },
  { to: ROUTES.directions, label: 'Направления' },
  { to: ROUTES.team, label: 'Врачи' },
  { to: ROUTES.course, label: 'Цены' },
]

const MARQUEE_ITEMS = ['Нейрореабилитация', 'Индивидуальный план', 'Команда специалистов', 'Астана']

const VIDEO_URL = 'https://videos.pexels.com/video-files/6111018/6111018-sd_640_360_25fps.mp4'

export function AnimatedHeaderPreview() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className='bg-bg'>
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-colors duration-500 ${
          scrolled ? 'bg-bg/95 text-ink shadow-[0_1px_0_rgb(var(--c-line))] backdrop-blur-sm' : 'text-white'
        }`}
      >
        <div className={`mx-auto flex max-w-content items-center justify-between px-5 transition-[height] duration-500 sm:px-8 lg:px-20 ${scrolled ? 'h-16' : 'h-20 lg:h-24'}`}>
          <SiteLogo markClassName={scrolled ? undefined : 'text-brand-bright'} textClassName={scrolled ? undefined : 'text-white'} />

          <nav aria-label='Основная навигация' className='hidden items-center gap-7 lg:flex'>
            {NAVIGATION.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                className={`relative py-2 text-sm font-medium no-underline transition-colors hover:text-brand-bright ${scrolled ? 'text-muted' : 'text-white/75'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className='flex items-center gap-3'>
            <a
              className={`hidden items-center gap-2 text-sm font-medium no-underline lg:inline-flex ${scrolled ? 'text-ink' : 'text-white'}`}
              href={CLINIC.phones[0].href}
            >
              <Phone className='h-4 w-4' aria-hidden='true' />
              {CLINIC.phones[0].label}
            </a>
            <Link
              href={ROUTES.booking}
              className='inline-flex h-11 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-accent-ink no-underline transition-colors hover:bg-brand-bright'
            >
              Записаться
            </Link>
            <button
              type='button'
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl lg:hidden ${scrolled ? 'bg-deep text-white' : 'bg-white/15 text-white'}`}
            >
              {menuOpen ? <X className='h-5 w-5' aria-hidden='true' /> : <Menu className='h-5 w-5' aria-hidden='true' />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              aria-label='Мобильная навигация'
              initial={reduced ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className='border-t border-line bg-bg px-5 py-6 sm:px-8'
            >
              <div className='mx-auto flex max-w-content flex-col gap-1'>
                {NAVIGATION.map((item) => (
                  <Link key={item.to} href={item.to} onClick={() => setMenuOpen(false)} className='py-3 text-lg font-medium text-ink no-underline'>
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <section className='relative isolate flex min-h-[45rem] items-end overflow-hidden bg-deep px-5 pb-14 pt-36 text-white sm:px-8 lg:min-h-screen lg:px-20 lg:pb-20'>
        <video className='absolute inset-0 -z-20 h-full w-full object-cover' autoPlay loop muted playsInline poster='/photos/walk-bars.jpg'>
          <source src={VIDEO_URL} type='video/mp4' />
        </video>
        <div aria-hidden='true' className='absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,32,42,0.92)_0%,rgba(6,32,42,0.7)_45%,rgba(6,32,42,0.35)_100%)]' />

        <div className='mx-auto grid w-full max-w-content gap-10 lg:grid-cols-12 lg:items-end'>
          <motion.div
            initial={reduced ? false : 'hidden'}
            animate='visible'
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.13 } } }}
            className='lg:col-span-8'
          >
            <motion.p variants={fadeUp} className='m-0 text-sm font-medium uppercase tracking-[0.1em] text-white/65'>
              Клиника нейрореабилитации в Астане
            </motion.p>
            <motion.h1 variants={fadeUp} className='mt-5 max-w-[11em] font-display text-4xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl'>
              Возвращаем движение, речь и самостоятельность
            </motion.h1>
            <motion.p variants={fadeUp} className='mt-7 max-w-[34em] text-lg leading-relaxed text-white/80'>
              От первой консультации до понятного плана восстановления — рядом команда, которая видит человека, а не диагноз.
            </motion.p>
            <motion.div variants={fadeUp} className='mt-8 flex flex-wrap items-center gap-5'>
              <Link href={ROUTES.booking} className='inline-flex min-h-14 items-center gap-3 rounded-xl bg-accent px-6 py-3 text-base font-semibold text-accent-ink no-underline transition-colors hover:bg-brand-bright'>
                Записаться на консультацию
                <ArrowDownRight className='h-5 w-5' aria-hidden='true' />
              </Link>
              <span className='text-sm text-white/65'>Первые 15 минут консультации — бесплатно</span>
            </motion.div>
          </motion.div>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.7, duration: 0.5 }}
            className='hidden border-l border-white/30 pl-6 text-sm leading-relaxed text-white/75 lg:col-span-3 lg:block'
          >
            План занятий, личный куратор и поддержка семьи на каждом этапе курса.
          </motion.p>
        </div>
      </section>

      <Marquee />
      <PreviewSections />
    </section>
  )
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

function Marquee() {
  const reduced = useReducedMotion()
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <div className='overflow-hidden bg-accent py-4 text-accent-ink'>
      <motion.div
        className='flex w-max items-center gap-8 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.09em]'
        animate={reduced ? undefined : { x: ['0%', '-50%'] }}
        transition={reduced ? undefined : { duration: 24, ease: 'linear', repeat: Infinity }}
      >
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className='flex items-center gap-8'>
            {item}
            <span aria-hidden='true'>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function PreviewSections() {
  const reduced = useReducedMotion()

  return (
    <section className='mx-auto grid max-w-content gap-16 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:px-20'>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.45 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className='lg:col-span-5'
      >
        <p className='text-sm font-medium uppercase tracking-[0.08em] text-brand'>Как строится курс</p>
        <h2 className='mt-4 font-display text-3xl font-semibold leading-[1.15] tracking-[-0.045em] text-ink sm:text-4xl'>
          Понятный путь от оценки состояния к самостоятельности
        </h2>
      </motion.div>
      <div className='lg:col-span-6 lg:col-start-7'>
        {['Оценка состояния и целей семьи', 'План занятий на каждый день', 'Отчёты о динамике и поддержка дома'].map((text, index) => (
          <motion.div
            key={text}
            initial={reduced ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 0.65, delay: reduced ? 0 : index * 0.18, ease: 'easeOut' }}
            className='flex items-baseline gap-6 border-t border-line py-5'
          >
            <span className='font-display text-sm text-brand'>0{index + 1}</span>
            <p className='m-0 text-xl leading-snug text-ink'>{text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
