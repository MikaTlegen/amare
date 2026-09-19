import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SpinningFavicon } from "@amare/ui";
import { AuthProvider } from "@/auth/AuthContext";
import { onest, unbounded } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s — Кабинет Amare Care",
    default: "Кабинет Amare Care",
  },
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${onest.variable}`}>
      <body>
        <SpinningFavicon />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
