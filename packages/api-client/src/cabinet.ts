/**
 * Черновик контракта кабинетов (пациент, опекун, специалист).
 *
 * Перенесено из наброска amare-site (src/api/types.ts, src/api/mockData.ts).
 * Типы и демо-данные общие для apps/care и apps/staff — оба приложения
 * клонируют DEMO_* в своё мутируемое состояние, само состояние между
 * приложениями не синхронизируется (см. docs/DECISIONS.md).
 */

export type Role = "patient" | "guardian" | "staff";

export interface User {
  id: string;
  name: string;
  role: Role;
  /** Опекун смотрит за конкретным пациентом. */
  wardId?: string;
  /** Специальность — только у сотрудника. */
  speciality?: string;
}

export type ExerciseStatus = "done" | "now" | "todo";

export interface Exercise {
  id: string;
  title: string;
  minutes: number;
  status: ExerciseStatus;
  /** К какому направлению относится — для группировки и статистики. */
  direction: string;
  hint?: string;
}

export interface DayPlan {
  /** Какой день курса идёт. */
  day: number;
  courseLength: number;
  planMinutes: number;
  exercises: Exercise[];
}

export interface ScalePoint {
  day: string;
  barthel: number;
}

export type AlertLevel = "info" | "warn" | "danger";

export interface Alert {
  id: string;
  level: AlertLevel;
  text: string;
  at: string;
}

export interface PatientCard {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  courseDay: number;
  courseLength: number;
  curator: string;
  /** Минуты практики по дням недели — главная метрика платформы. */
  weekMinutes: number[];
  barthel: ScalePoint[];
  alerts: Alert[];
}

export type AttachmentKind = "photo" | "scan" | "document" | "video";

export interface Attachment {
  id: string;
  name: string;
  kind: AttachmentKind;
  /** Уже отформатированный размер: «1,2 МБ». */
  size: string;
  at: string;
  /** Кто приложил — влияет на то, где файл показывается. */
  by: "patient" | "staff";
  /** К какому пациенту относится. Документы хранятся по пациентам. */
  patientId: string;
}

export interface Message {
  id: string;
  author: "curator" | "me";
  authorName: string;
  text: string;
  at: string;
  attachments?: Attachment[];
}

/** Шаблон программы из конструктора курсов (модуль M4 ТЗ). */
export interface ProgramTemplate {
  id: string;
  title: string;
  days: number;
  /** Из чего состоит: короткий список направлений. */
  includes: string[];
  note: string;
}

export interface AssignedProgram {
  id: string;
  patientId: string;
  title: string;
  days: number;
  startAt: string;
  comment: string;
  assignedBy: string;
  assignedAt: string;
}

export interface StaffTask {
  id: string;
  patientName: string;
  patientId: string;
  kind: "video" | "call" | "assessment" | "alert";
  title: string;
  due: string;
  done: boolean;
}

