import { describe, expect, it } from 'vitest'
import {
  addVital,
  completeExercise,
  getCareTasks,
  getDayPlan,
  getMedHistory,
  getMedications,
  getPatientDocuments,
  getSessionReports,
  getVitals,
  resetMockState,
  sendMessage,
  setMedicationState,
  toggleCareTask,
} from './mock'

describe('completeExercise', () => {
  it('переводит выполненное упражнение в done и следующее — в now', async () => {
    resetMockState()
    const before = await getDayPlan()
    const now = before.exercises.find((e) => e.status === 'now')
    expect(now).toBeDefined()

    const after = await completeExercise(now!.id)
    const updated = after.exercises.find((e) => e.id === now!.id)
    expect(updated?.status).toBe('done')

    const nextNow = after.exercises.find((e) => e.status === 'now')
    expect(nextNow?.id).not.toBe(now!.id)
  })

  it('сохраняет оценку «как далось» вместе с отметкой — её увидит куратор', async () => {
    resetMockState()
    const before = await getDayPlan()
    const now = before.exercises.find((e) => e.status === 'now')

    const after = await completeExercise(now!.id, 3)
    const updated = after.exercises.find((e) => e.id === now!.id)
    expect(updated).toMatchObject({ status: 'done', feedback: 3 })
  })

  it('без оценки отмечает выполнение и не выдумывает ответ', async () => {
    resetMockState()
    const before = await getDayPlan()
    const now = before.exercises.find((e) => e.status === 'now')

    const after = await completeExercise(now!.id)
    expect(after.exercises.find((e) => e.id === now!.id)?.feedback).toBeUndefined()
  })

  it('не падает и не меняет план, если id упражнения не найден', async () => {
    resetMockState()
    const before = await getDayPlan()
    const after = await completeExercise('нет-такого-id')
    expect(after).toEqual(before)
  })
})

describe('отчёты, документы, история приёмов', () => {
  it('отчёты с занятий не пустые и у каждого есть подробности', async () => {
    const reports = await getSessionReports()
    expect(reports.length).toBeGreaterThan(0)
    expect(reports.every((report) => report.details.length > 0)).toBe(true)
  })

  it('у каждого документа пациента есть содержимое для просмотра', async () => {
    const docs = await getPatientDocuments()
    expect(docs.length).toBeGreaterThan(0)
    expect(docs.every((doc) => doc.body.length > 0)).toBe(true)
  })

  it('в истории приёмов у пропуска нет времени приёма, у принятого — есть', async () => {
    const history = await getMedHistory()
    expect(history.some((log) => log.state === 'missed')).toBe(true)
    for (const log of history) {
      expect(Boolean(log.takenAt)).toBe(log.state !== 'missed')
    }
  })
})

describe('sendMessage', () => {
  it('добавляет сообщение от «me» в конец списка', async () => {
    resetMockState()
    const messages = await sendMessage('Здравствуйте')
    const last = messages.at(-1)
    expect(last).toBeDefined()
    expect(last?.author).toBe('me')
    expect(last?.text).toBe('Здравствуйте')
  })
})

describe('addVital', () => {
  it('кладёт новую запись в начало списка', async () => {
    resetMockState()
    const before = await getVitals()
    const after = await addVital({ systolic: 130, diastolic: 80, pulse: 70, mood: 4 })

    expect(after).toHaveLength(before.length + 1)
    expect(after[0]?.systolic).toBe(130)
  })

  it('помечает запись, внесённую опекуном', async () => {
    resetMockState()
    const own = await addVital({ systolic: 120, diastolic: 75, pulse: 66, mood: 4 })
    expect(own[0]?.byGuardian).toBeUndefined()

    const byGuardian = await addVital({ systolic: 150, diastolic: 95, pulse: 82, mood: 2 }, true)
    expect(byGuardian[0]?.byGuardian).toBe(true)
  })
})

describe('setMedicationState', () => {
  it('меняет статус одного лекарства и не трогает остальные', async () => {
    resetMockState()
    const before = await getMedications()
    const target = before.find((item) => item.state === 'pending')
    expect(target).toBeDefined()

    const after = await setMedicationState(target!.id, 'missed')
    expect(after.find((item) => item.id === target!.id)?.state).toBe('missed')

    const others = after.filter((item) => item.id !== target!.id)
    for (const item of others) {
      expect(item.state).toBe(before.find((prev) => prev.id === item.id)?.state)
    }
  })
})

describe('toggleCareTask', () => {
  it('ставит отметку со временем и снимает её повторным нажатием', async () => {
    resetMockState()
    const before = await getCareTasks()
    const undone = before.find((task) => task.doneAt === null)
    expect(undone).toBeDefined()

    const marked = await toggleCareTask(undone!.id, '14:20')
    expect(marked.find((task) => task.id === undone!.id)?.doneAt).toBe('14:20')

    const unmarked = await toggleCareTask(undone!.id, '14:25')
    expect(unmarked.find((task) => task.id === undone!.id)?.doneAt).toBeNull()
  })
})
