'use client'

import { useState } from 'react'
import { Link } from '@/components/Links'
import { Logo, type LogoProps } from '@amare/ui'
import { useT } from '@amare/i18n/react'
import { ROUTES } from '@/lib/clinic'

/** Логотип-ссылка на главную; повторный клик запускает один оборот марки. */
export function SiteLogo(props: LogoProps) {
  const t = useT('nav')
  const [isSpinning, setIsSpinning] = useState(false)

  function spinMark() {
    setIsSpinning(false)
    window.requestAnimationFrame(() => setIsSpinning(true))
  }

  return (
    <Link
      href={ROUTES.home}
      className='tap-target inline-flex shrink-0 no-underline [perspective:600px]'
      aria-label={t('logoAria')}
      onClick={(event) => {
        event.preventDefault()
        spinMark()
        window.setTimeout(() => {
          if (window.location.pathname !== ROUTES.home) window.location.assign(ROUTES.home)
        }, 1_000)
      }}
    >
      <Logo
        {...props}
        markClassName={`h-7 motion-reduce:transform-none ${isSpinning ? 'animate-[flip-x_1s_ease-in-out]' : ''}`}
      />
    </Link>
  )
}
