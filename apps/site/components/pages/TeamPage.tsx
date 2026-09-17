'use client'

/* eslint-disable @next/next/no-img-element -- перенос 1:1 из набросков; next/image — отдельная задача */
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CalendarDays, X, Award } from 'lucide-react'
import { PageCover } from '@/components/PageCover'
import { Reveal } from '@amare/ui'
import { Button } from '@amare/ui'
import { DOCTORS, TEAM_ROLES, CONDITION_LIST, type ConditionId } from '@/data/doctors'
import { CLINIC, PRICES, ROUTES } from '@/lib/clinic'
import { cn } from '@amare/ui'

/**
 * Страница «Врачи».
 *
 * Поддерживает фильтр ?condition=... — с ним сюда приходят из блока
 * «С какими состояниями работаем». Фильтр в адресе, а не в состоянии:
 * ссылку можно отправить родственнику, и он увидит тех же врачей.
 */
export function TeamPage() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  // Фильтр живёт в адресе: ссылку можно отправить родственнику
  const setParams = (next: Record<string, string>) => {
    const query = new URLSearchParams(next).toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }
  const condition = params.get('condition') as ConditionId | null
  const active = CONDITION_LIST.find((c) => c.id === condition)

  const doctors = active ? DOCTORS.filter((d) => d.conditions.includes(active.id)) : DOCTORS

  return (
    <>
      <PageCover
        crumb="Врачи"
        title="С пациентом работает команда"
        note="Не один врач, а мультидисциплинарная группа: решения принимаются совместно и пересматриваются по ходу курса."
        image="/photos/reception.jpg"
        alt="Ресепшен клиники Amare"
        objectPosition="center 40%"
      />

      {/*
        Основатель. Фото намеренно нет: в материалах не было портрета
        Асемгуль Амирбековны, а подставлять сюда снимок другого
        сотрудника — прямой обман.
      */}
      <section className="container-content pt-12">
        <Reveal
          as="article"
          className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-7 sm:p-9"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Основатель клиники
          </span>
          <h2 className="m-0 font-display text-2xl font-medium tracking-[-0.04em] sm:text-3xl">
            Асемгуль Амирбековна
          </h2>
          <p className="m-0 max-w-[44em] text-lg leading-relaxed text-ink/80">
            «[ЦИТАТА ОСНОВАТЕЛЯ — 2–3 предложения о том, почему была открыта клиника и что значит
            предотвратить инвалидность]»
          </p>
          <span className="text-base text-muted">
            [Должность, квалификация и портрет — прислать из клиники]
          </span>
        </Reveal>
      </section>

      {/* Фильтр по состоянию */}
      <section className="container-content flex flex-col gap-4 pt-10">
        <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
          Подобрать по состоянию
        </h2>
        <ul className="flex flex-wrap gap-2.5">
          {CONDITION_LIST.map((item) => {
            const on = item.id === condition
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setParams(on ? {} : { condition: item.id })}
                  className={cn(
                    'min-h-[2.9rem] rounded-full border px-5 py-2.5 text-base font-medium transition-colors',
                    on
                      ? 'border-deep bg-deep text-white'
                      : 'border-line bg-surface text-muted hover:border-ink hover:text-ink',
                  )}
                >
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>

        {active && (
          <p className="m-0 flex flex-wrap items-center gap-3 text-base text-muted">
            Показаны специалисты по направлению «{active.label}»: {doctors.length}
            <button
              type="button"
              onClick={() => setParams({})}
              className="inline-flex min-h-[2.6rem] items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-base font-medium text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Показать всех
            </button>
          </p>
        )}
      </section>

      {/* Врачи */}
      <section className="container-content flex flex-col gap-6 py-10">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {doctors.map((doctor, i) => (
            <Reveal as="li" key={doctor.id} delay={i * 0.05}>
              <article className="gradient-border group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface">
                <div className="aspect-4/5 overflow-hidden bg-tint">
                  {doctor.photo ? (
                    <img
                      src={doctor.photo}
                      alt={`${doctor.role} ${doctor.name}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted">
                      [ФОТО с сайта amare.kz]
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-1.5 p-5">
                  <h3 className="m-0 text-lg font-semibold leading-snug">{doctor.name}</h3>
                  <span className="text-base text-muted">{doctor.role}</span>
                  <span className="text-base font-medium text-accent">{doctor.experience}</span>

                  {doctor.about && (
                    <p className="m-0 mt-1 text-base leading-relaxed text-muted">{doctor.about}</p>
                  )}

                  <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-tint px-3 py-1.5 text-sm font-medium text-deep">
                    <Award className="h-4 w-4" aria-hidden="true" />
                    Сертификат
                  </span>

                  <Link
                    href={`${ROUTES.booking}?doctor=${doctor.id}`}
                    className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 pt-3 text-base font-semibold text-accent-ink no-underline"
                  >
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    Записаться
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Состав МДГ */}
      <section className="container-content grid items-center gap-8 pb-14 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <h2 className="m-0 font-display text-2xl font-medium leading-[1.16] tracking-[-0.045em] sm:text-3xl sm:leading-9">
            И специалисты, которые ведут занятия каждый день
          </h2>
          <ul className="flex flex-wrap gap-2.5">
            {TEAM_ROLES.map((role) => (
              <li
                key={role}
                className="rounded-full bg-tint px-4 py-2.5 text-base font-medium text-deep"
              >
                {role}
              </li>
            ))}
          </ul>
          <p className="m-0 text-base leading-relaxed text-ink/75">
            Состав группы подбирается под дефициты конкретного пациента и пересматривается на
            еженедельном разборе.
          </p>
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
            alt="Мультидисциплинарная команда клиники Amare"
            loading="lazy"
            decoding="async"
            className="aspect-3/4 w-full rounded-3xl bg-tint object-contain"
          />
        </figure>
      </section>

      <section className="container-content pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-deep p-8 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="m-0 font-display text-2xl font-medium tracking-[-0.04em] text-white">
              Записаться к специалисту
            </h2>
            <p className="m-0 text-base text-white/70">
              Очно, онлайн или с выездом на дом. {PRICES.freeIntro.toLowerCase()}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to={ROUTES.booking}>Выбрать время</Button>
            <Button href={CLINIC.phones[0].href} variant="onDark">
              {CLINIC.phones[0].label}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
