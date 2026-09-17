import { S3Client } from "@aws-sdk/client-s3";
import { Global, Inject, Logger, Module, type OnApplicationShutdown } from "@nestjs/common";
import { Redis } from "ioredis";
import { Pool } from "pg";
import { ENV, type Env } from "../config/env";
import { PG_POOL, REDIS, S3_CLIENT } from "./infra.tokens";

const CONNECT_TIMEOUT_MS = 2_000;

// Клиенты инфраструктуры. Все ленивые: соединение открывается при первом запросе
@Global()
@Module({
  providers: [
    {
      provide: PG_POOL,
      inject: [ENV],
      useFactory: (env: Env) =>
        new Pool({ connectionString: env.DATABASE_URL, connectionTimeoutMillis: CONNECT_TIMEOUT_MS }),
    },
    {
      provide: REDIS,
      inject: [ENV],
      useFactory: (env: Env) =>
        new Redis(env.REDIS_URL, {
          lazyConnect: true,
          maxRetriesPerRequest: 1,
          connectTimeout: CONNECT_TIMEOUT_MS,
        }),
    },
    {
      provide: S3_CLIENT,
      inject: [ENV],
      useFactory: (env: Env) =>
        new S3Client({
          endpoint: env.S3_ENDPOINT,
          region: env.S3_REGION,
          // Garage работает с адресацией вида endpoint/bucket
          forcePathStyle: true,
          credentials: { accessKeyId: env.S3_ACCESS_KEY_ID, secretAccessKey: env.S3_SECRET_ACCESS_KEY },
        }),
    },
  ],
  exports: [PG_POOL, REDIS, S3_CLIENT],
})
export class InfraModule implements OnApplicationShutdown {
  private readonly logger = new Logger(InfraModule.name);

  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    @Inject(REDIS) private readonly redis: Redis,
    @Inject(S3_CLIENT) private readonly s3: S3Client,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    const results = await Promise.allSettled([this.pool.end(), this.redis.quit()]);
    this.s3.destroy();
    for (const result of results) {
      if (result.status === "rejected") {
        this.logger.warn(`Ошибка при закрытии соединения: ${String(result.reason)}`);
      }
    }
  }
}
