import { getContent, getT, type Locale } from '@amare/i18n'
import { Link } from '@/components/Links'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { PageCover } from '@/components/PageCover'
import { ParallaxBand } from '@amare/ui'
import { Reveal } from '@amare/ui'
import { Button } from '@/components/Links'
import { COURSE_STEPS, FORMATS } from '@/data/course'
import { CLINIC, ROUTES, whatsappLink } from '@/lib/clinic'

/** Страница «Курс и цены»: пять шагов, форматы, иногородние. */
export function CoursePage({ locale }: { locale: Locale }) {
  const t = getT(locale, 'course')
  const text = getContent(locale, 'course')
  const price = getT(locale, 'prices')
  const priceOf = getContent(locale, 'prices')

  return (
    <>
      <PageCover
        crumb={t('cover.crumb')}
        title={t('cover.title')}
        note={t('cover.note')}
        image="/photos/fine-motor.jpg"
        alt={t('cover.alt')}
        objectPosition="center 35%"
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
                  {text(`step.${step.n}.title`)}
                </h2>

                <p className="text-base leading-relaxed text-ink/80 lg:col-span-6">
                  {text(`step.${step.n}.full`)}
                </p>

                <div className="flex items-center gap-2 lg:col-span-2 lg:justify-end">
                  {step.priceKey ? (
                    <span className="font-display text-xl font-semibold tracking-[-0.04em] text-ink">
                      {price(step.priceKey)}
                    </span>
                  ) : (
                    <span className="text-base text-muted">{price('includedInCourse')}</span>
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
          <p className="m-0 flex-1 text-lg leading-relaxed text-white/85">{t('help.note')}</p>
          <div className="flex flex-wrap gap-3">
            <Button to={ROUTES.booking} variant="white">
              {t('help.book')}
            </Button>
            <Button href={whatsappLink(t('help.whatsappText'))} variant="white">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              {t('help.whatsapp')}
            </Button>
          </div>
        </div>
      </section>

      <section className="container-content flex flex-col gap-6 pb-14">
        <h2 className="font-display text-3xl font-medium tracking-[-0.045em]">
          {t('formats.title')}
        </h2>

        {/*
          У каждого формата своя кнопка записи: человек, который дочитал
          до цены, уже принял решение — заставлять его искать кнопку
          в другом блоке значит терять заявку. Параметр format
          предвыбирается на странице записи.
        */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FORMATS.map((format, i) => (
            <Reveal as="li" key={format.id} delay={i * 0.05}>
              <article className="flex h-full flex-col gap-2.5 rounded-3xl border border-line bg-surface p-6">
                <h3 className="text-lg font-semibold">{text(`format.${format.id}.title`)}</h3>
                <span className="font-display text-2xl font-semibold tracking-[-0.04em]">
                  {priceOf(format.priceKey)}
                </span>
                <p className="text-base leading-relaxed text-muted">
                  {text(`format.${format.id}.note`)}
                </p>
                <Button
                  to={`${ROUTES.booking}?format=${format.bookingFormat}`}
                  variant="outline"
                  className="mt-auto w-full"
                >
                  {t('formats.book')}
                </Button>
              </article>
            </Reveal>
          ))}
        </ul>

        <p className="text-base text-muted">{price('payment')}</p>
      </section>

      <section className="container-content pb-14">
        {/*
          Кадр узкий и банерный: вывеска занимает его почти целиком.
          strength={0} снимает и параллакс, и зум — иначе полоса срезала бы
          как раз вывеску, ради которой этот снимок и взят.
        */}
        <ParallaxBand
          image="/photos/facade-sign.png"
          alt={t('remote.alt')}
          scrim="side"
          strength={0}
          className="rounded-3xl"
        >
          <div className="flex max-w-136 flex-col items-start gap-4 p-8 sm:p-10">
            <h2 className="font-display text-2xl font-medium leading-tight tracking-[-0.04em] text-white sm:text-3xl sm:leading-9">
              {t('remote.title')}
            </h2>
            <p className="text-base leading-relaxed text-white/80">{t('remote.note')}</p>
            <Button href={CLINIC.whatsapp} variant="white">
              {t('remote.whatsapp')}
            </Button>
          </div>
        </ParallaxBand>
      </section>

      <section className="container-content pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl border border-tint bg-tint p-8 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="font-display text-2xl font-medium tracking-[-0.04em]">
              {t('cta.title')}
            </h2>
            <p className="text-base text-ink/75">
              {t('cta.note', { freeIntro: price('freeIntroInline') })}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to={ROUTES.booking}>{t('cta.pick')}</Button>
            <Button href={CLINIC.phones[0].href} variant="outline">
              {CLINIC.phones[0].label}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
