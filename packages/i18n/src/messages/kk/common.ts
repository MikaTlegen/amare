import type { Translation } from "../../types";

/** Черновик перевода. Вычитывает клиника — см. docs/DECISIONS.md. */
export const common: Translation<"common"> = {
  appName: "Amare.kz",
  healthOk: "Қызмет жұмыс істеп тұр",

  call: "Хабарласу",
  book: "Жазылу",

  "contact.open": "Клиникамен хабарласу",
  "contact.close": "Байланыс мәзірін жабу",
  "contact.whatsapp": "WhatsApp",
  "contact.instagram": "Instagram",

  "cookie.region": "Cookie файлдарын пайдалануға келісім",
  "cookie.text":
    "Сайт cookie файлдарын пайдаланады. 2GIS картасы бөгде серверден жүктеледі және өз cookie файлдарын қояды.",
  "cookie.policy": "Деректерді өңдеу саясаты",
  "cookie.necessary": "Тек қажеттілері",
  "cookie.acceptAll": "Барлығын қабылдау",
};
