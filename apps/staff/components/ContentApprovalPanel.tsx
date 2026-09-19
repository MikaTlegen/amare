"use client"

import { useState } from "react"
import { CheckCircle2, ClipboardCheck, Undo2 } from "lucide-react"

type Item = { id: string; name: string; version: string; kind: string; author: string; note: string; status: "На проверке" | "Утверждён" | "Возвращён" }

export function ContentApprovalPanel() {
  const [items, setItems] = useState<Item[]>([
    { id: "c-1", name: "Речь и глотание", version: "v1.0", kind: "Шаблон курса", author: "Алия Турсунова", note: "14 дней, 14 упражнений", status: "На проверке" },
    { id: "c-2", name: "Перенос веса стоя", version: "v1.0", kind: "Упражнение", author: "Алия Турсунова", note: "Начальный уровень, требуется опекун", status: "На проверке" },
  ])
  const [message, setMessage] = useState("")
  const pending = items.filter((item) => item.status === "На проверке")
  const decided = items.filter((item) => item.status !== "На проверке")
  const decide = (id: string, status: Item["status"]) => { setItems(items.map((item) => item.id === id ? { ...item, status } : item)); setMessage(status === "Утверждён" ? "Материал утверждён и теперь доступен для использования в курсах." : "Материал возвращён модератору в черновики.") }
  return <div className="grid gap-5"><section className="rounded-3xl border border-line bg-surface p-6"><div className="flex items-start gap-3"><ClipboardCheck className="mt-1 h-6 w-6 text-brand" /><div><h2 className="m-0 font-display text-2xl font-medium">Медицинская проверка контента</h2><p className="mb-0 mt-1 text-base text-muted">Только врач-куратор проверяет медицинскую корректность. Администратор не участвует в утверждении.</p></div></div>{message && <p className="mb-0 mt-5 rounded-2xl bg-tint px-4 py-3 text-sm text-deep">{message}</p>}<div className="mt-5 grid gap-3">{pending.length === 0 ? <p className="m-0 text-muted">Материалов на проверке нет.</p> : pending.map((item) => <article key={item.id} className="rounded-2xl border border-line bg-bg p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><strong>{item.name} {item.version}</strong><p className="mb-0 mt-1 text-sm text-muted">{item.kind} · автор: {item.author}</p><p className="mb-0 mt-1 text-sm text-muted">{item.note}</p></div><div className="flex w-full flex-wrap gap-2 sm:w-auto"><button type="button" onClick={() => decide(item.id, "Возвращён")} className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-line px-4 py-2 text-sm font-semibold sm:w-auto"><Undo2 className="mr-1 inline h-4 w-4" />Вернуть</button><button type="button" onClick={() => decide(item.id, "Утверждён")} className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-deep px-4 py-2 text-sm font-semibold text-white sm:w-auto"><CheckCircle2 className="mr-1 inline h-4 w-4" />Утвердить</button></div></div></article>)}</div></section>{decided.length > 0 && <section className="rounded-3xl border border-line bg-surface p-6"><h2 className="m-0 font-display text-xl font-medium">Принятые решения</h2><div className="mt-4 grid gap-2">{decided.map((item) => <p key={item.id} className="m-0 rounded-2xl bg-bg p-3 text-sm"><strong>{item.name} {item.version}</strong> — {item.status}</p>)}</div></section>}</div>
}
