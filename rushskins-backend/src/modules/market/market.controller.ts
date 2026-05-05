import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { IsOptional, IsString } from 'class-validator'

class MarketQueryDto {
  @IsOptional()
  @IsString()
  search?: string
}

class PurchaseDto {
  @IsString()
  itemId!: string

  @IsString()
  userId!: string
}

type Rarity = 'consumer' | 'industrial' | 'milspec' | 'restricted' | 'classified' | 'covert' | 'contraband'

interface SkinItem {
  id: string
  name: string
  weapon: string
  wear: string
  rarity: Rarity
  price: number
  imageUrl: string
  float?: number
}

const MOCK: SkinItem[] = [
  {
    id: 'awp-dragon-lore',
    name: 'Dragon Lore',
    weapon: 'AWP',
    wear: 'Factory New',
    rarity: 'contraband',
    price: 180000_00,
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NVXgRFZBpHBOaFCEJHJFZdSAi-Bx0HDxFwT--plGxlHxUaa-LzIANfw_aqNmlD09-ywoKJkqauYu-BxjlSvZV0j7j--Y-0ig/360fx360f',
    float: 0.0023,
  },
  {
    id: 'ak47-redline',
    name: 'Redline',
    weapon: 'AK-47',
    wear: 'Field-Tested',
    rarity: 'classified',
    price: 1800_00,
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NVXgRFZBpHBOaFCEJHJFZdSAi-Bx0HDxFwT--plGxlHxUaa-LzIAVx1v2cJmlD09-ywoK0hq-hYmyGxz9SvZVzjbud8d-liVHsrkJpMmH2dockLF-CxA/360fx360f',
    float: 0.2201,
  },
]

@Controller('api/market')
export class MarketController {
  @Get('items')
  list(@Query() query: MarketQueryDto): SkinItem[] {
    const q = (query.search ?? '').trim().toLowerCase()
    if (!q) return MOCK
    return MOCK.filter(i => i.name.toLowerCase().includes(q) || i.weapon.toLowerCase().includes(q))
  }

  @Post('purchase')
  purchase(@Body() body: PurchaseDto) {
    return {
      success: true,
      tradeId: `trade_${Date.now()}`,
      itemId: body.itemId,
      userId: body.userId,
    }
  }
}

