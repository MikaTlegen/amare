import type { Translation } from "../../types";

/** Черновик перевода. Вычитывает клиника — см. docs/DECISIONS.md. */
export const home: Translation<"home"> = {
  "hero.label": "Астанадағы нейрооңалту клиникасы",
  "hero.title": "Қозғалысты, сөйлеуді және дербестікті қайтарамыз",
  "hero.note":
    "Алғашқы консультациядан түсінікті қалпына келу жоспарына дейін — қасыңызда диагнозды емес, адамды көретін команда.",
  "hero.book": "Консультацияға жазылу",
  "hero.aside": "Сабақ жоспары, жеке куратор және курстың әр кезеңінде отбасына қолдау.",
  "hero.videoPause": "Бейнені тоқтату",
  "hero.videoPlay": "Бейнені қосу",

  "facts.label": "Клиника туралы қысқаша",
  "facts.rating.value": "{source} ішінде {value}",
  // В казахском существительное после числа не меняет форму
  "facts.rating.note.one": "{count} баға",
  "facts.rating.note.few": "{count} баға",
  "facts.rating.note.many": "{count} баға",
  "facts.doctors.value.one": "{count} маман",
  "facts.doctors.value.few": "{count} маман",
  "facts.doctors.value.many": "{count} маман",
  "facts.doctors.note": "бір команда",
  "facts.price.note": "10–14 күндік курс",
  "facts.insurance.value": "МӘМС және ЕМС",
  "facts.insurance.note": "немесе ақылы",

  "directions.label": "Бағыттар",
  "directions.title": "Отбасына дәл қазір маңызды міндетке арналған оңалту",
  "directions.note":
    "Бағдарламаны нақты мақсаттар төңірегінде құрамыз: қауіпсіз жүру, сөйлеу, тамақтану, әдеттегі істерге оралу.",
  "directions.all": "Барлық бағыттар",

  "course.label": "Курс қалай құрылады",
  "course.title": "Жағдайды бағалаудан дербестікке дейінгі түсінікті жол",
  "course.note":
    "Әр кезең жоспарда тіркелген. Отбасы бүгін не болып жатқанын және қандай мақсатқа қарай жүріп келе жатқанымызды түсінеді.",
  "course.link": "Курс пен құны туралы білу",

  "team.label": "Команда",
  "team.title": "Науқаспен бір маман ғана жұмыс істемейді",
  "team.link": "Командамен танысу",

  "contact.label": "Әңгімеден бастаңыз",
  "contact.title": "Не болып жатқанын айтыңыз — бағдар алуға көмектесеміз",
  "contact.book": "Консультацияға жазылу",
};
