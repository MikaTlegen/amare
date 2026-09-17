import { HeadBucketCommand, type S3Client } from "@aws-sdk/client-s3";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { type HealthIndicatorResult, HealthIndicatorService } from "@nestjs/terminus";
import type { Redis } from "ioredis";
import type { Pool } from "pg";
import { ENV, type Env } from "../config/env";
import { PG_POOL, REDIS, S3_CLIENT } from "../infra/infra.tokens";

const PROBE_TIMEOUT_MS = 2_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Таймаут ${ms} мс`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// Проверки готовности зависимостей для /health/ready
@Injectable()
export class DependenciesHealthIndicator {
  private readonly logger = new Logger(DependenciesHealthIndicator.name);

  constructor(
    private readonly indicators: HealthIndicatorService,
    @Inject(ENV) private readonly env: Env,
    @Inject(PG_POOL) private readonly pool: Pool,
    @Inject(REDIS) private readonly redis: Redis,
    @Inject(S3_CLIENT) private readonly s3: S3Client,
  ) {}

  postgres(): Promise<HealthIndicatorResult> {
    return this.probe("postgres", () => this.pool.query("SELECT 1"));
  }

  redisPing(): Promise<HealthIndicatorResult> {
    return this.probe("redis", () => this.redis.ping());
  }

  s3Bucket(): Promise<HealthIndicatorResult> {
    return this.probe("s3", () => this.s3.send(new HeadBucketCommand({ Bucket: this.env.S3_BUCKET })));
  }

  private async probe(key: string, run: () => Promise<unknown>): Promise<HealthIndicatorResult> {
    const indicator = this.indicators.check(key);
    try {
      await withTimeout(run(), PROBE_TIMEOUT_MS);
      return indicator.up();
    } catch (error) {
      // Подробности — только в лог сервера; наружу не отдаём адреса и тексты ошибок
      this.logger.warn(`Зависимость ${key} недоступна: ${error instanceof Error ? error.message : String(error)}`);
      return indicator.down({ message: "unavailable" });
    }
  }
}
