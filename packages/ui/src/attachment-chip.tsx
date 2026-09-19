'use client'

import { FileText, Image as ImageIcon, ScanLine, Video, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Attachment, AttachmentKind } from '@amare/api-client'
import { useT } from '@amare/i18n/react'
import { cn } from './cn'

export const KIND_ICON: Record<AttachmentKind, LucideIcon> = {
  photo: ImageIcon,
  scan: ScanLine,
  document: FileText,
  video: Video,
}

/** Ключ подписи типа вложения в словаре ui. */
export const KIND_KEY = {
  photo: 'attachment.photo',
  scan: 'attachment.scan',
  document: 'attachment.document',
  video: 'attachment.video',
} as const satisfies Record<AttachmentKind, string>

/** Подписи типов вложений: нужны и в списке документов, не только в чипе. */
export function useKindLabel(): Record<AttachmentKind, string> {
  const t = useT('ui')
  return {
    photo: t(KIND_KEY.photo),
    scan: t(KIND_KEY.scan),
    document: t(KIND_KEY.document),
    video: t(KIND_KEY.video),
  }
}

/**
 * Вложение в чате или в списке документов.
 *
 * Скачивание намеренно не реализовано: файл существует только в памяти
 * вкладки. В бою здесь будет временная подписанная ссылка — медицинский
 * снимок не должен открываться по постоянному URL.
 */
export function AttachmentChip({
  attachment,
  onRemove,
  onDark = false,
}: {
  attachment: Pick<Attachment, 'name' | 'kind' | 'size'>
  onRemove?: () => void
  onDark?: boolean
}) {
  const t = useT('ui')
  const Icon = KIND_ICON[attachment.kind]

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-base',
        onDark ? 'border-white/25 bg-white/10 text-white' : 'border-line bg-bg text-ink',
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0', onDark ? 'text-sky' : 'text-brand')} aria-hidden="true" />
      <span className="truncate">{attachment.name}</span>
      <span className={cn('shrink-0 text-sm', onDark ? 'text-white/60' : 'text-muted')}>
        {attachment.size}
      </span>
      {onRemove && (
        // after-* расширяет зону нажатия до 44 px, не увеличивая высоту чипа:
        // вложения чаще всего прикрепляют с телефона
        <button
          type="button"
          onClick={onRemove}
          aria-label={t('attachment.remove', { name: attachment.name })}
          className="relative shrink-0 rounded-lg p-1 after:absolute after:inset-[-0.6rem] after:content-[''] hover:bg-line"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </span>
  )
}
