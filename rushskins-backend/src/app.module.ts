// src/app.module.ts

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { allConfigs } from './config'
import { User } from './modules/users/entities/user.entity'
import { AuthModule } from './modules/auth/auth.module'
import { MarketModule } from './modules/market/market.module'
import { PaymentsModule } from './modules/payments/payments.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: allConfigs,
    }),

    // ─── PostgreSQL через TypeORM ──────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type:        'postgres',
        host:        config.get<string>('db.host'),
        port:        config.get<number>('db.port'),
        database:    config.get<string>('db.database'),
        username:    config.get<string>('db.username'),
        password:    config.get<string>('db.password'),
        ssl:         config.get<boolean>('db.ssl')
                       ? { rejectUnauthorized: false }
                       : false,
        entities:    [User],
        synchronize: config.get<string>('app.nodeEnv') === 'development',
        logging:     config.get<string>('app.nodeEnv') === 'development',
      }),
    }),

    AuthModule,
    MarketModule,
    PaymentsModule,
  ],
})
export class AppModule {}
