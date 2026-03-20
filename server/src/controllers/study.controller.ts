import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  Query,
  Res,
  ServiceUnavailableException,
} from '@nestjs/common'
import type { Response } from 'express'
import { z } from 'zod'
import { PrismaService } from '../prisma.service'
import { 计算下一次复习, dayKey, 初始化复习状态, type 记忆反馈 } from '../srs'

const NextQuery = z.object({
  bookId: z.string().uuid(),
  mode: z.enum(['study', 'review']).optional(),
})

const FeedbackBody = z.object({
  bookId: z.string().uuid(),
  wordId: z.string().uuid(),
  rating: z.string(),
})

function ensureDeviceId(deviceId: string | undefined, res: Response): string {
  const id = (deviceId ?? '').trim()
  if (id) return id
  const generated =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `dev_${Math.random().toString(16).slice(2)}_${Date.now()}`
  res.setHeader('x-device-id', generated)
  return generated
}

@Controller('/api/study')
export class StudyController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get('/next')
  async next(
    @Query() query: unknown,
    @Headers('x-device-id') deviceIdHeader: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const db = this.prisma.isDbReady()
    if (!db.connected) throw new ServiceUnavailableException({ message: '数据库未就绪', db })

    const parsed = NextQuery.safeParse(query)
    if (!parsed.success) throw new BadRequestException(parsed.error.issues)
    const { bookId, mode } = parsed.data
    const deviceId = ensureDeviceId(deviceIdHeader, res)

    const now = new Date()

    const due = await this.prisma.deviceWordState.findFirst({
      where: { deviceId, bookId, dueAt: { lte: now } },
      orderBy: { dueAt: 'asc' },
      include: { word: true },
    })
    if (due) {
      return {
        deviceId,
        mode: 'review',
        word: {
          id: due.word.id,
          word: due.word.word,
          phonetic: due.word.phonetic,
          meaning: due.word.meaning,
          example: due.word.example,
        },
        state: {
          intervalDay: due.intervalDay,
          ease: due.ease,
          dueAt: due.dueAt,
          reviews: due.reviews,
          streak: due.streak,
        },
      }
    }

    const randomWord = await this.prisma.word.findFirst({
      where: { 
        bookId,
        NOT: {
          states: {
            some: { deviceId }
          }
        }
      },
      orderBy: { createdAt: 'asc' },
    })
    if (!randomWord) throw new BadRequestException('词库为空')

    const state = 初始化复习状态(now)
    return {
      deviceId,
      mode: mode === 'review' ? 'review' : 'study',
      word: {
        id: randomWord.id,
        word: randomWord.word,
        phonetic: randomWord.phonetic,
        meaning: randomWord.meaning,
        example: randomWord.example,
      },
      state,
    }
  }

  @Post('/feedback')
  async feedback(
    @Headers('x-device-id') deviceIdHeader: string | undefined,
    @Res({ passthrough: true }) res: Response,
    @Body() body: unknown,
  ) {
    const db = this.prisma.isDbReady()
    if (!db.connected) throw new ServiceUnavailableException({ message: '数据库未就绪', db })

    const parsed = FeedbackBody.safeParse(body)
    if (!parsed.success) throw new BadRequestException(parsed.error.issues)
    const { bookId, wordId, rating } = parsed.data
    
    const deviceId = ensureDeviceId(deviceIdHeader, res)

    const now = new Date()
    const current = await this.prisma.deviceWordState.findUnique({
      where: { deviceId_wordId: { deviceId, wordId } },
    })

    const next = 计算下一次复习(
      current
        ? {
            intervalDay: current.intervalDay,
            ease: current.ease,
            dueAt: current.dueAt,
            reviewedAt: current.reviewedAt ?? undefined,
            streak: current.streak,
            reviews: current.reviews,
          }
        : 初始化复习状态(now),
      rating as 记忆反馈,
      now,
    )

    const upserted = await this.prisma.deviceWordState.upsert({
      where: { deviceId_wordId: { deviceId, wordId } },
      create: {
        deviceId,
        wordId,
        bookId,
        intervalDay: next.intervalDay,
        ease: next.ease,
        dueAt: next.dueAt,
        reviewedAt: next.reviewedAt,
        streak: next.streak,
        reviews: next.reviews,
      },
      update: {
        bookId,
        intervalDay: next.intervalDay,
        ease: next.ease,
        dueAt: next.dueAt,
        reviewedAt: next.reviewedAt,
        streak: next.streak,
        reviews: next.reviews,
      },
    })

    const dk = dayKey(now)
    await this.prisma.studyLog.upsert({
      where: { deviceId_bookId_dayKey: { deviceId, bookId, dayKey: dk } },
      create: { deviceId, bookId, dayKey: dk, count: 1 },
      update: { count: { increment: 1 } },
    })

    return {
      deviceId,
      saved: {
        wordId: upserted.wordId,
        dueAt: upserted.dueAt,
        intervalDay: upserted.intervalDay,
        ease: upserted.ease,
        streak: upserted.streak,
        reviews: upserted.reviews,
      },
    }
  }
}

