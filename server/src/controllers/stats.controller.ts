import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Inject,
  Query,
  Res,
  ServiceUnavailableException,
} from '@nestjs/common'
import type { Response } from 'express'
import { z } from 'zod'
import { PrismaService } from '../prisma.service'
import { dayKey } from '../srs'

const StatsQuery = z.object({
  bookId: z.string().uuid(),
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

@Controller('/api/stats')
export class StatsController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  async stats(
    @Query() query: unknown,
    @Headers('x-device-id') deviceIdHeader: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const db = this.prisma.isDbReady()
    if (!db.connected) throw new ServiceUnavailableException({ message: '数据库未就绪', db })

    const parsed = StatsQuery.safeParse(query)
    if (!parsed.success) throw new BadRequestException(parsed.error.issues)
    const { bookId } = parsed.data
    const deviceId = ensureDeviceId(deviceIdHeader, res)

    const now = new Date()
    const today = dayKey(now)

    const [todayLog, totalStates, dueCount] = await Promise.all([
      this.prisma.studyLog.findUnique({
        where: { deviceId_bookId_dayKey: { deviceId, bookId, dayKey: today } },
      }),
      this.prisma.deviceWordState.count({ where: { deviceId, bookId } }),
      this.prisma.deviceWordState.count({ where: { deviceId, bookId, dueAt: { lte: now } } }),
    ])

    return {
      deviceId,
      todayKey: today,
      learnedToday: todayLog?.count ?? 0,
      totalTracked: totalStates,
      dueCount,
    }
  }
}

