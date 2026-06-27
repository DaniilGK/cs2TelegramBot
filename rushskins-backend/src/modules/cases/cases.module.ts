import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CasesController } from './cases.controller'
import { CasesService } from './cases.service'
import { Case } from './entities/case.entity'
import { CaseItem } from './entities/case-item.entity'
import { CaseOpen } from './entities/case-open.entity'
import { User } from '../users/entities/user.entity'
import { Skin } from '../skins/entities/skin.entity'
import { UserInventory } from '../inventory/entities/user-inventory.entity'
import { Transaction } from '../transactions/entities/transaction.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Case,
      CaseItem,
      CaseOpen,
      User,
      Skin,
      UserInventory,
      Transaction,
    ]),
  ],
  controllers: [CasesController],
  providers: [CasesService],
  exports: [CasesService],
})
export class CasesModule {}
