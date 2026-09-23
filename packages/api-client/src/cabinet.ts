/**
 * Черновик контракта кабинетов (пациент, опекун, специалист).
 *
 * Перенесено из наброска amare-site (src/api/types.ts, src/api/mockData.ts).
 * Типы и демо-данные общие для apps/care и apps/staff — оба приложения
 * клонируют DEMO_* в своё мутируемое состояние, само состояние между
 * приложениями не синхронизируется (см. docs/DECISIONS.md).
 */

export type Role = "patient" | "guardian" | "staff";

/**
 * Роль сотрудника внутри рабочего места.
 *
 * Куратор ведёт пациентов: очередь задач, алерты, видео, разборы.
 * Модератор отвечает за содержимое — шаблоны курсов и библиотеку
 * упражнений/материалов. Раньше здесь была отдельная роль «админ», но
 * на практике это тот же человек — роли объединены (см. docs/DECISIONS.md).
 */
export type StaffRole = "curator" | "moderator";

export interface User {
  id: string;
  name: string;
  role: Role;
  /** Опекун смотрит за конкретным пациентом. */
  wardId?: string;
  /** Специальность — только у сотрудника. */
  speciality?: string;
  /** Роль внутри рабочего места — только у сотрудника. */
  staffRole?: StaffRole;
}

export type ExerciseStatus = "done" | "now" | "todo";

/**
 * Как далось упражнение: 1 — легко, 3 — тяжело. Подписи в словаре cabinet.
 *
 * Это оценка пациента, а не врача: врач не знает, чего стоило занятие.
 * По ней куратор видит, где нагрузку пора снизить или поднять.
 */
export type ExerciseDifficulty = 1 | 2 | 3;

export interface Exercise {
  id: string;
  title: string;
  minutes: number;
  status: ExerciseStatus;
  /** К какому направлению относится — для группировки и статистики. */
  direction: string;
  hint?: string;
  /** Оценка пациента после занятия. Пусто — он ещё не отвечал. */
  feedback?: ExerciseDifficulty;
  /** Разбор упражнения на видео. Внешняя ссылка: плеер в кабинет не встраиваем. */
  videoUrl?: string;
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
  /** Оценки пациента «как далось» за последние дни — сигнал куратору. */
  feedback?: ExerciseFeedback[];
}

/** Одна оценка упражнения пациентом, как её видит куратор. */
export interface ExerciseFeedback {
  id: string;
  exercise: string;
  level: ExerciseDifficulty;
  at: string;
}

export type SessionReportKind = "video" | "week" | "homework";

/**
 * Отчёт куратора о занятии: что делали, как получилось, что дальше.
 * Видят пациент и опекун; пишет куратор после занятия или разбора.
 */
export interface SessionReport {
  id: string;
  kind: SessionReportKind;
  title: string;
  at: string;
  curator: string;
  summary: string;
  details: string[];
  videoUrl?: string;
}

/** Документ пациента в кабинете: выписки и заключения клиники. */
export interface PatientDocument {
  id: string;
  title: string;
  issuedBy: string;
  at: string;
  /** Содержимое для демо-просмотра. В бою — файл по подписанной ссылке. */
  body: string[];
}

export type MedicationLogState = "taken" | "late" | "missed";

