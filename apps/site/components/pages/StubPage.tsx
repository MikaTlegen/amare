'use client'

import { usePathname } from 'next/navigation'
import { Construction } from 'lucide-react'
import { Button } from '@amare/ui'
import { ClinicMap } from '@/components/ClinicMap'
import { CLINIC, ROUTES } from '@/lib/clinic'

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
const TITLES: Record<string, { title: string; note: string }> = {
  [ROUTES.relatives]: {
    title: 'Родственникам',
    note: 'База знаний для тех, кто ухаживает: признаки инсульта, перемещение лежачего человека, питание при нарушении глотания, профилактика падений дома.',
  },
  [ROUTES.about]: {
    title: 'О клинике',
    note: 'История клиники, оборудование, подход мультидисциплинарной группы.',
  },
  [ROUTES.jobs]: {
    title: 'Вакансии',
    note: 'Клиника ищет специалистов по реабилитации. Пока резюме принимаем по телефону.',
  },
  [ROUTES.offer]: {
    title: 'Публичная оферта',
    note: 'Документ готовится юристом клиники. До публикации условия уточняйте у администратора.',
  },
  [ROUTES.privacy]: {
    title: 'Политика обработки персональных данных',
    note: 'Документ готовится. Персональные данные обрабатываются и хранятся на территории Республики Казахстан.',
  },
  [ROUTES.license]: {
    title: 'Лицензия',
    note: 'Скан лицензии на медицинскую деятельность будет опубликован здесь.',
  },
}

export function StubPage() {
  const pathname = usePathname()
  const page = TITLES[pathname] ?? {
    title: 'Раздел готовится',
    note: 'Страница появится в ближайшее время.',
  }

  /** На странице о клинике карта уместна: человек ищет, как доехать. */
  const withMap = pathname === ROUTES.about

  return (
    <section className="container-content flex flex-col gap-8 py-16">
      <div className="flex max-w-3xl flex-col gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint">
          <Construction className="h-6 w-6 text-deep" aria-hidden="true" />
        </span>

        <h1 className="m-0 font-display text-3xl font-medium tracking-[-0.045em] sm:text-4xl">
          {page.title}
        </h1>

        <p className="m-0 text-lg leading-relaxed text-muted">{page.note}</p>

        <p className="m-0 text-lg leading-relaxed">
          Пока раздела нет — спросите у администратора:{' '}
          <a href={CLINIC.phones[0].href} className="font-semibold">
            {CLINIC.phones[0].label}
          </a>
        </p>

        <div className="flex flex-wrap gap-3">
          <Button to={ROUTES.booking}>Записаться на консультацию</Button>
          <Button to={ROUTES.home} variant="outline">
            На главную
          </Button>
        </div>
      </div>

      {withMap && <ClinicMap />}
    </section>
  )
}
