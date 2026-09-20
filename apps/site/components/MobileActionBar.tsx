import { Phone, CalendarCheck } from 'lucide-react'
import { getT, type Locale } from '@amare/i18n'
import { Link } from '@/components/Links'
import { CLINIC, ROUTES } from '@/lib/clinic'

/** Общие классы обёртки: распорка и сама панель должны мериться одинаково. */
const SHELL = 'border-t border-line bg-bg/95 px-4 pt-3 pb-[calc(0.75rem_+_env(safe-area-inset-bottom))]'

/**
 * Две кнопки панели. basis-32 — порог переноса: на базовом кегле они стоят в
 * строку, начиная со среднего деления ползунка доступности встают друг под
 * друга во всю ширину. Без переноса «Записаться» уезжала за край экрана.
 */
function ActionRow({ call, book }: { call: string; book: string }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <a
        href={CLINIC.phones[0].href}
        className="flex min-h-12 min-w-0 flex-1 basis-32 items-center justify-center gap-2 rounded-xl bg-deep px-4 py-3 text-base font-semibold text-white no-underline"
      >
        <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
        {call}
      </a>
      <Link
        href={ROUTES.booking}
        className="flex min-h-12 min-w-0 flex-1 basis-32 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-base font-semibold text-accent-ink no-underline"
      >
        <CalendarCheck className="h-5 w-5 shrink-0" aria-hidden="true" />
        {book}
      </Link>
    </div>
  )
}

/**
 * Липкая панель действий на мобильных.
 *
 * Два действия, которые реально совершают с телефона: позвонить и записаться.
 *
 * Панель нарисована дважды. В потоке — невидимая копия: это и есть место под
 * панель, иначе она накроет юрблок подвала с лицензией и политикой данных.
 * Поверх — сама панель. Раньше место держала распорка с фиксированной высотой
 * 6rem, и на крупном кегле, когда кнопки перестают помещаться в строку,
 * высоты переставало хватать. Копия совпадает по построению — на любом кегле,
 * любой длине перевода и без единой строки скрипта.
 *
 * inert на копии обязателен: invisible оставляет ссылки в порядке табуляции.
 */
export function MobileActionBar({ locale }: { locale: Locale }) {
  const t = getT(locale, 'common')
  const call = t('call')
  const book = t('book')

  return (
    <>
      <div aria-hidden="true" inert className={`invisible md:hidden ${SHELL}`}>
        <ActionRow call={call} book={book} />
      </div>

      <div className={`fixed inset-x-0 bottom-0 z-40 backdrop-blur-sm md:hidden ${SHELL}`}>
        <ActionRow call={call} book={book} />
      </div>
    </>
  )
}
