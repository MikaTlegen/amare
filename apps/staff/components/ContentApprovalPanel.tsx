"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, ClipboardCheck, Undo2 } from "lucide-react"
import { useT } from "@amare/i18n/react"
import { decideContent, getContentReviews, type ContentReviewItem } from "@/lib/mock"

/**
 * Медицинская проверка контента куратором.
 *
 * У каждого материала — поле комментария: «вернуть» без объяснения
 * бесполезно, автор не узнает, что исправлять. Поэтому возврат без
 * комментария недоступен, а утверждение комментарий допускает, но
 * не требует (например, «на старте — только с опекуном»).
 */
export function ContentApprovalPanel() {
  const t = useT("staff")
  const [items, setItems] = useState<ContentReviewItem[]>([])
  const [comments, setComments] = useState<Record<string, string>>({})
  const [message, setMessage] = useState("")

  useEffect(() => { void getContentReviews().then(setItems) }, [])

  const pending = items.filter((item) => item.status === "На проверке")
  const decided = items.filter((item) => item.status !== "На проверке")

  const decide = async (id: string, status: "Утверждён" | "Возвращён") => {
    setItems(await decideContent(id, status, comments[id] ?? ""))
    setComments((current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== id)))
    setMessage(status === "Утверждён" ? "Материал утверждён и теперь доступен для использования в курсах." : "Материал возвращён модератору в черновики.")
  }

  return (
    <div className="grid gap-4 sm:gap-5">
      <section className="rounded-3xl border border-line bg-surface p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <ClipboardCheck className="mt-1 h-6 w-6 shrink-0 text-brand" aria-hidden="true" />
          <div>
            <h2 className="m-0 font-display text-xl font-medium sm:text-2xl">Медицинская проверка контента</h2>
            <p className="mb-0 mt-1 text-base text-muted">Только врач-куратор проверяет медицинскую корректность. Администратор не участвует в утверждении.</p>
          </div>
        </div>

        {message && <p className="mb-0 mt-5 rounded-2xl bg-tint px-4 py-3 text-base text-deep">{message}</p>}

        <div className="mt-5 grid gap-3">
          {pending.length === 0 ? (
            <p className="m-0 text-muted">Материалов на проверке нет.</p>
          ) : (
            pending.map((item) => {
              const comment = comments[item.id] ?? ""
              const canReturn = comment.trim().length > 0
              const fieldId = `content-comment-${item.id}`
              return (
                <article key={item.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-bg p-4">
                  <div>
                    <strong>{item.name} {item.version}</strong>
                    <p className="mb-0 mt-1 text-base text-muted">{item.kind} · автор: {item.author}</p>
                    <p className="mb-0 mt-1 text-base text-muted">{item.note}</p>
                  </div>

                  <label htmlFor={fieldId} className="flex flex-col gap-1.5 text-base font-medium">
                    {t("content.comment")}
                    <textarea
                      id={fieldId}
                      rows={2}
                      value={comment}
                      onChange={(event) => setComments({ ...comments, [item.id]: event.target.value })}
                      placeholder={t("content.commentPlaceholder")}
                      className="rounded-xl border-[1.5px] border-line bg-surface px-4 py-3 text-base font-normal"
                    />
                  </label>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void decide(item.id, "Возвращён")}
                      disabled={!canReturn}
                      aria-describedby={canReturn ? undefined : `${fieldId}-hint`}
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-line px-4 py-2 text-base font-semibold disabled:opacity-50 sm:flex-none"
                    >
                      <Undo2 className="h-4 w-4" aria-hidden="true" />
                      Вернуть
                    </button>
                    <button
                      type="button"
                      onClick={() => void decide(item.id, "Утверждён")}
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-deep px-4 py-2 text-base font-semibold text-white sm:flex-none"
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Утвердить
                    </button>
                  </div>
                  {!canReturn && <p id={`${fieldId}-hint`} className="m-0 text-base text-muted">{t("content.commentRequired")}</p>}
                </article>
              )
            })
          )}
        </div>
      </section>

      {decided.length > 0 && (
        <section className="rounded-3xl border border-line bg-surface p-4 sm:p-6">
          <h2 className="m-0 font-display text-xl font-medium">Принятые решения</h2>
          <div className="mt-4 grid gap-2">
            {decided.map((item) => (
              <div key={item.id} className="flex flex-col gap-1 rounded-2xl bg-bg p-3 text-base">
                <p className="m-0"><strong>{item.name} {item.version}</strong> — {item.status}</p>
                {item.comment && <p className="m-0 text-muted">{t("content.commentShown", { text: item.comment })}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
