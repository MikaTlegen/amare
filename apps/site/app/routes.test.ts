import { existsSync, readdirSync, readFileSync } from "node:fs";
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
]);

// Русские страницы лежат в группе (ru): у каждой локали свой корневой макет
function pageFile(route: string): string {
  return `${appDir}(ru)/${route === "/" ? "" : `${route.slice(1)}/`}page.tsx`;
}

/*
 * Клиентские компоненты берут словарь у провайдера. Страница, которая его не
 * поставила, рендерит не текст, а сам ключ — «niyazbekova.name» вместо имени,
 * и это не падает ни линтером, ни типами. Так сломалась русская карточка
 * врача: казахская собирается через renderPage, который оборачивает сам.
 */
const pageFiles = readdirSync(appDir, { recursive: true, encoding: "utf8" })
  .filter((name) => name.endsWith("page.tsx"))
  .map((name) => ({ name, text: readFileSync(`${appDir}${name}`, "utf8") }));

describe("словари страниц", () => {
  it("страницы вообще найдены", () => {
    expect(pageFiles.length).toBeGreaterThan(10);
  });

  it.each(pageFiles)("$name — ставит провайдер словарей", ({ text }) => {
    expect(/PageMessages|renderPage/.test(text)).toBe(true);
  });
});

describe("маршруты сайта", () => {
  const siteRoutes = Object.entries(ROUTES).filter(([, path]) => !CABINET_ROUTES.has(path));

  // В наброске это было комментарием «иначе ссылка молча ведёт на 404»
  it.each(siteRoutes)("%s (%s) — есть страница", (_name, path) => {
    expect(existsSync(pageFile(path)), pageFile(path)).toBe(true);
  });

  it("пути кабинетов перенаправляются в care в обеих локалях", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const sources = redirects.map((redirect) => redirect.source);

    for (const prefix of ["", "/kk"]) {
      expect(sources).toContain(`${prefix}${ROUTES.login}`);
      expect(sources).toContain(`${prefix}${ROUTES.cabinet}`);
      expect(sources).toContain(`${prefix}${ROUTES.cabinet}/:path*`);
    }
    for (const redirect of redirects) {
      expect(redirect.destination.startsWith("http"), redirect.destination).toBe(true);
    }
  });
});
