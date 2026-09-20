import type { Metadata } from 'next'
import { t } from '@amare/i18n'
import { PageMessages } from '@/components/PageMessages'
import { DoctorProfilePage } from '@/components/pages/DoctorProfilePage'
import { DOCTORS } from '@/data/doctors'
import { doctorPath } from '@/lib/pages'
import { entityMetadata } from '@/lib/seo'

type Props = { params: Promise<{ doctorId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { doctorId } = await params
  const doctor = DOCTORS.find((item) => item.id === doctorId)

  return entityMetadata(
    doctorPath(doctorId),
    doctor ? t('ru', 'doctors', `${doctorId}.name` as never) : t('ru', 'meta', 'doctorNotFound'),
    'ru',
  )
}

export function generateStaticParams() {
  return DOCTORS.map(({ id }) => ({ doctorId: id }))
}

/*
 * PageMessages обязателен: карточка — клиентский компонент, и без провайдера
 * useT возвращает сам ключ. Страница показывала «niyazbekova.name» вместо
 * имени. Казахская версия собирается через renderPage, который оборачивает
 * сам, поэтому ломалась только русская.
 */
export default async function Page({ params }: Props) {
  const { doctorId } = await params

  return (
    <PageMessages path={doctorPath(doctorId)} locale="ru">
      <DoctorProfilePage doctorId={doctorId} locale="ru" />
    </PageMessages>
  )
}
