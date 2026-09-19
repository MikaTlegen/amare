import type { Metadata } from 'next'
import { CabinetRedirect } from '@/components/pages/CabinetRedirect'
import { ROUTES } from '@/lib/clinic'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata(ROUTES.login, 'ru')

/**
 * Запасная страница входа.
 *
 * В обычном режиме сюда не попадают: /vhod перехватывает редирект из
 * next.config.ts. Но редиректы делает сервер, а в статической сборке
 * (STATIC_EXPORT=1) сервера нет — и кнопка «Кабинет» в шапке упиралась
 * бы в 404. Эта страница закрывает дыру, не меняя поведение в разработке.
 */
export default function Page() {
  return <CabinetRedirect />
}
