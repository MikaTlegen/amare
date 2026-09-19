'use client'

import { Button, Link } from '@/components/Links'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowDownRight, ArrowRight, Phone } from 'lucide-react'
import { Reveal } from '@amare/ui'
import { COURSE_STEPS, FACTS } from '@/data/course'
import { DIRECTIONS } from '@/data/directions'
import { DoctorsCarousel } from '@/components/home/DoctorsCarousel'
import { TwoDoors } from '@/components/home/TwoDoors'
import { Quiz } from '@/components/home/Quiz'
import { ResultsBand } from '@/components/home/ResultsBand'
import { Reviews } from '@/components/home/Reviews'
import { FounderWord } from '@/components/home/FounderWord'
import { ClinicMap } from '@/components/ClinicMap'
import { CLINIC, ROUTES } from '@/lib/clinic'

const VIDEO_URL = 'https://videos.pexels.com/video-files/6111018/6111018-sd_640_360_25fps.mp4'
const MARQUEE_ITEMS = ['Нейрореабилитация', 'Индивидуальный план', 'Команда специалистов', 'Астана']

/** Главная в редакционном стиле: крупный ритм, живая типографика и минимум оболочек. */
export function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Facts />
      <EntryPoints />
      <Directions />
      <Course />
      <Quiz />
      <ResultsBand />
      <Team />
      <FounderWord />
      <Reviews />
      <Contact />
      <section className='bg-bg px-4 py-16 sm:px-8 lg:px-20'>
        <div className='mx-auto max-w-content'><ClinicMap /></div>
      </section>
    </>
  )
}

function Hero() {
  const reduced = useReducedMotion()

  return (
    <section className='relative isolate flex min-h-[45rem] items-end overflow-hidden bg-deep px-4 pb-14 pt-36 text-white sm:px-8 lg:min-h-screen lg:px-20 lg:pb-20'>
      <video className='absolute inset-0 -z-20 h-full w-full object-cover' autoPlay loop muted playsInline poster='/photos/walk-bars.jpg'>
        <source src={VIDEO_URL} type='video/mp4' />
      </video>
      <div aria-hidden='true' className='absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,32,42,0.94)_0%,rgba(6,32,42,0.72)_48%,rgba(6,32,42,0.3)_100%)]' />

      <div className='mx-auto grid w-full max-w-content gap-10 lg:grid-cols-12 lg:items-end'>
        <motion.div
          initial={reduced ? false : 'hidden'}
          animate='visible'
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.13 } } }}
          className='min-w-0 lg:col-span-8'
        >
          <motion.p variants={fadeUp} className='m-0 text-sm font-medium uppercase tracking-[0.1em] text-white/65'>
            Клиника нейрореабилитации в Астане
          </motion.p>
          <motion.h1 variants={fadeUp} className='mt-5 max-w-none font-display sm:max-w-[11em] text-2xl font-semibold leading-[1.12] sm:leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl'>
            Возвращаем движение, речь и самостоятельность
          </motion.h1>
          <motion.p variants={fadeUp} className='mt-7 max-w-[34em] text-lg leading-relaxed text-white/80'>
            От первой консультации до понятного плана восстановления — рядом команда, которая видит человека, а не диагноз.
          </motion.p>
          <motion.div variants={fadeUp} className='mt-8 flex flex-wrap items-center gap-5'>
            <Button to={ROUTES.booking} size='lg'>
              Записаться на консультацию
              <ArrowDownRight className='h-5 w-5' aria-hidden='true' />
            </Button>
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
  )
}

