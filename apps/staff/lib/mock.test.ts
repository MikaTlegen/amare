import { describe, expect, it } from 'vitest'
import {
  addTemplate,
  assignProgram,
  closeTask,
  getEditableTemplates,
  getPatientPrograms,
  getProgramTemplates,
  getStaffMembers,
  getStaffPatients,
  getStaffTasks,
  getVideoReviews,
  getWeeklyReview,
  resetMockState,
  reviewVideo,
  saveCourse,
  sendWeeklyReview,
} from './mock'

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

describe('reviewVideo', () => {
  it('сохраняет вердикт с комментарием и не трогает остальные записи', async () => {
    resetMockState()
    const before = await getVideoReviews()
    const target = before.find((item) => item.verdict === null)
    expect(target).toBeDefined()

    const after = await reviewVideo(target!.id, 'wrong', 'Слишком быстрый темп')
    const updated = after.find((item) => item.id === target!.id)
    expect(updated?.verdict).toBe('wrong')
    expect(updated?.comment).toBe('Слишком быстрый темп')

    const others = after.filter((item) => item.id !== target!.id)
    for (const item of others) {
      expect(item.verdict).toBe(before.find((prev) => prev.id === item.id)?.verdict)
    }
  })
})

describe('getWeeklyReview', () => {
  it('собирает минуты практики и пропуски из карты пациента', async () => {
    resetMockState()
    const [patient] = await getStaffPatients()
    const review = await getWeeklyReview(patient!)

    const minutes = patient!.weekMinutes.reduce((sum, value) => sum + value, 0)
    const missed = patient!.weekMinutes.filter((value) => value === 0).length

    expect(review.patientId).toBe(patient!.id)
    expect(review.facts.some((fact) => fact.includes(String(minutes)))).toBe(true)
    expect(review.facts.some((fact) => fact.includes(String(missed)))).toBe(true)
    expect(review.draft).toContain(patient!.name)
    expect(review.sentAt).toBeNull()
  })

  it('после отправки помечает разбор отправленным', async () => {
    resetMockState()
    const [patient] = await getStaffPatients()
    await sendWeeklyReview(patient!.id)

    const review = await getWeeklyReview(patient!)
    expect(review.sentAt).not.toBeNull()
  })
})

describe('addTemplate', () => {
  it('добавляет шаблон в библиотеку', async () => {
    resetMockState()
    const before = await getEditableTemplates()
    const after = await addTemplate({
      title: 'Речь, 14 дней',
      days: 14,
      includes: ['Логопед'],
      note: 'При афазии',
    })

    expect(after).toHaveLength(before.length + 1)
    expect(after.at(-1)?.title).toBe('Речь, 14 дней')
    expect(after.at(-1)?.note).toBe('При афазии')
  })

  it('сам помечает курс короче 14 дней как не подходящий для ОСМС', async () => {
    resetMockState()
    const after = await addTemplate({
      title: 'Поддерживающий, 8 дней',
      days: 8,
      includes: ['ЛФК'],
      note: '',
    })

    expect(after.at(-1)?.note).toContain('ОСМС')
  })

  it('не перетирает примечание, если администратор написал своё', async () => {
    resetMockState()
    const after = await addTemplate({
      title: 'Короткий, 10 дней',
      days: 10,
      includes: ['Массаж'],
      note: 'Только платно, по решению врача',
    })

    expect(after.at(-1)?.note).toBe('Только платно, по решению врача')
  })
})

describe('saveCourse', () => {
  const draft = {
    id: '',
    title: 'Речь дома, месяц',
    days: 30,
    durationMonths: 1,
    includes: ['Логопед'],
    note: '',
    status: 'draft' as const,
    stages: [{ id: 's-1', title: 'Неделя 1', exercises: [{ id: 'e-1', title: 'Артикуляция', minutes: 10 }] }],
    curatorIds: ['st-curator-3'],
    moderatorIds: ['st-moderator-1'],
  }

  it('сохраняет черновик, но куратору он не виден', async () => {
    resetMockState()
    const { templates, issues } = await saveCourse(draft)
    const saved = templates.at(-1)

    expect(issues).toEqual([])
    expect(saved?.id).toBeTruthy()
    expect((await getProgramTemplates()).some((item) => item.id === saved?.id)).toBe(false)
  })

  it('публикует полный курс — и куратор может его назначить', async () => {
    resetMockState()
    const { templates } = await saveCourse(draft)
    const id = templates.at(-1)?.id ?? ''
    await saveCourse({ ...draft, id, status: 'published' })

    expect((await getProgramTemplates()).some((item) => item.id === id)).toBe(true)
    const programs = await assignProgram({ patientId: 'p-2', templateId: id, startAt: '', comment: '', assignedBy: 'Куратор' })
    expect(programs.at(-1)?.title).toBe('Речь дома, месяц')
  })

  it('не публикует курс без упражнений и куратора — и не меняет библиотеку', async () => {
    resetMockState()
    const before = await getEditableTemplates()
    const { templates, issues } = await saveCourse({ ...draft, status: 'published', stages: [], curatorIds: [] })

    expect(issues).toEqual(['exercises', 'curators'])
    expect(templates).toHaveLength(before.length)
  })

  it('заменяет существующий курс по id, а не дублирует', async () => {
    resetMockState()
    const { templates } = await saveCourse(draft)
    const id = templates.at(-1)?.id ?? ''
    const after = await saveCourse({ ...draft, id, title: 'Речь дома, 30 дней' })

    expect(after.templates).toHaveLength(templates.length)
    expect(after.templates.find((item) => item.id === id)?.title).toBe('Речь дома, 30 дней')
  })

  it('черновик из демо-библиотеки нельзя назначить пациенту', async () => {
    resetMockState()
    const before = await getPatientPrograms('p-2')
    const after = await assignProgram({ patientId: 'p-2', templateId: 'tpl-home-6m', startAt: '', comment: '', assignedBy: 'Куратор' })

    expect(after).toHaveLength(before.length)
  })
})

describe('getStaffMembers', () => {
  it('отдаёт и кураторов, и модераторов', async () => {
    const members = await getStaffMembers()
    expect(members.some((member) => member.staffRole === 'curator')).toBe(true)
    expect(members.some((member) => member.staffRole === 'moderator')).toBe(true)
  })
})
