/* eslint-disable @next/next/no-img-element -- перенос 1:1 из набросков; next/image — отдельная задача */
import { getContent, getContentList, getPlural, getT, type Locale } from '@amare/i18n'
import { PageCover } from '@/components/PageCover'
import { Reveal } from '@amare/ui'
import { Button } from '@/components/Links'
import { Link } from '@/components/Links'
import { ArrowRight } from 'lucide-react'
import { DIRECTIONS } from '@/data/directions'
import { CONDITION_LIST, DOCTORS } from '@/data/doctors'
import { CLINIC, ROUTES } from '@/lib/clinic'
import { cn } from '@amare/ui'

/** Страница «Направления»: сюда ушли развёрнутые описания с главной. */
export function DirectionsPage({ locale }: { locale: Locale }) {
  const t = getT(locale, 'directions')
  const text = getContent(locale, 'directions')
  const condition = getContent(locale, 'doctors')
  const doctorCount = getPlural(locale, 'doctors')

  return (
    <>
      <PageCover
        crumb={t('cover.crumb')}
        title={t('cover.title')}
        note={t('cover.note')}
        image="/photos/equipment.jpg"
        alt={t('cover.alt')}
      />

      <section className="container-content flex flex-col gap-5 py-14">
        {DIRECTIONS.map((direction, i) => {
          const Icon = direction.icon
          /* Чередуем сторону фото: иначе десять одинаковых карточек подряд
             читаются как таблица и взгляд по ним не цепляется. */
          const photoRight = i % 2 === 1
          const tags = getContentList(locale, 'directions', `${direction.id}.tags`)

          return (
            <Reveal
              as="article"
              key={direction.id}
              id={direction.id}
              delay={i * 0.05}
              className="grid overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-12"
            >
              {direction.photo && (
                <img
                  src={direction.photo}
                  alt={text(`${direction.id}.photoAlt`)}
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    'h-64 w-full object-cover lg:col-span-5 lg:h-full',
                    photoRight && 'lg:order-2',
                  )}
                />
              )}

              <div
                className={cn(
                  'flex flex-col justify-center gap-3 p-7 sm:p-8',
                  direction.photo ? 'lg:col-span-7' : 'lg:col-span-12',
                )}
              >
                <span className="flex items-center gap-2 font-display text-sm font-semibold text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {text(`${direction.id}.method`)}
                </span>

                <h2 className="font-display text-2xl font-medium tracking-[-0.04em] sm:text-[1.7rem] leading-8">
                  {text(`${direction.id}.title`)}
                </h2>

                <p className="max-w-[44em] text-lg leading-relaxed text-ink/80">
                  {text(`${direction.id}.full`)}
                </p>

                {/*
                  Раньше здесь были чипы с фоном и скруглением. Это подписи
                  «чем меряем и кто ведёт», а не действия — вид кнопки заставлял
                  по ним кликать. Теперь просто строка через точки.
                */}
                <p className="m-0 text-base text-muted">{tags.join(' · ')}</p>
              </div>
            </Reveal>
          )
        })}
      </section>

      {/*
        Каждое состояние — ссылка на врачей, которые с ним работают.
        Раньше это был мёртвый список: человек прочитал «ишемический
        инсульт» и не знал, что делать дальше. Теперь следующий шаг очевиден.
      */}
      <section className="container-content flex flex-col gap-5 pb-14">
        <h2 className="font-display text-3xl font-medium tracking-[-0.045em]">
          {t('conditions.title')}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {CONDITION_LIST.map((id) => {
            const count = DOCTORS.filter((d) => d.conditions.includes(id)).length
            return (
              <li key={id}>
                <Link
                  href={`${ROUTES.team}?condition=${id}`}
                  className="group flex h-full flex-col justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-5 no-underline transition-colors hover:border-brand"
                >
                  <span className="text-base font-medium text-ink">
                    {condition(`condition.${id}`)}
                  </span>
                  <span className="inline-flex items-center gap-2 text-base font-semibold text-brand">
                    {doctorCount('count', count)}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="container-content pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl border border-tint bg-tint p-8 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="font-display text-2xl font-medium tracking-[-0.04em]">
              {t('cta.title')}
            </h2>
            <p className="text-base text-ink/75">{t('cta.note')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to={ROUTES.form}>{t('cta.form')}</Button>
            <Button href={CLINIC.phones[0].href} variant="outline">
              {CLINIC.phones[0].label}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
