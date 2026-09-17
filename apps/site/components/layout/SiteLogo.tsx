import Link from 'next/link'
import { Logo, type LogoProps } from '@amare/ui'
import { ROUTES } from '@/lib/clinic'

/** Логотип-ссылка на главную: марка из @amare/ui, маршрут знает только сайт. */
export function SiteLogo(props: LogoProps) {
  return (
    <Link href={ROUTES.home} className="inline-flex shrink-0 no-underline" aria-label="Amare.kz — на главную">
      <Logo {...props} />
    </Link>
  )
}
