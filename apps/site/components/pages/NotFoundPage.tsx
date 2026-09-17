import { Button } from '@amare/ui'
import { CLINIC, ROUTES } from '@/lib/clinic'

/**
 * 404. Не шутим и не извиняемся многословно: человек мог искать
 * телефон клиники в сложный момент — даём его сразу.
 */
export function NotFoundPage() {
  return (
    <section className="container-content flex min-h-104 flex-col items-start justify-center gap-5 py-20">
      <span className="font-display text-5xl font-semibold tracking-tighter text-accent">404</span>
      <h1 className="font-display text-3xl font-medium tracking-[-0.045em]">Страница не найдена</h1>
      <p className="max-w-[32em] text-lg leading-relaxed text-muted">
        Возможно, ссылка устарела. Вернитесь на главную или позвоните — администратор подскажет.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button to={ROUTES.home}>На главную</Button>
        <Button href={CLINIC.phones[0].href} variant="outline">
          {CLINIC.phones[0].label}
        </Button>
      </div>
    </section>
  )
}
