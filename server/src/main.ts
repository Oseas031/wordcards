import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  const port = Number(process.env.PORT ?? 3100)
  await app.listen(port)
  // eslint-disable-next-line no-console
  console.log(`后端已启动： http://localhost:${port}`)
}

bootstrap()

