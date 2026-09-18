'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Camera, MessageCircle, Phone, X } from 'lucide-react'
import { CLINIC } from '@/lib/clinic'

const CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp', href: CLINIC.whatsapp, Icon: MessageCircle },
  { id: 'instagram', label: 'Instagram', href: CLINIC.instagram, Icon: Camera },
  { id: 'call', label: 'Позвонить', href: CLINIC.phones[0].href, Icon: Phone },
]

/**
 * Плавающая кнопка связи.
 *
 * На мобильных она не нужна: там внизу и так висит панель «Позвонить /
 * Записаться», две плавающие кнопки друг на друге — это мусор.
 * Поэтому hidden до md.
 *
 * Пульсация — единственная постоянная анимация на сайте, и она отключается
 * при prefers-reduced-motion вместе с раскрытием меню.
 */
export function ContactFab() {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  return (
    <div className="fixed bottom-10 right-10 z-40 hidden flex-col items-end gap-3 md:flex">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex origin-bottom-right flex-col gap-1.5 rounded-2xl border border-line bg-surface p-2.5 shadow-2xl"
          >
            {CHANNELS.map(({ id, label, href, Icon }) => (
              <a
                key={id}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-ink no-underline transition-colors hover:bg-tint"
              >
                <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                {label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Закрыть меню связи' : 'Связаться с клиникой'}
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-ink shadow-[0_14px_34px_rgba(200,53,46,0.4)] transition-transform hover:scale-105"
      >
        {!open && !reduced && (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-pulse-ring rounded-full bg-accent"
          />
        )}
        <span className="relative">
          {open ? (
            <X className="h-7 w-7" aria-hidden="true" />
          ) : (
            <MessageCircle className="h-7 w-7" aria-hidden="true" />
          )}
        </span>
      </button>
    </div>
  )
}
