import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginPage } from "@/components/LoginPage";

export const metadata: Metadata = { title: "Вход в кабинет" };

// Страница читает параметры адреса (useSearchParams) — Next требует границу Suspense
export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
