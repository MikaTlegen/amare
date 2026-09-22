import { Home, MonitorSmartphone, Route, Video } from 'lucide-react'
import { getContent, getT, type Locale } from '@amare/i18n'
import { Button } from '@/components/Links'
import { PageCover } from '@/components/PageCover'
import { CLINIC, ROUTES } from '@/lib/clinic'

/** Порядок и иконки шагов; текст лежит в словаре remote по ключу `step.<id>`. */
const STEPS = [
  { id: 'online', icon: Video },
  { id: 'course', icon: Route },
  { id: 'home', icon: MonitorSmartphone },
  { id: 'review', icon: Home },
] as const

/**
 * Дистанционная реабилитация для иногородних (S-09 ТЗ).
 *
 * Сознательно не обещаем «реабилитацию онлайн»: дистанционно идут
 * оценка, контроль и коррекция программы, а сами занятия человек
 * выполняет сам или с родственником. Обещать большее — врать.
 */
export function RemotePage({ locale }: { locale: Locale }) {
  const t = getT(locale, 'remote')
  const text = getContent(locale, 'remote')
  const price = getT(locale, 'prices')

  return (
    <>
      <PageCover
        crumb={t('cover.crumb')}
        title={t('cover.title')}
        note={t('cover.note')}
        image="/photos/telemedicine.jpg"
        alt={t('cover.alt')}
      />

      <section className="container-content grid gap-5 py-14 sm:grid-cols-2">
        {STEPS.map(({ id, icon: Icon }) => (
          <article
            key={id}
            className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-7"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint">
              <Icon className="h-6 w-6 text-deep" aria-hidden="true" />
            </span>
            <h2 className="m-0 font-display text-xl font-medium tracking-[-0.02em]">
              {text(`step.${id}.title`)}
            </h2>
            <p className="m-0 text-base leading-relaxed text-muted">
              {text(`step.${id}.text`, { price: price('online') })}
            </p>
          </article>
        ))}
      </section>

      <section className="container-content pb-14">
        <div className="flex flex-col gap-3 rounded-3xl border border-line bg-bg p-7">
          <h2 className="m-0 font-display text-xl font-medium tracking-[-0.02em]">
            {t('limits.title')}
          </h2>
          <p className="m-0 max-w-[48em] text-base leading-relaxed text-muted">{t('limits.text')}</p>
        </div>
      </section>

      <section className="container-content pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl border border-tint bg-tint p-8 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="font-display text-2xl font-medium tracking-[-0.02em]">{t('cta.title')}</h2>
            <p className="text-base text-ink/75">{t('cta.note')}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to={ROUTES.form}>{t('cta.form')}</Button>
            <Button href={CLINIC.whatsapp} variant="outline">
              {t('cta.whatsapp')}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
