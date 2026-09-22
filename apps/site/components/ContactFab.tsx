'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import * as Popover from '@radix-ui/react-popover'
import { Camera, MessageCircle, Phone, X } from 'lucide-react'
import { useT } from '@amare/i18n/react'
import { CLINIC } from '@/lib/clinic'

const CHANNELS = [
  { id: 'contact.whatsapp', href: CLINIC.whatsapp, Icon: MessageCircle },
  { id: 'contact.instagram', href: CLINIC.instagram, Icon: Camera },
  { id: 'call', href: CLINIC.phones[0].href, Icon: Phone },
] as const

/**
 * Плавающая кнопка связи.
 *
 * До lg она не нужна: там внизу висит нижняя навигация со вкладками
 * «Позвонить» и «Меню», и кнопка поверх неё — мусор. Поэтому hidden до lg,
 * по той же границе, по которой уходит панель.
 *
 * Пульсации и красного ореола больше нет: постоянно мигающее красное пятно
 * на каждой странице — самый громкий элемент интерфейса, а клиника
 * нейрореабилитации не должна дёргать человека. Красный остался там, где
 * он значит действие: на кнопке «Записаться».
 *
 * Раскрытие — на Radix Popover, как шапка и виджет доступности. Раньше меню
 * было самодельным: aria-expanded стоял, но Escape не закрывал, фокус не
 * возвращался на кнопку и клик мимо не срабатывал.
 *
 * Анимации закрытия нет намеренно. С forceMount + AnimatePresence содержимое
 * оставалось смонтированным на время выхода, и Radix не мог вернуть фокус на
 * кнопку; в фоновой вкладке кадров нет вовсе, и выход не завершался никогда.
 * Появление анимируем, исчезновение — мгновенное.
 */
export function ContactFab() {
  const t = useT('common')
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div className="fixed bottom-10 right-10 z-40 hidden lg:block">
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label={t(open ? 'contact.close' : 'contact.open')}
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-deep text-white shadow-lg transition-transform hover:scale-105"
          >
            <span className="relative">
              {open ? (
                <X className="h-7 w-7" aria-hidden="true" />
              ) : (
                <MessageCircle className="h-7 w-7" aria-hidden="true" />
              )}
            </span>
          </button>
        </Popover.Trigger>
      </div>

      <Popover.Portal>
        <Popover.Content asChild side="top" align="end" sideOffset={12} collisionPadding={16}>
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="z-50 flex origin-bottom-right flex-col gap-1.5 rounded-2xl border border-line bg-surface p-2.5 shadow-2xl"
          >
            {CHANNELS.map(({ id, href, Icon }) => (
              <a
                key={id}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-ink no-underline transition-colors hover:bg-tint"
              >
                <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                {t(id)}
              </a>
            ))}
          </motion.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
