'use client'

import { useRef, useState } from 'react'
import { Button, Link } from '@/components/Links'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowDownRight, ArrowRight, Pause, Phone, Play } from 'lucide-react'
import { Reveal } from '@amare/ui'
import { COURSE_STEPS } from '@/data/course'
import { DIRECTIONS } from '@/data/directions'
import { DOCTORS } from '@/data/doctors'
import { useContent, useContentList, usePlural, useT } from '@amare/i18n/react'
import { DoctorsCarousel } from '@/components/home/DoctorsCarousel'
import { TwoDoors } from '@/components/home/TwoDoors'
import { Quiz } from '@/components/home/Quiz'
import { ResultsBand } from '@/components/home/ResultsBand'
import { Reviews } from '@/components/home/Reviews'
import { FounderWord } from '@/components/home/FounderWord'
import { ClinicMap } from '@/components/ClinicMap'
import { CLINIC, ROUTES } from '@/lib/clinic'

/* Видео и постер лежат у нас: раньше файл тянулся с videos.pexels.com,
   то есть каждый визит уходил запросом к третьей стороне — ровно то, от чего
   мы ушли со шрифтами, раздавая их со своего домена. */
const HERO_VIDEO = '/video/hero.mp4'
const HERO_POSTER = '/photos/walk-bars.jpg'

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
  const t = useT('home')
  const price = useT('prices')
  const reduced = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)

  /*
   * Высота первого экрана считается от окна, а не от кегля: раньше стояло
   * min-h-[45rem] (810 px при базовом шрифте) плюс lg:min-h-screen и pt-36,
   * и на ноутбуке 1024×768 единственная кнопка экрана начиналась ниже сгиба.
   * min(42rem, 88vh) оставляет место под кнопку на любой высоте окна,
   * а доля vh не даёт экрану выглядеть обрезанным на высоком мониторе.
   */

  // Состояние ведём от самого элемента: браузер может не дать автозапуск,
  // и тогда подпись кнопки должна говорить «Запустить», а не «Остановить»
  function toggleVideo() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play()
    else video.pause()
  }

  return (
    <section className='relative isolate flex min-h-[min(42rem,88vh)] items-end overflow-hidden bg-deep px-4 pb-12 pt-24 text-white sm:px-8 lg:min-h-[min(46rem,92vh)] lg:px-20 lg:pb-12 lg:pt-20'>
      {/* При prefers-reduced-motion видео не грузится вовсе — постер и есть кадр.
          Остальное движение на сайте так себя и ведёт, а это было единственным,
          что нельзя было ни выключить, ни остановить (WCAG 2.2.2). */}
      {reduced ? (
        <img
          src={HERO_POSTER}
          alt=''
          aria-hidden='true'
          className='absolute inset-0 -z-20 h-full w-full object-cover'
        />
      ) : (
        <>
          <video
            ref={videoRef}
            className='absolute inset-0 -z-20 h-full w-full object-cover'
            autoPlay
            loop
            muted
            playsInline
            poster={HERO_POSTER}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src={HERO_VIDEO} type='video/mp4' />
          </video>
          <button
            type='button'
            onClick={toggleVideo}
            aria-label={t(playing ? 'hero.videoPause' : 'hero.videoPlay')}
            className='absolute right-4 top-24 z-10 inline-flex h-11 w-11 items-center justify-center rounded-xl border-[1.5px] border-white/45 text-white transition-colors hover:bg-white/10 sm:right-8 lg:right-20'
          >
            {playing ? (
              <Pause className='h-5 w-5' aria-hidden='true' />
            ) : (
              <Play className='h-5 w-5' aria-hidden='true' />
            )}
          </button>
        </>
      )}
      {/* Светлый конец вуали 0.62, а не 0.3: приписка справа стояла на светлом
          участке кадра и давала 1.9:1 вместо 4.5:1 */}
      <div aria-hidden='true' className='absolute inset-0 -z-10 bg-linear-to-r from-scrim/94 via-scrim/72 to-scrim/62' />

      <div className='mx-auto grid w-full max-w-content gap-10 lg:grid-cols-12 lg:items-end'>
        <motion.div
          initial={reduced ? false : 'hidden'}
          animate='visible'
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          className='min-w-0 lg:col-span-8'
        >
          <motion.p variants={fadeUp} className='m-0 text-sm font-medium text-white/65'>
            {t('hero.label')}
          </motion.p>
          {/* clamp вместо ступеней text-2xl → sm:text-6xl: в диапазоне
              375–639 px заголовок застревал на 27 px, то есть на самом частом
              размере экрана крупной типографики не было вовсе, а на границе
              брейкпойнта кегль прыгал вдвое. */}
          <motion.h1 variants={fadeUp} className='mt-5 max-w-none font-display sm:max-w-[11em] text-[clamp(1.75rem,min(6vw,7vh),3.25rem)] font-semibold leading-[1.08] tracking-[-0.02em]'>
            {t('hero.title')}
          </motion.h1>
          <motion.p variants={fadeUp} className='mt-7 max-w-[34em] text-lg leading-relaxed text-white/80'>
            {t('hero.note')}
          </motion.p>
          <motion.div variants={fadeUp} className='mt-8 flex flex-wrap items-center gap-5'>
            <Button to={ROUTES.booking} size='lg'>
              {t('hero.book')}
              <ArrowDownRight className='h-5 w-5' aria-hidden='true' />
            </Button>
            <span className='text-sm text-white/65'>{price('freeIntro')}</span>
          </motion.div>
        </motion.div>
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 0.3, duration: 0.45 }}
          className='hidden border-l border-white/45 pl-6 text-sm leading-relaxed text-white lg:col-span-3 lg:block'
        >
          {t('hero.aside')}
        </motion.p>
      </div>
    </section>
  )
}

