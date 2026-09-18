'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { Logo, type LogoProps } from '@amare/ui'
import { ROUTES } from '@/lib/clinic'

/** Логотип-ссылка на главную с короткой фирменной анимацией по повторному нажатию. */
export function SiteLogo(props: LogoProps) {
  const [isAnimationOpen, setIsAnimationOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  function openAnimation() {
    setIsAnimationOpen(true)
    window.setTimeout(() => void videoRef.current?.play(), 0)
  }

  return (
    <>
      <Link
        href={ROUTES.home}
        className='inline-flex shrink-0 no-underline'
        aria-label='Amare.kz — на главную'
        onClick={(event) => {
          if (window.location.pathname === ROUTES.home) {
            event.preventDefault()
            openAnimation()
          }
        }}
      >
        <Logo {...props} />
      </Link>

      {isAnimationOpen ? (
        <div className='fixed inset-0 z-100 flex items-center justify-center bg-deep/90 p-5' role='dialog' aria-modal='true' aria-label='Анимация логотипа'>
          <button type='button' className='absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center text-white hover:text-sky' onClick={() => setIsAnimationOpen(false)} aria-label='Закрыть анимацию логотипа'>
            <X className='h-6 w-6' aria-hidden='true' />
          </button>
          <video ref={videoRef} src='/video/amare-logo.mp4' autoPlay playsInline controls onEnded={() => setIsAnimationOpen(false)} className='max-h-[80vh] max-w-full' />
        </div>
      ) : null}
    </>
  )
}
