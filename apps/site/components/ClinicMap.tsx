import { MapPin, Clock, Phone, ExternalLink } from 'lucide-react'
import { CLINIC, MAP } from '@/lib/clinic'
import { cn } from '@amare/ui'

/**
 * Карта 2ГИС: карточка с адресом слева, живая карта справа.
 *
 * Карта видна сразу — человеку, который ищет, как доехать, лишний клик
 * не нужен. Плата за это: iframe 2ГИС видит IP посетителя и ставит свои
 * куки, поэтому в проекте есть баннер согласия (components/ui/CookieBanner),
 * и упоминание 2ГИС обязано попасть в политику обработки данных.
 *
 * sandbox ограничивает фрейм: скрипты и формы ему нужны для работы карты,
 * а увести пользователя со страницы он может только по его же действию.
 */
export function ClinicMap({ className }: { className?: string }) {
  const src = `https://makemap.2gis.ru/widget?data=${MAP.widgetData}`

  return (
    <div className={cn('grid gap-5 lg:grid-cols-12', className)}>
      <aside className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-6 lg:col-span-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-tint">
          <MapPin className="h-6 w-6 text-deep" aria-hidden="true" />
        </span>

        <div className="flex flex-col gap-1">
          <h3 className="m-0 font-display text-xl font-medium leading-snug tracking-[-0.035em]">
            {CLINIC.name}
          </h3>
          <p className="m-0 text-base leading-relaxed text-muted">{CLINIC.address.full}</p>
        </div>

        <p className="m-0 flex items-start gap-3 text-base leading-relaxed">
          <Clock className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
          {CLINIC.hours}
        </p>

        <p className="m-0 flex flex-col gap-1">
          {CLINIC.phones.map((phone) => (
            <a
              key={phone.href}
              href={phone.href}
              className={cn(
                'inline-flex items-center gap-3 no-underline',
                phone.primary ? 'text-xl font-semibold text-ink' : 'text-base text-muted',
              )}
            >
              {phone.primary && <Phone className="h-5 w-5 text-brand" aria-hidden="true" />}
              {phone.label}
            </a>
          ))}
        </p>

        <a
          href={CLINIC.address.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-deep px-5 py-3 text-base font-semibold text-white no-underline"
        >
          Маршрут в 2ГИС
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </aside>

      <div className="relative h-104 overflow-hidden rounded-3xl border border-line bg-tint lg:col-span-8 lg:h-auto lg:min-h-104">
        <iframe
          title={`Карта: ${CLINIC.name}, ${CLINIC.address.full}`}
          src={src}
          loading="lazy"
          allowFullScreen
          sandbox="allow-modals allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  )
}
