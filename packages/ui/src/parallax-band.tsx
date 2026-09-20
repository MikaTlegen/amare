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
 * Плотности вуали. Цвет — токен scrim: раньше здесь стояло захардкоженное
 * rgba(6,32,42,…), то есть цвет, на котором держится читаемость текста поверх
 * всех фотографий сайта, был единственным вне палитры и не отзывался на
 * контрастную тему.
 *
 * Светлый конец у side — 0.62, а не 0.25: на светлом кадре белый текст давал
 * там 2.0:1 вместо 4.5:1.
 */
const SCRIMS: Record<NonNullable<ParallaxBandProps['scrim']>, string> = {
  soft: 'bg-scrim/72',
  medium: 'bg-scrim/84',
  strong: 'bg-scrim/90',
  side: 'bg-linear-to-r from-scrim/94 via-scrim/72 to-scrim/62',
}

/**
 * Полоса с фотографией-подложкой и параллаксом.
 *
 * Как это работает: useScroll даёт прогресс секции от «вошла снизу»
 * до «вышла сверху», useTransform превращает его в сдвиг фона по Y.
 *
 * Про масштаб. Он выводится из strength, а не задан константой: чтобы фон
 * не обнажил край при смещении на ±S процентов, запас должен быть не меньше
 * 2×S. Берём 2.5×S — при strength=20 это привычные 150% с небольшим запасом.
 * При strength=0 увеличения нет вовсе: кадр показывается как есть, без
 * дополнительной обрезки. Это нужно узким банерным фотографиям, где важное
 * занимает почти весь кадр и любой зум его срезает.
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
  const zoom = 1 + strength * 0.025

  return (
    <section ref={ref} id={id} className={cn('relative isolate overflow-hidden', className)}>
      <motion.div
        aria-hidden="true"
        // will-change держит композитный слой в памяти, поэтому ставим его
        // только когда слой действительно едет: при reduced-motion фон статичен
        className={cn('absolute inset-0 -z-10', !reduced && 'will-change-transform')}
        style={reduced ? { scale: zoom } : { scale: zoom, y }}
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
