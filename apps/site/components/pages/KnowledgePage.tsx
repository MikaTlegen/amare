import { AlertTriangle, Phone } from 'lucide-react'
import { Button } from '@amare/ui'
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
export function KnowledgePage() {
  return (
    <>
      <PageCover
        crumb="База знаний"
        title="Что делать дома и чего делать нельзя"
        note="Материалы для пациентов и родственников. Клинические тексты выходят после утверждения мультидисциплинарной группой клиники."
        image="/photos/fine-motor.jpg"
        alt="Занятие специалиста с пациентом в клинике"
      />

      <section className="container-content flex flex-col gap-12 py-14">
        {KNOWLEDGE.map((section) => (
          <div key={section.id} id={section.id} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <h2 className="m-0 font-display text-3xl font-medium tracking-[-0.045em]">
                {section.title}
              </h2>
              <p className="m-0 text-lg leading-relaxed text-muted">{section.note}</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {section.articles.map((article) => (
                <article
                  key={article.id}
                  id={article.id}
                  className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-6"
                >
                  <h3 className="m-0 text-xl font-semibold leading-snug">{article.title}</h3>
                  <p className="m-0 text-base leading-relaxed text-muted">{article.summary}</p>

                  {article.points && (
                    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                      {article.points.map((point) => (
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
                    <p className="m-0 flex items-start gap-2.5 rounded-2xl border border-line px-4 py-3 text-base leading-relaxed text-muted">
                      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                      Текст готовится и проходит проверку врачами клиники. Пока спросите у своего
                      специалиста или на консультации — показать технику безопаснее, чем описать.
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="container-content pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl bg-deep p-8 text-white sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="m-0 font-display text-2xl font-medium tracking-[-0.04em]">
              Если прямо сейчас плохо — звоните 103
            </h2>
            <p className="m-0 text-base leading-relaxed text-white/75">
              Клиника не оказывает экстренную помощь. По вопросам курса и ухода — наш телефон в
              рабочее время.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="tel:103" variant="white">
              <Phone className="h-5 w-5" aria-hidden="true" />
              103
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
