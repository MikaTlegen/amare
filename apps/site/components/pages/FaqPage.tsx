import { Phone } from 'lucide-react'
import { getContent, getT, type Locale } from '@amare/i18n'
import { Button } from '@/components/Links'
import { PageCover } from '@/components/PageCover'
import { FAQ_IDS } from '@/data/faq'
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
export function FaqPage({ locale }: { locale: Locale }) {
  const t = getT(locale, 'faq')
  const text = getContent(locale, 'faq')
  const price = getT(locale, 'prices')

  // Цены подставляются в ответ целиком: «от 250 000 ₸» в казахском
  // строится иначе, и склеивать число с предлогом в коде нельзя
  const answer = (id: string) =>
    text(`${id}.answer`, {
      consultation: price('consultation'),
      course: price('course'),
      homeVisit: price('homeVisit'),
      online: price('online'),
      freeIntro: price('freeIntro'),
    })

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale,
    mainEntity: FAQ_IDS.map((id) => ({
      '@type': 'Question',
      name: text(`${id}.question`),
      acceptedAnswer: { '@type': 'Answer', text: answer(id) },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageCover
        crumb={t('cover.crumb')}
        title={t('cover.title')}
        note={t('cover.note')}
        image="/photos/doctor-patient.jpg"
        alt={t('cover.alt')}
      />

      <section className="container-content flex flex-col gap-3 py-14">
        {FAQ_IDS.map((id) => (
          <details
            key={id}
            id={id}
            className="group rounded-3xl border border-line bg-surface px-6 py-5 open:border-brand"
          >
            <summary className="cursor-pointer list-none text-lg font-semibold leading-snug marker:content-none">
              <span className="flex items-start justify-between gap-5">
                {text(`${id}.question`)}
                <span
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-2xl leading-none text-brand transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="m-0 mt-4 max-w-[46em] text-lg leading-relaxed text-ink/80">
              {answer(id)}
            </p>
          </details>
        ))}
      </section>

      <section className="container-content pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl border border-tint bg-tint p-8 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="font-display text-2xl font-medium tracking-[-0.04em]">{t('cta.title')}</h2>
            <p className="text-base text-ink/75">{t('cta.note')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to={ROUTES.form}>{t('cta.form')}</Button>
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
