/* eslint-disable @next/next/no-img-element -- фото «до/после»; next/image — отдельная задача */
import { Info } from 'lucide-react'
import { Button, Reveal } from '@amare/ui'
import { PageCover } from '@/components/PageCover'
import { RECOVERY_STORIES } from '@/data/stories'
import { CLINIC, ROUTES, whatsappLink } from '@/lib/clinic'

/** Истории восстановления (S-08 ТЗ): пары фото «до/после» с описанием. */
export function ResultsPage() {
  return (
    <>
      <PageCover
        crumb="Результаты"
        title="Истории восстановления"
        note="Пациенты клиники Amare и то, с чем они пришли и ушли. Фото и сведения публикуются с согласия пациентов."
        image="/photos/walk-bars.jpg"
        alt="Тренировка ходьбы на реабилитационных брусьях"
      />

      <section className="container-content flex flex-col gap-6 py-14">
        {RECOVERY_STORIES.map((story, i) => (
          <Reveal
            as="article"
            key={story.id}
            id={story.id}
            delay={i * 0.06}
            className="grid gap-6 rounded-3xl border border-line bg-surface p-6 sm:p-8 lg:grid-cols-12"
          >
            <div className="flex flex-col gap-4 lg:col-span-5">
              <div className="flex flex-col gap-1">
                <h2 className="m-0 font-display text-2xl font-medium tracking-[-0.04em]">
                  {story.name}, {story.age}
                </h2>
                <p className="m-0 text-base text-muted">{story.diagnosis}</p>
              </div>

              <dl className="m-0 flex flex-col gap-3">
                <div className="rounded-2xl bg-bg px-5 py-4">
                  <dt className="text-sm font-semibold uppercase tracking-[0.08em] text-muted">
                    До курса
                  </dt>
                  <dd className="m-0 mt-1 text-base leading-relaxed">{story.before}</dd>
                </div>
                <div className="rounded-2xl bg-tint px-5 py-4">
                  <dt className="text-sm font-semibold uppercase tracking-[0.08em] text-brand">
                    После курса
                  </dt>
                  <dd className="m-0 mt-1 text-base leading-relaxed">{story.after}</dd>
                </div>
              </dl>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
              <figure className="m-0 flex flex-col gap-2">
                <img
                  src={story.beforePhoto}
                  alt={`${story.name} до курса реабилитации`}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-2xl object-contain"
                />
                <figcaption className="text-center text-base font-semibold text-muted">
                  До
                </figcaption>
              </figure>
              <figure className="m-0 flex flex-col gap-2">
                <img
                  src={story.afterPhoto}
                  alt={`${story.name} после курса реабилитации`}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-2xl object-contain"
                />
                <figcaption className="text-center text-base font-semibold text-brand">
                  После
                </figcaption>
              </figure>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="container-content pb-14">
        <p className="m-0 flex items-start gap-3 rounded-3xl border border-line bg-bg px-6 py-5 text-base leading-relaxed text-muted">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-deep" aria-hidden="true" />
          Эти результаты — не обещание. Восстановление зависит от объёма поражения, срока после
          инсульта, сопутствующих болезней и того, насколько регулярно человек занимается дома.
          Что реально даст курс именно вам, скажет врач после осмотра.
        </p>
      </section>

      <section className="container-content pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl border border-tint bg-tint p-8 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="font-display text-2xl font-medium tracking-[-0.04em]">
              Хотите понять, чего ждать в вашем случае?
            </h2>
            <p className="text-base text-ink/75">
              {CLINIC.hours}. Первые 15 минут консультации — бесплатно.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to={ROUTES.booking}>Записаться</Button>
            <Button
              href={whatsappLink('Здравствуйте! Видел истории восстановления на сайте.')}
              variant="outline"
            >
              Написать в WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
