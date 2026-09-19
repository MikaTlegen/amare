'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useT } from '@amare/i18n/react'
import { useAuth } from './AuthContext'
import { ROUTES } from '@/lib/routes'
import type { CareRole } from '@/lib/mock'

/**
 * Защита маршрутов кабинета.
 *
 * Клиентская проверка — это только удобство навигации, а не безопасность:
 * любой может открыть devtools и подменить состояние. Доступ к медицинским
 * данным закрывает сервер, проверяя сессию на каждом запросе.
 */
export function RequireAuth({ children, allow }: { children: ReactNode; allow?: CareRole[] }) {
  const t = useT('cabinet')
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // user.role — CareRole в рантайме: care выдаёт сессии только через signInAs(CareRole)
  const wrongRole = !loading && !!user && !!allow && !allow.includes(user.role as CareRole)
  const unauthenticated = !loading && !user

  useEffect(() => {
    if (unauthenticated) {
      router.replace(`${ROUTES.login}?from=${encodeURIComponent(pathname)}`)
    } else if (wrongRole) {
      router.replace(ROUTES.cabinet)
    }
  }, [unauthenticated, wrongRole, pathname, router])

  if (loading || unauthenticated || wrongRole) {
    return <div className="container-content py-24 text-center text-lg text-muted">{t('loading')}</div>
  }

  return <>{children}</>
}
