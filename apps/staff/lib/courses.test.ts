import { describe, expect, it } from 'vitest'
import type { ProgramTemplate } from '@amare/api-client'
import { DURATION_PRESETS, courseIssues, exerciseCount, isPublished, osmsWarning } from './courses'

const complete: ProgramTemplate = {
  id: 'c-1',
  title: 'Домашнее восстановление',
  days: 30,
  durationMonths: 1,
  includes: ['ЛФК'],
  note: '',
  status: 'draft',
  stages: [{ id: 's-1', title: 'Неделя 1', exercises: [{ id: 'e-1', title: 'Перенос веса', minutes: 10 }] }],
  curatorIds: ['st-curator-1'],
  moderatorIds: [],
}

describe('DURATION_PRESETS', () => {
  it('месяц, полгода и год — и каждый не короче стандарта ОСМС', () => {
    expect(DURATION_PRESETS.map((preset) => preset.months)).toEqual([1, 6, 12])
    expect(DURATION_PRESETS.every((preset) => !osmsWarning(preset.days))).toBe(true)
  })
})

describe('courseIssues', () => {
  it('полный курс можно публиковать', () => {
    expect(courseIssues(complete)).toEqual([])
  })

  it('без названия, упражнений и куратора — три причины', () => {
    const issues = courseIssues({ ...complete, title: '  ', stages: [], curatorIds: [] })
    expect(issues).toEqual(['title', 'exercises', 'curators'])
  })

  it('пустой этап не считается упражнением', () => {
    const issues = courseIssues({ ...complete, stages: [{ id: 's', title: 'Пусто', exercises: [] }] })
    expect(issues).toContain('exercises')
  })

  it('нулевая длительность не проходит', () => {
    expect(courseIssues({ ...complete, days: 0 })).toContain('days')
  })
})

describe('osmsWarning', () => {
  it('предупреждает о курсе короче 14 дней, но не о пустом поле', () => {
    expect(osmsWarning(10)).toBe(true)
    expect(osmsWarning(14)).toBe(false)
    expect(osmsWarning(0)).toBe(false)
  })
})

describe('exerciseCount и isPublished', () => {
  it('считает упражнения по всем этапам', () => {
    expect(exerciseCount(complete)).toBe(1)
    expect(exerciseCount({ ...complete, stages: undefined })).toBe(0)
  })

  it('курс без статуса (до конструктора) считается опубликованным', () => {
    expect(isPublished({ ...complete, status: undefined })).toBe(true)
    expect(isPublished(complete)).toBe(false)
  })
})
