import { Phone } from 'lucide-react'
import { Button } from '@amare/ui'
import { PageCover } from '@/components/PageCover'
import { FAQ } from '@/data/faq'
import { CLINIC, ROUTES } from '@/lib/clinic'

/**
 * Вопросы и ответы (S-02 ТЗ).
 *
 * Разметка FAQPage по S-12 отдаётся прямо здесь: страница серверная,
 * пользовательского ввода в JSON-LD не попадает.
 *
 * Ответы раскрываются нативным details — он работает без JS, доступен
 * с клавиатуры и ищется поиском по странице (Ctrl+F находит текст
 * внутри закрытого details в современных браузерах).
 */
export function FaqPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageCover
        crumb="Вопросы и ответы"
        title="Что обычно спрашивают до первого приёма"
        note="Организационные вопросы — сроки, деньги, документы, формат. На медицинские вопросы отвечает врач после осмотра, а не страница сайта."
        image="/photos/reception.jpg"
        alt="Стойка регистратуры клиники Amare"
      />

      <section className="container-content flex flex-col gap-3 py-14">
        {FAQ.map((item) => (
          <details
            key={item.id}
            id={item.id}
            className="group rounded-3xl border border-line bg-surface px-6 py-5 open:border-brand"
          >
            <summary className="cursor-pointer list-none text-lg font-semibold leading-snug marker:content-none">
              <span className="flex items-start justify-between gap-5">
                {item.question}
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-2xl leading-none text-brand transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="m-0 mt-4 max-w-[46em] text-lg leading-relaxed text-ink/80">
              {item.answer}
            </p>
          </details>
        ))}
      </section>

      <section className="container-content pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl border border-tint bg-tint p-8 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="font-display text-2xl font-medium tracking-[-0.04em]">
              Не нашли свой вопрос?
            </h2>
            <p className="text-base text-ink/75">
              Позвоните или опишите ситуацию в анкете — ответит администратор, а при медицинских
              вопросах врач-реабилитолог.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to={ROUTES.form}>Заполнить анкету</Button>
            <Button href={CLINIC.phones[0].href} variant="outline">
              <Phone className="h-5 w-5" aria-hidden="true" />
              {CLINIC.phones[0].label}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
