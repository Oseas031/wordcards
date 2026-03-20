import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
  Query,
  ServiceUnavailableException,
} from '@nestjs/common'
import { z } from 'zod'
import { PrismaService } from '../prisma.service'

const ListQuery = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(2000).optional(),
  offset: z.coerce.number().int().min(0).optional(),
})

@Controller('/api/books/:bookId/words')
export class WordsController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  async list(@Param('bookId') bookId: string, @Query() query: unknown) {
    const db = this.prisma.isDbReady()
    if (!db.connected) throw new ServiceUnavailableException({ message: '数据库未就绪', db })

    const parsed = ListQuery.safeParse(query)
    if (!parsed.success) throw new BadRequestException(parsed.error.issues)
    const { q, limit = 20, offset = 0 } = parsed.data

    const s = q?.trim()
    const where = s
      ? {
          bookId,
          OR: [
            { wordKey: { contains: s.toLowerCase() } },
            { meaning: { contains: s, mode: 'insensitive' as const } },
            { example: { contains: s, mode: 'insensitive' as const } },
          ],
        }
      : { bookId }

    const [total, items] = await Promise.all([
      this.prisma.word.count({ where }),
      this.prisma.word.findMany({
        where,
        orderBy: { wordKey: 'asc' },
        take: limit,
        skip: offset,
      }),
    ])

    return {
      total,
      limit,
      offset,
      items: items.map((w: { id: string; word: string; phonetic: string | null; meaning: string; example: string | null }) => ({
        id: w.id,
        word: w.word,
        phonetic: w.phonetic,
        meaning: w.meaning,
        example: w.example,
      })),
    }
  }
}

