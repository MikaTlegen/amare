"use client"

import { useState } from "react"
import { Archive, BookOpen, ClipboardCheck, Plus, Send, Undo2, Wrench } from "lucide-react"
import { useT } from "@amare/i18n/react"

type View = "library" | "review" | "archive"
type Status = "draft" | "review" | "approved" | "archived"
type Template = { id: string; title: string; version: string; days: number; exercises: number; status: Status; comment?: string }
type Exercise = { id: string; title: string; direction: string; difficulty: string; duration: string; languages: string; guardian: boolean }

const initialTemplates: Template[] = [
  { id: "t-1", title: "Восстановление ходьбы", version: "v1.2", days: 14, exercises: 18, status: "approved" },
  { id: "t-2", title: "Речь и глотание", version: "v1.0", days: 14, exercises: 14, status: "review" },
  { id: "t-3", title: "Комплексный курс", version: "v1.1", days: 20, exercises: 24, status: "draft" },
  { id: "t-4", title: "Восстановление ходьбы", version: "v1.1", days: 14, exercises: 16, status: "archived" },
]

export function ModeratorContentPanel({ view }: { view: View }) {
  const t = useT("staff")
  const [templates, setTemplates] = useState(initialTemplates)
  const [exercises, setExercises] = useState<Exercise[]>([{ id: "e-1", title: "Перенос веса стоя", direction: "Ходьба и равновесие", difficulty: "Начальный", duration: "10 мин", languages: "Русский, қазақша", guardian: true }])
  const [message, setMessage] = useState("")
  const shown = templates.filter((item) => view === "review" ? item.status === "review" : view === "archive" ? item.status === "archived" : item.status !== "archived")

  if (view !== "library") {
    const Icon = view === "review" ? ClipboardCheck : Archive
    const title = view === "review" ? "Материалы на проверке" : "Архив версий"
    return <section className="max-w-4xl rounded-3xl border border-line bg-surface p-4 sm:p-6"><div className="flex items-center gap-3"><Icon className="h-6 w-6 text-brand" /><div><h2 className="m-0 font-display text-2xl font-medium">{title}</h2><p className="mb-0 mt-1 text-base text-muted">{view === "review" ? "Версии ожидают решения врача. До утверждения их нельзя назначить пациенту." : "Архивные версии сохранены для истории и не изменяются."}</p></div></div><div className="mt-5 grid gap-3">{shown.map((item) => <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-bg p-4"><div><strong>{item.title} {item.version}</strong><p className="mb-0 mt-1 text-sm text-muted">{item.days} дней · {item.exercises} упражнений</p></div>{view === "review" && <ReturnToDraft id={item.id} onReturn={(comment) => { setTemplates(templates.map((entry) => entry.id === item.id ? { ...entry, status: "draft", comment } : entry)); setMessage(`Материал возвращён в черновики. ${t("content.commentShown", { text: comment })}`) }} />}</article>)}</div>{message && <p className="mb-0 mt-5 rounded-2xl bg-tint px-4 py-3 text-sm text-deep">{message}</p>}</section>
  }

  return <div className="grid gap-5 xl:grid-cols-12">
    <ExerciseForm onSave={(exercise) => { setExercises([{ ...exercise, id: `e-${Date.now()}` }, ...exercises]); setMessage("Упражнение сохранено в библиотеке как черновик.") }} />
    <TemplateForm exerciseCount={exercises.length} onSave={(template) => { setTemplates([{ ...template, id: `t-${Date.now()}` }, ...templates]); setMessage("Шаблон сохранён как черновик и недоступен для назначения.") }} />
    {message && <p className="xl:col-span-12 m-0 rounded-2xl bg-tint px-5 py-4 text-base text-deep">{message}</p>}
    <section className="rounded-3xl border border-line bg-surface p-4 sm:p-6 xl:col-span-12"><div className="mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5 text-brand" /><h2 className="m-0 font-display text-xl font-medium">Библиотека упражнений</h2></div><div className="grid gap-3 md:grid-cols-2">{exercises.map((item) => <article key={item.id} className="rounded-2xl border border-line bg-bg p-4"><strong>{item.title}</strong><p className="mb-0 mt-1 text-sm text-muted">{item.direction} · {item.difficulty} · {item.duration}</p><p className="mb-0 mt-1 text-sm text-muted">Языки: {item.languages}{item.guardian ? " · нужен опекун" : ""}</p></article>)}</div></section>
    <section className="rounded-3xl border border-line bg-surface p-4 sm:p-6 xl:col-span-12"><h2 className="m-0 font-display text-xl font-medium">Шаблоны курсов и версии</h2><p className="mb-4 mt-1 text-sm text-muted">Изменение утверждённого шаблона создаёт новую версию, исходная остаётся неизменной.</p><div className="grid gap-3">{shown.map((item) => <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-bg p-4"><div><strong>{item.title} {item.version}</strong><p className="mb-0 mt-1 text-sm text-muted">{item.days} дней · {item.exercises} упражнений</p></div><div className="flex items-center gap-2"><span className="rounded-full bg-tint px-3 py-1 text-sm">{item.status === "draft" ? "Черновик" : item.status === "review" ? "На проверке" : "Утверждён"}</span>{item.status === "draft" && <button type="button" onClick={() => { setTemplates(templates.map((entry) => entry.id === item.id ? { ...entry, status: "review" } : entry)); setMessage("Версия отправлена врачу на медицинскую проверку.") }} className="rounded-xl bg-deep px-4 py-2 text-sm font-semibold text-white"><Send className="mr-1 inline h-4 w-4" />На проверку</button>}{item.status === "approved" && <button type="button" onClick={() => { setTemplates([{ ...item, id: `t-${Date.now()}`, version: `v${(Number(item.version.slice(1)) + 0.1).toFixed(1)}`, status: "draft" }, ...templates]); setMessage("Создана новая черновая версия. Утверждённая версия не изменена.") }} className="rounded-xl border border-line px-4 py-2 text-sm font-semibold">Новая версия</button>}</div></article>)}</div></section>
  </div>
}

function ExerciseForm({ onSave }: { onSave: (exercise: Omit<Exercise, "id">) => void }) {
  const [form, setForm] = useState<Omit<Exercise, "id">>({ title: "", direction: "", difficulty: "Начальный", duration: "", languages: "Русский", guardian: false })
  return <form onSubmit={(event) => { event.preventDefault(); if (!form.title) return; onSave(form); setForm({ ...form, title: "", direction: "", duration: "" }) }} className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-4 sm:p-6 xl:col-span-5"><div className="flex items-center gap-2"><Wrench className="h-5 w-5 text-brand" /><h2 className="m-0 font-display text-xl font-medium">Новое упражнение</h2></div><Field label="Название" value={form.title} onChange={(title) => setForm({ ...form, title })} required /><Field label="Направление реабилитации" value={form.direction} onChange={(direction) => setForm({ ...form, direction })} /><div className="grid gap-3 sm:grid-cols-2"><Field label="Сложность" value={form.difficulty} onChange={(difficulty) => setForm({ ...form, difficulty })} /><Field label="Длительность" value={form.duration} onChange={(duration) => setForm({ ...form, duration })} /></div><Field label="Языковые версии" value={form.languages} onChange={(languages) => setForm({ ...form, languages })} /><label className="flex min-h-12 items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5" checked={form.guardian} onChange={(event) => setForm({ ...form, guardian: event.target.checked })} />Требуется присутствие опекуна</label><button className="rounded-xl bg-deep px-5 py-3 font-semibold text-white">Сохранить черновик</button></form>
}

function TemplateForm({ exerciseCount, onSave }: { exerciseCount: number; onSave: (template: Omit<Template, "id">) => void }) {
  const [title, setTitle] = useState("")
  const [days, setDays] = useState("14")
  return <form onSubmit={(event) => { event.preventDefault(); if (!title) return; onSave({ title, version: "v1.0", days: Number(days) || 14, exercises: exerciseCount, status: "draft" }); setTitle("") }} className="flex flex-col gap-3 rounded-3xl border border-line bg-surface p-4 sm:p-6 xl:col-span-7"><div className="flex items-center gap-2"><Plus className="h-5 w-5 text-brand" /><h2 className="m-0 font-display text-xl font-medium">Конструктор шаблона</h2></div><p className="m-0 text-sm text-muted">Программа → курс → неделя → день → сессия → упражнение. Новый шаблон создаётся черновиком.</p><Field label="Название программы / курса" value={title} onChange={setTitle} required /><Field label="Количество дней" value={days} onChange={setDays} /><div className="rounded-2xl bg-bg p-4 text-sm">В состав войдут упражнения из библиотеки: {exerciseCount}. Дни, сессии и упражнения можно копировать и менять в следующем шаге конструктора.</div><button className="rounded-xl bg-deep px-5 py-3 font-semibold text-white">Создать черновик</button></form>
}

/**
 * Возврат версии в черновик — только с комментарием: без него автор
 * не узнает, что исправлять, и пришлёт на проверку то же самое.
 */
function ReturnToDraft({ id, onReturn }: { id: string; onReturn: (comment: string) => void }) {
  const t = useT("staff")
  const [comment, setComment] = useState("")
  const fieldId = `return-comment-${id}`
  const ready = comment.trim().length > 0
  return <div className="flex w-full flex-col gap-2"><label htmlFor={fieldId} className="flex flex-col gap-1.5 text-base font-medium">{t("content.comment")}<textarea id={fieldId} rows={2} value={comment} onChange={(event) => setComment(event.target.value)} placeholder={t("content.commentPlaceholder")} className="rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-base font-normal" /></label><button type="button" disabled={!ready} onClick={() => onReturn(comment.trim())} className="inline-flex min-h-11 w-fit items-center gap-1.5 rounded-xl border-[1.5px] border-line px-4 py-2 text-base font-semibold disabled:opacity-50"><Undo2 className="h-4 w-4" aria-hidden="true" />Вернуть в черновик</button>{!ready && <p className="m-0 text-base text-muted">{t("content.commentRequired")}</p>}</div>
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) { return <label className="flex flex-col gap-1.5 text-sm font-medium">{label}<input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 rounded-xl border border-line bg-bg px-3 py-2 text-base font-normal" /></label> }
