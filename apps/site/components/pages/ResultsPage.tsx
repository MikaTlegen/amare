/* eslint-disable @next/next/no-img-element -- фото «до/после»; next/image — отдельная задача */
import { Info } from 'lucide-react'
import { getContent, getT, type Locale } from '@amare/i18n'
import { Reveal } from '@amare/ui'
import { Button } from '@/components/Links'
import { PageCover } from '@/components/PageCover'
import { RECOVERY_STORIES } from '@/data/stories'
import { ROUTES, whatsappLink } from '@/lib/clinic'

/** Истории восстановления (S-08 ТЗ): пары фото «до/после» с описанием. */
export function ResultsPage({ locale }: { locale: Locale }) {
  const t = getT(locale, 'stories')
  const text = getContent(locale, 'stories')
  const contacts = getT(locale, 'contacts')
  const price = getT(locale, 'prices')

  return (
    <>
      <PageCover
        crumb={t('cover.crumb')}
        title={t('cover.title')}
        note={t('cover.note')}
        image="/photos/walk-bars.jpg"
        alt={t('cover.alt')}
      />

      <section className="container-content flex flex-col gap-6 py-14">
        {RECOVERY_STORIES.map((story, i) => {
          const name = text(`${story.id}.name`)

          return (
            <Reveal
              as="article"
              key={story.id}
              id={story.id}
              delay={i * 0.06}
              className="grid gap-6 rounded-3xl border border-line bg-surface p-6 sm:p-8 lg:grid-cols-12"
            >
              <div className="flex flex-col gap-4 lg:col-span-5">
                <div className="flex flex-col gap-1">
                  <h2 className="m-0 font-display text-2xl font-medium tracking-[-0.02em]">
                    {t('heading', { name, age: story.age })}
                  </h2>
                  <p className="m-0 text-base text-muted">{text(`${story.id}.diagnosis`)}</p>
                </div>

                <dl className="m-0 flex flex-col gap-3">
                  <div className="rounded-2xl bg-bg px-5 py-4">
                    <dt className="text-sm font-semibold text-muted">
                      {t('beforeLabel')}
                    </dt>
                    <dd className="m-0 mt-1 text-base leading-relaxed">
                      {text(`${story.id}.before`)}
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-tint px-5 py-4">
                    <dt className="text-sm font-semibold text-brand">
                      {t('afterLabel')}
                    </dt>
                    <dd className="m-0 mt-1 text-base leading-relaxed">
                      {text(`${story.id}.after`)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
                <figure className="m-0 flex flex-col gap-2">
                  <img
                    src={story.beforePhoto}
                    alt={t('beforeAlt', { name })}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-2xl object-contain"
                  />
                  <figcaption className="text-center text-base font-semibold text-muted">
                    {t('beforeCaption')}
                  </figcaption>
                </figure>
                <figure className="m-0 flex flex-col gap-2">
                  <img
                    src={story.afterPhoto}
                    alt={t('afterAlt', { name })}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-2xl object-contain"
                  />
                  <figcaption className="text-center text-base font-semibold text-brand">
                    {t('afterCaption')}
                  </figcaption>
                </figure>
              </div>
            </Reveal>
          )
        })}
      </section>

      <section className="container-content pb-14">
        <p className="m-0 flex items-start gap-3 rounded-3xl border border-line bg-bg px-6 py-5 text-base leading-relaxed text-muted">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-deep" aria-hidden="true" />
          {t('disclaimer')}
        </p>
      </section>

      <section className="container-content pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl border border-tint bg-tint p-8 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="font-display text-2xl font-medium tracking-[-0.02em]">{t('cta.title')}</h2>
            <p className="text-base text-ink/75">
              {t('cta.note', { hours: contacts('hours'), freeIntro: price('freeIntro') })}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to={ROUTES.booking}>{t('cta.book')}</Button>
            <Button href={whatsappLink(t('cta.whatsappText'))} variant="outline">
              {t('cta.whatsapp')}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
