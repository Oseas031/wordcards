import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { BooksController } from './controllers/books.controller'
import { StudyController } from './controllers/study.controller'
import { StatsController } from './controllers/stats.controller'
import { WordsController } from './controllers/words.controller'
import { HealthController } from './controllers/health.controller'

@Module({
  controllers: [
    HealthController,
    BooksController,
    WordsController,
    StudyController,
    StatsController,
  ],
  providers: [PrismaService],
})
export class AppModule {}

