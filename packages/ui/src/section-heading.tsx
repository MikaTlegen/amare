import type { ReactNode } from 'react'
import { cn } from './cn'

interface Props {
  title: string
  /** Правый элемент: ссылка «все →» или стрелки карусели. */
  aside?: ReactNode
  /** Короткое пояснение под заголовком. Одно предложение, не абзац. */
  note?: string
  onDark?: boolean
  className?: string
}

export function SectionHeading({ title, aside, note, onDark = false, className }: Props) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-6', className)}>
      <div className="flex max-w-136 flex-col gap-2">
        <h2
          className={cn(
            'font-display text-3xl font-medium leading-[1.14] tracking-[-0.045em] sm:text-4xl sm:leading-10',
            onDark ? 'text-white' : 'text-ink',
          )}
        >
          {title}
        </h2>
        {note && (
          <p className={cn('text-base leading-relaxed', onDark ? 'text-white/75' : 'text-muted')}>
            {note}
          </p>
        )}
      </div>
      {aside}
    </div>
  )
}
