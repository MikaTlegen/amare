'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Clock3 } from 'lucide-react'
import { AppointmentPicker } from '@/components/booking/AppointmentPicker'
import { DOCTORS } from '@/data/doctors'
import { getSlots, type Slot } from '@/lib/booking'
import { CLINIC, ROUTES, bookingLink } from '@/lib/clinic'

const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

function dayLabel(date: Date) {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')}`
}

/** «2026-09-25T10:30» → Date по локальному времени: new Date() сдвинул бы зону. */
function slotDate(at: string): Date {
  const [date, time] = at.split('T')
  const [year, month, day] = date!.split('-').map(Number)
  const [hour, minute] = time!.split(':').map(Number)
  return new Date(year!, month! - 1, day!, hour!, minute!)
}

function formatClosestSlot(slot: Slot) {
  return `${dayLabel(slotDate(slot.at))} в ${slot.at.slice(11, 16)}`
}

/** Профиль специалиста с предварительным расписанием до подключения CRM. */
export function DoctorProfilePage({ doctorId }: { doctorId: string }) {
  const doctor = DOCTORS.find((item) => item.id === doctorId)
  const [slotId, setSlotId] = useState<string | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])

  useEffect(() => {
    void getSlots().then(setSlots)
  }, [])

  /*
   * Очный приём этого врача. Онлайн и выезд на дом остаются на странице
   * записи: переключателя формата здесь нет, а смешивать три формата
   * в одном списке времени — значит показывать одно окно трижды.
   */
  const doctorSlots = useMemo(
    () =>
      doctor
        ? slots.filter((slot) => slot.doctorId === doctor.id && slot.format === 'clinic')
        : [],
    [slots, doctor],
  )

  const selectedSlot = doctorSlots.find((slot) => slot.id === slotId && !slot.taken)
  const closestSlot = doctorSlots.find((slot) => !slot.taken)

  if (!doctor) {
    return (
      <section className='container-content py-20'>
        <h1 className='font-display text-3xl font-semibold'>Специалист не найден</h1>
        <Link href={ROUTES.team} className='mt-6 inline-flex text-brand'>Вернуться к команде</Link>
      </section>
    )
  }

  return (
    <>
      <section className='bg-tint px-4 py-10 sm:px-8 lg:px-20'>
        <div className='mx-auto max-w-content'>
          <Link href={ROUTES.team} className='tap-target inline-flex items-center gap-2 text-sm font-semibold text-ink no-underline hover:text-brand'>
            <ArrowLeft className='h-4 w-4' aria-hidden='true' />
            Все специалисты
          </Link>
          <div className='mt-8 grid gap-8 lg:grid-cols-12 lg:items-end'>
            <div className='overflow-hidden bg-bg lg:col-span-4'>
              {doctor.photo ? <img src={doctor.photo} alt={`${doctor.role} ${doctor.name}`} className='aspect-4/5 h-full w-full object-cover object-top' /> : null}
            </div>
            <div className='min-w-0 lg:col-span-7 lg:col-start-6'>
              <p className='text-sm font-semibold uppercase tracking-[0.08em] text-brand'>{doctor.role}</p>
              <h1 className='mt-3 max-w-[14ch] font-display text-3xl font-semibold leading-tight tracking-[-0.05em] text-ink sm:text-6xl'>{doctor.name}</h1>
              <p className='mt-5 text-lg leading-relaxed text-muted'>{doctor.about}</p>
              <div className='mt-7 flex flex-wrap gap-3'>
                <span className='bg-bg px-4 py-2 text-sm font-semibold text-ink'>{doctor.experience}</span>
                {doctor.certificates.map((certificate) => <a key={certificate.href} href={certificate.href} target='_blank' rel='noopener noreferrer' className='inline-flex min-h-11 items-center bg-bg px-4 py-2 text-sm font-semibold text-ink no-underline hover:text-brand'>{certificate.label}</a>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto grid max-w-content gap-12 px-4 py-16 sm:px-8 lg:grid-cols-12 lg:px-20'>
        <div className='min-w-0 lg:col-span-5'>
          <p className='text-sm font-semibold uppercase tracking-[0.08em] text-brand'>Запись на консультацию</p>
          <h2 className='mt-4 font-display text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl'>Выберите удобное время</h2>
          <p className='mt-5 text-base leading-relaxed text-muted'>Показываем предварительно доступные окна. Администратор подтвердит запись по телефону.</p>
          {closestSlot ? <p className='mt-6 inline-flex items-center gap-2 bg-tint px-4 py-3 text-sm font-semibold text-deep'><Clock3 className='h-4 w-4' aria-hidden='true' />Ближайшая дата: {formatClosestSlot(closestSlot)}</p> : null}
        </div>

        <div className='min-w-0 lg:col-span-7'>
          <AppointmentPicker slots={doctorSlots} selectedId={slotId} onSelect={setSlotId} />

          <Link
            href={selectedSlot ? `${bookingLink(doctor.id)}&slot=${selectedSlot.id}` : bookingLink(doctor.id)}
            className={`mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-base font-semibold no-underline ${selectedSlot ? 'bg-accent text-accent-ink' : 'bg-deep text-white'}`}
          >
            <CalendarDays className='h-5 w-5' aria-hidden='true' />
            {selectedSlot ? `Записаться на ${selectedSlot.at.slice(11, 16)}` : 'Оставить заявку'}
          </Link>
          <p className='mt-4 text-xs leading-relaxed text-muted'>
            Здесь показан очный приём. Онлайн и выезд на дом — на{' '}
            <Link href={bookingLink(doctor.id)} className='text-brand'>странице записи</Link>.
            Нажимая «Записаться», вы переходите к форме с выбранным специалистом. {CLINIC.hours}.
          </p>
        </div>
      </section>
    </>
  )
}
