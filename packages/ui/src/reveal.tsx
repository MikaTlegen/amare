'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ElementType, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Задержка каскада, секунды. */
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'article' | 'li'
  /** Якорь для ссылок вида /napravleniya#speech. */
  id?: string
}

/**
 * Появление блока при въезде в экран.
 *
 * При prefers-reduced-motion анимация не «ускоряется», а исчезает совсем:
 * блок сразу виден. Половинчатое решение (быстрый сдвиг) для человека
 * с вестибулярными нарушениями всё равно остаётся сдвигом.
 */
export function Reveal({ children, delay = 0, className, as = 'div', id }: RevealProps) {
  const reduced = useReducedMotion()
  // motion[as] возвращает union компонентов — сводим к одному типу,
  // пропсы у всех motion-тегов одинаковые.
  const MotionTag = motion[as] as typeof motion.div

  if (reduced) {
    const Tag = as as ElementType
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      id={id}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
