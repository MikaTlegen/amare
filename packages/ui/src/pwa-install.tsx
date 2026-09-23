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
 * Общая логика показа установки: событие beforeinstallprompt (Chrome/Edge/
 * Android) или собственная подсказка для Safari iOS, которая это событие
 * никогда не шлёт. Возвращает null, пока установка недоступна или
 * приложение уже установлено — вызывающий компонент в этом случае ничего
 * не рендерит, а не показывает бесполезный клик.
 */
function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(true); // до монтирования на клиенте — не мигаем кнопкой

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

  const available = !installed && (promptEvent !== null || isIos());

  const request = async (): Promise<"prompted" | "ios"> => {
    if (promptEvent) {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setPromptEvent(null);
      return "prompted";
    }
    return "ios";
  };

  return { available, request };
}

function IosHintDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT("ui");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
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
            onClick={onClose}
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
  );
}

/**
 * Кнопка «Установить приложение» — полная, с текстом (мобильное меню сайта).
 */
export function InstallPwaButton({ className }: { className?: string }) {
  const t = useT("ui");
  const { available, request } = useInstallPrompt();
  const [showIosHint, setShowIosHint] = useState(false);

  if (!available) return null;

  const handleClick = async () => {
    if ((await request()) === "ios") setShowIosHint(true);
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

      <IosHintDialog open={showIosHint} onClose={() => setShowIosHint(false)} />
    </>
  );
}

/**
 * Компактный вариант — круглая иконка-бейдж без текста, для нижней
 * навигации сайта (там, где на вкладку «Вход» бейджем крепится установка,
 * а не отдельный слот в сетке из пяти вкладок).
 */
export function InstallPwaBadge({ className }: { className?: string }) {
  const t = useT("ui");
  const { available, request } = useInstallPrompt();
  const [showIosHint, setShowIosHint] = useState(false);

  if (!available) return null;

  const handleClick = async () => {
    if ((await request()) === "ios") setShowIosHint(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void handleClick()}
        aria-label={t("pwa.install")}
        title={t("pwa.install")}
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center rounded-full bg-deep text-white shadow-sm",
          className,
        )}
      >
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <IosHintDialog open={showIosHint} onClose={() => setShowIosHint(false)} />
    </>
  );
}
