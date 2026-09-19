'use client'

import { useEffect } from 'react'

// Адрес кабинета публичный, не секрет. В статической сборке — относительный путь
const CARE_URL = (process.env.NEXT_PUBLIC_CARE_URL ?? 'http://localhost:3002').replace(/\/+$/, '')
const LOGIN_URL = `${CARE_URL}/vhod`

/**
 * Переводит посетителя в кабинет на стороне браузера.
 *
 * Ссылка видна и работает даже если скрипты не выполнились — на неё
 * человек нажмёт сам, а не упрётся в пустую страницу.
 */
export function CabinetRedirect() {
  useEffect(() => {
    window.location.replace(LOGIN_URL)
  }, [])

  return (
    <section className="container-content flex flex-col items-start gap-4 py-24">
      <h1 className="text-2xl font-medium text-deep">Переходим в кабинет</h1>
      <p className="text-muted">Если переход не начался, нажмите на ссылку.</p>
      <a href={LOGIN_URL} className="font-medium text-brand underline">
        Открыть вход в кабинет
      </a>
    </section>
  )
}
