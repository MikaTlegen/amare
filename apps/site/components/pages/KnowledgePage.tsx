/* eslint-disable @next/next/no-img-element -- иллюстрации статей; next/image — отдельная задача */
import { AlertTriangle, Phone } from 'lucide-react'
import { cn } from '@amare/ui'
import { getContent, getContentList, getT, type Locale } from '@amare/i18n'
import { Button } from '@/components/Links'
import { PageCover } from '@/components/PageCover'
import { KNOWLEDGE } from '@/data/knowledge'
import { CLINIC, ROUTES } from '@/lib/clinic'

/**
 * База знаний (S-07 ТЗ).
 *
 * Статьи с готовым текстом раскрываются здесь же; статьи со статусом
 * needsReview показывают только тему и ведут к специалисту. Так человек
 * видит, что материал будет, но не получает непроверенных клинических
 * советов — в реабилитации неправильная техника переворота или кормления
 * заканчивается травмой и аспирацией.
 */
const EMERGENCY_PHONE = '103'

export function KnowledgePage({ locale }: { locale: Locale }) {
  const t = getT(locale, 'knowledge')
  const text = getContent(locale, 'knowledge')

  return (
    <>
      <PageCover
        crumb={t('cover.crumb')}
        title={t('cover.title')}
        note={t('cover.note')}
        image="/photos/library.jpg"
        alt={t('cover.alt')}
      />

      <section className="container-content flex flex-col gap-12 py-14">
        {KNOWLEDGE.map((section) => {
          /*
           * Раздел с одной статьёй раскладывается горизонтально во всю
           * ширину: в сетке из двух колонок одинокая карточка оставляла
           * справа пустое место.
           */
          const single = section.articles.length === 1

          return (
          <div key={section.id} id={section.id} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <h2 className="m-0 font-display text-3xl font-medium tracking-[-0.02em]">
                {text(`section.${section.id}.title`)}
              </h2>
              <p className="m-0 text-lg leading-relaxed text-muted">{text(`section.${section.id}.note`)}</p>
            </div>

            <div className={cn('grid gap-4', !single && 'lg:grid-cols-2')}>
              {section.articles.map((article) => (
                <article
                  key={article.id}
                  id={article.id}
                  className={cn(
                    'flex flex-col gap-3 overflow-hidden rounded-3xl border border-line bg-surface',
                    single && 'lg:flex-row lg:gap-0',
                  )}
                >
                  <img
                    src={article.photo}
                    alt={text(`${article.id}.photoAlt`)}
                    loading="lazy"
                    decoding="async"
                    className={cn(
                      'h-48 w-full object-cover',
                      single && 'lg:h-auto lg:w-2/5 lg:shrink-0 lg:self-stretch',
                    )}
                  />

                  <div className={cn('flex flex-1 flex-col gap-3 px-6 pb-6', single && 'lg:p-7')}>
                    <h3 className="m-0 text-xl font-semibold leading-snug">{text(`${article.id}.title`)}</h3>
                    <p className="m-0 text-base leading-relaxed text-muted">{text(`${article.id}.summary`)}</p>

                    {article.hasPoints && (
                      <ul
                        className={cn(
                          'm-0 flex list-none flex-col gap-2.5 p-0',
                          single && 'lg:grid lg:grid-cols-2',
                        )}
                      >
                        {getContentList(locale, 'knowledge', `${article.id}.points`).map((point) => (
                          <li
                            key={point}
                            className="flex gap-3 rounded-2xl bg-bg px-4 py-3 text-base leading-relaxed"
                          >
                            <span aria-hidden="true" className="font-semibold text-brand">
                              —
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    )}

                    {article.needsReview && (
                      <p className="m-0 mt-auto flex items-start gap-2.5 rounded-2xl border border-line px-4 py-3 text-base leading-relaxed text-muted">
                        <AlertTriangle
                          className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        {t('needsReview')}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
          )
        })}
      </section>

      <section className="container-content pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-deep p-8 text-white sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="m-0 font-display text-2xl font-medium tracking-[-0.02em]">
              {t('emergency.title', { phone: EMERGENCY_PHONE })}
            </h2>
            <p className="m-0 text-base leading-relaxed text-white/75">
              {t('emergency.note')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={`tel:${EMERGENCY_PHONE}`} variant="white">
              <Phone className="h-5 w-5" aria-hidden="true" />
              {EMERGENCY_PHONE}
            </Button>
            <Button to={ROUTES.contacts} variant="white">
              {CLINIC.phones[0].label}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
