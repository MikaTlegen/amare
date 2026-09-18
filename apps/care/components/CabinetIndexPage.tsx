'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/auth/AuthContext'
import { ROUTES } from '@/lib/routes'

const TARGET_BY_ROLE: Record<string, string> = {
  patient: ROUTES.cabinetPatient,
  guardian: ROUTES.cabinetGuardian,
}

/** /kabinet — разводит по кабинету, соответствующему роли. */
export function CabinetIndexPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace(ROUTES.login)
      return
    }
    router.replace(TARGET_BY_ROLE[user.role] ?? ROUTES.login)
  }, [user, loading, router])

  return <div className="container-content py-24 text-center text-lg text-muted">Загружаем кабинет…</div>
}
