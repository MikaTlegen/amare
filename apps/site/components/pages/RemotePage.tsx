import { Home, MonitorSmartphone, Route, Video } from 'lucide-react'
import { Button } from '@amare/ui'
import { PageCover } from '@/components/PageCover'
import { CLINIC, PRICES, ROUTES } from '@/lib/clinic'

const STEPS = [
  {
    icon: Video,
    title: 'Онлайн-консультация',
    text: `Врач-реабилитолог смотрит выписку и видео того, как человек двигается, и говорит, что реально даст курс. ${PRICES.online}.`,
  },
  {
    icon: Route,
    title: 'Курс в Астане без простоев',
    text: 'Расписание собирается плотно, чтобы приезд не растягивался. Поможем найти жильё рядом с клиникой — возить человека через весь город не придётся.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Домашняя программа после отъезда',
    text: 'В кабинете — план на день, видео упражнений, дневник давления и чат с куратором. Родственник видит то же самое в своём кабинете опекуна.',
  },
  {
    icon: Home,
    title: 'Переоценка и повторный курс',
    text: 'Через оговорённый срок — повторные шкалы по видеосвязи. Если прогресс встал, программу меняют, не дожидаясь следующего приезда.',
  },
]

/**
 * Дистанционная реабилитация для иногородних (S-09 ТЗ).
 *
 * Сознательно не обещаем «реабилитацию онлайн»: дистанционно идут
 * оценка, контроль и коррекция программы, а сами занятия человек
 * выполняет сам или с родственником. Обещать большее — врать.
 */
export function RemotePage() {
  return (
    <>
      <PageCover
        crumb="Иногородним"
        title="Если вы не в Астане"
        note="Маршрут для тех, кто приезжает из другого города: онлайн-оценка, плотный очный курс и сопровождение дома."
        image="/photos/lobby.jpg"
        alt="Зона ожидания клиники Amare"
      />

      <section className="container-content grid gap-5 py-14 sm:grid-cols-2">
        {STEPS.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-7"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint">
              <Icon className="h-6 w-6 text-deep" aria-hidden="true" />
            </span>
            <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">{title}</h2>
            <p className="m-0 text-base leading-relaxed text-muted">{text}</p>
          </article>
        ))}
      </section>

      <section className="container-content pb-14">
        <div className="flex flex-col gap-3 rounded-3xl border border-line bg-bg p-7">
          <h2 className="m-0 font-display text-xl font-medium tracking-[-0.035em]">
            Что дистанционно сделать нельзя
          </h2>
          <p className="m-0 max-w-[48em] text-base leading-relaxed text-muted">
            По видеосвязи не ставят диагноз, не отменяют и не назначают лекарства и не ведут
            острый период. Массаж, аппаратные процедуры и работа с тяжёлым пациентом требуют
            присутствия. Поэтому дистанционная часть — это оценка, контроль техники и коррекция
            домашней программы, а не замена курса.
          </p>
        </div>
      </section>

      <section className="container-content pb-16">
        <div className="flex flex-col items-start gap-5 rounded-3xl border border-tint bg-tint p-8 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-1 flex-col gap-1.5">
            <h2 className="font-display text-2xl font-medium tracking-[-0.04em]">
              Начните с онлайн-консультации
            </h2>
            <p className="text-base text-ink/75">
              Опишите состояние в анкете — врач посмотрит выписку и скажет, есть ли смысл ехать.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to={ROUTES.form}>Заполнить анкету</Button>
            <Button href={CLINIC.whatsapp} variant="outline">
              Написать в WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
