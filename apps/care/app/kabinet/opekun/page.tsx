import type { Metadata } from "next";
import { DEFAULT_LOCALE, t } from "@amare/i18n";
import { RequireAuth } from "@/auth/RequireAuth";
import { GuardianCabinetPage } from "@/components/GuardianCabinetPage";

// Заголовок вкладки ставит сервер, а язык кабинета человек выбирает в браузере:
// здесь он остаётся на языке по умолчанию
export const metadata: Metadata = { title: t(DEFAULT_LOCALE, "cabinet", "guardian.title") };

export default function Page() {
  return (
    <RequireAuth allow={["guardian"]}>
      <GuardianCabinetPage />
    </RequireAuth>
  );
}
