'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker, type DayPickerProps } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'
import { cn } from '@amare/ui'

/**
 * Календарь на react-day-picker в токенах проекта.
 *
 * Классы заданы полностью, поэтому стили библиотеки не подключаются —
 * иначе её переменные конфликтовали бы с нашей палитрой.
 *
 * Высота ячеек крупная (2.75rem): по U-01 ТЗ элементы управления
 * рассчитаны на человека с нарушенной моторикой, а дату приёма часто
 * выбирает сам пациент, а не родственник. Ширина — резиновая (flex-1):
 * семь ячеек фиксированной ширины не помещались в экран 375 px и
 * обрезались родителем, крайние дни недели нельзя было нажать.
 */
export function Calendar({ className, classNames, ...props }: DayPickerProps) {
  const base = {
    months: 'relative flex flex-col gap-4',
    month: 'w-full',
    month_caption: 'relative mx-11 mb-2 flex h-11 items-center justify-center',
    caption_label: 'truncate font-display text-lg font-medium tracking-[-0.03em] capitalize',
    nav: 'absolute top-0 flex w-full justify-between',
    button_previous:
      'inline-flex size-11 items-center justify-center rounded-xl text-muted transition-colors hover:bg-tint hover:text-ink disabled:opacity-35',
    button_next:
      'inline-flex size-11 items-center justify-center rounded-xl text-muted transition-colors hover:bg-tint hover:text-ink disabled:opacity-35',
    month_grid: 'w-full border-collapse',
    weekdays: 'flex w-full',
    weekday: 'flex h-11 flex-1 items-center justify-center text-sm font-medium text-muted',
    week: 'flex w-full',
    day: 'group h-11 flex-1 p-0 text-base',
    day_button: cn(
      'relative flex h-11 w-full items-center justify-center rounded-xl font-medium text-ink',
      'transition-colors hover:bg-tint',
      'group-data-[selected]:bg-deep group-data-[selected]:text-white',
      'group-data-[disabled]:pointer-events-none group-data-[disabled]:text-ink/25',
      'group-data-[outside]:text-ink/25',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
    ),
    // Точка под сегодняшним числом: «сегодня» должно читаться без цвета
    today:
      '*:after:pointer-events-none *:after:absolute *:after:bottom-1.5 *:after:start-1/2 *:after:size-1 *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-brand [&[data-selected]>*]:after:bg-white',
    outside: 'text-ink/25',
    hidden: 'invisible',
  }

  const merged = Object.fromEntries(
    Object.entries(base).map(([key, value]) => {
      const extra = classNames?.[key as keyof typeof classNames]
      return [key, extra ? cn(value, extra) : value]
    }),
  )

  return (
    <DayPicker
      locale={ru}
      showOutsideDays
      className={cn('mx-auto w-full max-w-[22rem]', className)}
      classNames={merged}
      components={{
        Chevron: ({ orientation, ...rest }) =>
          orientation === 'left' ? (
            <ChevronLeft className="h-5 w-5" aria-hidden="true" {...rest} />
          ) : (
            <ChevronRight className="h-5 w-5" aria-hidden="true" {...rest} />
          ),
      }}
      {...props}
    />
  )
}
