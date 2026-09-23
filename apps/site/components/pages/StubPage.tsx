'use client'

import { usePathname } from 'next/navigation'
import { Construction } from 'lucide-react'
import { stripLocale } from '@amare/i18n/locales'
import { useT } from '@amare/i18n/react'
import { Button } from '@/components/Links'
import { ClinicMap } from '@/components/ClinicMap'
import { BOOKING_URL, CLINIC, ROUTES } from '@/lib/clinic'

/**
 * Заглушка для страниц, которых ещё нет.
 *
 * Зачем она нужна: ссылка на несуществующую страницу либо ведёт на 404
 * (человек думает, что сайт сломан), либо на главную (человек думает, что
 * промахнулся мышью). И то и другое хуже честного «раздел готовится» —
 * особенно для юридических документов, где посетитель ищет конкретное.
 *
 * TODO: по мере готовности заменять на настоящие страницы, а запись
 * отсюда удалять.
 */
const NAMES: Record<string, string> = {
  [ROUTES.relatives]: 'relatives',
  [ROUTES.about]: 'about',
  [ROUTES.jobs]: 'jobs',
  [ROUTES.offer]: 'offer',
  [ROUTES.license]: 'license',
}

export function StubPage() {
  // Маршруты в ROUTES без префикса локали: на /kk/ его надо снять
  const pathname = stripLocale(usePathname())
  const t = useT('legal')
  const meta = useT('meta')

  const name = NAMES[pathname]
  // Заголовок один и тот же на вкладке и на странице — берём из meta
  const title = name ? meta(name as Parameters<typeof meta>[0]) : t('fallback.title')
  const note = name ? t(`note.${name}` as Parameters<typeof t>[0]) : t('fallback.note')

  /** На странице о клинике карта уместна: человек ищет, как доехать. */
  const withMap = pathname === ROUTES.about

  return (
    <section className="container-content flex flex-col gap-8 py-16">
      <div className="flex max-w-3xl flex-col gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint">
          <Construction className="h-6 w-6 text-deep" aria-hidden="true" />
        </span>

        <h1 className="m-0 font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
          {title}
        </h1>

        <p className="m-0 text-lg leading-relaxed text-muted">{note}</p>

        <p className="m-0 text-lg leading-relaxed">
          {t('ask')}{' '}
          <a href={CLINIC.phones[0].href} className="font-semibold">
            {CLINIC.phones[0].label}
          </a>
        </p>

        <div className="flex flex-wrap gap-3">
          <Button href={BOOKING_URL}>{t('book')}</Button>
          <Button to={ROUTES.home} variant="outline">
            {t('home')}
          </Button>
        </div>
      </div>

      {withMap && <ClinicMap />}
    </section>
  )
}
