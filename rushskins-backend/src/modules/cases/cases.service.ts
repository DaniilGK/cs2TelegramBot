import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Case } from './entities/case.entity'
import { CaseItem } from './entities/case-item.entity'
import { CaseOpen } from './entities/case-open.entity'
import { Skin, SkinRarity } from '../skins/entities/skin.entity'
import { User } from '../users/entities/user.entity'
import { InventoryStatus, UserInventory } from '../inventory/entities/user-inventory.entity'
import {
  Transaction,
  TransactionCurrency,
  TransactionType,
} from '../transactions/entities/transaction.entity'

export interface CaseOpenResult {
  skin: Skin
  ticketsEarned: number
}

@Injectable()
export class CasesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Case)
    private readonly cases: Repository<Case>,
    @InjectRepository(CaseItem)
    private readonly caseItems: Repository<CaseItem>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  getAllCases(): Promise<Case[]> {
    return this.cases.find({
      where: { isActive: true },
      order: { price: 'ASC' },
    })
  }

  async getCaseWithItems(caseId: string) {
    const caseEntity = await this.cases.findOne({
      where: { id: caseId },
    })

    if (!caseEntity) throw new NotFoundException('Кейс не найден')

    const items = await this.caseItems.find({
      where: { caseId },
      relations: { skin: true },
      order: { dropWeight: 'DESC' },
    })

    return {
      ...caseEntity,
      items,
    }
  }

  async openCase(userId: string, caseId: string, quantity: number): Promise<CaseOpenResult[]> {
    const normalizedQuantity = Number(quantity)
    if (!Number.isInteger(normalizedQuantity) || normalizedQuantity < 1 || normalizedQuantity > 10) {
      throw new BadRequestException('quantity must be between 1 and 10')
    }

    const caseEntity = await this.cases.findOne({
      where: { id: caseId, isActive: true },
    })
    if (!caseEntity) throw new NotFoundException('Кейс не найден')

    const items = await this.caseItems.find({
      where: { caseId },
      relations: { skin: true },
    })
    if (items.length === 0) throw new BadRequestException('В кейсе нет скинов')

    const totalPrice = Number(caseEntity.price) * normalizedQuantity

    return this.dataSource.transaction(async manager => {
      const user = await manager.getRepository(User).findOne({ where: { id: userId } })
      if (!user) throw new NotFoundException('Пользователь не найден')

      const currentCoins = Number(user.coins)
      if (currentCoins < totalPrice) throw new BadRequestException('Недостаточно RC')

      const results: CaseOpenResult[] = []
      let totalTickets = 0

      for (let i = 0; i < normalizedQuantity; i += 1) {
        const selectedItem = this.pickWeightedItem(items)
        const ticketsEarned = this.calculateTickets(caseEntity.price, selectedItem.skin.rarity)

        await manager.getRepository(UserInventory).save({
          userId,
          skinId: selectedItem.skinId,
          status: InventoryStatus.HELD,
          soldForRc: null,
        })

        await manager.getRepository(CaseOpen).save({
          userId,
          caseId,
          skinId: selectedItem.skinId,
          ticketsEarned,
        })

        await manager.getRepository(Transaction).save([
          {
            userId,
            type: TransactionType.SPEND,
            currency: TransactionCurrency.RC,
            amount: caseEntity.price,
            description: `Opened ${caseEntity.name}`,
          },
          {
            userId,
            type: TransactionType.TICKETS_EARN,
            currency: TransactionCurrency.TICKETS,
            amount: ticketsEarned,
            description: `Tickets from ${caseEntity.name}`,
          },
        ])

        totalTickets += ticketsEarned
        results.push({
          skin: selectedItem.skin,
          ticketsEarned,
        })
      }

      user.coins = currentCoins - totalPrice
      user.tickets = Number(user.tickets) + totalTickets
      await manager.getRepository(User).save(user)

      return results
    })
  }

  private pickWeightedItem(items: CaseItem[]): CaseItem {
    const totalWeight = items.reduce((sum, item) => sum + Number(item.dropWeight), 0)
    if (totalWeight <= 0) throw new BadRequestException('Некорректные веса дропа')

    let roll = Math.random() * totalWeight
    for (const item of items) {
      roll -= Number(item.dropWeight)
      if (roll <= 0) return item
    }

    return items[items.length - 1]
  }

  private calculateTickets(casePrice: number, rarity: SkinRarity): number {
    let tickets = 1
    if (casePrice >= 500) {
      tickets = 10
    } else if (casePrice >= 100) {
      tickets = 3
    }

    if (rarity === SkinRarity.CLASSIFIED) tickets += 5
    if (rarity === SkinRarity.COVERT) tickets += 20

    return tickets
  }
}
