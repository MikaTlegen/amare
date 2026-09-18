import { describe, expect, it } from 'vitest'
import type { PatientCard } from '@amare/api-client'
import { STATUS_ORDER, patientStatus } from './patient-status'

function patient(overrides: Partial<PatientCard> = {}): PatientCard {
  return {
    id: 'p-test',
    name: 'Тестовый пациент',
    age: 60,
    diagnosis: 'Ишемический инсульт',
    courseDay: 5,
    courseLength: 14,
    curator: 'Куратор',
    weekMinutes: [40, 40, 40, 40, 40, 40, 40],
    barthel: [{ day: 'День 1', barthel: 40 }],
    alerts: [],
    ...overrides,
  }
}

describe('patientStatus', () => {
  it('возвращает green, когда нет сигналов и пропусков', () => {
    expect(patientStatus(patient())).toBe('green')
  })

  it('возвращает red при критическом сигнале, даже если занятий не пропущено', () => {
    const card = patient({
      alerts: [{ id: 'a', level: 'danger', text: 'Два дня без активности', at: 'сегодня' }],
    })
    expect(patientStatus(card)).toBe('red')
  })

  it('красный важнее оранжевого: критический сигнал перекрывает предупреждение', () => {
    const card = patient({
      weekMinutes: [0, 0, 40, 40, 40, 40, 40],
      alerts: [
        { id: 'a', level: 'warn', text: 'Жалоба на боль', at: 'вчера' },
        { id: 'b', level: 'danger', text: 'Давление 190/110', at: 'сегодня' },
      ],
    })
    expect(patientStatus(card)).toBe('red')
  })

  it('возвращает orange при предупреждении', () => {
    const card = patient({
      alerts: [{ id: 'a', level: 'warn', text: 'Пропущено занятие', at: 'вчера' }],
    })
    expect(patientStatus(card)).toBe('orange')
  })

  it('возвращает orange при двух и более днях без занятий', () => {
    expect(patientStatus(patient({ weekMinutes: [0, 0, 40, 40, 40, 40, 40] }))).toBe('orange')
  })

  it('один пропущенный день не выводит пациента из зелёной зоны', () => {
    expect(patientStatus(patient({ weekMinutes: [0, 40, 40, 40, 40, 40, 40] }))).toBe('green')
  })

  it('сортирует срочных выше спокойных', () => {
    expect(STATUS_ORDER.red).toBeLessThan(STATUS_ORDER.orange)
    expect(STATUS_ORDER.orange).toBeLessThan(STATUS_ORDER.green)
  })
})
