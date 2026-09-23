import { describe, expect, it } from 'vitest'
import { resolveGroups, tabFromSearch, type Tab } from './cabinet-nav'

const tabs: Tab[] = [
  { id: 'plan', label: 'Сегодня' },
  { id: 'diary', label: 'Дневник' },
  { id: 'chat', label: 'Куратор' },
  { id: 'docs', label: 'Документы' },
]

describe('resolveGroups', () => {
  it('без групп отдаёт все вкладки одним безымянным списком', () => {
    expect(resolveGroups(tabs)).toEqual([{ tabs }])
  })

  it('раскладывает вкладки по группам в порядке ids', () => {
    const result = resolveGroups(tabs, [
      { label: 'Сегодня', ids: ['diary', 'plan'] },
      { label: 'Связь', ids: ['chat', 'docs'] },
    ])

    expect(result.map((group) => group.label)).toEqual(['Сегодня', 'Связь'])
    expect(result[0]?.tabs.map((tab) => tab.id)).toEqual(['diary', 'plan'])
  })

  it('не теряет вкладку, забытую в группах, — она уходит в конец без заголовка', () => {
    const result = resolveGroups(tabs, [{ label: 'Сегодня', ids: ['plan', 'diary', 'chat'] }])

    expect(result.at(-1)).toEqual({ tabs: [tabs[3]] })
  })

  it('пропускает неизвестные id, повторы и пустые группы', () => {
    const result = resolveGroups(tabs, [
      { label: 'А', ids: ['plan', 'nope'] },
      { label: 'Б', ids: ['plan'] },
      { label: 'В', ids: ['diary', 'chat', 'docs'] },
    ])

    expect(result.map((group) => group.label)).toEqual(['А', 'В'])
    expect(result.flatMap((group) => group.tabs).length).toBe(tabs.length)
  })
})

describe('tabFromSearch', () => {
  const ids = tabs.map((tab) => tab.id)

  it('берёт раздел из ?tab=', () => {
    expect(tabFromSearch('?tab=chat', ids, 'plan')).toBe('chat')
  })

  it('неизвестный или пустой раздел — раздел по умолчанию', () => {
    expect(tabFromSearch('?tab=admin', ids, 'plan')).toBe('plan')
    expect(tabFromSearch('', ids, 'plan')).toBe('plan')
  })
})
