import { DEFAULT_LOCALE, t } from "@amare/i18n";
import { PageShell } from "@amare/ui";

// Заглушка: проверяет, что приложение собирается с общими пакетами
export default function HomePage() {
  return (
    <PageShell title={t(DEFAULT_LOCALE, "common.appName")}>
      <p>care: {t(DEFAULT_LOCALE, "common.missingInKk")}</p>
    </PageShell>
  );
}
