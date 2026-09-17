'use client'

import { motion, useReducedMotion } from 'motion/react'
import { ClipboardList, MessagesSquare, LineChart } from 'lucide-react'
import { ParallaxBand } from '@amare/ui'
import { Button } from '@amare/ui'
import { CLINIC, PRICES, ROUTES } from '@/lib/clinic'

const TITLE = 'Возвращаем движение, речь и самостоятельность'
const TAGS = ['Инсульт', 'ЧМТ', 'После операций', 'ДЦП']

/**
 * Первый экран.
 *
 * Заголовок проявляется по словам — это единственное место, где такая
 * анимация оправдана: она держит взгляд, пока грузится фото. Дальше по
 * странице хватает обычного Reveal.
 *
 * Справа — карточка кабинета. На сайте посетитель всегда гость: кабинет
 * живёт в отдельном приложении care. Показывать анониму «день 12 из 20»
 * и чужой план дня — значит врать интерфейсом, поэтому здесь только то,
 * что внутри кабинета.
 */
export function Hero() {
  const reduced = useReducedMotion()
  const words = TITLE.split(' ')

  return (
    <ParallaxBand
      image="/photos/reception.jpg"
      alt="Стойка ресепшена клиники Amare"
      scrim="side"
      strength={16}
      className="min-h-152"
    >
      <div className="container-content grid items-center gap-10 py-16 lg:grid-cols-12 lg:py-24">
        <div className="flex flex-col gap-6 lg:col-span-6">
          <ul className="flex flex-wrap gap-2" aria-label="Профили пациентов">
            {TAGS.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm font-medium text-white"
              >
                {tag}
              </li>
            ))}
          </ul>

          <h1 className="font-display text-[2.4rem] font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl sm:leading-none lg:text-[3.3rem]">
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                className="mr-[0.28em] inline-block"
                initial={reduced ? false : { opacity: 0, y: '0.4em' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: reduced ? 0 : 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <p className="max-w-[26em] text-lg leading-relaxed text-white/80">
            Клиника нейрореабилитации в Астане. Курс, домашняя программа и куратор рядом.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button to={ROUTES.booking} size="lg">
              Записаться
            </Button>
            <Button href="#quiz" variant="onDark" size="lg">
              Оценить состояние
            </Button>
          </div>

          <p className="text-base text-white/60">
            {PRICES.freeIntro} · {CLINIC.address.street}
          </p>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <CabinetCard />
        </div>
      </div>
    </ParallaxBand>
  )
}

const INSIDE = [
  { Icon: ClipboardList, text: 'План занятий на каждый день курса' },
  { Icon: MessagesSquare, text: 'Чат с личным куратором' },
  { Icon: LineChart, text: 'Динамика по шкалам и отчёты родственникам' },
]

/**
 * Карточка кабинета в первом экране.
 *
 * Честная витрина — «вот что внутри», без выдуманных данных.
 * Кнопка ведёт на /vhod, который перенаправляет в приложение care.
 *
 * TODO: карточка для вошедшего (приглашение вернуться к плану) — когда
 * появится настоящая авторизация с общей сессией для site и care.
 */
function CabinetCard() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-surface/95 p-6 shadow-2xl backdrop-blur-sm">
      <span className="text-sm uppercase tracking-[0.08em] text-muted">Личный кабинет</span>

      <p className="m-0 font-display text-xl font-medium leading-snug tracking-[-0.035em]">
        Курс продолжается и между визитами в клинику
      </p>

      <ul className="flex flex-col gap-2">
        {INSIDE.map(({ Icon, text }) => (
          <li key={text} className="flex items-center gap-3 rounded-xl bg-bg px-4 py-3">
            <Icon className="h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
            <span className="flex-1 text-base">{text}</span>
          </li>
        ))}
      </ul>

      <Button to={ROUTES.login} variant="deep" className="w-full">
        Войти в кабинет
      </Button>

      <p className="m-0 text-sm leading-relaxed text-muted">
        Доступ выдаёт администратор после первой консультации.
      </p>
    </div>
  )
}
