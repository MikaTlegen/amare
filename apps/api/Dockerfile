# syntax=docker/dockerfile:1
# Один образ для api и worker. Сборка из корня репозитория:
#   docker build -f apps/api/Dockerfile .

FROM node:24-alpine AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    TURBO_TELEMETRY_DISABLED=1
RUN corepack enable pnpm
WORKDIR /repo

# Урезаем монорепо до api и его зависимостей
FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@2.10.13 prune @amare/api --docker

# Зависимости ставятся отдельным слоем: кешируются, пока не меняется lock-файл
FROM base AS deps
COPY --from=pruner /repo/out/json/ .
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store pnpm install --frozen-lockfile

# Разработка: nest --watch, исходники синхронизирует docker compose watch
FROM deps AS dev
COPY --from=pruner /repo/out/full/ .
RUN chown -R node:node apps/api
USER node
WORKDIR /repo/apps/api
# nest запускается напрямую: pnpm перед скриптом проверяет зависимости и пытается их переустановить
CMD ["./node_modules/.bin/nest", "start", "--watch"]

FROM deps AS build
COPY --from=pruner /repo/out/full/ .
RUN pnpm --filter @amare/api build \
 && pnpm --filter @amare/api deploy --prod /prod

# Рабочий образ: только собранный код и прод-зависимости, без исходников и dev-пакетов
FROM node:24-alpine AS prod
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /prod/ ./
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
