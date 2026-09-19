import type { Translation } from "../../types";

/** Черновик перевода. Вычитывает клиника — см. docs/DECISIONS.md. */
export const progress: Translation<"progress"> = {
  days: ["1-күн", "5-күн", "10-күн", "15-күн", "20-күн"],

  before: "Көмексіз отыра алмайтын",
  after: "Таяқпен жүреді, өзі тамақтанады",

  "band.title": "Ілгерілеу сандармен көрінеді",
  "band.note":
    "Бартел индексі тұрмыстық дербестікті көрсетеді: 0 — бөгде көмекке толық тәуелділік, 100 — адам өзі бас көтереді.",
  "band.alt": "Amare клиникасының күту аймағы",
  "band.averageGain": "Курс ішіндегі орташа өсім",
  "band.completionRate": "Курсты аяғына дейін жеткізетіндер",
  "band.chartTitle": "20 күндегі Бартел индексі",
  "band.demo": "демонстрациялық деректер",
  "band.beforeLabel": "Болған",
  "band.afterLabel": "Болды",
  "band.stories": "Қалпына келу тарихтары",

  "founder.name": "Әсемгүл Әмірбекқызы",
  "founder.role": "Дәрігер, Amare клиникасының негізін қалаушы",
  "founder.roleInline": "дәрігер, Amare клиникасының негізін қалаушы",
  "founder.photoAlt": "Әсемгүл Әмірбекқызы, Amare клиникасының негізін қалаушы",
  "founder.quote":
    "Біз әр клиентіміздің әлеуетіне сенеміз және қалпына келу жолында сізге қадам-қадаммен көмектесеміз.",
  "founder.credit": "{name} — {role}",

  "doors.newLabel": "Алғаш рет",
  "doors.newTitle": "3 минуттық сауалнама — дәрігер жоспармен жауап береді",
  "doors.newAction": "Толтыру",
  "doors.currentLabel": "Курстамын",
  "doors.currentTitle": "Науқас, қамқоршы және қызметкер кабинеті",
  "doors.currentAction": "Кіру",

  "carousel.label": "Мамандар карточкалары",
  "carousel.noPhoto": "Маман фотосы",
  "carousel.prev": "Алдыңғы дәрігер",
  "carousel.next": "Келесі дәрігер",
};
