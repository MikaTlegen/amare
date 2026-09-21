import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { HealthModule } from "./health/health.module";
import { InfraModule } from "./infra/infra.module";
import { LeadsModule } from "./leads/leads.module";

@Module({
  imports: [ConfigModule, InfraModule, HealthModule, LeadsModule],
})
export class AppModule {}
