import 'reflect-metadata'
import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
dotenv.config()

export const AppDataSource = new DataSource({
  type:        'postgres',
  host:        process.env.DB_HOST     ?? 'localhost',
  port:        parseInt(process.env.DB_PORT ?? '5432', 10),
  database:    process.env.DB_NAME     ?? 'rushskins',
  username:    process.env.DB_USER     ?? 'postgres',
  password:    process.env.DB_PASS     ?? 'postgres',
  ssl:         process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities:    ['src/**/*.entity.ts'],
  migrations:  ['src/database/migrations/*.ts'],
  synchronize: false,
  logging:     process.env.NODE_ENV === 'development',
})
