# Правила проекта

**Обязательно к прочтению:** `./docs/DEVELOPMENT_RULES.md` — полный свод правил.
Прочитай его перед первой задачей в этом проекте.

Ниже — только то, что нельзя нарушать никогда. Остальное в файле выше.

## Критичное

1. Секреты (ключи, пароли, токены) — только в `.env`. `.env` в `.gitignore`.
   Никогда не писать их в код.
2. Проверять не только вход в систему, но и **владение объектом**:
   может ли этот пользователь работать именно с этой записью.
3. Новый пакет перед установкой проверять: существует ли он, кто автор,
   сколько загрузок.
4. Миграции БД — только файлом, со скриптом отката в комментарии внизу.
   Удаление данных — только с моего явного согласия.
5. Прямые коммиты в `main` запрещены. Ветка на задачу.
6. Не менять то, о чём не просили. Все правки обсуждать до внесения.
7. В существующем проекте стиль проекта важнее наших правил.
   Правила — только для нового кода.

## Общение

- Отвечать на русском, коротко и по существу.
- Объяснять код на уровне блоков. Подробно — там, где деньги,
  доступ, чужие данные и удаление.
- Комментарии и логи — на русском.
- Импорты — в общем блоке вверху файла. Чужие импорты не трогать.

## Плагины

В проекте работают **ECC** и **Impeccable**. Их правила действуют,
но `./docs/DEVELOPMENT_RULES.md` имеет приоритет над ними.
Переопределения ECC (TDD, типы тестов, покрытие) — раздел 1 DEVELOPMENT_RULES.md.

## Окружение

- Код лежит в WSL Ubuntu (`~/projects/Amare`). Команды, включая git, запускать внутри WSL:
  из Windows git отказывается работать с `\\wsl.localhost` (dubious ownership).
- pnpm 12 — через corepack (`packageManager` в корневом `package.json`), shim в `~/.local/bin`.
- Решения и их причины — `docs/DECISIONS.md`. Новое архитектурное решение — запись туда.

## Команды

- `pnpm install` — зависимости. pnpm не ставит релизы моложе `minimumReleaseAge`
  и блокирует install-скрипты (разрешения — `allowBuilds` в `pnpm-workspace.yaml`). Не ослаблять.
- `pnpm lint` / `pnpm typecheck` / `pnpm test` / `pnpm build` — по всему монорепо через turbo.
- Один пакет: `pnpm --filter @amare/api test`. Один файл: `pnpm --filter @amare/api test -- health`.
- `docker compose up -d --wait` — dev-стек (postgres, redis, s3, api, worker); `--watch` — синхронизация `apps/api/src`.
- `docker compose -f compose.yaml -f compose.prod.yaml up -d --build --wait` — prod-стек.
- Проверка: `curl localhost:3000/health` (живость), `curl localhost:3000/health/ready` (postgres, redis, s3).
- Next-приложения в compose не входят: `pnpm --filter @amare/site dev` (site 3001, care 3002, staff 3003).

## Архитектура

- `apps/api` — NestJS, CommonJS, сборка SWC. Один образ `apps/api/Dockerfile` (стадии `dev`/`prod`),
  два процесса: `dist/main.js` (HTTP) и `dist/worker.js` (без HTTP). Сборка образа — из корня репозитория.
- Окружение api валидируется zod при старте (`src/config/env.ts`, токен `ENV`); ошибка называет
  только имена переменных. Новая переменная — в схему, в `x-app-env` compose и в `.env.example`.
- Клиенты postgres (`pg`), redis (`ioredis`), s3 (`@aws-sdk/client-s3`) — глобальные провайдеры
  `InfraModule` по токенам из `infra.tokens.ts`, закрываются при shutdown. ORM не выбран.
- Тесты api — vitest + `unplugin-swc` (метаданные декораторов). В e2e клиенты подменяются через
  `overrideProvider`, реальной сети нет.
- `packages/*` отдают TS-исходники без сборки; Next подключает их через `transpilePackages`.
- `@amare/i18n` — словари по пространствам имён (`messages/{ru,kk}/<namespace>.ts`): русский —
  эталон ключей, казахский частичный с откатом на ru. Серверный перевод — `getT`/`getContent`,
  клиентский — `useT`/`useContent` из `@amare/i18n/react` (словари приносит провайдер, чтобы
  они не уезжали в бандл целиком). Локали и работа с адресом — `@amare/i18n/locales`.
  Новый текст — в словарь, а не в компонент; тесты пакета сторожат паритет ключей.
- Языки сайта живут на разных адресах: русский в корне, казахский под `/kk/` (две группы
  маршрутов `app/(ru)` и `app/(kk)`, реестр страниц — `apps/site/lib/pages.tsx`). Внутренние
  ссылки ставятся через `components/Links.tsx`, прямой `next/link` в `components/` запрещён.
  В кабинетах язык хранится в `localStorage` (`amare:lang`), адрес не меняется — `docs/DECISIONS.md`.
- `apps/site` — публичный сайт, перенесён из набросков `amare-site` 1:1. Страницы — тонкие обёртки
  `app/<путь>/page.tsx` над `components/pages/*`; контакты, цены, маршруты — только `lib/clinic.ts`
  (тест `app/routes.test.ts` проверяет, что у каждого маршрута есть страница). Посетитель всегда гость:
  `/vhod` и `/kabinet/*` редиректят в care (`NEXT_PUBLIC_CARE_URL`). Стиль перенесённых файлов — как в наброске
  (одинарные кавычки, без точек с запятой).
- `apps/care` (пациент, опекун) и `apps/staff` (специалист, отдельно от care и от публичного сайта) —
  кабинеты из наброска, каждый со своим `auth/AuthContext.tsx`+`RequireAuth.tsx` и мок-клиентом
  `lib/mock.ts` (демо-данные без бэкенда, состояние в памяти вкладки, между care и staff не
  синхронизируется — `docs/DECISIONS.md`). Общие компоненты кабинета (`CabinetShell`, `ChatPanel`,
  `AttachmentChip`, `BarthelChart`) — в `packages/ui`; общие типы и демо-данные — в
  `packages/api-client/src/cabinet.ts`.
- Дизайн-токены — только `packages/ui` (`docs/DESIGN_TOKENS.md`): Tailwind v4, стандартная палитра отключена,
  цвета — классы токенов (`bg-deep`, `text-brand`). Цвет меняется в `tokens.css` и `palette.ts` вместе,
  затем `pnpm --filter @amare/ui test` (сверка и контраст). Кегль 18px, контраст — `data-contrast="high"`.
- TypeScript закреплён на 6.0 (typescript-eslint не поддерживает 7). Правило `no-unused-vars` строгое,
  а конфиг линтера защищён хуком — чинить код, не конфиг.
- S3 — Garage single-node: ключ и bucket создаются при старте из `.env`
  (`S3_ACCESS_KEY_ID` = `GK` + 24 hex, секреты — 64 hex).
- CI — `.github/workflows/ci.yml`: lint/typecheck/test, затем prod-стек в compose и curl health.
