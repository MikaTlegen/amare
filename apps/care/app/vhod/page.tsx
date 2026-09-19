import type { Metadata } from "next";
import { DEFAULT_LOCALE, t } from "@amare/i18n";
import { Suspense } from "react";
import { LoginPage } from "@/components/LoginPage";

// Заголовок вкладки ставит сервер, а язык кабинета человек выбирает в браузере:
// здесь он остаётся на языке по умолчанию
export const metadata: Metadata = { title: t(DEFAULT_LOCALE, "cabinet", "login.title") };

// Страница читает параметры адреса (useSearchParams) — Next требует границу Suspense
export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