/** «1234567» → «1,2 МБ». Показываем размер так, как его читает человек. */
export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} МБ`;
}

/** Определяем вид вложения по типу файла — для иконки и группировки. */
export function detectKind(file: File): AttachmentKind {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("image/")) {
    // Снимки МРТ и сканы выписок тоже приходят картинками; различаем по имени
    return /скан|snimok|mri|мрт|кт|выписк/i.test(file.name) ? "scan" : "photo";
  }
  return "document";
}

/**
 * Демонстрационные данные кабинетов.
 *
 * ВСЁ ЗДЕСЬ ВЫМЫШЛЕНО. Ни одного реального пациента: имена условные,
 * динамика шкал подобрана для показа интерфейса. Эти данные нельзя
 * использовать как статистику клиники и нельзя публиковать на сайте.
 */

export const DEMO_USERS: Record<string, User> = {
  patient: {
    id: "u-patient",
    name: "Серик Абдуллаев",
    role: "patient",
  },
  guardian: {
    id: "u-guardian",
    name: "Айгерим Абдуллаева",
    role: "guardian",
    wardId: "p-1",
  },
  staff: {
    id: "u-staff",
    name: "Индира Жумабекова",
    role: "staff",
    speciality: "Врач-реабилитолог, куратор",
  },
};

export const DEMO_PATIENT: PatientCard = {
  id: "p-1",
  name: "Серик Абдуллаев",
  age: 67,
  diagnosis: "Ишемический инсульт, правосторонний гемипарез",
  courseDay: 12,
  courseLength: 20,
  curator: "Индира Жумабекова",
  weekMinutes: [45, 60, 55, 0, 60, 52, 43],
  barthel: [
    { day: "День 1", barthel: 25 },
    { day: "День 5", barthel: 40 },
    { day: "День 10", barthel: 55 },
    { day: "День 12", barthel: 60 },
  ],
  alerts: [
    {
      id: "a-1",
      level: "warn",
      text: "Пропущено занятие в четверг. Куратор спросит о причине на разборе.",
      at: "2 дня назад",
    },
    {
      id: "a-2",
      level: "info",
      text: "Переоценка по шкалам назначена на 15-й день курса.",
      at: "вчера",
    },
  ],
};

export const DEMO_DAY_PLAN: DayPlan = {
  day: 12,
  courseLength: 20,
  planMinutes: 60,
  exercises: [
    {
      id: "e-1",
      title: "Разработка кисти",
      minutes: 15,
      status: "done",
      direction: "hand",
      hint: "Медленно, до лёгкого сопротивления. Боли быть не должно.",
    },
    {
      id: "e-2",
      title: "Речевая гимнастика",
      minutes: 20,
      status: "done",
      direction: "speech",
      hint: "Перед зеркалом, десять повторов каждого упражнения.",
    },
    {
      id: "e-3",
      title: "Равновесие у опоры",
      minutes: 18,
      status: "now",
      direction: "walking",
      hint: "Обязательно рядом с устойчивой опорой и в присутствии близкого.",
    },
    {
      id: "e-4",
      title: "Ходьба по коридору",
      minutes: 7,
      status: "todo",
      direction: "walking",
      hint: "В комфортном темпе, с остановками.",
    },
  ],
};

export const DEMO_MESSAGES: Message[] = [
  {
    id: "m-1",
    author: "curator",
    authorName: "Индира Жумабекова",
    text: "Серик Маратович, добрый день. Видела вчерашнее видео — кисть разрабатывается хорошо. Сегодня добавьте равновесие, но только с поддержкой.",
    at: "сегодня, 09:14",
  },
  {
    id: "m-2",
    author: "me",
    authorName: "Вы",
    text: "Спасибо. В четверг не получилось позаниматься, кружилась голова.",
    at: "сегодня, 10:02",
  },
  {
    id: "m-3",
    author: "curator",
    authorName: "Индира Жумабекова",
    text: "Отметила. Если головокружение повторится — не занимайтесь и сразу напишите, пересоберём нагрузку.",
    at: "сегодня, 10:20",
  },
];

export const DEMO_STAFF_TASKS: StaffTask[] = [
  {
    id: "t-1",
    patientId: "p-1",
    patientName: "Серик Абдуллаев",
    kind: "alert",
    title: "Пропуск занятия и жалоба на головокружение",
    due: "сегодня",
    done: false,
  },
  {
    id: "t-2",
    patientId: "p-2",
    patientName: "Мария Ковалёва",
    kind: "video",
    title: "Проверить видео домашнего задания",
    due: "сегодня",
    done: false,
  },
  {
    id: "t-3",
    patientId: "p-3",
    patientName: "Нурлан Естаев",
    kind: "assessment",
    title: "Переоценка по шкале Рэнкина, 15-й день",
    due: "завтра",
    done: false,
  },
  {
    id: "t-4",
    patientId: "p-4",
    patientName: "Гульнара Сеитова",
    kind: "call",
    title: "Звонок родственнику по итогам недели",
    due: "завтра",
    done: true,
  },
];

export const DEMO_STAFF_PATIENTS: PatientCard[] = [
  DEMO_PATIENT,
  {
    id: "p-2",
    name: "Мария Ковалёва",
    age: 58,
    diagnosis: "ЧМТ, нарушение равновесия",
    courseDay: 6,
    courseLength: 14,
    curator: "Индира Жумабекова",
    weekMinutes: [30, 40, 40, 35, 45, 0, 0],
    barthel: [
      { day: "День 1", barthel: 45 },
      { day: "День 5", barthel: 55 },
    ],
    alerts: [],
  },
  {
    id: "p-3",
    name: "Нурлан Естаев",
    age: 71,
    diagnosis: "Геморрагический инсульт, афазия",
    courseDay: 14,
    courseLength: 20,
    curator: "Индира Жумабекова",
    weekMinutes: [50, 55, 60, 60, 55, 40, 30],
    barthel: [
      { day: "День 1", barthel: 20 },
      { day: "День 5", barthel: 30 },
      { day: "День 10", barthel: 45 },
    ],
    alerts: [{ id: "a-3", level: "danger", text: "Два дня без активности в приложении.", at: "сегодня" }],
  },
];

/**
 * Документы пациента. У каждого пациента свой набор — это обязательное
 * требование: медицинские файлы не лежат «общей кучей».
 */
export const DEMO_DOCUMENTS: Attachment[] = [
  {
    id: "f-1",
    name: "Выписка из стационара.pdf",
    kind: "document",
    size: "1,4 МБ",
    at: "12 дней назад",
    by: "patient",
    patientId: "p-1",
  },
  {
    id: "f-2",
    name: "МРТ головного мозга, снимок.jpg",
    kind: "scan",
    size: "3,1 МБ",
    at: "12 дней назад",
    by: "patient",
    patientId: "p-1",
  },
  {
    id: "f-3",
    name: "Заключение МДГ, первая неделя.pdf",
    kind: "document",
    size: "260 КБ",
    at: "5 дней назад",
    by: "staff",
    patientId: "p-1",
  },
  {
    id: "f-4",
    name: "Видео: ходьба на брусьях.mp4",
    kind: "video",
    size: "18,6 МБ",
    at: "вчера",
    by: "staff",
    patientId: "p-1",
  },
  {
    id: "f-5",
    name: "Выписка.pdf",
    kind: "document",
    size: "980 КБ",
    at: "6 дней назад",
    by: "patient",
    patientId: "p-2",
  },
];

/**
 * Шаблоны программ из конструктора курсов (модуль M4 ТЗ).
 * Длительность 10/14/20 дней — как требует стандарт РК: на II и III
 * этапах курс не короче 14 дней, поэтому 10-дневный помечен отдельно.
 */
export const PROGRAM_TEMPLATES: ProgramTemplate[] = [
  {
    id: "tpl-walk-14",
    title: "Восстановление ходьбы, 14 дней",
    days: 14,
    includes: ["Кинезиотерапия", "ЛФК", "Массаж"],
    note: "Базовый курс при гемипарезе с сохранным когнитивным статусом.",
  },
  {
    id: "tpl-speech-14",
    title: "Речь и глотание, 14 дней",
    days: 14,
    includes: ["Логопед", "Нейропсихолог", "ЛФК"],
    note: "При афазии и дисфагии. Логопед ежедневно.",
  },
  {
    id: "tpl-complex-20",
    title: "Комплексный курс, 20 дней",
    days: 20,
    includes: ["Кинезиотерапия", "Эрготерапия", "Логопед", "Нейропсихолог"],
    note: "Тяжёлые пациенты, несколько дефицитов одновременно.",
  },
  {
    id: "tpl-support-10",
    title: "Поддерживающий, 10 дней",
    days: 10,
    includes: ["ЛФК", "Массаж"],
    note: "Только вне ОСМС: стандарт РК требует не менее 14 дней на II–III этапах.",
  },
];

export const DEMO_PROGRAMS: AssignedProgram[] = [
  {
    id: "pr-1",
    patientId: "p-1",
    title: "Комплексный курс, 20 дней",
    days: 20,
    startAt: "12 дней назад",
    comment: "Акцент на равновесие, кисть — со второй недели.",
    assignedBy: "Индира Жумабекова",
    assignedAt: "12 дней назад",
  },
];
