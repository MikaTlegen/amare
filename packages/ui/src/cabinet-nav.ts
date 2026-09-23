'use client'

import { useCallback, useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface Tab {
  id: string
  label: string
  /** Иконка пункта меню. Без неё пункт рисуется только подписью. */
  icon?: LucideIcon
}

/** Группа меню: подпись и id вкладок в порядке показа. */
export interface TabGroup {
  label: string
  ids: readonly string[]
}

export interface ResolvedGroup {
  label?: string
  tabs: Tab[]
}

/** Параметр адреса, в котором живёт открытый раздел кабинета. */
export const TAB_PARAM = 'tab'

/**
 * Раскладывает вкладки по группам меню.
 *
 * Вкладка, которую забыли упомянуть в группах, не пропадает из меню, а
 * уходит в безымянную группу в конце: потерять раздел кабинета из-за
 * опечатки в id хуже, чем показать его без заголовка группы.
 */
export function resolveGroups(tabs: readonly Tab[], groups?: readonly TabGroup[]): ResolvedGroup[] {
  if (!groups?.length) return [{ tabs: [...tabs] }]

  const byId = new Map(tabs.map((tab) => [tab.id, tab]))
  const used = new Set<string>()
  const resolved: ResolvedGroup[] = groups
    .map((group) => {
      const groupTabs = group.ids.flatMap((id) => {
        const tab = byId.get(id)
        if (!tab || used.has(id)) return []
        used.add(id)
        return [tab]
      })
      return { label: group.label, tabs: groupTabs }
    })
    .filter((group) => group.tabs.length > 0)

  const rest = tabs.filter((tab) => !used.has(tab.id))
  return rest.length ? [...resolved, { tabs: rest }] : resolved
}

/** Раздел из строки адреса: только известный id, иначе — раздел по умолчанию. */
export function tabFromSearch(search: string, ids: readonly string[], fallback: string): string {
  const value = new URLSearchParams(search).get(TAB_PARAM)
  return value && ids.includes(value) ? value : fallback
}

/**
 * Открытый раздел кабинета, синхронизированный с адресом (?tab=).
 *
 * Раньше раздел жил только в состоянии компонента: «Назад» и обновление
 * страницы выбрасывали человека на первую вкладку, а ссылкой на нужный
 * экран нельзя было поделиться с куратором. Каждое переключение — новая
 * запись истории, поэтому системная кнопка «Назад» возвращает в прошлый
 * раздел, а не уводит из кабинета.
 *
 * Первый рендер идёт с разделом по умолчанию (адреса на сервере нет),
 * настоящий раздел подставляется после монтирования.
 */
export function useCabinetTab(ids: readonly string[], fallback: string): [string, (id: string) => void] {
  const [tab, setTabState] = useState(fallback)
  const idsKey = ids.join('|')

  useEffect(() => {
    const known = idsKey.split('|')
    const sync = () => setTabState(tabFromSearch(window.location.search, known, fallback))
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [idsKey, fallback])

  const setTab = useCallback((id: string) => {
    setTabState(id)
    const url = new URL(window.location.href)
    if (url.searchParams.get(TAB_PARAM) === id) return
    url.searchParams.set(TAB_PARAM, id)
    window.history.pushState(null, '', url)
    // Новый раздел — с начала, а не с середины прокрутки прошлого
    window.scrollTo({ top: 0 })
  }, [])

  return [tab, setTab]
}
