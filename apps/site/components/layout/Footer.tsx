import { getT, type Locale } from '@amare/i18n'
import { Link } from '@/components/Links'
import { SiteLogo } from './SiteLogo'
import { CABINETS, CLINIC, ROUTES } from '@/lib/clinic'

/** Колонки ссылок. Подписи берутся из словаря по ключу, адреса — из ROUTES. */
const COLUMNS = [
  {
    title: 'column.clinic',
    links: [
      { key: 'link.about', to: ROUTES.about },
      { key: 'link.team', to: ROUTES.team },
      { key: 'link.reviews', to: ROUTES.reviews },
      { key: 'link.contacts', to: ROUTES.contacts },
      { key: 'link.jobs', to: ROUTES.jobs },
    ],
  },
  {
    title: 'column.patients',
    links: [
      { key: 'link.directions', to: ROUTES.directions },
      { key: 'link.course', to: ROUTES.course },
      { key: 'link.remote', to: ROUTES.remote },
      { key: 'link.relatives', to: ROUTES.relatives },
      { key: 'link.booking', to: ROUTES.booking },
    ],
  },
  {
    title: 'column.useful',
    links: [
      { key: 'link.knowledge', to: ROUTES.knowledge },
      { key: 'link.faq', to: ROUTES.faq },
      { key: 'link.results', to: ROUTES.results },
    ],
  },
  {
    title: 'column.documents',
    links: [
      { key: 'link.offer', to: ROUTES.offer },
      { key: 'link.privacy', to: ROUTES.privacy },
      { key: 'link.license', to: ROUTES.license },
    ],
  },
] as const

/**
 * Кабинеты — внешние адреса, а не пути сайта.
 *
 * Пациент и опекун живут в care, специалист — в staff. Раньше все три
 * ссылки вели на /vhod, то есть сотрудник попадал в форму входа, где его
 * роли нет вообще.
 */
const CABINET_LINKS = [
  { key: 'cabinet.patient', href: `${CABINETS.care}${ROUTES.cabinetPatient}` },
  { key: 'cabinet.guardian', href: `${CABINETS.care}${ROUTES.cabinetGuardian}` },
  { key: 'cabinet.staff', href: CABINETS.staff },
] as const

/**
 * Подвал с юридическим блоком.
 *
 * Мелкий шрифт — но не серее muted: по S-10 ТЗ реквизиты, лицензия
 * и политика ПД должны быть читаемыми, а не спрятанными. Это ещё и то,
 * чего сейчас на сайте клиники нет и за что можно получить претензию.
 *
 * БИН и номер лицензии выводятся только когда заполнены: строка
 * «БИН [БИН]» на публичном сайте хуже, чем её отсутствие.
 *
 * Серверный компонент: локаль приходит пропом из макета, а не из контекста.
 */
export function Footer({ locale }: { locale: Locale }) {
  const t = getT(locale, 'footer')
  const tc = getT(locale, 'contacts')

  const requisites = [
    tc('legalName'),
    CLINIC.bin && t('legal.bin', { value: CLINIC.bin }),
    CLINIC.license && t('legal.license', { value: CLINIC.license }),
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <footer className="bg-ink text-white/90">
      <div className="container-content flex flex-col gap-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12">
          <div className="flex flex-col gap-3 lg:col-span-4">
            <SiteLogo onDark textClassName="text-white" />
            <p className="text-base leading-relaxed text-white/65">
              {tc('addressFull')}
              <br />
              {tc('hours')}
            </p>
            {CLINIC.phones.map((phone) => (
              <a
                key={phone.href}
                href={phone.href}
                className={
                  phone.primary
                    ? 'tap-target text-xl font-semibold text-white no-underline'
                    : 'tap-target text-base text-white/80 no-underline'
                }
              >
                {phone.label}
              </a>
            ))}
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} className="flex flex-col gap-2.5 lg:col-span-2">
              <h3 className="text-sm uppercase tracking-[0.08em] text-white/50">{t(column.title)}</h3>
              {column.links.map((link) => (
                <Link
                  key={link.key}
                  href={link.to}
                  className="tap-target text-base text-white/85 no-underline transition-colors hover:text-accent"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
          ))}

          <nav className="flex flex-col gap-2.5 lg:col-span-2">
            <h3 className="text-sm uppercase tracking-[0.08em] text-white/50">{t('column.cabinets')}</h3>
            {CABINET_LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="tap-target text-base text-white/85 no-underline transition-colors hover:text-accent"
              >
                {t(link.key)}
              </a>
            ))}
          </nav>
        </div>

        <p className="border-t border-white/10 pt-5 text-sm leading-relaxed text-white/60">
          {requisites} · {t('legal.notice')} © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
