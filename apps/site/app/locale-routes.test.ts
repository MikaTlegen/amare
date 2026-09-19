import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { LOCALES } from "@amare/i18n/locales";
import { ROUTES } from "../lib/clinic";
import { allPaths, doctorPath, PAGES } from "../lib/pages";
import { DOCTORS } from "../data/doctors";
import { generateStaticParams } from "./(kk)/kk/[...slug]/page";

/*
 * Сторож двуязычия.
 *
 * Русская версия файловая, казахская собирается из реестра lib/pages.tsx.
 * Две разные механики легко расходятся: страница добавлена только в одну,
 * и второй язык молча отдаёт 404. Этот тест ловит расхождение до сборки.
 */

const appDir = fileURLToPath(new URL(".", import.meta.url));

// В кабинеты ведёт редирект, собственной страницы у них нет
const CABINET_ONLY = new Set<string>([
  ROUTES.cabinet,
  ROUTES.cabinetPatient,
  ROUTES.cabinetGuardian,
]);

const sitePaths = Object.values(ROUTES).filter((path) => !CABINET_ONLY.has(path));

describe("реестр страниц", () => {
  it.each(sitePaths)("%s есть в реестре", (path) => {
    expect(Object.keys(PAGES)).toContain(path);
  });

  it("покрывает и карточки врачей", () => {
    for (const doctor of DOCTORS) {
      expect(allPaths()).toContain(doctorPath(doctor.id));
    }
  });
});

describe("казахская ветка", () => {
  const slugs = generateStaticParams().map(({ slug }) => `/${slug.join("/")}`);

  it("генерирует все маршруты, кроме главной", () => {
    expect(slugs).toEqual(allPaths().filter((path) => path !== ROUTES.home));
  });

  it("главная лежит отдельным файлом", () => {
    expect(existsSync(`${appDir}(kk)/kk/page.tsx`)).toBe(true);
  });

  // Если кто-то начнёт дублировать страницы руками, языки разъедутся
  it("кроме главной и catch-all других страниц нет", () => {
    const pages = readdirSync(`${appDir}(kk)`, { recursive: true, encoding: "utf8" }).filter(
      (name) => name.endsWith("page.tsx"),
    );

    expect(pages.sort()).toEqual(["kk/[...slug]/page.tsx", "kk/page.tsx"]);
  });
});

describe("корневые макеты", () => {
  it.each([...LOCALES])("макет %s объявляет свой lang", (locale) => {
    const group = locale === "ru" ? "(ru)" : "(kk)";
    const layout = readFileSync(`${appDir}${group}/layout.tsx`, "utf8");

    expect(layout).toContain(`locale="${locale}"`);
  });
});
