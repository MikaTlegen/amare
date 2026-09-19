import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  getList,
  getMessages,
  getPlural,
  getT,
  isLocale,
  LOCALES,
  NAMESPACES,
  pickMessages,
  t,
} from "./index";

describe("t", () => {
  it("возвращает перевод для указанной локали", () => {
    expect(t("ru", "nav", "team")).toBe("Врачи");
    expect(t("kk", "nav", "team")).toBe("Дәрігерлер");
  });

  it("подставляет значения в плейсхолдеры", () => {
    expect(t("ru", "footer", "legal.bin", { value: "123456789012" })).toBe("БИН 123456789012");
  });

  it("оставляет плейсхолдер, если значение не передано", () => {
    expect(t("ru", "footer", "legal.bin")).toBe("БИН {value}");
  });
});

describe("getMessages", () => {
  it("падает обратно на русский, если перевода нет", () => {
    // Ключ есть в эталоне, но в казахском словаре его намеренно нет
    const kk = getMessages("kk", "common") as Record<string, string>;
    const ru = getMessages("ru", "common") as Record<string, string>;

    expect(Object.keys(kk).sort()).toEqual(Object.keys(ru).sort());
  });

  it("для локали по умолчанию отдаёт эталон без копирования", () => {
    expect(getMessages(DEFAULT_LOCALE, "nav")).toBe(getMessages(DEFAULT_LOCALE, "nav"));
  });
});

describe("getT", () => {
  it("переводит ключи своего пространства имён", () => {
    const translate = getT("kk", "footer");
    expect(translate("column.clinic")).toBe("Клиника");
    expect(translate("link.booking")).toBe("Жазылу");
  });
});

describe("getPlural", () => {
  const forms = (locale: "ru" | "kk") => {
    const plural = getPlural(locale, "ui");
    return [1, 2, 5].map((count) => plural("barthel.score", count));
  };

  it("в русском выбирает три формы", () => {
    expect(forms("ru")).toEqual(["1 балл", "2 балла", "5 баллов"]);
  });

  it("в казахском форма слова не меняется", () => {
    expect(forms("kk")).toEqual(["1 ұпай", "2 ұпай", "5 ұпай"]);
  });
});

describe("getList", () => {
  it("для ключа без списка отдаёт пустой массив", () => {
    // @ts-expect-error — строковый ключ не является списковым
    expect(getList("ru", "nav", "team")).toEqual([]);
  });
});

describe("isLocale", () => {
  it("принимает только поддерживаемые локали", () => {
    expect(isLocale("kk")).toBe(true);
    expect(isLocale("ru")).toBe(true);
    expect(isLocale("en")).toBe(false);
  });
});

describe("pickMessages", () => {
  it("отдаёт только запрошенные пространства имён", () => {
    const picked = pickMessages("kk", ["nav"]);

    expect(Object.keys(picked)).toEqual(["nav"]);
    expect(picked.nav?.team).toBe("Дәрігерлер");
  });
});

describe("NAMESPACES", () => {
  it("непустой и все локали объявлены", () => {
    expect(NAMESPACES.length).toBeGreaterThan(0);
    expect([...LOCALES]).toEqual(["ru", "kk"]);
  });
});
