'use client'

import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { SendHorizontal, Paperclip } from 'lucide-react'
import { formatSize, detectKind, type Message } from '@amare/api-client'
import { AttachmentChip } from './attachment-chip'
import { cn } from './cn'

/** Ограничения выбора файлов. Сервер обязан проверить их заново. */
const MAX_FILES = 5
const MAX_BYTES = 25 * 1024 * 1024

export interface ChatApi {
  getMessages: () => Promise<Message[]>
  sendMessage: (text: string, files: File[]) => Promise<Message[]>
}

/**
 * Чат с куратором или пациентом.
 *
 * Без «прочитано», статусов набора и прочей мессенджерной машинерии:
 * здесь важно, чтобы пожилой человек понял, кто написал и что ответить.
 *
 * Вложения. Родственники присылают выписки, снимки и видео с домашних
 * занятий — это основной способ получить документы, поэтому кнопка
 * скрепки стоит прямо в поле ввода. Всё присланное автоматически
 * попадает в документы пациента: специалист не должен листать переписку,
 * чтобы найти выписку.
 *
 * `api` приходит пропом (не импортируется напрямую): компонент общий
 * для чата пациента с куратором (care) и чата специалиста с конкретным
 * пациентом (staff) — у них разный доступ к данным.
 *
 * Проверки размера и количества здесь — только для удобства. Настоящую
 * проверку типа, размера и содержимого делает сервер: клиентскую обойти
 * тривиально.
 */
export function ChatPanel({ api, readOnly = false }: { api: ChatApi; readOnly?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void api.getMessages().then(setMessages)
  }, [api])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [messages])

  const pick = (event: ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(event.target.files ?? [])
    const next = [...files, ...chosen].slice(0, MAX_FILES)
    const tooBig = next.find((f) => f.size > MAX_BYTES)

    if (tooBig) {
      setError(`Файл «${tooBig.name}» больше 25 МБ. Видео лучше сжать или загрузить частями.`)
    } else if (files.length + chosen.length > MAX_FILES) {
      setError(`За раз можно приложить не больше ${MAX_FILES} файлов.`)
    } else {
      setError(null)
    }

    setFiles(next.filter((f) => f.size <= MAX_BYTES))
    // Сбрасываем input, иначе повторный выбор того же файла не сработает
    if (inputRef.current) inputRef.current.value = ''
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const value = text.trim()
    if (!value && files.length === 0) return

    setSending(true)
    setMessages(await api.sendMessage(value || 'Файл во вложении', files))
    setText('')
    setFiles([])
    setError(null)
    setSending(false)
  }

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-4 sm:p-6">
      <ul className="flex max-h-[min(26rem,60dvh)] flex-col gap-3 overflow-y-auto overscroll-contain">
        {messages.map((message) => {
          const mine = message.author === 'me'
          return (
            <li
              key={message.id}
              className={cn('flex flex-col gap-1', mine ? 'items-end' : 'items-start')}
            >
              <span className="text-sm text-muted">
                {message.authorName} · {message.at}
              </span>

              <div
                className={cn(
                  'flex max-w-[40em] flex-col gap-2.5 rounded-2xl px-5 py-3.5',
                  mine ? 'bg-deep text-white' : 'bg-bg text-ink',
                )}
              >
                <p className="m-0 text-base leading-relaxed">{message.text}</p>

                {message.attachments && message.attachments.length > 0 && (
                  <ul className="flex flex-col gap-2">
                    {message.attachments.map((attachment) => (
                      <li key={attachment.id} className="flex">
                        <AttachmentChip attachment={attachment} onDark={mine} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          )
        })}
        <div ref={endRef} />
      </ul>

      {!readOnly && (
        <form onSubmit={submit} className="flex flex-col gap-3">
          {files.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {files.map((file, i) => (
                <li key={`${file.name}-${i}`} className="max-w-full">
                  <AttachmentChip
                    attachment={{
                      name: file.name,
                      kind: detectKind(file),
                      size: formatSize(file.size),
                    }}
                    onRemove={() => setFiles(files.filter((_, index) => index !== i))}
                  />
                </li>
              ))}
            </ul>
          )}

          {error && (
            <p className="m-0 rounded-xl border border-accent bg-[rgb(253,238,237)] px-4 py-3 text-base">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="chat-input" className="sr-only">
              Сообщение
            </label>
            <input
              id="chat-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Напишите сообщение…"
              className="min-h-[3.2rem] flex-1 rounded-xl border-[1.5px] border-line bg-bg px-4 py-3 text-base"
            />

            <input
              ref={inputRef}
              id="chat-files"
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={pick}
              className="sr-only"
            />
            <label
              htmlFor="chat-files"
              className="inline-flex min-h-[3.2rem] cursor-pointer items-center justify-center gap-2 rounded-xl border-[1.5px] border-line px-5 py-3 text-base font-medium"
            >
              <Paperclip className="h-5 w-5 text-brand" aria-hidden="true" />
              Файл
            </label>

            <button
              type="submit"
              disabled={sending || (!text.trim() && files.length === 0)}
              className="inline-flex min-h-[3.2rem] items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-base font-semibold text-accent-ink disabled:opacity-50"
            >
              <SendHorizontal className="h-5 w-5" aria-hidden="true" />
              Отправить
            </button>
          </div>

          <p className="m-0 text-sm leading-relaxed text-muted">
            Выписки, снимки и видео с занятий сразу попадут в документы пациента. До {MAX_FILES}{' '}
            файлов, каждый не больше 25 МБ.
          </p>
        </form>
      )}

      <p className="m-0 text-base leading-relaxed text-muted">
        Чат работает в рабочее время. Если стало резко хуже — не пишите, а звоните в скорую по 103.
      </p>
    </div>
  )
}
