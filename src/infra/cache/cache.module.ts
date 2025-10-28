import { Module } from "@nestjs/common"
import { EnvService } from "../env/env.service"
import { EnvModule } from "../env/env.module"

@Module({
  imports: [EnvModule],
  providers: [EnvService],
})
export class CacheModule {}
