import { describe, expect, it } from 'vitest'
import {
  DEMO_DAY_PLAN,
  DEMO_MED_HISTORY,
  DEMO_MEDICATIONS,
  DEMO_MESSAGES,
  DEMO_PATIENT,
  type Medication,
} from '@amare/api-client'
import {
  barthelSummary,
  isAboveTarget,
  lastCuratorMessage,
  medsSummary,
  planSummary,
} from './summary'

describe('planSummary', () => {
  it('считает выполненные и оставшиеся минуты по тому же плану, что видит раздел', () => {
    expect(planSummary(DEMO_DAY_PLAN)).toEqual({ done: 2, total: 4, minutesLeft: 25 })
  })
})

describe('medsSummary', () => {
  it('собирает пропуски из истории с днём и временем по плану', () => {
    const summary = medsSummary(DEMO_MEDICATIONS, DEMO_MED_HISTORY, 'сегодня')
    expect(summary.missed).toContainEqual({ title: 'Аторвастатин', day: 'вчера', planned: '21:00' })
  })

  it('пропуск сегодня стоит первым — он свежее', () => {
    const today: Medication[] = DEMO_MEDICATIONS.map((item) =>
      item.id === 'med-3' ? { ...item, state: 'missed' } : item,
    )
    const summary = medsSummary(today, DEMO_MED_HISTORY, 'сегодня')
    expect(summary.missed[0]).toEqual({ title: 'Периндоприл', day: 'сегодня', planned: '09:00' })
  })

  it('без пропусков список пуст', () => {
    expect(medsSummary(DEMO_MEDICATIONS, [], 'сегодня').missed).toEqual([])
  })
})

describe('давление и прогресс', () => {
  it('выше цели — если превышено хотя бы одно из двух чисел', () => {
    expect(isAboveTarget({ systolic: 138, diastolic: 86 })).toBe(false)
    expect(isAboveTarget({ systolic: 138, diastolic: 92 })).toBe(true)
  })

  it('прирост Бартел считается от первой оценки курса', () => {
    expect(barthelSummary(DEMO_PATIENT)).toEqual({ last: 60, gain: 35 })
  })

  it('последнее сообщение куратора, а не пациента', () => {
    expect(lastCuratorMessage(DEMO_MESSAGES)?.id).toBe('m-3')
  })
})
