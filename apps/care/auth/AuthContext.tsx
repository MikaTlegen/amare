'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@amare/api-client'
import { resetMockState, signInAs, type CareRole } from '@/lib/mock'

const STORAGE_KEY = 'amare-care:demo-session'

interface AuthValue {
  user: User | null
  /** Первая проверка сессии ещё идёт — чтобы не мигать формой входа. */
  loading: boolean
  signIn: (role: CareRole) => Promise<User>
  signOut: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

/**
 * Демо-сессия.
 *
 * В localStorage кладётся ТОЛЬКО роль — ни имени, ни медицинских данных.
 * Это нужно, чтобы показ клиенту пережил перезагрузку страницы.
 *
 * TODO AUTH: в бою сессия живёт в httpOnly-cookie, которую ставит сервер,
 * а клиент узнаёт пользователя запросом /api/me. Хранить токен в
 * localStorage нельзя: его читает любой скрипт на странице.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const restore = async () => {
      try {
        const role = localStorage.getItem(STORAGE_KEY) as CareRole | null
        if (role) {
          const restored = await signInAs(role)
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

  const signIn = useCallback(async (role: CareRole) => {
    const next = await signInAs(role)
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

/** Человекочитаемое название роли — используется в шапке кабинета. */
export const ROLE_LABEL: Record<CareRole, string> = {
  patient: 'Пациент',
  guardian: 'Опекун',
}
