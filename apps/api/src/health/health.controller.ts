import { Controller, Get } from "@nestjs/common";
import { HealthCheck, type HealthCheckResult, HealthCheckService } from "@nestjs/terminus";
import { DependenciesHealthIndicator } from "./dependencies.health";

@Controller("health")
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly dependencies: DependenciesHealthIndicator,
  ) {}

  // Живость процесса: зависимости не проверяются, иначе Docker перезапускал бы API при сбое БД
  @Get()
  live(): { status: "ok" } {
    return { status: "ok" };
  }

  // Готовность принимать трафик: postgres, redis и s3 должны отвечать
  @Get("ready")
  @HealthCheck()
  ready(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.dependencies.postgres(),
      () => this.dependencies.redisPing(),
      () => this.dependencies.s3Bucket(),
    ]);
  }
}
