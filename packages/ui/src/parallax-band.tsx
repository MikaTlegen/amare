'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { cn } from './cn'

interface ParallaxBandProps {
  image: string
  alt: string
  children: ReactNode
  /** Плотность тёмной вуали поверх фото. Меньше — светлее. */
  scrim?: 'soft' | 'medium' | 'strong' | 'side'
  /** Сила сдвига фона в процентах от высоты секции. */
  strength?: number
  className?: string
  id?: string
  /** Фокус кадра по вертикали: 'center 60%' и т.п. */
  objectPosition?: string
}

/**
 * Плотности вуали. Записаны через rgba(...) с запятыми, а не через
 * rgb(... / ...): слэш внутри произвольного значения Tailwind принимает
 * за модификатор прозрачности и класс молча не собирается.
 */
const SCRIMS: Record<NonNullable<ParallaxBandProps['scrim']>, string> = {
  soft: 'bg-[rgba(6,32,42,0.72)]',
  medium: 'bg-[rgba(6,32,42,0.84)]',
  strong: 'bg-[rgba(6,32,42,0.9)]',
  side: 'bg-linear-to-r from-[rgba(6,32,42,0.94)] via-[rgba(6,32,42,0.7)] to-[rgba(6,32,42,0.25)]',
}

/**
 * Полоса с фотографией-подложкой и параллаксом.
 *
 * Как это работает: useScroll даёт прогресс секции от «вошла снизу»
 * до «вышла сверху», useTransform превращает его в сдвиг фона по Y.
 *
 * Про масштаб. Картинка увеличена до 150%, и это связано со сдвигом
 * жёстко: чтобы фон не обнажил край при смещении на ±S процентов,
 * запас должен быть не меньше 2×S. При strength=20 минимум — 140%.
 * Будете усиливать параллакс — поднимайте и scale, иначе сверху и снизу
 * полосы пустоты.
 *
 * Доступность. Сдвиг заметный, но не экстремальный (20% по умолчанию,
 * не 50%): у пациентов после инсульта вестибулярные нарушения — обычное
 * дело, а сильный параллакс вызывает головокружение. При
 * prefers-reduced-motion фон становится полностью статичным.
 *
 * Контраст. Текст поверх фото читается только благодаря вуали —
 * не убирайте её и не осветляйте ниже 0.7, иначе белый текст на светлом
 * участке кадра провалит проверку 4.5:1.
 */
export function ParallaxBand({
  image,
  alt,
  children,
  scrim = 'medium',
  strength = 20,
  className,
  id,
  objectPosition = 'center',
}: ParallaxBandProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`])

  return (
    <section ref={ref} id={id} className={cn('relative isolate overflow-hidden', className)}>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10 scale-[1.5] will-change-transform"
        style={reduced ? undefined : { y }}
      >
        {/* Обычный img — перенос 1:1 из набросков; next/image — отдельная задача */}
        <img
          src={image}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition }}
        />
      </motion.div>
      <div aria-hidden="true" className={cn('absolute inset-0 -z-10', SCRIMS[scrim])} />
      {children}
    </section>
  )
}
