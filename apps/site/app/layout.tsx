import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ContactFab } from "@/components/ContactFab";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/MobileActionBar";
import { onest, unbounded } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Amare.kz — клиника нейрореабилитации в Астане",
    template: "%s — Amare.kz",
  },
  description:
    "Реабилитация после инсульта, ЧМТ и операций в Астане. Курс 10–20 дней под контролем мультидисциплинарной команды, домашняя программа и личный куратор.",
};

/*
 * viewport-fit=cover обязателен: без него env(safe-area-inset-*) на iOS всегда 0,
 * и липкие панели уезжают под системную полосу жестов.
 * Масштабирование пальцами не ограничиваем — аудитория 55+ (S-13).
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/*
 * Разметка MedicalClinic для карточки в поиске: адрес и телефон.
 * Статичные данные клиники, пользовательского ввода здесь нет.
 * TODO SEO: hreflang kk/ru и sitemap — вместе с отдельными адресами /kk/ и /ru/ (S-12).
 */
const CLINIC_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "Amare.kz",
  description: "Клиника нейрореабилитации после инсульта",
  url: "https://amare.kz",
  telephone: "+7 700 525 25 77",
  address: {
    "@type": "PostalAddress",
    streetAddress: "проспект Мәңгілік Ел 21, НП 31",
    addressLocality: "Астана",
    addressCountry: "KZ",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "14:00" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${onest.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(CLINIC_JSON_LD) }} />

        {/* Ссылка для клавиатуры: первый Tab — пропустить навигацию */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-deep focus:px-5 focus:py-3 focus:text-white"
        >
          Перейти к содержанию
        </a>

        <Header />

        <main id="main" className="scroll-mt-24">
          {children}
        </main>

        <Footer />

        {/* Место под липкую панель действий: раньше отступ стоял на <main>,
            и панель накрывала низ футера с лицензией и политикой данных */}
        <div aria-hidden="true" className="h-[calc(6rem_+_env(safe-area-inset-bottom))] md:hidden" />
        <ContactFab />
        <MobileActionBar />
        <CookieBanner />
      </body>
    </html>
  );
}