/*
 * Строка тегов под первым экраном.
 *
 * Громкой её делали не движение само по себе, а всё разом: красная плашка
 * во всю ширину, капслок с разрядкой и «✦» между словами — так набирают
 * рекламу, а не клинику. Осталась светлая плашка, обычный регистр, кружок
 * вместо звезды и вдвое более медленный ход.
 *
 * К общим тегам добавлены заголовки направлений — из того же словаря, что и
 * сам раздел, расходиться им нельзя. Дело не только в смысле: четырёх тегов
 * не хватало по ширине. Один цикл занимал 801 px, и на мониторе 1600 px в
 * кадр попадали два одинаковых повтора подряд — строка выглядела пустой.
 * Девять тегов дают цикл шире любого экрана.
 *
 * Копии две, поэтому и сдвиг на 50%: лента бесшовна, пока одна копия шире
 * окна. При prefers-reduced-motion движение не запускается вовсе.
 */
function Marquee() {
  const list = useContentList('home')
  const text = useContent('directions')
  const reduced = useReducedMotion()
  const tags = [...list('marquee'), ...DIRECTIONS.map((direction) => text(`${direction.id}.title`))]
  const items = [...tags, ...tags]

  return (
    <div className='overflow-hidden border-y border-line bg-tint py-4 text-deep'>
      <motion.div
        className='flex w-max items-center gap-6 whitespace-nowrap text-sm font-medium sm:text-base lg:gap-10 lg:text-lg'
        animate={reduced ? undefined : { x: ['0%', '-50%'] }}
        transition={reduced ? undefined : { duration: 90, ease: 'linear', repeat: Infinity }}
      >
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className='flex items-center gap-6 lg:gap-10'>
            {item}
            <span aria-hidden='true' className='h-1.5 w-1.5 shrink-0 rounded-full bg-brand/45' />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function Facts() {
  const t = useT('home')
  const plural = usePlural('home')
  const price = useT('prices')
  const source = useT('contacts')('ratingSource')

  // Число специалистов считаем по карточкам: цифра на главной не должна
  // расходиться со страницей «Врачи»
  const facts = [
    {
      value: t('facts.rating.value', { value: CLINIC.rating.value, source }),
      note: plural('facts.rating.note', CLINIC.rating.reviews),
    },
    {
      value: plural('facts.doctors.value', DOCTORS.length),
      note: t('facts.doctors.note'),
    },
    { value: price('course'), note: t('facts.price.note') },
    { value: t('facts.insurance.value'), note: t('facts.insurance.note') },
  ]

  return (
    <section aria-label={t('facts.label')} className='mx-auto grid max-w-content gap-x-8 gap-y-10 px-4 py-20 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-20'>
      {facts.map((fact, index) => (
        <Reveal key={fact.value} delay={index * 0.04} className='border-t border-line pt-5'>
          <p className='m-0 font-display text-3xl font-semibold tracking-[-0.02em] text-ink'>{fact.value}</p>
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
  const t = useT('home')
  const text = useContent('directions')

  return (
    <section className='bg-deep px-4 py-20 text-white sm:px-8 lg:px-20'>
      <div className='mx-auto grid max-w-content gap-16 lg:grid-cols-12'>
        <Reveal className='lg:col-span-5'>
          <p className='text-sm font-medium text-sky'>{t('directions.label')}</p>
          <h2 className='mt-4 font-display text-2xl font-semibold leading-[1.2] sm:leading-[1.15] tracking-[-0.02em] sm:text-5xl'>
            {t('directions.title')}
          </h2>
          <p className='mt-6 max-w-[30em] text-lg leading-relaxed text-white/75'>
            {t('directions.note')}
          </p>
          <Link href={ROUTES.directions} className='tap-target mt-8 inline-flex items-center gap-2 text-base font-semibold text-white no-underline hover:text-sky'>
            {t('directions.all')}
            <ArrowRight className='h-5 w-5' aria-hidden='true' />
          </Link>
        </Reveal>
        <div className='lg:col-span-6 lg:col-start-7'>
          {DIRECTIONS.slice(0, 5).map((direction, index) => (
            <Reveal key={direction.id} delay={index * 0.05} className='border-t border-white/20 py-5'>
              <Link href={`${ROUTES.directions}#${direction.id}`} className='tap-target group flex items-baseline justify-between gap-6 text-xl text-white no-underline sm:text-2xl'>
                <span>{text(`${direction.id}.title`)}</span>
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
  const t = useT('home')
  const text = useContent('course')

  return (
    <section className='mx-auto grid max-w-content gap-16 px-4 py-24 sm:px-8 lg:grid-cols-12 lg:px-20'>
      <Reveal className='lg:col-span-5'>
        <p className='text-sm font-medium text-brand'>{t('course.label')}</p>
        <h2 className='mt-4 font-display text-2xl font-semibold leading-[1.2] sm:leading-[1.15] tracking-[-0.02em] text-ink sm:text-5xl'>
          {t('course.title')}
        </h2>
        <p className='mt-6 max-w-[28em] text-lg leading-relaxed text-muted'>
          {t('course.note')}
        </p>
        <Link href={ROUTES.course} className='tap-target mt-8 inline-flex items-center gap-2 text-base font-semibold text-ink no-underline hover:text-brand'>
          {t('course.link')}
          <ArrowRight className='h-5 w-5' aria-hidden='true' />
        </Link>
      </Reveal>
      <div className='lg:col-span-6 lg:col-start-7'>
        {COURSE_STEPS.map((step, index) => (
          <Reveal key={step.n} delay={index * 0.05} className='flex items-baseline gap-6 border-t border-line py-5'>
            <span className='font-display text-sm text-brand'>{step.n}</span>
            <div>
              <h3 className='m-0 text-xl font-medium text-ink'>{text(`step.${step.n}.title`)}</h3>
              <p className='mt-2 text-base leading-relaxed text-muted'>{text(`step.${step.n}.full`)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Team() {
  const t = useT('home')

  return (
    <section className='bg-tint px-4 py-20 sm:px-8 lg:px-20'>
      <div className='mx-auto max-w-content'>
        <Reveal className='flex flex-col justify-between gap-6 sm:flex-row sm:items-end'>
          <div>
            <p className='text-sm font-medium text-deep'>{t('team.label')}</p>
            <h2 className='mt-4 max-w-[16em] font-display text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-5xl'>
              {t('team.title')}
            </h2>
          </div>
          <Link href={ROUTES.team} className='tap-target inline-flex items-center gap-2 text-base font-semibold text-ink no-underline hover:text-brand'>
            {t('team.link')}
            <ArrowRight className='h-5 w-5' aria-hidden='true' />
          </Link>
        </Reveal>
        <DoctorsCarousel />
      </div>
    </section>
  )
}

function Contact() {
  const t = useT('home')
  const contacts = useT('contacts')

  return (
    <section className='relative isolate overflow-hidden bg-deep px-4 py-24 text-white sm:px-8 lg:px-20'>
      <img
        src='/photos/facade.jpg'
        alt=''
        aria-hidden='true'
        loading='lazy'
        decoding='async'
        className='absolute inset-0 -z-20 h-full w-full object-cover opacity-30'
      />
      <div aria-hidden='true' className='absolute inset-0 -z-10 bg-deep/75' />
      <div className='mx-auto grid max-w-content gap-12 lg:grid-cols-12 lg:items-end'>
        <Reveal className='min-w-0 lg:col-span-8'>
          <p className='text-sm font-medium text-white/60'>{t('contact.label')}</p>
          <h2 className='mt-4 max-w-[14em] font-display text-2xl font-semibold leading-[1.18] sm:leading-[1.12] tracking-[-0.02em] sm:text-5xl'>
            {t('contact.title')}
          </h2>
          <p className='mt-7 max-w-[32em] text-lg leading-relaxed text-white/75'>{contacts('addressFull')}</p>
          <div className='mt-8 flex flex-wrap items-center gap-5'>
            <Button to={ROUTES.booking} variant='white' size='lg'>{t('contact.book')}</Button>
            <a href={CLINIC.phones[0].href} className='tap-target inline-flex items-center gap-2 text-base font-semibold text-white no-underline hover:text-sky'>
              <Phone className='h-5 w-5' aria-hidden='true' />
              {CLINIC.phones[0].label}
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.15} className='border-l border-white/25 pl-6 text-sm leading-relaxed text-white/75 lg:col-span-3'>
          {contacts('hours')}
        </Reveal>
      </div>
    </section>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}
