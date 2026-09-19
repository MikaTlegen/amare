import type { Metadata } from "next";
import { DEFAULT_LOCALE, t } from "@amare/i18n";
import { CabinetIndexPage } from "@/components/CabinetIndexPage";

// Заголовок вкладки ставит сервер, а язык кабинета человек выбирает в браузере:
// здесь он остаётся на языке по умолчанию
export const metadata: Metadata = { title: t(DEFAULT_LOCALE, "cabinet", "index.title") };

export default function Page() {
  return <CabinetIndexPage />;
}
