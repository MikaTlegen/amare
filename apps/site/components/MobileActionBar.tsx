import { Phone, CalendarCheck } from 'lucide-react'
import { getT, type Locale } from '@amare/i18n'
import { Link } from '@/components/Links'
import { CLINIC, ROUTES } from '@/lib/clinic'

/**
 * Липкая панель действий на мобильных.
 *
 * Два действия, которые реально совершают с телефона: позвонить и записаться.
 * Панель занимает место внизу, поэтому под футером стоит спейсер такой же
 * высоты (SiteShell) — иначе она накроет юрблок подвала.
 */
export function MobileActionBar({ locale }: { locale: Locale }) {
  const t = getT(locale, 'common')

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 pt-3 pb-[calc(0.75rem_+_env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden">
      <div className="flex gap-2.5">
        <a
          href={CLINIC.phones[0].href}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-deep px-4 py-3 text-base font-semibold text-white no-underline"
        >
          <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
          {t('call')}
        </a>
        <Link
          href={ROUTES.booking}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-base font-semibold text-accent-ink no-underline"
        >
          <CalendarCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
          {t('book')}
        </Link>
      </div>
    </div>
  )
}
