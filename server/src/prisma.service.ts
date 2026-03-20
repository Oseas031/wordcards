import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private connected = false
  private lastError: string | null = null

  async onModuleInit() {
    try {
      await this.$connect()
      this.connected = true
      this.lastError = null
    } catch (e) {
      this.connected = false
      this.lastError = e instanceof Error ? e.message : String(e)
    }
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  isDbReady() {
    return { connected: this.connected, lastError: this.lastError }
  }
}

