'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Stethoscope, LibraryBig, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { StaffRole } from '@amare/api-client'
import { useAuth } from '@/auth/AuthContext'

const DEMO_ROLES: { role: StaffRole; title: string; note: string; Icon: LucideIcon }[] = [
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

/** Общий вход клиники живёт в care. Адрес публичный, не секрет. */
const COMMON_LOGIN_URL = `${(process.env.NEXT_PUBLIC_CARE_URL ?? 'http://localhost:3002').replace(/\/+$/, '')}/vhod`

/**
 * Адрес публичного сайта. Рабочее место — отдельное приложение на своём
 * домене, поэтому уйти на главную ссылкой `/` нельзя: нужен полный адрес.
 */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001').replace(/\/+$/, '')

function isStaffRole(value: string | null): value is StaffRole {
  return value === 'curator' || value === 'admin' || value === 'moderator'
}

/**
 * Вход в рабочее место.
 *
 * Три роли, потому что это разные работы: куратор ведёт людей, модератор —
 * содержимое, администратор — расписание и оплаты. Курсы загружает не куратор:
 * иначе шаблон правит тот, кто между делом закрывает двадцать задач.
 *
 * Общий вход клиники живёт в care и присылает сюда `?role=`: в демо это
 * заменяет общую сессию, которой без бэкенда нет. Значение проверяется по
 * белому списку — оно приходит из адресной строки, то есть извне.
 *
 * Справа — форма «логин + пароль», выключенная: показывает, каким вход
 * будет на самом деле.
 */
export function LoginPage() {
  const { user, signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [busy, setBusy] = useState<StaffRole | null>(null)

  const requestedRole = searchParams.get('role')

  useEffect(() => {
    if (user) router.replace('/')
  }, [user, router])

  // Роль из общего входа: открываем рабочее место сразу, не заставляя выбирать дважды
  useEffect(() => {
    if (user || !isStaffRole(requestedRole)) return
    let cancelled = false
    const enterFromCommonLogin = async () => {
      await signIn(requestedRole)
      if (!cancelled) router.replace('/')
    }
    void enterFromCommonLogin()
    return () => {
      cancelled = true
    }
  }, [user, requestedRole, signIn, router])

  if (user) return null

  const enter = async (role: StaffRole) => {
    setBusy(role)
    await signIn(role)
    router.replace('/')
  }

  return (
    <section className="container-content py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          {/* Рабочее место — отдельное приложение, ссылка «/» вела бы внутрь него */}
          <a
            href={SITE_URL}
            className="tap-target inline-flex w-fit items-center gap-2 text-base font-semibold text-ink no-underline hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            На главную страницу
          </a>
          <h1 className="m-0 mt-2 font-display text-3xl font-medium tracking-[-0.045em] sm:text-4xl">
            Вход в рабочее место
          </h1>
          <p className="m-0 max-w-[40em] text-lg leading-relaxed text-muted">
            Доступ выдаёт администратор клиники штатным специалистам. Общий вход клиники —{' '}
            <a href={COMMON_LOGIN_URL} className="font-semibold text-ink">
              на странице входа в кабинет
            </a>
            , эта страница открывается из него.
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
              Данные в демо вымышлены. Ничего не отправляется и нигде не сохраняется, кроме факта
              входа в этом браузере.
            </p>
          </div>

          {/* Будущий боевой вход — намеренно выключен */}
          <div className="flex flex-col gap-4 rounded-3xl border border-dashed border-line bg-bg p-6 lg:col-span-5">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-muted">
              Так это будет работать
            </span>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-name" className="text-base font-medium text-muted">
                Логин
              </label>
              <input
                id="login-name"
                type="text"
                disabled
                autoComplete="username"
                placeholder="i.zhumabekova"
                className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-base disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-base font-medium text-muted">
                Пароль
              </label>
              <input
                id="login-password"
                type="password"
                disabled
                autoComplete="current-password"
                placeholder="••••••••"
                className="min-h-[3.2rem] rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-base disabled:opacity-60"
              />
            </div>

            <button
              type="button"
              disabled
              className="min-h-[3.2rem] rounded-xl bg-deep px-6 py-3 text-base font-semibold text-white opacity-50"
            >
              Войти
            </button>

            <p className="m-0 text-base leading-relaxed text-muted">
              В дальнейшем здесь будет обычная авторизация: логин и пароль, которые выдаёт
              администратор клиники. Роль и права приходят с сервера вместе с учётной записью,
              выбрать их на этом экране будет нельзя. Сессия — в httpOnly-cookie, которую ставит
              сервер; пароли хранятся хешами (argon2id), вход защищён ограничением попыток.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
