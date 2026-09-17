import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { WorkerModule } from "./worker/worker.module";

const logger = new Logger("WorkerBootstrap");

async function bootstrap(): Promise<void> {
  // Контекст приложения без HTTP-сервера
  const app = await NestFactory.createApplicationContext(WorkerModule);
  app.enableShutdownHooks();
}

bootstrap().catch((error: unknown) => {
  logger.error("Не удалось запустить worker", error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
