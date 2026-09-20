'use client'

import { useT } from '@amare/i18n/react'
import { Link } from '@/components/Links'
import { ROUTES } from '@/lib/clinic'

interface Props {
  title: string
  note?: string
  image: string
  alt: string
  /** Текущая страница в хлебных крошках. */
  crumb: string
  /** Фокус кадра для размытой подложки: 'center 60%' и т.п. */
  objectPosition?: string
}

/**
 * Обложка внутренней страницы: фоновое фото, крошки и заголовок.
 * Затемнение сохраняет читаемость текста на любом кадре.
 *
 * Заголовок и подпись приходят пропами — их переводит сама страница.
 * Свои две строки берёт из контекста: компонент рисуется и на серверных,
 * и на клиентских страницах, а импорт словарей утянул бы их в бандл.
 */
export function PageCover({
  title,
  note,
  image,
  alt,
  crumb,
  objectPosition = 'center',
}: Props) {
  const t = useT('nav')

  return (
    <section
      aria-label={alt}
      className="relative isolate overflow-hidden bg-deep bg-cover bg-center"
      style={{ backgroundImage: 'url(' + image + ')', backgroundPosition: objectPosition }}
    >
      <div className="mx-auto max-w-content px-4 py-20 sm:px-8 lg:px-20 lg:py-28">
        <div className="flex max-w-2xl flex-col justify-center gap-4">
          <nav aria-label={t('breadcrumbs')} className="flex items-center gap-2 text-base text-white/70">
            <Link href={ROUTES.home} className="tap-target text-white/70 no-underline hover:text-white">{t('home')}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-white">{crumb}</span>
          </nav>
          <h1 className="max-w-[16em] font-display text-2xl font-semibold leading-[1.18] tracking-[-0.045em] text-white sm:text-5xl sm:leading-none">{title}</h1>
          {note && <p className="max-w-[34em] text-lg leading-relaxed text-white/80">{note}</p>}
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-scrim/70 lg:bg-linear-to-r lg:from-scrim/90 lg:via-scrim/72 lg:to-scrim/62" />
    </section>
  )
}
