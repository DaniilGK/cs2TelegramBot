import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const port = config.get<number>('app.port') ?? 4000

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'http://localhost:3000',
      'https://daniilgk.github.io',
    ],
    credentials: true,
  })

  await app.listen(port)
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`)
}

bootstrap()
