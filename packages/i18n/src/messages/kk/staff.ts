import type { Translation } from "../../types";

/** Черновик перевода. Вычитывает клиника — см. docs/DECISIONS.md. */
export const staff: Translation<"staff"> = {
  "role.curator": "Куратор",
  "role.moderator": "Контент модераторы",

  "title.curator": "Дәрігер-куратордың жұмыс орны",
  "title.moderator": "Курстар мен контентті модерациялау",
  "subtitle.curator": "Ашық тапсырмалар: {tasks} · науқастар: {patients}",
  "subtitle.moderator": "Жаттығулар, материалдар және үлгі нұсқалары",

  "tab.queue": "Тапсырмалар кезегі",
  "tab.patients": "Менің науқастарым",
  "tab.video": "Тексеруге берілген бейне",
  "tab.contentReview": "Бекітуге берілген контент",

  "queue.closing": "Жабылуда…",
  "queue.done": "Орындалды",
  "queue.open": "Карточканы ашу",
  "queue.empty": "Ашық тапсырмалар жоқ.",
  "queue.closedToday": "Бүгін жабылғандар",

  "board.all": "Барлығы",
  "board.filter": "Жағдай бойынша сүзгі",
  "board.barthel": "Қазіргі Бартел",
  "board.gain": "Курс ішіндегі өсім",
  "board.practice": "Апта ішіндегі жаттығу",
  "status.red": "Дабыл сигналы",
  "status.orange": "Назар аударуды қажет етеді",
  "status.green": "Жоспар бойынша",
  "board.courseDay": "{total} күннің {day}-күні",
  "board.weekMinutes": "{count} мин",
  "video.pending": "Тексерілмеген бейне: {total} ішінен {pending}",
  "board.empty": "Бұл топта қазір ешкім жоқ.",
  "board.open": "Карточканы ашу",

  "video.collapse": "Жию",
  "video.edit": "Өзгерту",
  "video.rate": "Бағалау",
  "video.technique": "Техникада нені түзету керек",
  "video.comment": "Науқасқа түсініктеме",
  "video.saving": "Сақталуда…",
  "video.send": "Науқасқа жіберу",
  "verdict.ok": "Бәрі дұрыс, осы көлемде жалғастырыңыз.",
  "verdict.amplitude": "Амплитуда қажеттіден аз — қозғалысты аяғына дейін жеткізіңіз.",
  "verdict.tempo": "Қарқын тым жылдам, баяуырақ және жұлқынбай жасаңыз.",
  "verdict.support": "Міндетті түрде тіректің жанында және жақын адамның қатысуымен.",

  "video.recorded": "жазба {duration}",
  "verdictLabel.ok": "Техника дұрыс",
  "verdictLabel.partial": "Ішінара дұрыс",
  "verdictLabel.wrong": "Дұрыс емес, қайта жасау керек",

  "login.title": "Жұмыс орнына кіру",
};
