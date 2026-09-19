import type { Translation } from "../../types";

/** Черновик перевода. Вычитывает клиника — см. docs/DECISIONS.md. */
export const footer: Translation<"footer"> = {
  "column.clinic": "Клиника",
  "column.patients": "Науқастарға",
  "column.useful": "Пайдалы",
  "column.documents": "Құжаттар",
  "column.cabinets": "Кабинеттер",

  "link.about": "Клиника туралы",
  "link.team": "Дәрігерлер",
  "link.reviews": "Пікірлер",
  "link.contacts": "Байланыс",
  "link.jobs": "Бос орындар",
  "link.directions": "Бағыттар",
  "link.course": "Курс және бағалар",
  "link.remote": "Басқа қаладан келгендерге",
  "link.relatives": "Туыстарға",
  "link.booking": "Жазылу",
  "link.knowledge": "Білім базасы",
  "link.faq": "Сұрақтар мен жауаптар",
  "link.results": "Нәтижелер",
  "link.offer": "Жария оферта",
  "link.privacy": "Дербес деректер саясаты",
  "link.license": "Лицензия",

  "cabinet.patient": "Науқасқа",
  "cabinet.guardian": "Қамқоршыға",
  "cabinet.staff": "Қызметкерге",

  // БИН по-казахски — БСН (бизнес-сәйкестендіру нөмірі)
  "legal.bin": "БСН {value}",
  "legal.license": "№ {value} лицензия",
  "legal.notice":
    "Дербес деректер Қазақстан Республикасының аумағында өңделеді және сақталады. Қарсы көрсетілімдері бар, маман кеңесі қажет. Сайттағы ақпарат жария оферта болып табылмайды.",
};
