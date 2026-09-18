'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@amare/api-client'
import { resetMockState, signInAsStaff } from '@/lib/mock'

const STORAGE_KEY = 'amare-staff:demo-session'

interface AuthValue {
  user: User | null
  /** Первая проверка сессии ещё идёт — чтобы не мигать формой входа. */
  loading: boolean
  signIn: () => Promise<User>
  signOut: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

/**
 * Демо-сессия специалиста.
 *
 * В отличие от care здесь только одна роль, поэтому в localStorage
 * хранится не роль, а просто факт входа — ни имени, ни данных пациентов.
 *
 * TODO AUTH: в бою сессия живёт в httpOnly-cookie, которую ставит сервер,
 * а клиент узнаёт пользователя запросом /api/me.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const restore = async () => {
      try {
        const signedIn = localStorage.getItem(STORAGE_KEY) === '1'
        if (signedIn) {
          const restored = await signInAsStaff()
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

  const signIn = useCallback(async () => {
    const next = await signInAsStaff()
    setUser(next)
    try {
      localStorage.setItem(STORAGE_KEY, '1')
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
