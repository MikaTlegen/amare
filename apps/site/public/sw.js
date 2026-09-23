// Service worker сайта. Задача — не офлайн-режим (контент курса без сети
// пациенту не нужен), а установка PWA: часть браузеров требует активный SW
// с обработчиком fetch, чтобы показать предложение "Установить".
//
// Стратегия — network-first с попутным кешем: свежий контент важнее
// офлайн-доступа, а кеш просто подстраховывает на нестабильной сети.
//
// self и caches — глобальные объекты ServiceWorkerGlobalScope, а не codegen
// и не опечатка; файл выполняется вне TS-проекта, без общего eslint globals.
/* global self, caches */
const CACHE = "amare-site-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Только собственные GET-запросы: чужие домены (виджет CRM, видео) не кешируем
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});
