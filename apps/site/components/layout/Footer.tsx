import { Link } from '@/components/Links'
import { SiteLogo } from './SiteLogo'
import { CABINETS, CLINIC, ROUTES } from '@/lib/clinic'

const COLUMNS = [
  {
    title: 'Клиника',
    links: [
      { label: 'О клинике', to: ROUTES.about },
      { label: 'Врачи', to: ROUTES.team },
      { label: 'Отзывы', to: ROUTES.reviews },
      { label: 'Контакты', to: ROUTES.contacts },
      { label: 'Вакансии', to: ROUTES.jobs },
    ],
  },
  {
    title: 'Пациентам',
    links: [
      { label: 'Направления', to: ROUTES.directions },
      { label: 'Курс и цены', to: ROUTES.course },
      { label: 'Иногородним', to: ROUTES.remote },
      { label: 'Родственникам', to: ROUTES.relatives },
      { label: 'Записаться', to: ROUTES.booking },
    ],
  },
  {
    title: 'Полезное',
    links: [
      { label: 'База знаний', to: ROUTES.knowledge },
      { label: 'Вопросы и ответы', to: ROUTES.faq },
      { label: 'Результаты', to: ROUTES.results },
    ],
  },
  {
    title: 'Документы',
    links: [
      { label: 'Публичная оферта', to: ROUTES.offer },
      { label: 'Политика ПД', to: ROUTES.privacy },
      { label: 'Лицензия', to: ROUTES.license },
    ],
  },
]

/**
 * Кабинеты — внешние адреса, а не пути сайта.
 *
 * Пациент и опекун живут в care, специалист — в staff. Раньше все три
 * ссылки вели на /vhod, то есть сотрудник попадал в форму входа, где его
 * роли нет вообще.
 */
const CABINET_LINKS = [
  { label: 'Пациенту', href: `${CABINETS.care}${ROUTES.cabinetPatient}` },
  { label: 'Опекуну', href: `${CABINETS.care}${ROUTES.cabinetGuardian}` },
  { label: 'Сотруднику', href: CABINETS.staff },
]

/**
 * Подвал с юридическим блоком.
 *
 * Мелкий шрифт — но не серее muted: по S-10 ТЗ реквизиты, лицензия
 * и политика ПД должны быть читаемыми, а не спрятанными. Это ещё и то,
 * чего сейчас на сайте клиники нет и за что можно получить претензию.
 *
 * БИН и номер лицензии выводятся только когда заполнены: строка
 * «БИН [БИН]» на публичном сайте хуже, чем её отсутствие.
 */
export function Footer() {
  const requisites = [
    CLINIC.legalName,
    CLINIC.bin && `БИН ${CLINIC.bin}`,
    CLINIC.license && `лицензия № ${CLINIC.license}`,
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
              {CLINIC.address.full}
              <br />
              {CLINIC.hours}
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
              <h3 className="text-sm uppercase tracking-[0.08em] text-white/50">{column.title}</h3>
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.to}
                  className="tap-target text-base text-white/85 no-underline transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}

          <nav className="flex flex-col gap-2.5 lg:col-span-2">
            <h3 className="text-sm uppercase tracking-[0.08em] text-white/50">Кабинеты</h3>
            {CABINET_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="tap-target text-base text-white/85 no-underline transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <p className="border-t border-white/10 pt-5 text-sm leading-relaxed text-white/60">
          {requisites} · Персональные данные обрабатываются и хранятся на территории Республики
          Казахстан. Имеются противопоказания, необходима консультация специалиста. Информация на
          сайте не является публичной офертой. © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
