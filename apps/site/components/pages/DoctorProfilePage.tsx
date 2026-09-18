'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Clock3 } from 'lucide-react'
import { DOCTORS } from '@/data/doctors'
import { getSlots, type Slot } from '@/lib/booking'
import { CLINIC, ROUTES } from '@/lib/clinic'

const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

function dayLabel(date: Date) {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')}`
}

function formatClosestSlot(slot: Slot) {
  const date = new Date(slot.at)
  return `${dayLabel(date)} в ${slot.at.slice(11, 16)}`
}

/** Профиль специалиста с предварительным расписанием до подключения CRM. */
export function DoctorProfilePage({ doctorId }: { doctorId: string }) {
  const doctor = DOCTORS.find((item) => item.id === doctorId)
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [slots, setSlots] = useState<Slot[] | null>(null)

  const dates = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() + index + 1)
    return date
  }), [])

  if (!doctor) {
    return (
      <section className='container-content py-20'>
        <h1 className='font-display text-3xl font-semibold'>Специалист не найден</h1>
        <Link href={ROUTES.team} className='mt-6 inline-flex text-brand'>Вернуться к команде</Link>
      </section>
    )
  }

  const selectedDay = dates[selectedDate] ?? new Date()
  const dateKey = selectedDay.toISOString().slice(0, 10)
  const doctorSlots = (slots ?? []).filter((slot) => slot.doctorId === doctor.id && slot.at.startsWith(dateKey))
  const closestSlot = (slots ?? []).find((slot) => slot.doctorId === doctor.id)

  async function loadSlots() {
    if (slots) return
    setSlots(await getSlots())
  }

  return (
    <>
      <section className='bg-tint px-5 py-10 sm:px-8 lg:px-20'>
        <div className='mx-auto max-w-content'>
          <Link href={ROUTES.team} className='inline-flex items-center gap-2 text-sm font-semibold text-ink no-underline hover:text-brand'>
            <ArrowLeft className='h-4 w-4' aria-hidden='true' />
            Все специалисты
          </Link>
          <div className='mt-8 grid gap-8 lg:grid-cols-12 lg:items-end'>
            <div className='overflow-hidden bg-bg lg:col-span-4'>
              {doctor.photo ? <img src={doctor.photo} alt={`${doctor.role} ${doctor.name}`} className='aspect-4/5 h-full w-full object-cover object-top' /> : null}
            </div>
            <div className='lg:col-span-7 lg:col-start-6'>
              <p className='text-sm font-semibold uppercase tracking-[0.08em] text-brand'>{doctor.role}</p>
              <h1 className='mt-3 max-w-[14ch] font-display text-4xl font-semibold leading-tight tracking-[-0.05em] text-ink sm:text-6xl'>{doctor.name}</h1>
              <p className='mt-5 text-lg leading-relaxed text-muted'>{doctor.about}</p>
              <div className='mt-7 flex flex-wrap gap-3'>
                <span className='bg-bg px-4 py-2 text-sm font-semibold text-ink'>{doctor.experience}</span>
                {doctor.certificates.map((certificate) => <a key={certificate.href} href={certificate.href} target='_blank' rel='noopener noreferrer' className='bg-bg px-4 py-2 text-sm font-semibold text-ink no-underline hover:text-brand'>{certificate.label}</a>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto grid max-w-content gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12 lg:px-20'>
        <div className='lg:col-span-5'>
          <p className='text-sm font-semibold uppercase tracking-[0.08em] text-brand'>Запись на консультацию</p>
          <h2 className='mt-4 font-display text-3xl font-semibold tracking-[-0.045em] text-ink sm:text-4xl'>Выберите удобное время</h2>
          <p className='mt-5 text-base leading-relaxed text-muted'>Показываем предварительно доступные окна. Администратор подтвердит запись по телефону.</p>
          {closestSlot ? <p className='mt-6 inline-flex items-center gap-2 bg-tint px-4 py-3 text-sm font-semibold text-deep'><Clock3 className='h-4 w-4' aria-hidden='true' />Ближайшая дата: {formatClosestSlot(closestSlot)}</p> : null}
        </div>

        <div className='border border-line bg-bg p-5 sm:p-6 lg:col-span-7'>
          <div className='flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {dates.map((date, index) => (
              <button key={date.toISOString()} type='button' onClick={() => { setSelectedDate(index); setSelectedSlot(null); void loadSlots() }} className={`min-w-18 px-3 py-3 text-sm font-semibold transition-colors ${selectedDate === index ? 'bg-deep text-white' : 'bg-tint text-ink hover:bg-line'}`}>
                {dayLabel(date)}
              </button>
            ))}
          </div>

          <div className='mt-6 grid gap-3 sm:grid-cols-3'>
            {slots === null ? (
              <button type='button' onClick={() => void loadSlots()} className='sm:col-span-3 min-h-14 border border-dashed border-line px-4 text-left text-sm font-semibold text-ink hover:border-brand hover:text-brand'>Показать свободные окна</button>
            ) : doctorSlots.length > 0 ? doctorSlots.map((slot) => (
              <button key={slot.id} type='button' onClick={() => setSelectedSlot(slot)} className={`min-h-14 border px-4 text-left text-sm font-semibold transition-colors ${selectedSlot?.id === slot.id ? 'border-deep bg-deep text-white' : 'border-line text-ink hover:border-brand hover:text-brand'}`}>
                {slot.at.slice(11, 16)}
              </button>
            )) : <p className='sm:col-span-3 py-5 text-sm leading-relaxed text-muted'>На этот день свободных окон пока нет. Выберите другую дату или оставьте заявку — мы предложим ближайшее время.</p>}
          </div>

          <Link href={`${ROUTES.booking}?doctor=${doctor.id}${selectedSlot ? `&slot=${selectedSlot.id}` : ''}`} className={`mt-6 inline-flex min-h-12 items-center justify-center gap-2 px-5 text-base font-semibold no-underline ${selectedSlot ? 'bg-accent text-accent-ink' : 'bg-deep text-white'}`}>
            <CalendarDays className='h-5 w-5' aria-hidden='true' />
            {selectedSlot ? `Записаться на ${selectedSlot.at.slice(11, 16)}` : 'Оставить заявку'}
          </Link>
          <p className='mt-4 text-xs leading-relaxed text-muted'>Нажимая «Записаться», вы переходите к форме с выбранным специалистом. {CLINIC.hours}.</p>
        </div>
      </section>
    </>
  )
}
