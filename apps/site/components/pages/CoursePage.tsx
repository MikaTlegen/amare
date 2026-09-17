import { PageCover } from '@/components/PageCover'
import { ParallaxBand } from '@amare/ui'
import { Reveal } from '@amare/ui'
import { Button } from '@amare/ui'
import { COURSE_STEPS, FORMATS } from '@/data/course'
import { CLINIC, PRICES, ROUTES } from '@/lib/clinic'
import { cn } from '@amare/ui'

/** Страница «Курс и цены»: пять шагов, форматы, иногородние. */
export function CoursePage() {
  return (
    <>
      <PageCover
        crumb="Курс и цены"
        title="Как проходит курс"
        note="От первой консультации до домашней программы после выписки."
        image="/photos/lobby.jpg"
        alt="Зона ожидания клиники Amare"
      />

      <section className="container-content flex flex-col gap-4 py-14">
        <ol className="flex flex-col gap-4">
          {COURSE_STEPS.map((step, i) => {
            const last = i === COURSE_STEPS.length - 1
            return (
              <Reveal as="li" key={step.n} delay={i * 0.05}>
                <article
                  className={cn(
                    'grid items-center gap-5 rounded-3xl p-7 lg:grid-cols-12 lg:gap-7',
                    last ? 'bg-deep' : 'border border-line bg-surface',
                  )}
                >
                  <span
                    className={cn(
                      'font-display text-3xl font-semibold tracking-tighter lg:col-span-1',
                      last ? 'text-sky' : 'text-accent',
                    )}
                  >
                    {step.n}
                  </span>

                  <h2
                    className={cn(
                      'font-display text-xl font-medium tracking-[-0.04em] lg:col-span-3',
                      last && 'text-white',
                    )}
                  >
                    {step.title}
                  </h2>

                  <p
                    className={cn(
                      'text-base leading-relaxed lg:col-span-6',
                      last ? 'text-white/75' : 'text-ink/80',
                    )}
                  >
                    {step.full}
                  </p>

                  <div className="lg:col-span-2 lg:text-right">
                    {step.price ? (
                      <span
                        className={cn(
                          'font-display text-xl font-semibold tracking-[-0.04em]',
                          last && 'text-white',
                        )}
                      >
                        {step.price}
                      </span>
                    ) : last ? (
                      <Button to={ROUTES.booking} className="w-full lg:w-auto">
                        Обсудить
                      </Button>
                    ) : (
                      <span className="text-base text-muted">входит в курс</span>
                    )}
                  </div>
                </article>
              </Reveal>
            )
          })}
        </ol>
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
          Цены действуют на {PRICES.validFrom}. Оплата — картой, Kaspi или в рассрочку. По ОСМС и
          ДМС условия уточняйте у администратора.
        </p>
      </section>

      <section className="container-content pb-14">
        <ParallaxBand
          image="/photos/facade.jpg"
          alt="Вход в клинику Amare"
          scrim="side"
          strength={14}
          objectPosition="center 62%"
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
