'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, UserRound, HeartHandshake, Stethoscope, ShieldCheck, LibraryBig } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/auth/AuthContext'
import type { CareRole } from '@/lib/mock'
import { ROUTES, SITE_URL, safeRedirectPath, staffLoginUrl, type StaffRoleId } from '@/lib/routes'

const STAFF_DEMO_ROLES: { role: StaffRoleId; title: string; note: string; Icon: LucideIcon }[] = [
  {
    role: 'curator',
    title: 'Войти как куратор',
    note: 'Очередь задач, пациенты, тревожные сигналы, проверка видео',
    Icon: Stethoscope,
  },
  {
    role: 'moderator',
    title: 'Войти как модератор',
    note: 'Упражнения, материалы, версии и проверка шаблонов',
    Icon: ShieldCheck,
  },
  {
    role: 'admin',
    title: 'Войти как администратор',
    note: 'Пациенты и кураторы, расписание, оплаты',
    Icon: LibraryBig,
  },
]

const DEMO_ROLES: { role: CareRole; title: string; note: string; Icon: LucideIcon }[] = [
  {
    role: 'patient',
    title: 'Войти как пациент',
    note: 'План дня, дневник давления, лекарства, документы, чат с куратором',
    Icon: UserRound,
  },
  {
    role: 'guardian',
    title: 'Войти как опекун',
    note: 'Состояние близкого, отметки ухода, школа опекуна, уведомления',
    Icon: HeartHandshake,
  },
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
          {/* Кабинет — отдельное приложение, ссылка «/» вела бы внутрь него */}
          <a
            href={SITE_URL}
            className="tap-target inline-flex w-fit items-center gap-2 text-base font-semibold text-ink no-underline hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            На главную страницу
          </a>
          <h1 className="m-0 mt-2 font-display text-3xl font-medium tracking-[-0.045em] sm:text-4xl">
            Вход в кабинет
          </h1>
          <p className="m-0 max-w-[40em] text-lg leading-relaxed text-muted">
            Кабинет открывается после первой консультации: доступ выдаёт администратор клиники.
            Сотрудники клиники входят на этой же странице.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="flex flex-col gap-3 lg:col-span-7">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-accent">
              Демонстрационный вход
            </span>

            {DEMO_ROLES.map(({ role, title, note, Icon }) => (
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
                  <span className="text-lg font-semibold">{busy === role ? 'Входим…' : title}</span>
                  <span className="text-base text-muted">{note}</span>
                </span>
              </button>
            ))}

            <p className="m-0 text-base leading-relaxed text-muted">
              Данные в демо вымышлены. Ничего не отправляется и нигде не сохраняется, кроме
              выбранной роли в этом браузере.
            </p>

            {/* Сотрудники входят отсюда же: вход у клиники один, а рабочее место
                открывается в отдельном приложении со своим периметром доступа */}
            <div className="mt-3 flex flex-col gap-3 border-t border-line pt-5">
              <span className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">
                Сотрудникам клиники
              </span>

              {STAFF_DEMO_ROLES.map(({ role, title, note, Icon }) => (
                <a
                  key={role}
                  href={staffLoginUrl(role)}
                  className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 text-left no-underline transition-colors hover:border-deep"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tint">
                    <Icon className="h-6 w-6 text-deep" aria-hidden="true" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-lg font-semibold text-ink">{title}</span>
                    <span className="text-base text-muted">{note}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Будущий боевой вход — намеренно выключен */}
          <div className="flex flex-col gap-4 rounded-3xl border border-dashed border-line bg-bg p-6 lg:col-span-5">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">
              Так это будет работать
            </span>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-phone" className="text-base font-medium text-muted">
                Номер телефона
              </label>
              <input
                id="login-phone"
                type="tel"
                disabled
                placeholder="+7 ___ ___ __ __"
                className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-base disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-code" className="text-base font-medium text-muted">
                Код из SMS
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
              Получить код
            </button>

            <p className="m-0 text-base leading-relaxed text-muted">
              Пациент и опекун входят по коду из SMS, без пароля. Сессия — в httpOnly-cookie,
              которую ставит сервер.
            </p>

            <p className="m-0 border-t border-line pt-4 text-base leading-relaxed text-muted">
              У сотрудников будет обычная авторизация: логин и пароль, которые выдаёт
              администратор клиники. Роль и права придут с сервера вместе с учётной записью —
              выбирать их на этом экране, как сейчас в демо, будет нельзя.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
