import { ExternalLink, ShieldCheck, Star } from 'lucide-react'
import { Button } from '@amare/ui'
import { PageCover } from '@/components/PageCover'
import { REVIEWS, REVIEWS_SUMMARY } from '@/data/reviews'
import { CLINIC, ROUTES } from '@/lib/clinic'

/**
 * Отзывы (S-02 ТЗ).
 *
 * Отдельная страница нужна, потому что отзывы читают до записи и ищут
 * их в меню, а не листая главную. Содержимое честное: проверяемый
 * рейтинг, ссылка на первоисточник и объяснение, почему мы не
 * перепечатываем чужие тексты.
 */
export function ReviewsPage() {
  return (
    <>
      <PageCover
        crumb="Отзывы"
        title="Отзывы о клинике"
        note="Рейтинг и оценки берём из 2ГИС: их пишут сами пациенты, и мы не можем их отредактировать."
        image="/photos/team.jpg"
        alt="Команда клиники Amare"
      />

      <section className="container-content grid gap-5 py-14 lg:grid-cols-12">
        <div className="flex flex-col items-start gap-3 rounded-3xl bg-deep p-8 lg:col-span-5">
          <span className="font-display text-6xl font-semibold tracking-tighter text-white">
            {REVIEWS_SUMMARY.rating}
          </span>
          <span className="flex gap-1" aria-label={`Рейтинг ${REVIEWS_SUMMARY.rating} из 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-sky text-sky" aria-hidden="true" />
            ))}
          </span>
          <p className="m-0 text-lg leading-relaxed text-white/75">
            {REVIEWS_SUMMARY.count} оценок в {REVIEWS_SUMMARY.source}
          </p>
          <Button href={REVIEWS_SUMMARY.sourceUrl} variant="white" className="mt-3 self-start">
            Читать отзывы в {REVIEWS_SUMMARY.source}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-8 lg:col-span-7">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint">
            <ShieldCheck className="h-6 w-6 text-deep" aria-hidden="true" />
          </span>
          <h2 className="m-0 font-display text-2xl font-medium tracking-[-0.04em]">
            Почему здесь нет стены цитат
          </h2>
          <p className="m-0 max-w-[44em] text-lg leading-relaxed text-ink/80">
            Отзыв принадлежит человеку, который его написал. Переносить чужой текст с 2ГИС на
            коммерческий сайт без разрешения нельзя, а сочинять отзывы за пациентов — тем более:
            в медицине это ещё и риск раскрыть факт лечения конкретного человека.
          </p>
          <p className="m-0 max-w-[44em] text-lg leading-relaxed text-ink/80">
            Поэтому мы собираем отзывы сами и публикуем их только с письменного согласия автора.
            Раздел наполняется медленно — зато каждому тексту здесь можно верить.
          </p>
        </div>
      </section>

      {REVIEWS.length > 0 && (
        <section className="container-content grid gap-5 pb-14 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review) => (
            <article
              key={review.id}
              className="flex h-full flex-col gap-3 rounded-3xl border border-line bg-surface p-6"
            >
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
          ))}
        </section>
      )}

      <section className="container-content pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl border border-tint bg-tint p-8 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="font-display text-2xl font-medium tracking-[-0.04em]">
              Проходили курс у нас?
            </h2>
            <p className="text-base text-ink/75">
              Расскажите, что получилось, а что нет. Критику читаем первой — она меняет работу
              быстрее похвалы.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={CLINIC.whatsapp}>Написать в WhatsApp</Button>
            <Button to={ROUTES.results} variant="outline">
              Истории восстановления
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
