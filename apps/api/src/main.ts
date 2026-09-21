import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { ENV, type Env } from "./config/env";

const logger = new Logger("Bootstrap");

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.disable("x-powered-by");
  // Корректно закрываем соединения при SIGTERM от Docker
  app.enableShutdownHooks();

  const env = app.get<Env>(ENV);
  // Заявки уходят с другого адреса (сайт и кабинеты), поэтому список origin-ов явный
  app.enableCors({
    origin: env.SITE_ORIGINS.split(",").map((origin) => origin.trim()),
    methods: ["GET", "POST"],
  });

  await app.listen(env.PORT, "0.0.0.0");
  logger.log(`API запущен на порту ${env.PORT}`);
}

bootstrap().catch((error: unknown) => {
  logger.error("Не удалось запустить API", error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
