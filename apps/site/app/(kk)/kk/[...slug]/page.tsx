import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { t } from '@amare/i18n'
import { ROUTES } from '@/lib/clinic'
import { allPaths, resolvePage } from '@/lib/pages'
import { DOCTORS } from '@/data/doctors'
import { entityMetadata, pageMetadata } from '@/lib/seo'

/**
 * Все казахские страницы, кроме главной.
 *
 * Русская версия остаётся файловой, казахская собирается из реестра
 * lib/pages.tsx: так страницы не приходится держать в двух экземплярах
 * и следить, чтобы они не разъехались.
 */

// В статической сборке сервера нет: адрес, которого не было на этапе
// сборки, взяться в рантайме не может
export const dynamicParams = false

export function generateStaticParams() {
  return allPaths()
    .filter((path) => path !== ROUTES.home)
    .map((path) => ({ slug: path.slice(1).split('/') }))
}

type Props = { params: Promise<{ slug: string[] }> }

/** Карточка врача: заголовок — имя, а не название раздела. */
function doctorFromSlug(slug: string[]): (typeof DOCTORS)[number] | undefined {
  const [section, id] = slug
  return section === ROUTES.team.slice(1) && id
    ? DOCTORS.find((doctor) => doctor.id === id)
    : undefined
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const path = `/${slug.join('/')}`
  const doctor = doctorFromSlug(slug)

  return doctor
    ? entityMetadata(path, doctor.name, 'kk')
    : slug.length > 1
      ? entityMetadata(path, t('kk', 'meta', 'doctorNotFound'), 'kk')
      : pageMetadata(path, 'kk')
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const page = resolvePage(`/${slug.join('/')}`)
  if (!page) notFound()

  return page.render()
}
