import { describe, expect, it } from 'vitest'
import { assignProgram, closeTask, getPatientPrograms, getStaffTasks, resetMockState } from './mock'

describe('assignProgram', () => {
  it('добавляет программу конкретному пациенту и не трогает чужие', async () => {
    resetMockState()
    await assignProgram({
      patientId: 'p-2',
      templateId: 'tpl-walk-14',
      startAt: '2026-10-01',
      comment: 'Тестовое назначение',
      assignedBy: 'Тест Тестов',
    })

    const p2 = await getPatientPrograms('p-2')
    expect(p2).toHaveLength(1)
    expect(p2[0]?.title).toBe('Восстановление ходьбы, 14 дней')

    const p3 = await getPatientPrograms('p-3')
    expect(p3).toHaveLength(0)
  })

  it('игнорирует несуществующий шаблон', async () => {
    resetMockState()
    const before = await getPatientPrograms('p-1')
    await assignProgram({
      patientId: 'p-1',
      templateId: 'нет-такого-шаблона',
      startAt: '',
      comment: '',
      assignedBy: 'Тест',
    })
    const after = await getPatientPrograms('p-1')
    expect(after).toEqual(before)
  })
})

describe('closeTask', () => {
  it('помечает задачу выполненной и не трогает остальные', async () => {
    resetMockState()
    const before = await getStaffTasks()
    const target = before.find((t) => !t.done)
    expect(target).toBeDefined()

    const after = await closeTask(target!.id)
    expect(after.find((t) => t.id === target!.id)?.done).toBe(true)

    const othersUnchanged = after
      .filter((t) => t.id !== target!.id)
      .every((t) => t.done === before.find((b) => b.id === t.id)?.done)
    expect(othersUnchanged).toBe(true)
  })
})
