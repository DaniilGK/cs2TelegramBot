import type { SkinItem } from '@/store/useAppStore'

// --- Mock data (replace with real LIS-SKINS API calls) ---
export const MOCK_SKINS: SkinItem[] = [
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
  {
    id: 'm4a4-howl',
    name: 'Howl',
    weapon: 'M4A4',
    wear: 'Minimal Wear',
    rarity: 'contraband',
    price: 95000_00,
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NVXgRFZBpHBOaFCEJHJFZdSAi-Bx0HDxFwT--plGxlHxUaa-LzIAVx1v2cJmlD09-ywoK1h6WuZLqHxz9SvJVji7j-pY-liVHvrRJpajH3dockXgcv_5D/360fx360f',
    float: 0.0712,
  },
  {
    id: 'karambit-fade',
    name: 'Fade',
    weapon: 'Karambit',
    wear: 'Factory New',
    rarity: 'covert',
    price: 62000_00,
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NVXgRFZBpHBOaFCEJHJFZdSAi-Bx0HDxFwT--plGxlHxUaa-LzIAFY7ODKcjlD09-ywoKIhfiuZrmAkjhSvZRzj-vEpYqt3QznrEdpNinds2LPdUwuQGEm4A/360fx360f',
    float: 0.0031,
  },
  {
    id: 'glock-fade',
    name: 'Fade',
    weapon: 'Glock-18',
    wear: 'Factory New',
    rarity: 'restricted',
    price: 4800_00,
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NVXgRFZBpHBOaFCEJHJFZdSAi-Bx0HDxFwT--plGxlHxUaa-LzIAVx1v2cJmlD09-ywoK3kPKMZLqHxz9SvJVjlLj-pY-liVHtrFJoMDjx9wKMVlr-4BH9g/360fx360f',
    float: 0.0056,
  },
  {
    id: 'p250-sand-dune',
    name: 'Sand Dune',
    weapon: 'P250',
    wear: 'Field-Tested',
    rarity: 'consumer',
    price: 12_00,
    imageUrl: 'https://community.cloudflare.steamstatic.com/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NVXgRFZBpHBOaFCEJHJFZdSAi-Bx0HDxFwT--plGxlHxUaa-LzIAVx1v2cJmlD09-ywoK0kqWuZeKwjhSuZwr2-uT-LngsVBm-qZp/360fx360f',
    float: 0.3412,
  },
]

// --- LIS-SKINS API client (stub — wire up real endpoints) ---
const LIS_BASE = 'https://lis-skins.ru/api'

export interface LisSkinsItem {
  id:       number
  name:     string
  price:    number
  image:    string
  rarity:   string
  exterior: string
}

export async function fetchMarketItems(params?: {
  search?: string
  minPrice?: number
  maxPrice?: number
  rarity?: string
  limit?: number
  offset?: number
}): Promise<SkinItem[]> {
  // TODO: Replace with real LIS-SKINS API call
  // const query = new URLSearchParams({ ...params, limit: String(params?.limit ?? 20) })
  // const res = await fetch(`${LIS_BASE}/items?${query}`, {
  //   headers: { Authorization: `Bearer ${import.meta.env.VITE_LIS_API_KEY}` }
  // })
  // const data: LisSkinsItem[] = await res.json()
  // return data.map(mapLisItem)

  // Simulated delay + mock data
  await new Promise(r => setTimeout(r, 400))
  let items = [...MOCK_SKINS]
  if (params?.search) {
    const q = params.search.toLowerCase()
    items = items.filter(i => i.name.toLowerCase().includes(q) || i.weapon.toLowerCase().includes(q))
  }
  if (params?.rarity) items = items.filter(i => i.rarity === params.rarity)
  return items
}

export async function purchaseSkin(itemId: string, userId: string): Promise<{ success: boolean; tradeId?: string }> {
  // TODO: Wire up real purchase endpoint + BullMQ job
  await new Promise(r => setTimeout(r, 800))
  return { success: true, tradeId: `trade_${Date.now()}` }
}

// Map LIS-SKINS API shape → our SkinItem
function mapLisItem(item: LisSkinsItem): SkinItem {
  return {
    id:       String(item.id),
    name:     item.name,
    weapon:   item.name.split('|')[0]?.trim() ?? item.name,
    wear:     item.exterior,
    rarity:   (item.rarity.toLowerCase().replace(' ', '') as SkinItem['rarity']),
    price:    Math.round(item.price * 100),
    imageUrl: item.image,
  }
}
