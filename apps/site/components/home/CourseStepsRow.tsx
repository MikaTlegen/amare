'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Plus, Minus } from 'lucide-react'
import { SectionHeading } from '@amare/ui'
import { Reveal } from '@amare/ui'
import { COURSE_STEPS } from '@/data/course'
import { ROUTES } from '@/lib/clinic'
import { cn } from '@amare/ui'

/**
 * Пять шагов курса.
 *
 * Клик раскрывает подробности прямо в карточке — без модалки и без ухода
 * на другую страницу. Модальное окно с затемнением здесь было бы лишним
 * слоем: это справочный текст, а не действие. Для аудитории 55+ всплывающее
 * окно к тому же сбивает с толку — непонятно, где ты и как вернуться.
 *
 * Карточка — настоящая кнопка с aria-expanded: раскрытие работает
 * с клавиатуры и читается скринридером.
 */
export function CourseStepsRow() {
  const [open, setOpen] = useState<string | null>(null)
  const reduced = useReducedMotion()

  return (
    <section className="container-content flex flex-col gap-7 py-16">
      <SectionHeading
        title="Как проходит курс"
        note="Нажмите на шаг, чтобы увидеть подробности."
        aside={
          <Link
            href={ROUTES.course}
            className="inline-flex items-center gap-2 text-base font-semibold no-underline hover:text-accent"
          >
            Подробно о курсе и ценах
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        }
      />

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {COURSE_STEPS.map((step, i) => {
          const last = i === COURSE_STEPS.length - 1
          const expanded = open === step.n

          return (
            <Reveal as="li" key={step.n} delay={i * 0.06}>
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : step.n)}
                className={cn(
                  'flex h-full w-full flex-col gap-2 rounded-2xl p-6 text-left transition-colors',
                  last ? 'bg-deep' : 'border border-line bg-surface',
                  expanded && !last && 'border-accent',
                )}
              >
                <span className="flex items-center justify-between">
                  <span
                    className={cn(
                      'font-display text-sm font-semibold',
                      last ? 'text-sky' : 'text-accent',
                    )}
                  >
                    {step.n}
                  </span>
                  {expanded ? (
                    <Minus
                      className={cn('h-4 w-4', last ? 'text-white/60' : 'text-muted')}
                      aria-hidden="true"
                    />
                  ) : (
                    <Plus
                      className={cn('h-4 w-4', last ? 'text-white/60' : 'text-muted')}
                      aria-hidden="true"
                    />
                  )}
                </span>

                <span className={cn('text-lg font-semibold', last && 'text-white')}>
                  {step.title}
                </span>

                <span className={cn('text-base', last ? 'text-white/70' : 'text-muted')}>
                  {step.short}
                </span>

                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.span
                      initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="block overflow-hidden"
                    >
                      <span
                        className={cn(
                          'mt-3 block border-t pt-3 text-base leading-relaxed',
                          last ? 'border-white/15 text-white/80' : 'border-line text-ink/80',
                        )}
                      >
                        {step.full}
                        {step.price && (
                          <span
                            className={cn(
                              'mt-2 block font-display text-lg font-semibold tracking-[-0.04em]',
                              last ? 'text-white' : 'text-ink',
                            )}
                          >
                            {step.price}
                          </span>
                        )}
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </Reveal>
          )
        })}
      </ol>
    </section>
  )
}
