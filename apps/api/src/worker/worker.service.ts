import { Inject, Injectable, Logger, type OnApplicationBootstrap } from "@nestjs/common";
import type { Redis } from "ioredis";
import { REDIS } from "../infra/infra.tokens";

// Заготовка фонового процесса. Очереди задач подключаются отдельной задачей
@Injectable()
export class WorkerService implements OnApplicationBootstrap {
  private readonly logger = new Logger(WorkerService.name);

  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async onApplicationBootstrap(): Promise<void> {
    // Открытое соединение с Redis держит процесс живым до SIGTERM
    await this.redis.ping();
    this.logger.log("Worker запущен, Redis доступен");
  }
}
