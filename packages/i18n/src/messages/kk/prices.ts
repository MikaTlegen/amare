import type { Translation } from "../../types";

/** Черновик перевода. Вычитывает клиника — см. docs/DECISIONS.md. */
export const prices: Translation<"prices"> = {
  consultation: "18 000 ₸",
  course: "250 000 ₸-ден",
  homeVisit: "41 000 ₸",
  online: "18 000 ₸",
  dayHospital: "сұраныс бойынша",

  freeIntro: "Консультацияның алғашқы 15 минуты — тегін",
  freeIntroInline: "консультацияның алғашқы 15 минуты — тегін",

  includedInCourse: "курсқа кіреді",
  payment:
    "Төлем — картамен, Kaspi арқылы немесе бөліп төлеу. МӘМС және ЕМС бойынша шарттарды әкімшіден нақтылаңыз. Бағалардың өзектілігін жазылу кезінде әкімші растайды.",
};
