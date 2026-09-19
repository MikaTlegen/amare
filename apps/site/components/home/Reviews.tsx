import { ExternalLink, Quote, Star } from 'lucide-react'
import { Reveal, SectionHeading } from '@amare/ui'
import { Button } from '@/components/Links'
import { ROUTES } from '@/lib/clinic'
import { REVIEWS, REVIEWS_SUMMARY } from '@/data/reviews'

/**
 * Отзывы на главной.
 *
 * Рейтинг и количество оценок — реальные и публичные. Текстов пока нет:
 * копировать чужие отзывы с 2ГИС нельзя, сочинять — тем более
 * (подробности в data/reviews.ts). Пока список пуст, показываем цифру
 * и ссылку на первоисточник — она делает её проверяемой.
 */
export function Reviews() {
  return (
    <section className="container-content flex flex-col gap-7 py-16">
      <SectionHeading
        title="Что говорят пациенты"
        note="Рейтинг и оценки — из карточки клиники в 2ГИС, их можно проверить."
        aside={
          <a
            href={REVIEWS_SUMMARY.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target inline-flex items-center gap-2 text-base font-semibold no-underline hover:text-accent"
          >
            Все отзывы в {REVIEWS_SUMMARY.source}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        }
      />

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="flex flex-col items-start gap-3 rounded-3xl bg-deep p-7 lg:col-span-4">
          <span className="font-display text-5xl font-semibold tracking-tighter text-white">
            {REVIEWS_SUMMARY.rating}
          </span>

          <span className="flex gap-1" aria-label={`Рейтинг ${REVIEWS_SUMMARY.rating} из 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-sky text-sky" aria-hidden="true" />
            ))}
          </span>

          <p className="m-0 text-base leading-relaxed text-white/75">
            {REVIEWS_SUMMARY.count} оценок в {REVIEWS_SUMMARY.source}. Чаще всего хвалят
            реабилитолога, массажиста, логопеда, оборудование и чистоту.
          </p>
        </div>

        {REVIEWS.length === 0 ? (
          <div className="flex flex-col justify-center gap-3 rounded-3xl border border-line bg-surface p-7 lg:col-span-8">
            <Quote className="h-6 w-6 text-brand" aria-hidden="true" />
            <p className="m-0 max-w-[42em] text-lg leading-relaxed text-ink/85">
              Тексты отзывов мы публикуем только с письменного согласия автора. Собранные истории
              появятся здесь, а прямо сейчас все отзывы можно прочитать в карточке клиники в 2ГИС —
              там их пишут сами пациенты, и подредактировать их мы не можем.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button href={REVIEWS_SUMMARY.sourceUrl} variant="deep">
                Открыть отзывы в {REVIEWS_SUMMARY.source}
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button to={ROUTES.reviews} variant="ghost">
                Про отзывы на сайте
              </Button>
            </div>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            {REVIEWS.map((review, i) => (
              <Reveal as="li" key={review.id} delay={i * 0.06}>
                <article className="flex h-full flex-col gap-3 rounded-3xl border border-line bg-surface p-6">
                  <Quote className="h-6 w-6 text-brand" aria-hidden="true" />

                  <span className="flex gap-0.5" aria-label={`Оценка ${review.rating} из 5`}>
                    {Array.from({ length: review.rating }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                    ))}
                  </span>

                  <p className="m-0 flex-1 text-base leading-relaxed text-ink/85">{review.text}</p>

                  <footer className="text-base text-muted">
                    {review.author} · {review.relation}
                    <br />
                    {review.date}
                  </footer>
                </article>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
