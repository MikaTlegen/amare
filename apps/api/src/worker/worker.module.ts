import { Module } from "@nestjs/common";
import { ConfigModule } from "../config/config.module";
import { InfraModule } from "../infra/infra.module";
import { WorkerService } from "./worker.service";

@Module({
  imports: [ConfigModule, InfraModule],
  providers: [WorkerService],
})
export class WorkerModule {}
