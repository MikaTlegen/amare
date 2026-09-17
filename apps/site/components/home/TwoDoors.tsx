import { Reveal } from '@amare/ui'
import { Button } from '@amare/ui'
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
  return (
    <section className="container-content grid gap-5 py-12 lg:grid-cols-2">
      <Reveal
        as="article"
        className="flex flex-col items-start gap-4 rounded-3xl border border-line bg-surface p-7 sm:flex-row sm:items-center sm:gap-6"
      >
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Впервые
          </span>
          <h2 className="font-display text-2xl font-medium leading-tight tracking-[-0.04em]">
            Анкета за 3 минуты — врач ответит с планом
          </h2>
        </div>
        <Button to={ROUTES.form} variant="deep">
          Заполнить
        </Button>
      </Reveal>

      <Reveal
        as="article"
        delay={0.1}
        className="flex flex-col items-start gap-4 rounded-3xl border border-tint bg-tint p-7 sm:flex-row sm:items-center sm:gap-6"
      >
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-sm font-semibold uppercase tracking-widest text-deep">
            Уже на курсе
          </span>
          <h2 className="font-display text-2xl font-medium leading-tight tracking-[-0.04em]">
            Кабинет пациента, опекуна и сотрудника
          </h2>
        </div>
        <Button to={ROUTES.login} variant="deep">
          Войти
        </Button>
      </Reveal>
    </section>
  )
}
