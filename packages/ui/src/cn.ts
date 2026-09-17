import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Склейка Tailwind-классов: последний конфликтующий побеждает. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
