# syntax=docker/dockerfile:1
# Один Dockerfile для Next-приложений (site, care, staff). Сборка из корня репозитория:
#   docker build -f apps/web.Dockerfile --build-arg APP=site --build-arg PORT=3001 -t amare-site .
# NEXT_PUBLIC_CARE_URL, NEXT_PUBLIC_STAFF_URL и NEXT_PUBLIC_SITE_URL вшиваются при сборке:
# редиректы сайта в кабинеты, общий вход в care со ссылками в рабочее место, обратная ссылка
# из staff и возврат из кабинетов на главную. Адреса публичные, не секрет.

FROM node:24-alpine AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    TURBO_TELEMETRY_DISABLED=1 \
    NEXT_TELEMETRY_DISABLED=1
RUN corepack enable pnpm
WORKDIR /repo

# Урезаем монорепо до выбранного приложения и его зависимостей
FROM base AS pruner
ARG APP
COPY . .
RUN pnpm dlx turbo@2.10.13 prune @amare/${APP} --docker

# Зависимости ставятся отдельным слоем: кешируются, пока не меняется lock-файл
FROM base AS deps
COPY --from=pruner /repo/out/json/ .
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS build
ARG APP
ARG NEXT_PUBLIC_CARE_URL=http://localhost:3002
ENV NEXT_PUBLIC_CARE_URL=${NEXT_PUBLIC_CARE_URL}
ARG NEXT_PUBLIC_STAFF_URL=http://localhost:3003
ENV NEXT_PUBLIC_STAFF_URL=${NEXT_PUBLIC_STAFF_URL}
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3001
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
COPY --from=pruner /repo/out/full/ .
# turbo prune не переносит корневой tsconfig, а tsconfig приложений на него ссылаются
COPY --from=pruner /repo/tsconfig.base.json ./
# .next лежит в .gitignore и в deploy не попадает, поэтому копируем его явно
RUN pnpm --filter @amare/${APP} build \
 && pnpm --filter @amare/${APP} deploy --prod /prod \
 && cp -r apps/${APP}/.next /prod/.next

# Рабочий образ: собранное приложение и прод-зависимости, без исходников и dev-пакетов
FROM node:24-alpine AS prod
ARG PORT
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=${PORT}
WORKDIR /app
COPY --from=build /prod/ ./
USER node
EXPOSE ${PORT}
# Порт берётся из переменной PORT; next слушает 0.0.0.0
CMD ["./node_modules/.bin/next", "start"]
