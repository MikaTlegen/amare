import type { ReactNode } from 'react'
import { getT, pickMessages, type Locale } from '@amare/i18n'
import { I18nProvider } from '@amare/i18n/react'
import { SpinningFavicon } from '@amare/ui'
import { ContactFab } from '@/components/ContactFab'
import { CookieBanner } from '@/components/CookieBanner'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { MobileActionBar } from '@/components/MobileActionBar'
import { CLINIC } from '@/lib/clinic'
import { absoluteUrl } from '@/lib/seo'
import { inter, manrope } from '@/app/fonts'

/**
 * Каркас страницы, одинаковый для обеих локалей.
 *
 * Языки живут в разных группах маршрутов ((ru) и (kk)), а значит у каждой
 * свой корневой макет — иначе <html lang> пришлось бы менять скриптом уже
 * после загрузки, и скринридер прочитал бы казахскую страницу по-русски.
 * Чтобы два макета не разъехались, вся разметка собрана здесь.
 */

/*
 * Разметка MedicalClinic для карточки в поиске: адрес и телефон.
 * Статичные данные клиники, пользовательского ввода здесь нет.
 *
 * @id общий для обеих локалей: это одна организация на двух языках,
 * а не две разные клиники.
 */
function clinicJsonLd(locale: Locale) {
  const t = getT(locale, 'contacts')

  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': `${absoluteUrl('/')}#clinic`,
    name: CLINIC.name,
    description: t('clinicDescription'),
    inLanguage: locale,
    url: absoluteUrl(locale === 'ru' ? '/' : `/${locale}`),
    telephone: CLINIC.phones[0].label,
    address: {
      '@type': 'PostalAddress',
      streetAddress: t('addressStreet'),
      addressLocality: t('addressCity'),
      addressCountry: 'KZ',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '14:00' },
    ],
  }
}

/** Обвязка страницы — шапка, подвал, общие компоненты — нужна на каждой странице. */
const SHELL_NAMESPACES = ['common', 'contacts', 'footer', 'nav', 'ui'] as const

export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = getT(locale, 'nav')

  return (
    <html lang={locale} className={`${manrope.variable} ${inter.variable}`}>
      <body>
        <SpinningFavicon />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd(locale)) }}
        />

        <I18nProvider locale={locale} messages={pickMessages(locale, [...SHELL_NAMESPACES])}>
          {/* Ссылка для клавиатуры: первый Tab — пропустить навигацию */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-deep focus:px-5 focus:py-3 focus:text-white"
          >
            {t('skipToContent')}
          </a>

          <Header />

          <main id="main" className="scroll-mt-24">
            {children}
          </main>

          <Footer locale={locale} />

          {/* Место под липкую панель действий: раньше отступ стоял на <main>,
              и панель накрывала низ футера с лицензией и политикой данных */}
          <div aria-hidden="true" className="h-[calc(6rem_+_env(safe-area-inset-bottom))] md:hidden" />
          <ContactFab />
          <MobileActionBar locale={locale} />
          <CookieBanner />
        </I18nProvider>
      </body>
    </html>
  )
}
