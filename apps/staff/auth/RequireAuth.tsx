'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'

/**
 * Защита единственной защищённой страницы staff.
 *
 * Клиентская проверка — это только удобство навигации, а не безопасность:
 * доступ к данным пациентов закрывает сервер, проверяя сессию на каждом
 * запросе.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.replace('/vhod')
  }, [loading, user, router])

  if (loading || !user) {
    return <div className="container-content py-24 text-center text-lg text-muted">Загружаем рабочее место…</div>
  }

  return <>{children}</>
}