/** Запись истории приёма лекарства: по плану и как было на деле. */
export interface MedicationLog {
  id: string;
  title: string;
  dose: string;
  day: string;
  planned: string;
  state: MedicationLogState;
  /** Во сколько приняли на деле; у пропуска пусто. */
  takenAt?: string;
  critical?: boolean;
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

/**
 * Статус курса в библиотеке. Черновик видит только модератор;
 * назначить пациенту можно лишь опубликованный курс.
 */
export type CourseStatus = "draft" | "published";

/** Упражнение внутри этапа курса — те же поля, что у упражнения в плане дня. */
export interface CourseExercise {
  id: string;
  title: string;
  minutes: number;
  hint?: string;
  videoUrl?: string;
}

/** Этап курса: неделя, месяц — как решит модератор. */
export interface CourseStage {
  id: string;
  title: string;
  exercises: CourseExercise[];
}

/** Шаблон программы из конструктора курсов (модуль M4 ТЗ). */
export interface ProgramTemplate {
  id: string;
  title: string;
  days: number;
  /** Из чего состоит: короткий список направлений. */
  includes: string[];
  note: string;
  /** Пусто у шаблонов до конструктора — они считаются опубликованными. */
  status?: CourseStatus;
  /** Пресет длительности: 1, 6 или 12 месяцев. Пусто — длительность в днях. */
  durationMonths?: number;
  stages?: CourseStage[];
  /** Кто ведёт пациентов по этому курсу. */
  curatorIds?: string[];
  /** Кто отвечает за содержание курса. */
  moderatorIds?: string[];
}

/** Сотрудник клиники в списке для назначения на курс. */
export interface StaffMember {
  id: string;
  name: string;
  staffRole: StaffRole;
  speciality: string;
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
    staffRole: "curator",
  },
  moderator: {
    id: "u-moderator",
    name: "Алия Турсунова",
    role: "staff",
    speciality: "Модератор курсов и контента",
    staffRole: "moderator",
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
  feedback: [
    { id: "f-1", exercise: "Речевая гимнастика", level: 3, at: "сегодня, 10:40" },
    { id: "f-2", exercise: "Разработка кисти", level: 1, at: "сегодня, 10:05" },
    { id: "f-3", exercise: "Равновесие у опоры", level: 3, at: "вчера, 11:20" },
    { id: "f-4", exercise: "Речевая гимнастика", level: 2, at: "вчера, 10:30" },
    { id: "f-5", exercise: "Ходьба по коридору", level: 2, at: "позавчера, 12:10" },
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
      feedback: 1,
      direction: "hand",
      hint: "Медленно, до лёгкого сопротивления. Боли быть не должно.",
      videoUrl: "https://www.youtube.com/watch?v=oCTAxHgJdW8",
    },
    {
      id: "e-2",
      title: "Речевая гимнастика",
      minutes: 20,
      status: "done",
      feedback: 3,
      direction: "speech",
      hint: "Перед зеркалом, десять повторов каждого упражнения.",
      videoUrl: "https://www.youtube.com/watch?v=oCTAxHgJdW8",
    },
    {
      id: "e-3",
      title: "Равновесие у опоры",
      minutes: 18,
      status: "now",
      direction: "walking",
      hint: "Обязательно рядом с устойчивой опорой и в присутствии близкого.",
      videoUrl: "https://www.youtube.com/watch?v=oCTAxHgJdW8",
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
    feedback: [
      { id: "f-21", exercise: "Равновесие у опоры", level: 2, at: "сегодня, 08:40" },
      { id: "f-22", exercise: "Шаги в сторону", level: 1, at: "вчера, 09:15" },
    ],
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
    feedback: [
      { id: "f-31", exercise: "Называние предметов", level: 3, at: "позавчера, 11:00" },
      { id: "f-32", exercise: "Ходьба по коридору", level: 2, at: "позавчера, 12:30" },
    ],
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
  {
    id: "tpl-home-6m",
    title: "Домашнее восстановление, полгода",
    days: 182,
    durationMonths: 6,
    includes: ["ЛФК", "Эрготерапия", "Логопед"],
    note: "После выписки: занятия дома с еженедельным разбором у куратора.",
    status: "draft",
    stages: [
      {
        id: "st-1",
        title: "Месяц 1 — возвращаем опору",
        exercises: [
          { id: "ce-1", title: "Перенос веса стоя", minutes: 10, hint: "Рядом с устойчивой опорой." },
          { id: "ce-2", title: "Разработка кисти", minutes: 15 },
        ],
      },
      {
        id: "st-2",
        title: "Месяцы 2–3 — ходьба и речь",
        exercises: [{ id: "ce-3", title: "Ходьба по коридору", minutes: 15 }],
      },
    ],
    curatorIds: ["st-curator-1"],
    moderatorIds: ["st-moderator-1"],
  },
];

/**
 * Сотрудники для назначения на курсы. Вымышленные, как и все DEMO_*:
 * первые двое совпадают с демо-входом staff.
 */
export const DEMO_STAFF_MEMBERS: StaffMember[] = [
  { id: "st-curator-1", name: "Индира Жумабекова", staffRole: "curator", speciality: "Врач-реабилитолог" },
  { id: "st-curator-2", name: "Ержан Касымов", staffRole: "curator", speciality: "Кинезиотерапевт" },
  { id: "st-curator-3", name: "Динара Оспанова", staffRole: "curator", speciality: "Логопед-афазиолог" },
  { id: "st-moderator-1", name: "Алия Турсунова", staffRole: "moderator", speciality: "Модератор курсов и контента" },
  { id: "st-moderator-2", name: "Марат Сагинтаев", staffRole: "moderator", speciality: "Методист ЛФК" },
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

/* ------------------------------------------------------------------ *
 * Дневник самоконтроля, лекарства, материалы и документы (M5 ТЗ)
 * ------------------------------------------------------------------ */

/** Запись дневника: давление, пульс и настроение (P-04). */
export interface VitalEntry {
  id: string;
  /** Уже отформатированная дата: «сегодня, 08:20». */
  at: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  /** 1 — плохо, 5 — хорошо. Пациенту показывается смайлами. */
  mood: number;
  /** Ввёл опекун, а не пациент (G-03). */
  byGuardian?: boolean;
}

/**
 * Пороги для подтверждения аномального значения (U-07 ТЗ).
 *
 * Это НЕ клинические пороги алертов — те задаёт врач в модуле M8
 * (Приложение Г ТЗ). Здесь единственная задача: поймать опечатку
 * на цифровой клавиатуре, прежде чем она уедет в карту.
 */
export const VITALS_SANITY = {
  systolic: { min: 70, max: 220 },
  diastolic: { min: 40, max: 130 },
  pulse: { min: 35, max: 160 },
} as const;

export type MedicationState = "pending" | "taken" | "postponed" | "missed";

/** Лекарство в расписании (P-05). */
export interface Medication {
  id: string;
  title: string;
  dose: string;
  /** Время приёма по расписанию: «08:00». */
  at: string;
  state: MedicationState;
  /** Осталось дней по остатку упаковки — повод напомнить купить. */
  daysLeft: number;
  /** Пропуск критичен: антиагреганты и антикоагулянты. */
  critical?: boolean;
}

/** Обучающий материал, назначенный специалистом (P-11). */
export interface Material {
  id: string;
  title: string;
  kind: "video" | "article";
  minutes: number;
  assignedBy: string;
  note: string;
  /** Куда ведёт кнопка «Смотреть». Без ссылки материал показан, но недоступен. */
  url?: string;
  /** Текст статьи прямо в кабинете — когда внешней ссылки нет. */
  text?: string[];
}

export type ConsentState = "active" | "revoked";

/** Согласие пациента (P-14, P-15). */
export interface Consent {
  id: string;
  title: string;
  at: string;
  state: ConsentState;
  /** Краткое содержание согласия — раскрывается по нажатию. */
  text?: string;
  /** Согласие обязательно для лечения и отзывается только на бумаге. */
  required?: boolean;
}

/** Строка журнала доступа к медданным (раздел 6 ТЗ, P-15). */
export interface AccessLogEntry {
  id: string;
  who: string;
  role: string;
  action: string;
  at: string;
  /** Откуда был доступ: рабочее место в клинике, кабинет опекуна и т. п. */
  source?: string;
}

/** Отметка ухода за лежачим пациентом (G-03). */
export interface CareTask {
  id: string;
  title: string;
  /** Как часто повторяется: «каждые 2 часа». */
  period: string;
  doneAt: string | null;
}

/** Урок школы опекуна (G-06). */
export interface GuardianLesson {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  done: boolean;
  /** Видео урока. Без ссылки кнопка просмотра не показывается. */
  videoUrl?: string;
}

export type VideoVerdict = "ok" | "partial" | "wrong";

/** Видео упражнения на проверку специалистом (W-03). */
export interface VideoReview {
  id: string;
  patientId: string;
  patientName: string;
  exercise: string;
  at: string;
  /** Длительность записи в секундах — показываем рядом с плеером. */
  seconds: number;
  verdict: VideoVerdict | null;
  comment: string;
  /** Запись занятия. TODO BACKEND: подписанная ссылка на хранилище в РК. */
  videoUrl?: string;
}

/**
 * Подписи вердиктов — это интерфейс, а не демо-данные: они переехали
 * в @amare/i18n (namespace staff, ключи verdictLabel.*). Здесь остаётся
 * только ключ, чтобы связь «вердикт → подпись» была в одном месте.
 */
export const VERDICT_KEY: Record<VideoVerdict, string> = {
  ok: "verdictLabel.ok",
  partial: "verdictLabel.partial",
  wrong: "verdictLabel.wrong",
};

/** Черновик еженедельного разбора (W-05). */
export interface WeeklyReview {
  patientId: string;
  /** Автоматически собранные факты недели — специалист их правит. */
  facts: string[];
  draft: string;
  sentAt: string | null;
}

export const DEMO_VITALS: VitalEntry[] = [
  { id: "v-1", at: "сегодня, 08:20", systolic: 138, diastolic: 86, pulse: 74, mood: 4 },
  {
    id: "v-2",
    at: "вчера, 21:10",
    systolic: 145,
    diastolic: 90,
    pulse: 78,
    mood: 3,
    byGuardian: true,
  },
  { id: "v-3", at: "вчера, 08:05", systolic: 142, diastolic: 88, pulse: 72, mood: 4 },
  { id: "v-4", at: "позавчера, 20:40", systolic: 150, diastolic: 92, pulse: 80, mood: 2 },
  { id: "v-5", at: "позавчера, 08:15", systolic: 139, diastolic: 85, pulse: 70, mood: 4 },
];

export const DEMO_MEDICATIONS: Medication[] = [
  {
    id: "med-1",
    title: "Аспирин кардио",
    dose: "100 мг, 1 таблетка",
    at: "08:00",
    state: "taken",
    daysLeft: 12,
    critical: true,
  },
  {
    id: "med-2",
    title: "Аторвастатин",
    dose: "20 мг, 1 таблетка",
    at: "21:00",
    state: "pending",
    daysLeft: 4,
  },
  {
    id: "med-3",
    title: "Периндоприл",
    dose: "5 мг, 1 таблетка",
    at: "09:00",
    state: "pending",
    daysLeft: 21,
  },
];

export const DEMO_MATERIALS: Material[] = [
  {
    id: "mat-1",
    title: "Как безопасно глотать: поза и консистенция пищи",
    kind: "video",
    minutes: 6,
    assignedBy: "Логопед-дефектолог",
    note: "Посмотрите вместе с тем, кто вас кормит.",
    url: "https://www.youtube.com/watch?v=oCTAxHgJdW8",
  },
  {
    id: "mat-2",
    title: "Профилактика падений дома",
    kind: "article",
    minutes: 4,
    assignedBy: "Эрготерапевт",
    note: "Список того, что стоит убрать из квартиры уже сегодня.",
    text: [
      "Уберите ковры, провода и пороги на пути от кровати до туалета: большинство падений случается именно там, чаще ночью.",
      "Поставьте ночник в коридоре и выключатель у кровати — вставать в темноте нельзя.",
      "Поручни у кровати и в ванной нужны даже тем, кто уже ходит сам.",
      "Обувь — нескользящая, с задником. Тапки без задника — частая причина падений.",
      "Вставайте в три шага: сесть, посидеть минуту, встать с опорой. Резкий подъём даёт головокружение.",
    ],
  },
  {
    id: "mat-3",
    title: "Разработка кисти: разбор техники",
    kind: "video",
    minutes: 8,
    assignedBy: "Индира Жумабекова",
    note: "То же упражнение, что у вас в плане на день.",
    url: "https://www.youtube.com/watch?v=oCTAxHgJdW8",
  },
];

export const DEMO_CONSENTS: Consent[] = [
  {
    id: "c-1",
    title: "Согласие на обработку персональных данных, включая сведения о здоровье",
    at: "12 дней назад",
    state: "active",
    text: "Клиника хранит и обрабатывает ваши данные о здоровье только для лечения, на серверах в Казахстане. Доступ — у лечащей команды, каждый просмотр пишется в журнал.",
    required: true,
  },
  {
    id: "c-2",
    title: "Согласие на доступ опекуна к кабинету",
    at: "12 дней назад",
    state: "active",
    text: "Опекун (Айгерим Абдуллаева) видит план, дневник, лекарства и переписку с куратором, может вносить давление и отметки ухода. Отозвать — заявлением у администратора.",
  },
  {
    id: "c-3",
    title: "Согласие на использование обезличенного случая в материалах клиники",
    at: "10 дней назад",
    state: "active",
    text: "Клиника может рассказать о ходе восстановления без имени, лица и других данных, по которым вас можно узнать. Отказ не влияет на лечение.",
  },
];

export const DEMO_ACCESS_LOG: AccessLogEntry[] = [
  {
    id: "log-1",
    who: "Индира Жумабекова",
    role: "Врач-реабилитолог, куратор",
    action: "Открыла карту и динамику по шкалам",
    at: "сегодня, 09:12",
    source: "Рабочее место специалиста, клиника Amare",
  },
  {
    id: "log-2",
    who: "Айгерим Абдуллаева",
    role: "Опекун",
    action: "Внесла измерение давления",
    at: "вчера, 21:10",
    source: "Кабинет опекуна, телефон",
  },
  {
    id: "log-3",
    who: "Куспанова Айгуль",
    role: "Реабилитолог",
    action: "Посмотрела видео упражнения",
    at: "вчера, 15:40",
    source: "Рабочее место специалиста, клиника Amare",
  },
];

export const DEMO_CARE_TASKS: CareTask[] = [
  { id: "ct-1", title: "Поворот и смена положения", period: "каждые 2 часа", doneAt: "11:00" },
  {
    id: "ct-2",
    title: "Осмотр кожи: крестец, пятки, лопатки",
    period: "утром и вечером",
    doneAt: "08:30",
  },
  { id: "ct-3", title: "Кормление, положение сидя", period: "3 раза в день", doneAt: null },
  { id: "ct-4", title: "Питьё, отметка объёма", period: "в течение дня", doneAt: null },
  { id: "ct-5", title: "Стул и диурез", period: "раз в сутки", doneAt: null },
];

/** Демо-ролик один на все уроки — реальные съёмки появятся с админкой (M2). */
const GUARDIAN_LESSON_VIDEO = "https://www.youtube.com/watch?v=oCTAxHgJdW8";

export const DEMO_GUARDIAN_LESSONS: GuardianLesson[] = [
  {
    id: "gl-1",
    title: "Пересаживание и перемещение",
    minutes: 9,
    summary: "Как поднять и пересадить человека, не сорвав спину и не повредив ему плечо.",
    done: true,
    videoUrl: GUARDIAN_LESSON_VIDEO,
  },
  {
    id: "gl-2",
    title: "Укладки и позиционирование",
    minutes: 7,
    summary: "Положение парализованной руки и ноги в постели и в кресле.",
    done: true,
    videoUrl: GUARDIAN_LESSON_VIDEO,
  },
  {
    id: "gl-3",
    title: "Помощь при ходьбе",
    minutes: 6,
    summary: "С какой стороны идти, где держать, когда не идти вовсе.",
    done: false,
    videoUrl: GUARDIAN_LESSON_VIDEO,
  },
  {
    id: "gl-4",
    title: "Кормление при нарушении глотания",
    minutes: 8,
    summary: "Поза, консистенция, признаки поперхивания и что делать.",
    done: false,
    videoUrl: GUARDIAN_LESSON_VIDEO,
  },
  {
    id: "gl-5",
    title: "Профилактика пролежней и падений",
    minutes: 10,
    summary: "График поворотов, осмотр кожи, безопасная квартира.",
    done: false,
    videoUrl: GUARDIAN_LESSON_VIDEO,
  },
  {
    id: "gl-6",
    title: "Общение при афазии",
    minutes: 5,
    summary: "Как спрашивать и сколько ждать ответа. Чего делать не нужно.",
    done: false,
    videoUrl: GUARDIAN_LESSON_VIDEO,
  },
];

export const DEMO_VIDEO_REVIEWS: VideoReview[] = [
  {
    id: "vr-1",
    patientId: "p-2",
    patientName: "Мария Ковалёва",
    exercise: "Равновесие у опоры",
    at: "сегодня, 08:40",
    seconds: 74,
    verdict: null,
    comment: "",
    videoUrl: "https://www.youtube.com/watch?v=oCTAxHgJdW8",
  },
  {
    id: "vr-2",
    patientId: "p-1",
    patientName: "Серик Абдуллаев",
    exercise: "Разработка кисти",
    at: "вчера, 19:05",
    seconds: 126,
    verdict: "partial",
    comment: "Амплитуда меньше, чем вчера. Добавьте разогрев перед подходом.",
    videoUrl: "https://www.youtube.com/watch?v=oCTAxHgJdW8",
  },
  {
    id: "vr-3",
    patientId: "p-3",
    patientName: "Нурлан Естаев",
    exercise: "Ходьба по коридору",
    at: "вчера, 12:20",
    seconds: 95,
    verdict: null,
    comment: "",
    videoUrl: "https://www.youtube.com/watch?v=oCTAxHgJdW8",
  },
];

/** Демо-ролик для отчётов с занятий — тот же, что у упражнений. */
const REPORT_VIDEO = "https://www.youtube.com/watch?v=oCTAxHgJdW8";

export const DEMO_SESSION_REPORTS: SessionReport[] = [
  {
    id: "sr-1",
    kind: "video",
    title: "Занятие ЛФК: равновесие у опоры",
    at: "вчера, 11:20",
    curator: "Индира Жумабекова",
    summary: "Стоял у опоры 3 подхода по 40 секунд, без потери равновесия.",
    details: [
      "Держит вес на обеих ногах, правая нога включается позже левой.",
      "После второго подхода устал — это нормально, отдых 1–2 минуты.",
      "Дальше: добавляем перенос веса с ноги на ногу, только рядом с опорой и под присмотром опекуна.",
    ],
    videoUrl: REPORT_VIDEO,
  },
  {
    id: "sr-2",
    kind: "homework",
    title: "Разбор домашнего задания: разработка кисти",
    at: "2 дня назад",
    curator: "Индира Жумабекова",
    summary: "Амплитуда движений пальцев выросла, захват пока слабый.",
    details: [
      "Все 5 дней выполнены, по видео техника верная.",
      "Перед подходом — разогрев 2 минуты тёплой водой или массажем.",
      "Дальше: мяч средней жёсткости, 10 сжатий × 3 подхода.",
    ],
    videoUrl: REPORT_VIDEO,
  },
  {
    id: "sr-3",
    kind: "week",
    title: "Итоги второй недели курса",
    at: "3 дня назад",
    curator: "Индира Жумабекова",
    summary: "Индекс Бартел вырос с 40 до 55, занимался 6 дней из 7.",
    details: [
      "Практика за неделю: 315 минут при цели 300.",
      "Пропуск в четверг — из-за головокружения, давление в тот день 150/92.",
      "Речевая гимнастика даётся тяжело: снижаем число повторов с 10 до 7.",
      "Следующая переоценка по шкалам — на 15-й день курса.",
    ],
  },
  {
    id: "sr-4",
    kind: "video",
    title: "Занятие с логопедом: речевая гимнастика",
    at: "4 дня назад",
    curator: "Куспанова Айгуль",
    summary: "Артикуляция чётче, чем неделю назад; быстро устаёт.",
    details: [
      "Упражнения перед зеркалом выполняет самостоятельно.",
      "Лучше два коротких подхода по 10 минут, чем один длинный.",
    ],
    videoUrl: REPORT_VIDEO,
  },
  {
    id: "sr-5",
    kind: "week",
    title: "Итоги первой недели курса",
    at: "10 дней назад",
    curator: "Индира Жумабекова",
    summary: "Адаптация прошла спокойно, план выполнен на 80%.",
    details: [
      "Индекс Бартел при поступлении — 25, на 5-й день — 40.",
      "Опекун прошла 2 урока школы: пересаживание и укладки.",
      "Цель второй недели — ходьба по коридору с опорой.",
    ],
  },
];

export const DEMO_PATIENT_DOCUMENTS: PatientDocument[] = [
  {
    id: "pd-1",
    title: "Выписка из стационара",
    issuedBy: "Городская больница №7, неврологическое отделение",
    at: "14 дней назад",
    body: [
      "Диагноз: ишемический инсульт в бассейне левой средней мозговой артерии, правосторонний гемипарез.",
      "Лечение: консервативная терапия, 12 дней в стационаре.",
      "При выписке: ходит с опорой, самообслуживание частично, речь сохранна.",
      "Рекомендовано: реабилитация II–III этапа, аспирин кардио 100 мг, аторвастатин 20 мг, контроль давления.",
    ],
  },
  {
    id: "pd-2",
    title: "Заключение невролога при поступлении на курс",
    issuedBy: "Amare, врач-невролог",
    at: "12 дней назад",
    body: [
      "Шкала Рэнкина — 3, индекс Бартел — 25, шкала NIHSS — 6.",
      "Противопоказаний к активной реабилитации нет.",
      "Цели курса: ходьба без посторонней помощи, самообслуживание в быту.",
    ],
  },
  {
    id: "pd-3",
    title: "План реабилитации на 20 дней",
    issuedBy: "Amare, мультидисциплинарная команда",
    at: "12 дней назад",
    body: [
      "Направления: ЛФК (ходьба и равновесие), эрготерапия (кисть), логопедия (речь).",
      "Нагрузка: 60 минут в день, 5–6 дней в неделю, переоценка на 15-й день.",
      "Куратор: Индира Жумабекова.",
    ],
  },
  {
    id: "pd-4",
    title: "МРТ головного мозга, заключение",
    issuedBy: "Диагностический центр, по направлению стационара",
    at: "16 дней назад",
    body: [
      "Очаг ишемии в левой лобно-теменной области, размер 2,1 × 1,4 см.",
      "Признаков кровоизлияния нет.",
    ],
  },
];

/** История приёмов за последние дни — туда ведёт карточка «Пропущен приём». */
export const DEMO_MED_HISTORY: MedicationLog[] = [
  { id: "mh-1", title: "Аспирин кардио", dose: "100 мг", day: "вчера", planned: "08:00", state: "taken", takenAt: "08:10", critical: true },
  { id: "mh-2", title: "Периндоприл", dose: "5 мг", day: "вчера", planned: "09:00", state: "taken", takenAt: "09:05" },
  { id: "mh-3", title: "Аторвастатин", dose: "20 мг", day: "вчера", planned: "21:00", state: "missed" },
  { id: "mh-4", title: "Аспирин кардио", dose: "100 мг", day: "позавчера", planned: "08:00", state: "late", takenAt: "11:40", critical: true },
  { id: "mh-5", title: "Периндоприл", dose: "5 мг", day: "позавчера", planned: "09:00", state: "taken", takenAt: "09:00" },
  { id: "mh-6", title: "Аторвастатин", dose: "20 мг", day: "позавчера", planned: "21:00", state: "taken", takenAt: "21:15" },
];
