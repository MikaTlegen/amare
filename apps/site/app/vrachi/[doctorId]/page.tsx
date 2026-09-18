import type { Metadata } from 'next'
import { DoctorProfilePage } from '@/components/pages/DoctorProfilePage'
import { DOCTORS } from '@/data/doctors'

type Props = { params: Promise<{ doctorId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { doctorId } = await params
  const doctor = DOCTORS.find((item) => item.id === doctorId)
  return { title: doctor ? doctor.name : 'Специалист не найден' }
}

export function generateStaticParams() {
  return DOCTORS.map(({ id }) => ({ doctorId: id }))
}

export default async function Page({ params }: Props) {
  const { doctorId } = await params
  return <DoctorProfilePage doctorId={doctorId} />
}
