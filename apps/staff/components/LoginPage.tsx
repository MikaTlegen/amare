'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Stethoscope } from 'lucide-react'
import { useAuth } from '@/auth/AuthContext'

/**
 * Вход в рабочее место специалиста.
 *
 * Один демо-вход одним кликом — приложение однонотевое, выбирать роль
 * не из чего. Справа — форма «телефон + код», выключенная: показывает,
 * каким вход будет на самом деле.
 */
export function LoginPage() {
  const { user, signIn } = useAuth()
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (user) router.replace('/')
  }, [user, router])

  if (user) return null

  const enter = async () => {
    setBusy(true)
    await signIn()
    router.replace('/')
  }

  return (
    <section className="container-content py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="m-0 font-display text-3xl font-medium tracking-[-0.045em] sm:text-4xl">
            Вход в рабочее место
          </h1>
          <p className="m-0 max-w-[40em] text-lg leading-relaxed text-muted">
            Доступ выдаёт администратор клиники штатным специалистам.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          <div className="flex flex-col gap-3 lg:col-span-7">
            <span className="text-sm font-semibold uppercase tracking-[0.1em] text-accent">
              Демонстрационный вход
            </span>

            <button
              type="button"
              onClick={() => void enter()}
              disabled={busy}
              className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-5 text-left transition-colors hover:border-deep disabled:opacity-60"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tint">
                <Stethoscope className="h-6 w-6 text-deep" aria-hidden="true" />
              </span>
              <span className="flex flex-1 flex-col gap-0.5">
                <span className="text-lg font-semibold">
                  {busy ? 'Входим…' : 'Войти как специалист'}
                </span>
                <span className="text-base text-muted">Очередь задач, пациенты, тревожные сигналы</span>
              </span>
            </button>

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
              Вход по коду из SMS, без пароля. Сессия — в httpOnly-cookie, которую ставит сервер.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
