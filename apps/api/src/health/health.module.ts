import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { DependenciesHealthIndicator } from "./dependencies.health";
import { HealthController } from "./health.controller";

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [DependenciesHealthIndicator],
})
export class HealthModule {}