function Marquee() {
  const reduced = useReducedMotion()
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <div className='overflow-hidden bg-accent py-4 text-accent-ink'>
      <motion.div
        className='flex w-max items-center gap-8 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.09em]'
        animate={reduced ? undefined : { x: ['0%', '-33.333%'] }}
        transition={reduced ? undefined : { duration: 28, ease: 'linear', repeat: Infinity }}
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

function Facts() {
  return (
    <section aria-label='Коротко о клинике' className='mx-auto grid max-w-content gap-x-8 gap-y-10 px-4 py-20 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-20'>
      {FACTS.map((fact, index) => (
        <Reveal key={fact.value} delay={index * 0.08} className='border-t border-line pt-5'>
          <p className='m-0 font-display text-3xl font-semibold tracking-[-0.045em] text-ink'>{fact.value}</p>
          <p className='mt-2 text-base leading-relaxed text-muted'>{fact.note}</p>
        </Reveal>
      ))}
    </section>
  )
}

function EntryPoints() {
  return (
    <section className='bg-bg px-4 pb-12 sm:px-8 lg:px-20'>
      <div className='mx-auto max-w-content'>
        <TwoDoors />
      </div>
    </section>
  )
}

function Directions() {
  return (
    <section className='bg-deep px-4 py-20 text-white sm:px-8 lg:px-20'>
      <div className='mx-auto grid max-w-content gap-16 lg:grid-cols-12'>
        <Reveal className='lg:col-span-5'>
          <p className='text-sm font-medium uppercase tracking-[0.08em] text-sky'>Направления</p>
          <h2 className='mt-4 font-display text-2xl font-semibold leading-[1.2] sm:leading-[1.15] tracking-[-0.045em] sm:text-5xl'>
            Реабилитация под задачу, которая важна семье сейчас
          </h2>
          <p className='mt-6 max-w-[30em] text-lg leading-relaxed text-white/75'>
            Собираем программу вокруг реальных целей: безопасно ходить, говорить, есть, возвращаться к привычным делам.
          </p>
          <Link href={ROUTES.directions} className='tap-target mt-8 inline-flex items-center gap-2 text-base font-semibold text-white no-underline hover:text-sky'>
            Все направления
            <ArrowRight className='h-5 w-5' aria-hidden='true' />
          </Link>
        </Reveal>
        <div className='lg:col-span-6 lg:col-start-7'>
          {DIRECTIONS.slice(0, 5).map((direction, index) => (
            <Reveal key={direction.id} delay={index * 0.1} className='border-t border-white/20 py-5'>
              <Link href={`${ROUTES.directions}#${direction.id}`} className='tap-target group flex items-baseline justify-between gap-6 text-xl text-white no-underline sm:text-2xl'>
                <span>{direction.title}</span>
                <ArrowRight className='h-5 w-5 shrink-0 text-sky transition-transform group-hover:translate-x-1' aria-hidden='true' />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Course() {
  return (
    <section className='mx-auto grid max-w-content gap-16 px-4 py-24 sm:px-8 lg:grid-cols-12 lg:px-20'>
      <Reveal className='lg:col-span-5'>
        <p className='text-sm font-medium uppercase tracking-[0.08em] text-brand'>Как строится курс</p>
        <h2 className='mt-4 font-display text-2xl font-semibold leading-[1.2] sm:leading-[1.15] tracking-[-0.045em] text-ink sm:text-5xl'>
          Понятный путь от оценки состояния к самостоятельности
        </h2>
        <p className='mt-6 max-w-[28em] text-lg leading-relaxed text-muted'>
          Каждый этап зафиксирован в плане. Семья понимает, что происходит сегодня и к какой цели мы идём дальше.
        </p>
        <Link href={ROUTES.course} className='tap-target mt-8 inline-flex items-center gap-2 text-base font-semibold text-ink no-underline hover:text-brand'>
          Узнать о курсе и стоимости
          <ArrowRight className='h-5 w-5' aria-hidden='true' />
        </Link>
      </Reveal>
      <div className='lg:col-span-6 lg:col-start-7'>
        {COURSE_STEPS.map((step, index) => (
          <Reveal key={step.n} delay={index * 0.1} className='flex items-baseline gap-6 border-t border-line py-5'>
            <span className='font-display text-sm text-brand'>{step.n}</span>
            <div>
              <h3 className='m-0 text-xl font-medium text-ink'>{step.title}</h3>
              <p className='mt-2 text-base leading-relaxed text-muted'>{step.full}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Team() {
  return (
    <section className='bg-tint px-4 py-20 sm:px-8 lg:px-20'>
      <div className='mx-auto max-w-content'>
        <Reveal className='flex flex-col justify-between gap-6 sm:flex-row sm:items-end'>
          <div>
            <p className='text-sm font-medium uppercase tracking-[0.08em] text-deep'>Команда</p>
            <h2 className='mt-4 max-w-[16em] font-display text-3xl font-semibold leading-[1.15] tracking-[-0.045em] text-ink sm:text-5xl'>
              С пациентом работает не один специалист
            </h2>
          </div>
          <Link href={ROUTES.team} className='tap-target inline-flex items-center gap-2 text-base font-semibold text-ink no-underline hover:text-brand'>
            Познакомиться с командой
            <ArrowRight className='h-5 w-5' aria-hidden='true' />
          </Link>
        </Reveal>
        <DoctorsCarousel />
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className='relative isolate overflow-hidden bg-deep px-4 py-24 text-white sm:px-8 lg:px-20'>
      <img src='/photos/facade.jpg' alt='' aria-hidden='true' className='absolute inset-0 -z-20 h-full w-full object-cover opacity-30' />
      <div aria-hidden='true' className='absolute inset-0 -z-10 bg-deep/75' />
      <div className='mx-auto grid max-w-content gap-12 lg:grid-cols-12 lg:items-end'>
        <Reveal className='min-w-0 lg:col-span-8'>
          <p className='text-sm font-medium uppercase tracking-[0.08em] text-white/60'>Начните с разговора</p>
          <h2 className='mt-4 max-w-[14em] font-display text-2xl font-semibold leading-[1.18] sm:leading-[1.12] tracking-[-0.05em] sm:text-6xl'>
            Расскажите, что происходит — мы поможем сориентироваться
          </h2>
          <p className='mt-7 max-w-[32em] text-lg leading-relaxed text-white/75'>{CLINIC.address.full}</p>
          <div className='mt-8 flex flex-wrap items-center gap-5'>
            <Button to={ROUTES.booking} variant='white' size='lg'>Записаться на консультацию</Button>
            <a href={CLINIC.phones[0].href} className='tap-target inline-flex items-center gap-2 text-base font-semibold text-white no-underline hover:text-sky'>
              <Phone className='h-5 w-5' aria-hidden='true' />
              {CLINIC.phones[0].label}
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.15} className='border-l border-white/25 pl-6 text-sm leading-relaxed text-white/75 lg:col-span-3'>
          {CLINIC.hours}
        </Reveal>
      </div>
    </section>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
}
