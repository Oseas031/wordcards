import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Controller('/api/books')
export class BooksController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  async listBooks() {
    const db = this.prisma.isDbReady()
    if (!db.connected) throw new ServiceUnavailableException({ message: '数据库未就绪', db })

    const books = await this.prisma.book.findMany({
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { words: true } } },
    })
    return books.map((b: { id: string; code: string; name: string; _count: { words: number } }) => ({
      id: b.id,
      code: b.code,
      name: b.name,
      wordCount: b._count.words,
    }))
  }
}

