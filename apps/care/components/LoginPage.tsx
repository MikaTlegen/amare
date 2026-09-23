'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, UserRound, HeartHandshake, Stethoscope, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useContent, useT } from '@amare/i18n/react'
import { LanguageSwitch, useSetCabinetLocale } from '@amare/ui'
import { useAuth } from '@/auth/AuthContext'
import type { CareRole } from '@/lib/mock'
import { ROUTES, SITE_URL, safeRedirectPath, staffLoginUrl, type StaffRoleId } from '@/lib/routes'

/** Роли демо-входа. Подписи лежат в словаре cabinet по ключу login.<роль>. */
const STAFF_DEMO_ROLES: { role: StaffRoleId; Icon: LucideIcon }[] = [
  { role: 'curator', Icon: Stethoscope },
  { role: 'moderator', Icon: ShieldCheck },
]

const DEMO_ROLES: { role: CareRole; Icon: LucideIcon }[] = [
  { role: 'patient', Icon: UserRound },
  { role: 'guardian', Icon: HeartHandshake },
]

/**
 * Вход в кабинет.
 *
 * Слева — демо-вход одним кликом, чтобы показывать платформу без бэкенда.
 * Справа — форма «телефон + код», выключенная: она показывает, каким вход
 * будет на самом деле, и служит бэкендеру описанием задачи.
 *
 * Пароля здесь не будет и в бою: аудитория 55+, пароль они забудут или
 * запишут на бумажке рядом с компьютером. Код из SMS безопаснее и проще.
 */
export function LoginPage() {
  const t = useT('cabinet')
  const setLocale = useSetCabinetLocale()
  const text = useContent('cabinet')
  const { user, signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [busy, setBusy] = useState<CareRole | null>(null)

  const from = safeRedirectPath(searchParams.get('from'))

  useEffect(() => {
    if (user) router.replace(from ?? ROUTES.cabinet)
  }, [user, from, router])

  if (user) return null

  const enter = async (role: CareRole) => {
    setBusy(role)
    await signIn(role)
    router.replace(from ?? ROUTES.cabinet)
  }

  return (
    <section className="container-content py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          {/* Язык выбирают до входа: внутри кабинета переключатель есть,
              а на этой странице человек мог застрять на чужом языке */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Кабинет — отдельное приложение, ссылка «/» вела бы внутрь него */}
            <a
              href={SITE_URL}
              className="tap-target inline-flex w-fit items-center gap-2 text-base font-semibold text-ink no-underline hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t('login.home')}
            </a>
            <LanguageSwitch onChange={setLocale} />
          </div>
          <h1 className="m-0 mt-2 font-display text-3xl font-medium tracking-[-0.045em] sm:text-4xl">
            {t('login.title')}
          </h1>
          <p className="m-0 max-w-[40em] text-lg leading-relaxed text-muted">
            {t('login.note')}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="flex flex-col gap-3 lg:col-span-7">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-accent">
              {t('login.demo')}
            </span>

            {DEMO_ROLES.map(({ role, Icon }) => (
              <button
                key={role}
                type="button"
                onClick={() => void enter(role)}
                disabled={busy !== null}
                className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 text-left transition-colors hover:border-deep disabled:opacity-60"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tint">
                  <Icon className="h-6 w-6 text-deep" aria-hidden="true" />
                </span>
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="text-lg font-semibold">
                    {busy === role ? t('login.signing') : text(`login.${role}`)}
                  </span>
                  <span className="text-base text-muted">{text(`login.${role}Note`)}</span>
                </span>
              </button>
            ))}

            <p className="m-0 text-base leading-relaxed text-muted">
              {t('login.demoNote')}
            </p>

            {/* Сотрудники входят отсюда же: вход у клиники один, а рабочее место
                открывается в отдельном приложении со своим периметром доступа */}
            <div className="mt-3 flex flex-col gap-3 border-t border-line pt-5">
              <span className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">
                {t('login.staff')}
              </span>

              {STAFF_DEMO_ROLES.map(({ role, Icon }) => (
                <a
                  key={role}
                  href={staffLoginUrl(role)}
                  className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 text-left no-underline transition-colors hover:border-deep"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tint">
                    <Icon className="h-6 w-6 text-deep" aria-hidden="true" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-lg font-semibold text-ink">{text(`login.${role}`)}</span>
                    <span className="text-base text-muted">{text(`login.${role}Note`)}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Будущий боевой вход — намеренно выключен */}
          <div className="flex flex-col gap-4 rounded-3xl border border-dashed border-line bg-bg p-6 lg:col-span-5">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">
              {t('login.future')}
            </span>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-phone" className="text-base font-medium text-muted">
                {t('login.phone')}
              </label>
              <input
                id="login-phone"
                type="tel"
                disabled
                placeholder={t('login.phonePlaceholder')}
                className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-base disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-code" className="text-base font-medium text-muted">
                {t('login.code')}
              </label>
              <input
                id="login-code"
                inputMode="numeric"
                disabled
                placeholder="____"
                className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-base disabled:opacity-60"
              />
            </div>

            <button
              type="button"
              disabled
              className="min-h-[3.2rem] rounded-xl bg-deep px-6 py-3 text-base font-semibold text-white opacity-50"
            >
              {t('login.getCode')}
            </button>

            <p className="m-0 text-base leading-relaxed text-muted">
              {t('login.futurePatient')}
            </p>

            <p className="m-0 border-t border-line pt-4 text-base leading-relaxed text-muted">
              {t('login.futureStaff')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
