import { DEFAULT_LOCALE, t } from "@amare/i18n";
import { Logo, PageShell } from "@amare/ui";

// Заглушка: проверяет, что приложение собирается с общими пакетами и токенами
export default function HomePage() {
  return (
    <PageShell title={t(DEFAULT_LOCALE, "common.appName")}>
      <Logo />
      <p className="mt-4">staff: {t(DEFAULT_LOCALE, "common.missingInKk")}</p>
    </PageShell>
  );
}
