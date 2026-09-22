'use client'

/* eslint-disable @next/next/no-img-element -- перенос 1:1 из набросков; next/image — отдельная задача */
import { Link } from '@/components/Links'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CalendarDays, X, Award } from 'lucide-react'
import { useContent, useContentList, useT } from '@amare/i18n/react'
import { PageCover } from '@/components/PageCover'
import { Reveal } from '@amare/ui'
import { Button } from '@/components/Links'
import { DOCTORS, CONDITION_LIST, type ConditionId } from '@/data/doctors'
import { CLINIC, ROUTES } from '@/lib/clinic'
import { cn } from '@amare/ui'

/**
 * Страница «Врачи».
 *
 * Поддерживает фильтр ?condition=... — с ним сюда приходят из блока
 * «С какими состояниями работаем». Фильтр в адресе, а не в состоянии:
 * ссылку можно отправить родственнику, и он увидит тех же врачей.
 */
export function TeamPage() {
  const t = useT('doctors')
  const text = useContent('doctors')
  const list = useContentList('doctors')
  const price = useT('prices')

  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  // Фильтр живёт в адресе: ссылку можно отправить родственнику
  const setParams = (next: Record<string, string>) => {
    const query = new URLSearchParams(next).toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }
  const condition = params.get('condition') as ConditionId | null
  const active = CONDITION_LIST.find((id) => id === condition)

  const doctors = active ? DOCTORS.filter((d) => d.conditions.includes(active)) : DOCTORS

  return (
    <>
      <PageCover
        crumb={t('cover.crumb')}
        title={t('cover.title')}
        note={t('cover.note')}
        image="/photos/team.jpg"
        alt={t('cover.alt')}
        objectPosition="center 40%"
      />

      {/*
        Блока «Основатель клиники» здесь нет намеренно: слово основателя
        стоит на главной (components/home/FounderWord), дублировать его
        на странице врачей незачем.
      */}

      {/* Фильтр по состоянию */}
      <section className="container-content flex flex-col gap-4 pt-10">
        <h2 className="m-0 font-display text-xl font-medium tracking-[-0.02em]">
          {t('filter.title')}
        </h2>
        <ul className="flex flex-wrap gap-2.5">
          {CONDITION_LIST.map((id) => {
            const on = id === condition
            return (
              <li key={id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setParams(on ? {} : { condition: id })}
                  className={cn(
                    'min-h-[2.9rem] rounded-full border px-5 py-2.5 text-base font-medium transition-colors',
                    on
                      ? 'border-deep bg-deep text-white'
                      : 'border-line bg-surface text-muted hover:border-ink hover:text-ink',
                  )}
                >
                  {text(`condition.${id}`)}
                </button>
              </li>
            )
          })}
        </ul>

        {active && (
          <p className="m-0 flex flex-wrap items-center gap-3 text-base text-muted">
            {t('filter.active', {
              condition: text(`condition.${active}`),
              count: doctors.length,
            })}
            <button
              type="button"
              onClick={() => setParams({})}
              className="inline-flex min-h-[2.6rem] items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-base font-medium text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              {t('filter.reset')}
            </button>
          </p>
        )}
      </section>

      {/* Врачи */}
      <section className="container-content flex flex-col gap-6 py-10">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {doctors.map((doctor, i) => {
            const name = text(`${doctor.id}.name`)
            const role = text(`${doctor.id}.role`)

            return (
              <Reveal as="li" key={doctor.id} delay={i * 0.05}>
                <article className="gradient-border group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface">
                  <div className="aspect-4/5 overflow-hidden bg-tint">
                    {doctor.photo ? (
                      <img
                        src={doctor.photo}
                        alt={t('card.photoAlt', { role, name })}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted">
                        {t('card.noPhoto')}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-1.5 p-5">
                    <h3 className="m-0 text-lg font-semibold leading-snug">{name}</h3>
                    <span className="text-base text-muted">{role}</span>
                    <span className="text-base font-medium text-accent">
                      {text(`${doctor.id}.experience`)}
                    </span>

                    <p className="m-0 mt-1 text-base leading-relaxed text-muted">
                      {text(`${doctor.id}.about`)}
                    </p>

                    <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-tint px-3 py-1.5 text-sm font-medium text-deep">
                      <Award className="h-4 w-4" aria-hidden="true" />
                      {t('card.certificate')}
                    </span>

                    {/*
                      Растянутая ссылка: нажатие в любом месте карточки ведёт
                      на страницу врача, где стоит календарь записи.
                      Ссылка одна — вложенных <a> нет.
                    */}
                    <Link
                      href={`${ROUTES.team}/${doctor.id}`}
                      className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 pt-3 text-base font-semibold text-accent-ink no-underline after:absolute after:inset-0 after:content-['']"
                    >
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                      {t('card.book')}
                    </Link>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </ul>
      </section>

      {/* Состав МДГ */}
      <section className="container-content grid items-center gap-8 pb-14 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <h2 className="m-0 font-display text-2xl font-medium leading-[1.16] tracking-[-0.02em] sm:text-3xl sm:leading-9">
            {t('team.title')}
          </h2>
          {/*
            Список ролей — перечисление, а не набор действий. Плашки
            читались как кнопки, поэтому здесь обычный текст с точками
            в качестве разделителя.
          */}
          <ul className="m-0 flex list-none flex-wrap items-center gap-x-3 gap-y-1.5 p-0 text-lg text-deep">
            {list('roles').map((role, i) => (
              <li key={role} className="flex items-center gap-3">
                {i > 0 && (
                  <span className="text-line" aria-hidden="true">
                    ·
                  </span>
                )}
                {role}
              </li>
            ))}
          </ul>
          <p className="m-0 text-base leading-relaxed text-ink/75">{t('team.note')}</p>
        </div>

        {/*
          Фото команды вертикальное (1000×1336). Раньше оно стояло в широком
          блоке с object-cover и обрезало людей по краям. Теперь держим
          родную пропорцию 3:4 и даём object-contain на фирменной подложке:
          лучше поля по бокам, чем срезанные головы.
        */}
        <figure className="m-0 lg:col-span-5">
          <img
            src="/photos/team.jpg"
            alt={t('team.photoAlt')}
            loading="lazy"
            decoding="async"
            className="aspect-3/4 w-full rounded-3xl bg-tint object-contain"
          />
        </figure>
      </section>

      <section className="container-content pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-deep p-8 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="m-0 font-display text-2xl font-medium tracking-[-0.02em] text-white">
              {t('cta.title')}
            </h2>
            <p className="m-0 text-base text-white/70">
              {t('cta.note', { freeIntro: price('freeIntroInline') })}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to={ROUTES.booking}>{t('cta.pick')}</Button>
            <Button href={CLINIC.phones[0].href} variant="onDark">
              {CLINIC.phones[0].label}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
