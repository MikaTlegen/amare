'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo, type LogoProps } from '@amare/ui'
import { ROUTES } from '@/lib/clinic'

/** Логотип-ссылка на главную; повторный клик запускает один оборот марки. */
export function SiteLogo(props: LogoProps) {
  const [isSpinning, setIsSpinning] = useState(false)

  function spinMark() {
    setIsSpinning(false)
    window.requestAnimationFrame(() => setIsSpinning(true))
  }

  return (
    <Link
      href={ROUTES.home}
      className='inline-flex shrink-0 no-underline'
      aria-label='Amare.kz — на главную'
      onClick={(event) => {
        if (window.location.pathname === ROUTES.home) {
          event.preventDefault()
          spinMark()
        }
      }}
    >
      <Logo
        {...props}
        markClassName={`${props.markClassName ?? 'text-brand-bright'} h-7 motion-reduce:transform-none ${isSpinning ? 'animate-[spin_1s_ease-in-out]' : ''}`}
      />
    </Link>
  )
}
