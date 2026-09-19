import { Suspense } from "react";
import type { Metadata } from "next";
import { DEFAULT_LOCALE, t } from "@amare/i18n";
import { LoginPage } from "@/components/LoginPage";

// Заголовок вкладки ставит сервер, а язык рабочего места выбирается в браузере:
// здесь он остаётся на языке по умолчанию
export const metadata: Metadata = { title: t(DEFAULT_LOCALE, "staff", "login.title") };

// Suspense нужен из-за useSearchParams: страница читает ?role= из общего входа
export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
