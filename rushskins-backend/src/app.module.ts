import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { allConfigs } from './config'
import { MarketModule } from './modules/market/market.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: allConfigs,
    }),
    MarketModule,
  ],
})
export class AppModule {}

