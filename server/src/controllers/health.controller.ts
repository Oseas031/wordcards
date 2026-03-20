import { Controller, Get, Inject } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Controller('/api/health')
export class HealthController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  health() {
    const db = this.prisma.isDbReady()
    return {
      ok: true,
      db,
      hint:
        db.connected
          ? undefined
          : '数据库未就绪：请先启动 PostgreSQL（端口 5432）并执行 prisma:migrate + db:seed',
    }
  }
}

