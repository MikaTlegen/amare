import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { pickMessages } from "@amare/i18n";
import { CabinetLocaleProvider, SpinningFavicon } from "@amare/ui";
import { AuthProvider } from "@/auth/AuthContext";
import { inter, manrope } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s — Рабочее место Amare Care",
    default: "Рабочее место Amare Care",
  },
};

/*
 * viewport-fit=cover обязателен: без него env(safe-area-inset-*) на iOS всегда 0,
 * и липкие панели уезжают под системную полосу жестов.
 * Масштабирование пальцами не ограничиваем — аудитория 55+ (S-13).
 */
/** Словари рабочего места: обе локали собираются на сервере, выбор — в браузере. */
const MESSAGES = {
  ru: pickMessages("ru", ["staff", "ui", "common"]),
  kk: pickMessages("kk", ["staff", "ui", "common"]),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        <SpinningFavicon />
        <CabinetLocaleProvider messages={MESSAGES}>
          <AuthProvider>{children}</AuthProvider>
        </CabinetLocaleProvider>
      </body>
    </html>
  );
}
