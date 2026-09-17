import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from './cn'

type Variant = 'primary' | 'deep' | 'outline' | 'ghost' | 'onDark' | 'white'
type Size = 'md' | 'lg'

interface BaseProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  className?: string
}

interface LinkProps extends BaseProps {
  to: string
  href?: never
  onClick?: never
}
interface AnchorProps extends BaseProps {
  href: string
  to?: never
  onClick?: never
}
interface ButtonProps extends BaseProps {
  onClick: () => void
  to?: never
  href?: never
  type?: 'button' | 'submit'
}

type Props = LinkProps | AnchorProps | ButtonProps

/**
 * Кнопки и ссылки-кнопки в одном месте.
 *
 * Тег выбирается по смыслу, а не по виду: переход — это <a>/<Link>,
 * действие — <button>. Для скринридера и навигации с клавиатуры разница
 * принципиальна, а min-h-12 держит зону нажатия не меньше 44 px.
 */
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink hover:brightness-95',
  deep: 'bg-deep text-white hover:bg-deep2',
  outline: 'border-[1.5px] border-deep text-deep hover:bg-deep hover:text-white',
  ghost: 'border-[1.5px] border-line text-ink hover:border-ink',
  onDark: 'border-[1.5px] border-white/45 text-white hover:bg-white/10',
  white: 'bg-white text-ink hover:bg-white/90',
}

const SIZES: Record<Size, string> = {
  md: 'min-h-12 px-6 py-3 text-base',
  lg: 'min-h-[3.4rem] px-8 py-4 text-lg',
}

export function Button(props: Props) {
  const { children, variant = 'primary', size = 'md', className } = props

  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
    'transition-colors duration-200 no-underline',
    VARIANTS[variant],
    SIZES[size],
    className,
  )

  if ('to' in props && props.to) {
    return (
      <Link href={props.to} className={classes}>
        {children}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    const external = props.href.startsWith('http')
    return (
      <a
        href={props.href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }

  const { onClick, type = 'button' } = props as ButtonProps
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
