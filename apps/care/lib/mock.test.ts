import { describe, expect, it } from 'vitest'
import { completeExercise, getDayPlan, resetMockState, sendMessage } from './mock'

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

  it('не падает и не меняет план, если id упражнения не найден', async () => {
    resetMockState()
    const before = await getDayPlan()
    const after = await completeExercise('нет-такого-id')
    expect(after).toEqual(before)
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
