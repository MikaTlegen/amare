"use client";

import { useEffect } from "react";
import { LOGO_VIEW_BOX, MARK_RED, MARK_TEAL, OUTLINE_PATH, RED_CLIP_PATH, TEAL_LOOP_PATH } from "./logo";

const FAVICON_ID = "amare-spinning-favicon";
/** Марка стоит на месте 5 секунд, затем один быстрый оборот, и снова стоит. */
const HOLD_MS = 5000;
const SPIN_MS = 700;
const CYCLE_MS = HOLD_MS + SPIN_MS;
const FRAME_INTERVAL_MS = 50;
const CANVAS_SIZE = 64;

/**
 * Поворот вокруг вертикальной оси (как у настенной вывески) рисуем сжатием
 * по горизонтали (scaleX = cos(угол)): 1 — марка анфас, 0 — ребром,
 * -1 — зеркально развёрнута на пол-оборота. Высота не меняется.
 */
function drawFrame(ctx: CanvasRenderingContext2D, scaleX: number): void {
  const { minX, minY, width, height } = LOGO_VIEW_BOX;
  const scale = CANVAS_SIZE / Math.max(width, height);
  const cx = minX + width / 2;
  const cy = minY + height / 2;

  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.save();
  ctx.translate(CANVAS_SIZE / 2, CANVAS_SIZE / 2);
  ctx.scale(scaleX, 1);
  ctx.scale(scale, scale);
  ctx.translate(-cx, -cy);

  const base = new Path2D(OUTLINE_PATH);

  ctx.save();
  ctx.clip(new Path2D(RED_CLIP_PATH), "evenodd");
  ctx.fillStyle = MARK_RED;
  ctx.fill(base, "evenodd");
  ctx.restore();

  ctx.save();
  ctx.clip(new Path2D(TEAL_LOOP_PATH));
  ctx.fillStyle = MARK_TEAL;
  ctx.fill(base, "evenodd");
  ctx.restore();

  ctx.restore();
}

/**
 * Возвращает наш тег фавиконки, держа его последним среди иконок документа.
 *
 * Чужие теги больше не удаляются. Раньше здесь на каждом кадре вызывался
 * `link[rel="icon"]:not(#id)` → `el.remove()`, и под нож попадал тег, который
 * Next рисует из app/icon.svg. Этим узлом владеет React: при следующем
 * клиентском переходе он пытался удалить уже удалённый узел, падал внутри
 * commitDeletionEffectsOnFiber («Cannot read properties of null (reading
 * 'removeChild')») и обрывал коммит на середине. Снаружи это выглядело так:
 * адрес сменился, содержимое осталось прежним, а меню после этого не
 * открывалось до перезагрузки.
 *
 * Мигания это не вернёт: браузер берёт последнюю иконку в документе, поэтому
 * достаточно переставлять наш тег в конец, когда чужой оказался ниже.
 * Перестановка собственного узла React не трогает.
 */
function claimFaviconLink(): HTMLLinkElement {
  let link = document.getElementById(FAVICON_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = FAVICON_ID;
    link.rel = "icon";
    link.type = "image/png";
    document.head.appendChild(link);
    return link;
  }

  const ours = link;
  const outranked = [...document.querySelectorAll('link[rel="icon"]')].some(
    (el) =>
      el !== ours &&
      Boolean(ours.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING),
  );
  if (outranked || !ours.isConnected) document.head.appendChild(ours);

  return ours;
}

/**
 * Марка клиники во вкладке браузера: стоит 5 секунд, затем один быстрый
 * оборот вокруг вертикальной оси, и снова стоит. Ставится один раз в
 * корневом layout приложения. Останавливается, пока вкладка не активна.
 */
export function SpinningFavicon(): null {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameTimer: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      const link = claimFaviconLink();
      const t = Date.now() % CYCLE_MS;
      const angle = t < HOLD_MS ? 0 : ((t - HOLD_MS) / SPIN_MS) * Math.PI * 2;
      drawFrame(ctx, Math.cos(angle));
      link.href = canvas.toDataURL("image/png");
    };

    const start = () => {
      if (frameTimer) return;
      tick();
      frameTimer = setInterval(tick, FRAME_INTERVAL_MS);
    };
    const stop = () => {
      if (frameTimer) {
        clearInterval(frameTimer);
        frameTimer = null;
      }
    };
    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}
