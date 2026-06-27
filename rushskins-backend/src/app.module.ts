// src/app.module.ts

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { allConfigs } from './config'
import { User } from './modules/users/entities/user.entity'
import { Skin } from './modules/skins/entities/skin.entity'
import { Case } from './modules/cases/entities/case.entity'
import { CaseItem } from './modules/cases/entities/case-item.entity'
import { CaseOpen } from './modules/cases/entities/case-open.entity'
import { UserInventory } from './modules/inventory/entities/user-inventory.entity'
import { Transaction } from './modules/transactions/entities/transaction.entity'
import { Raffle } from './modules/raffles/entities/raffle.entity'
import { RaffleEntry } from './modules/raffles/entities/raffle-entry.entity'
import { Season } from './modules/leaderboard/entities/season.entity'
import { SeasonScore } from './modules/leaderboard/entities/season-score.entity'
import { AuthModule } from './modules/auth/auth.module'
import { MarketModule } from './modules/market/market.module'
import { PaymentsModule } from './modules/payments/payments.module'
import { CasesModule } from './modules/cases/cases.module'

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
        entities:    [
          User,
          Skin,
          Case,
          CaseItem,
          CaseOpen,
          UserInventory,
          Transaction,
          Raffle,
          RaffleEntry,
          Season,
          SeasonScore,
        ],
        synchronize: true,
        logging:     config.get<string>('app.nodeEnv') === 'development',
      }),
    }),

    AuthModule,
    MarketModule,
    PaymentsModule,
    CasesModule,
  ],
})
export class AppModule {}
