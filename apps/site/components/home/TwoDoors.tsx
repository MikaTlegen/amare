'use client'

import { Reveal } from '@amare/ui'
import { useT } from '@amare/i18n/react'
import { Button } from '@/components/Links'
import { ROUTES } from '@/lib/clinic'

/**
 * Развилка «впервые» / «уже на курсе».
 *
 * Ключевой блок всей структуры. Реабилитация — это отношения длиной
 * в месяцы, и сайт обслуживает два разных сценария: холодного посетителя
 * и действующего пациента, которому нужен вход в кабинет, а не рассказ
 * о преимуществах клиники.
 */
export function TwoDoors() {
  const t = useT('progress')

  return (
    <section className="container-content grid gap-5 py-12 lg:grid-cols-2">
      <Reveal
        as="article"
        className="flex flex-col items-start gap-4 rounded-3xl border border-line bg-surface p-7 sm:flex-row sm:items-center sm:gap-6"
      >
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            {t('doors.newLabel')}
          </span>
          <h2 className="font-display text-2xl font-medium leading-tight tracking-[-0.04em]">
            {t('doors.newTitle')}
          </h2>
        </div>
        <Button to={ROUTES.form} variant="deep">
          {t('doors.newAction')}
        </Button>
      </Reveal>

      <Reveal
        as="article"
        delay={0.1}
        className="flex flex-col items-start gap-4 rounded-3xl border border-tint bg-tint p-7 sm:flex-row sm:items-center sm:gap-6"
      >
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-widest text-deep">
            {t('doors.currentLabel')}
          </span>
          <h2 className="font-display text-2xl font-medium leading-tight tracking-[-0.04em]">
            {t('doors.currentTitle')}
          </h2>
        </div>
        <Button to={ROUTES.login} variant="deep">
          {t('doors.currentAction')}
        </Button>
      </Reveal>
    </section>
  )
}
