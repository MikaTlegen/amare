import type { Translation } from "../../types";

/** Черновик перевода. Вычитывает клиника — см. docs/DECISIONS.md. */
export const ui: Translation<"ui"> = {
  "cabinet.home": "Басты бетке оралу",
  "cabinet.signOut": "Кабинеттен шығу",
  "cabinet.tabs": "Кабинет бөлімдері",
  "cabinet.menuOpen": "Кабинет мәзірін ашу",
  "cabinet.menuClose": "Мәзірді жабу",
  "cabinet.more": "Тағы",
  "cabinet.mobileNav": "Негізгі бөлімдер",
  "cabinet.demoShort": "Демо: деректер ойдан шығарылған",
  "cabinet.demoNotice":
    "Демонстрациялық режим. Барлық деректер ойдан шығарылған, ешқайда ештеңе жіберілмейді. Нақты медициналық мәліметтер ҚР-да сақталатын бэкенд қосылғаннан кейін ғана пайда болады.",

  "chat.fileTooBig": "«{name}» файлы {limit} МБ-тан үлкен. Бейнені сығып немесе бөліктеп жүктеген дұрыс.",
  "chat.tooManyFiles": "Бір ретте {max} файлдан артық тіркеуге болмайды.",
  "chat.defaultText": "Тіркемедегі файл",
  "chat.messageLabel": "Хабарлама",
  "chat.placeholder": "Хабарлама жазыңыз…",
  "chat.attach": "Файл",
  "chat.send": "Жіберу",
  "chat.attachHint":
    "Үзінді көшірмелер, суреттер және сабақ бейнелері бірден науқастың құжаттарына түседі. {max} файлға дейін, әрқайсысы {limit} МБ-тан аспауы керек.",
  "chat.emergency":
    "Чат жұмыс уақытында істейді. Күрт нашарлап кетсе — жазбаңыз, {phone} нөміріне жедел жәрдем шақырыңыз.",

  "attachment.photo": "Сурет",
  "attachment.scan": "Скан",
  "attachment.document": "Құжат",
  "attachment.video": "Бейне",
  "attachment.remove": "{name} файлын алып тастау",

  "barthel.caption": "Курс күндері бойынша Бартел индексінің динамикасы.",
  "barthel.label": "Бартел индексі",
  // В казахском существительное после числа не меняет форму: все три одинаковы
  "barthel.score.one": "{count} ұпай",
  "barthel.score.few": "{count} ұпай",
  "barthel.score.many": "{count} ұпай",

  "a11y.trigger": "Қолжетімділік баптаулары: қаріп өлшемі және контраст",
  "a11y.title": "Оқу ыңғайлылығы",
  "a11y.textSize": "Мәтін өлшемі",
  "a11y.scaleNormal": "Қалыпты",
  "a11y.scaleLarger": "Ірірек",
  "a11y.scaleMax": "Максимум",
  "a11y.highContrast": "Жоғары контраст",
  "a11y.motionNote":
    "Егер жүйеде қозғалысты азайту қосылған болса, сайттағы анимациялар автоматты түрде өшіріледі.",

  "lang.group": "Сайт тілі",
  "lang.ru": "РУС",
  "lang.kk": "ҚАЗ",

  "pwa.install": "Қосымшаны орнату",
  "pwa.installShort": "Орнату",
  "pwa.iosTitle": "iPhone немесе iPad-қа орнату",
  "pwa.iosStep1": "Safari экранының төменгі жағындағы «Бөлісу» түймесін басыңыз.",
  "pwa.iosStep2": "«Үй экранына қосу» дегенді таңдаңыз.",
  "pwa.iosStep3": "Қосуды растаңыз — таңбаша басқа қосымшалардың қатарында пайда болады.",
  "pwa.close": "Жабу",
};
