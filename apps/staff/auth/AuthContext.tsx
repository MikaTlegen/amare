'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { StaffRole, User } from '@amare/api-client'
import { resetMockState, signInAsStaff } from '@/lib/mock'

const STORAGE_KEY = 'amare-staff:demo-session'

interface AuthValue {
  user: User | null
  /** Первая проверка сессии ещё идёт — чтобы не мигать формой входа. */
  loading: boolean
  signIn: (role: StaffRole) => Promise<User>
  signOut: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

function isStaffRole(value: string | null): value is StaffRole {
  return value === 'curator' || value === 'moderator'
}

/**
 * Демо-сессия сотрудника.
 *
 * В localStorage кладётся ТОЛЬКО роль — ни имени, ни данных пациентов.
 * Это нужно, чтобы показ клиенту пережил перезагрузку страницы.
 *
 * TODO AUTH: в бою сессия живёт в httpOnly-cookie, которую ставит сервер,
 * а клиент узнаёт пользователя запросом /api/me. Роль тоже приходит
 * с сервера: возможность выбрать «войти как модератор» на клиенте — это
 * повышение привилегий одной строкой в localStorage.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const restore = async () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (isStaffRole(saved)) {
          const restored = await signInAsStaff(saved)
          if (!cancelled) setUser(restored)
        }
      } catch {
        // приватный режим или заблокированное хранилище — входим заново
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void restore()
    return () => {
      cancelled = true
    }
  }, [])

  const signIn = useCallback(async (role: StaffRole) => {
    const next = await signInAsStaff(role)
    setUser(next)
    try {
      localStorage.setItem(STORAGE_KEY, role)
    } catch {
      // см. выше
    }
    return next
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    resetMockState()
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // см. выше
    }
  }, [])

  const value = useMemo(() => ({ user, loading, signIn, signOut }), [user, loading, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth вызван вне AuthProvider')
  return context
}

/** Ключ названия роли в словаре staff — подпись рисует шапка кабинета. */
export const STAFF_ROLE_KEY: Record<StaffRole, string> = {
  curator: 'role.curator',
  moderator: 'role.moderator',
}
