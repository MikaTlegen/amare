import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from './cn'

export type DashTone = 'default' | 'dark' | 'alert'

interface DashCardProps {
  label: string
  /** Главное число или короткий статус: «2 из 4», «138/86». */
  value: ReactNode
  /** Одна строка пояснения. Подробности — в разделе, куда ведёт карточка. */
  note?: ReactNode
  icon?: LucideIcon
  tone?: DashTone
  /** Переход в раздел с полной информацией. Без него карточка — просто показатель. */
  onClick?: () => void
  className?: string
}

const TONE: Record<DashTone, string> = {
  default: 'border border-line bg-surface text-ink',
  dark: 'bg-deep text-white',
  alert: 'border-[1.5px] border-accent bg-[rgb(253,238,237)] text-ink',
}

/**
 * Карточка сводки: подпись, крупное число, одна строка пояснения.
 *
 * Сводка отвечает на вопрос «всё ли в порядке», а не пересказывает
 * разделы: кратко здесь, полностью — по нажатию, в разделе меню. Поэтому
 * карточка с переходом — это кнопка целиком, а не мелкая ссылка внутри:
 * большой палец 55+ попадает в неё с первого раза.
 *
 * На телефоне карточки стоят по две в ряд (DashGrid), поэтому отступы
 * и число меньше, чем на компьютере: иначе на экран влезает две карточки
 * и сводка перестаёт быть сводкой. Кегль подписей не уменьшается.
 */
export function DashCard({ label, value, note, icon: Icon, tone = 'default', onClick, className }: DashCardProps) {
  const dark = tone === 'dark'
  const body = (
    <>
      <span className="flex items-start justify-between gap-2">
        <span className={cn('flex min-w-0 items-center gap-2 text-base font-medium leading-snug', dark ? 'text-white/80' : 'text-muted')}>
          {Icon && <Icon className={cn('hidden h-5 w-5 shrink-0 sm:block', dark ? 'text-white/80' : tone === 'alert' ? 'text-accent' : 'text-brand')} aria-hidden="true" />}
          {label}
        </span>
        {onClick && (
          <ArrowUpRight className={cn('h-5 w-5 shrink-0', dark ? 'text-white/70' : 'text-muted')} aria-hidden="true" />
        )}
      </span>
      <span className="font-display text-[1.75rem] font-semibold leading-none tabular-nums tracking-[-0.04em] sm:text-5xl">
        {value}
      </span>
      {note && (
        <span className={cn('line-clamp-2 text-base leading-snug', dark ? 'text-white/80' : 'text-muted')}>{note}</span>
      )}
    </>
  )

  const base = cn(
    'flex min-w-0 flex-col gap-2 rounded-2xl p-4 text-left sm:gap-3 sm:rounded-3xl sm:p-6',
    TONE[tone],
    className,
  )

  if (!onClick) return <div className={base}>{body}</div>

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        base,
        'transition-[border-color,transform] duration-150 hover:border-deep focus-visible:outline-offset-2 active:scale-[0.99] motion-reduce:transform-none',
      )}
    >
      {body}
    </button>
  )
}

/** Сетка сводки: две карточки в ряд на телефоне, три — на широком экране. */
export function DashGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3', className)}>{children}</div>
}
