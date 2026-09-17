import type { Metadata } from "next";
import type { ReactNode } from "react";
import { onest, unbounded } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amare Care — care",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${onest.variable}`}>
      <body>{children}</body>
    </html>
  );
}
