"use client";

import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import { useT } from "@amare/i18n/react";
import { cn } from "./cn";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // Safari iOS не поддерживает display-mode media query для PWA — свой флаг
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/**
 * Регистрирует service worker приложения. Нужен, чтобы браузер посчитал
 * сайт устанавливаемым (частью критериев installability) — офлайн-режим
 * не задача, см. комментарий в public/sw.js.
 */
export function RegisterServiceWorker({ swUrl }: { swUrl: string }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register(swUrl).catch(() => {
        // Установка PWA — удобство, а не обязательное условие работы сайта:
        // если браузер не поддерживает SW, страница остаётся рабочей
      });
    }
  }, [swUrl]);

  return null;
}

/**
 * Кнопка «Установить приложение» рядом с пунктом «Вход» в мобильном меню.
 *
 * Chrome/Edge/Android отдают событие beforeinstallprompt — им показываем
 * системный диалог установки. Safari на iOS это событие никогда не шлёт:
 * там своя короткая инструкция «Поделиться → На экран Домой».
 * Если приложение уже установлено (standalone) или платформа не поддерживает
 * ни то, ни другое — кнопка не рендерится, а не показывает бесполезный клик.
 */
export function InstallPwaButton({ className }: { className?: string }) {
  const t = useT("ui");
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [installed, setInstalled] = useState(true); // до монтирования на клиенте — не мигаем кнопкой
  const iosDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setInstalled(isStandalone());

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    const dialog = iosDialogRef.current;
    if (!dialog) return;
    if (showIosHint && !dialog.open) dialog.showModal();
    if (!showIosHint && dialog.open) dialog.close();
  }, [showIosHint]);

  if (installed) return null;
  if (!promptEvent && !isIos()) return null;

  const handleClick = async () => {
    if (promptEvent) {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setPromptEvent(null);
      return;
    }
    setShowIosHint(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void handleClick()}
        className={cn(
          "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] border-deep px-5 py-3.5 text-base font-semibold text-deep",
          className,
        )}
      >
        <Download className="h-5 w-5" aria-hidden="true" />
        {t("pwa.install")}
      </button>

      <dialog
        ref={iosDialogRef}
        onClose={() => setShowIosHint(false)}
        aria-label={t("pwa.iosTitle")}
        className="m-auto w-[min(26rem,92vw)] rounded-3xl border border-line bg-bg p-0 text-ink backdrop:bg-ink/60"
      >
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="m-0 font-display text-xl font-semibold tracking-[-0.03em]">
              {t("pwa.iosTitle")}
            </h2>
            <button
              type="button"
              onClick={() => setShowIosHint(false)}
              aria-label={t("pwa.close")}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <ol className="m-0 flex list-decimal flex-col gap-2 pl-5 text-base leading-relaxed">
            <li>{t("pwa.iosStep1")}</li>
            <li>{t("pwa.iosStep2")}</li>
            <li>{t("pwa.iosStep3")}</li>
          </ol>
        </div>
      </dialog>
    </>
  );
}
