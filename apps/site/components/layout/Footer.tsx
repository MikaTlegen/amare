import Link from 'next/link'
import { SiteLogo } from './SiteLogo'
import { CLINIC, ROUTES } from '@/lib/clinic'

const COLUMNS = [
  {
    title: 'Клиника',
    links: [
      { label: 'О клинике', to: ROUTES.about },
      { label: 'Врачи', to: ROUTES.team },
      { label: 'Вакансии', to: ROUTES.jobs },
    ],
  },
  {
    title: 'Пациентам',
    links: [
      { label: 'Направления', to: ROUTES.directions },
      { label: 'Курс и цены', to: ROUTES.course },
      { label: 'Родственникам', to: ROUTES.relatives },
      { label: 'Записаться', to: ROUTES.booking },
    ],
  },
  {
    title: 'Кабинеты',
    links: [
      { label: 'Пациенту', to: ROUTES.login },
      { label: 'Опекуну', to: ROUTES.login },
      { label: 'Сотруднику', to: ROUTES.login },
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
 * Подвал с юридическим блоком.
 *
 * Мелкий шрифт — но не серее muted: по S-10 ТЗ реквизиты, лицензия
 * и политика ПД должны быть читаемыми, а не спрятанными. Это ещё и то,
 * чего сейчас на сайте клиники нет и за что можно получить претензию.
 */
export function Footer() {
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
                    ? 'text-xl font-semibold text-white no-underline'
                    : 'text-base text-white/80 no-underline'
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
                  className="text-base text-white/85 no-underline transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>

        <p className="border-t border-white/10 pt-5 text-sm leading-relaxed text-white/60">
          {CLINIC.legalName}, БИН {CLINIC.bin} · Лицензия № {CLINIC.license} · Персональные данные
          обрабатываются и хранятся на территории Республики Казахстан. Имеются противопоказания,
          необходима консультация специалиста. Информация на сайте не является публичной офертой.
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
