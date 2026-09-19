import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginPage } from "@/components/LoginPage";

export const metadata: Metadata = { title: "Вход в рабочее место" };

// Suspense нужен из-за useSearchParams: страница читает ?role= из общего входа
export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
