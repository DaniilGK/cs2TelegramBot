import { registerAs } from '@nestjs/config'

export const appConfig = registerAs('app', () => ({
  nodeEnv:  process.env.NODE_ENV ?? 'development',
  port:     parseInt(process.env.PORT ?? '4000', 10),
  url:      process.env.APP_URL ?? 'http://localhost:4000',
  isDev:    (process.env.NODE_ENV ?? 'development') === 'development',
}))

export const dbConfig = registerAs('db', () => ({
  host:     process.env.DB_HOST ?? 'localhost',
  port:     parseInt(process.env.DB_PORT ?? '5432', 10),
  database: process.env.DB_NAME ?? 'rushskins',
  username: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASS ?? 'postgres',
  ssl:      process.env.DB_SSL === 'true',
}))

export const redisConfig = registerAs('redis', () => ({
  host:     process.env.REDIS_HOST ?? 'localhost',
  port:     parseInt(process.env.REDIS_PORT ?? '6379', 10),
  password: process.env.REDIS_PASS ?? undefined,
}))

export const jwtConfig = registerAs('jwt', () => ({
  secret:    process.env.JWT_SECRET ?? 'dev_secret_change_me',
  expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
}))

export const telegramConfig = registerAs('telegram', () => ({
  botToken:      process.env.TELEGRAM_BOT_TOKEN ?? '',
  botSecret:     process.env.TELEGRAM_BOT_SECRET ?? '',
  providerToken: process.env.TELEGRAM_PAYMENT_PROVIDER_TOKEN ?? '',
}))

export const steamConfig = registerAs('steam', () => ({
  apiKey:    process.env.STEAM_API_KEY ?? '',
  returnUrl: process.env.STEAM_RETURN_URL ?? '',
  realm:     process.env.STEAM_REALM ?? '',
}))

export const lisConfig = registerAs('lis', () => ({
  apiKey:       process.env.LIS_API_KEY ?? '',
  baseUrl:      process.env.LIS_API_BASE ?? 'https://lis-skins.ru/api',
  priceCacheTtl: parseInt(process.env.LIS_PRICE_CACHE_TTL ?? '300', 10),
}))

export const cryptoPayConfig = registerAs('cryptopay', () => ({
  token:         process.env.CRYPTOPAY_TOKEN ?? '',
  webhookSecret: process.env.CRYPTOPAY_WEBHOOK_SECRET ?? '',
}))

export const allConfigs = [
  appConfig, dbConfig, redisConfig, jwtConfig,
  telegramConfig, steamConfig, lisConfig, cryptoPayConfig,
]
