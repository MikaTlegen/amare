import type { Translation } from "../../types";

/** Черновик перевода. Вычитывает клиника — см. docs/DECISIONS.md. */
export const pages: Translation<"pages"> = {
  "notFound.title": "Бет табылмады",
  "notFound.note":
    "Сілтеме ескірген болуы мүмкін. Басты бетке оралыңыз немесе қоңырау шалыңыз — әкімші көмектеседі.",
  "notFound.home": "Басты бетке",

  "cabinet.title": "Кабинетке өтудеміз",
  "cabinet.note": "Егер өту басталмаса, сілтемені басыңыз.",
  "cabinet.link": "Кабинетке кіруді ашу",
};
