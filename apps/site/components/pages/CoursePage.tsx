import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { PageCover } from '@/components/PageCover'
import { ParallaxBand } from '@amare/ui'
import { Reveal } from '@amare/ui'
import { Button } from '@amare/ui'
import { COURSE_STEPS, FORMATS } from '@/data/course'
import { CLINIC, PRICES, ROUTES, whatsappLink } from '@/lib/clinic'

/** Страница «Курс и цены»: пять шагов, форматы, иногородние. */
export function CoursePage() {
  return (
    <>
      <PageCover
        crumb="Курс и цены"
        title="Как проходит курс"
        note="От первой консультации до домашней программы после выписки."
        image="/photos/massage.jpg"
        alt="Процедура курса реабилитации"
      />

      <section className="container-content flex flex-col gap-6 py-14">
        {/*
          Каждый шаг — ссылка на запись. Раньше последний шаг был выделен
          тёмной плашкой без причины: это не «главный» этап, а просто
          последний в списке, и цвет читался как «вот тут акция».
          Теперь все шаги равны, а выделяется тот, на который навели.
        */}
        <ol className="flex flex-col gap-4">
          {COURSE_STEPS.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 0.05}>
              <Link
                href={ROUTES.booking}
                className="group grid items-center gap-5 rounded-3xl border border-line bg-surface p-7 no-underline transition-colors hover:border-brand hover:bg-tint lg:grid-cols-12 lg:gap-7"
              >
                <span className="font-display text-3xl font-semibold tracking-tighter text-muted transition-colors group-hover:text-brand lg:col-span-1">
                  {step.n}
                </span>

                <h2 className="font-display text-xl font-medium tracking-[-0.04em] text-ink lg:col-span-3">
                  {step.title}
                </h2>

                <p className="text-base leading-relaxed text-ink/80 lg:col-span-6">{step.full}</p>

                <div className="flex items-center gap-2 lg:col-span-2 lg:justify-end">
                  {step.price ? (
                    <span className="font-display text-xl font-semibold tracking-[-0.04em] text-ink">
                      {step.price}
                    </span>
                  ) : (
                    <span className="text-base text-muted">входит в курс</span>
                  )}
                  <ArrowRight
                    className="h-5 w-5 shrink-0 text-brand opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </ol>

        <div className="flex flex-col items-start gap-4 rounded-3xl bg-deep p-7 sm:flex-row sm:items-center sm:gap-6">
          <p className="m-0 flex-1 text-lg leading-relaxed text-white/85">
            Не уверены, какой формат подойдёт? Опишите ситуацию — администратор ответит в рабочее
            время, а при медицинских вопросах подключит врача.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button to={ROUTES.booking} variant="white">
              Записаться
            </Button>
            <Button
              href={whatsappLink('Здравствуйте! Хочу узнать про курс реабилитации.')}
              variant="white"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Обсудить в WhatsApp
            </Button>
          </div>
        </div>
      </section>

      <section className="container-content flex flex-col gap-6 pb-14">
        <h2 className="font-display text-3xl font-medium tracking-[-0.045em]">Форматы и цены</h2>

        {/*
          У каждого формата своя кнопка записи: человек, который дочитал
          до цены, уже принял решение — заставлять его искать кнопку
          в другом блоке значит терять заявку. Параметр format
          предвыбирается на странице записи.
        */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FORMATS.map((format, i) => (
            <Reveal as="li" key={format.title} delay={i * 0.05}>
              <article className="flex h-full flex-col gap-2.5 rounded-3xl border border-line bg-surface p-6">
                <h3 className="text-lg font-semibold">{format.title}</h3>
                <span className="font-display text-2xl font-semibold tracking-[-0.04em]">
                  {format.price}
                </span>
                <p className="text-base leading-relaxed text-muted">{format.note}</p>
                <Button
                  to={`${ROUTES.booking}?format=${format.bookingFormat}`}
                  variant="outline"
                  className="mt-auto w-full"
                >
                  Записаться
                </Button>
              </article>
            </Reveal>
          ))}
        </ul>

        <p className="text-base text-muted">
          Оплата — картой, Kaspi или в рассрочку. По ОСМС и ДМС условия уточняйте
          у администратора. Актуальность цен подтвердит администратор при записи.
        </p>
      </section>

      <section className="container-content pb-14">
        {/*
          Кадр узкий и банерный: вывеска занимает его почти целиком.
          strength={0} снимает и параллакс, и зум — иначе полоса срезала бы
          как раз вывеску, ради которой этот снимок и взят.
        */}
        <ParallaxBand
          image="/photos/facade-sign.png"
          alt="Вывеска клиники нейрореабилитации Amare.kz на фасаде здания"
          scrim="side"
          strength={0}
          className="rounded-3xl"
        >
          <div className="flex max-w-136 flex-col items-start gap-4 p-8 sm:p-10">
            <h2 className="font-display text-2xl font-medium leading-tight tracking-[-0.04em] text-white sm:text-3xl sm:leading-9">
              Приезжаете из другого города
            </h2>
            <p className="text-base leading-relaxed text-white/80">
              Поможем с проживанием рядом с клиникой, соберём курс без простоев и продолжим
              дистанционно после отъезда.
            </p>
            <Button href={CLINIC.whatsapp} variant="white">
              Написать в WhatsApp
            </Button>
          </div>
        </ParallaxBand>
      </section>

      <section className="container-content pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl border border-tint bg-tint p-8 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="font-display text-2xl font-medium tracking-[-0.04em]">
              Записаться на консультацию
            </h2>
            <p className="text-base text-ink/75">
              Выберите формат, специалиста и время. {PRICES.freeIntro.toLowerCase()}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to={ROUTES.booking}>Выбрать время</Button>
            <Button href={CLINIC.phones[0].href} variant="outline">
              {CLINIC.phones[0].label}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
