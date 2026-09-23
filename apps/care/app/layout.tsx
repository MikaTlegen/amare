import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { pickMessages } from "@amare/i18n";
import { CabinetLocaleProvider, RegisterServiceWorker, SpinningFavicon } from "@amare/ui";
import { AuthProvider } from "@/auth/AuthContext";
import { inter, manrope } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s — Amare Care",
    default: "Amare Care",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/icon-192.png",
  },
};

/** Словари кабинета: обе локали собираются на сервере, выбор — в браузере. */
const MESSAGES = {
  ru: pickMessages("ru", ["cabinet", "ui", "common"]),
  kk: pickMessages("kk", ["cabinet", "ui", "common"]),
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

// На хостинге (STATIC_EXPORT=1) приложение лежит в /care — см. next.config.ts,
// basePath. Файл public/sw.js публикуется по тому же basePath, поэтому путь
// регистрации SW должен совпадать, иначе register() уйдёт мимо файла.
const SW_URL = process.env.STATIC_EXPORT === "1" ? "/care/sw.js" : "/sw.js";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        <SpinningFavicon />
        <RegisterServiceWorker swUrl={SW_URL} />
        <CabinetLocaleProvider messages={MESSAGES}>
          <AuthProvider>{children}</AuthProvider>
        </CabinetLocaleProvider>
      </body>
    </html>
  );
}
