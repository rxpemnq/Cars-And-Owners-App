import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import { createSessionConfig } from './libs/cookie/sessiondb.config'
import { CustomSessionStore } from './libs/cookie/session-store'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const customSessionStore = app.get(CustomSessionStore)

  app.use(cookieParser())
  app.use(session(createSessionConfig(customSessionStore)))

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0')
  console.log(`Application is running on: ${await app.getUrl()}`)
}
void bootstrap()
