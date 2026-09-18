import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/auth/AuthContext";
import { onest, unbounded } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s — Рабочее место Amare Care",
    default: "Рабочее место Amare Care",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${onest.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
