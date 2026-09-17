import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";
import { ROUTES } from "../lib/clinic";

const appDir = fileURLToPath(new URL(".", import.meta.url));

// Кабинеты живут в приложении care: на сайте эти пути — редиректы
const CABINET_ROUTES = new Set<string>([
  ROUTES.login,
  ROUTES.cabinet,
  ROUTES.cabinetPatient,
  ROUTES.cabinetGuardian,
  ROUTES.cabinetStaff,
]);

function pageFile(route: string): string {
  return `${appDir}${route === "/" ? "" : route.slice(1)}/page.tsx`;
}

describe("маршруты сайта", () => {
  const siteRoutes = Object.entries(ROUTES).filter(([, path]) => !CABINET_ROUTES.has(path));

  // В наброске это было комментарием «иначе ссылка молча ведёт на 404»
  it.each(siteRoutes)("%s (%s) — есть страница", (_name, path) => {
    expect(existsSync(pageFile(path)), pageFile(path)).toBe(true);
  });

  it("пути кабинетов перенаправляются в care", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const sources = redirects.map((redirect) => redirect.source);

    expect(sources).toContain(ROUTES.login);
    expect(sources).toContain(ROUTES.cabinet);
    expect(sources).toContain(`${ROUTES.cabinet}/:path*`);
    for (const redirect of redirects) {
      expect(redirect.destination.startsWith("http"), redirect.destination).toBe(true);
    }
  });
});
