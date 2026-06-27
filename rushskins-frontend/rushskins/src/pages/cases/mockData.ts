export const MOCK_CASES = [
  { id: '1', name: 'Starter Case', imageUrl: '', price: 50, isActive: true },
  { id: '2', name: 'Fire Case', imageUrl: '', price: 150, isActive: true },
  { id: '3', name: 'Elite Case', imageUrl: '', price: 500, isActive: true },
  { id: '4', name: 'Knife Case', imageUrl: '', price: 1000, isActive: true },
  { id: '5', name: 'Premium Case', imageUrl: '', price: 2500, isActive: true },
] as const

export const RARITY_COLORS = {
  consumer:   { bg: '#B0C3D9', glow: 'rgba(176,195,217,0.3)' },
  industrial: { bg: '#5E98D9', glow: 'rgba(94,152,217,0.3)' },
  milspec:    { bg: '#4B69FF', glow: 'rgba(75,105,255,0.3)' },
  restricted: { bg: '#8847FF', glow: 'rgba(136,71,255,0.3)' },
  classified: { bg: '#D32CE6', glow: 'rgba(211,44,230,0.3)' },
  covert:     { bg: '#EB4B4B', glow: 'rgba(235,75,75,0.3)' },
  contraband: { bg: '#E4AE39', glow: 'rgba(228,174,57,0.3)' },
} as const

export type SkinRarity = keyof typeof RARITY_COLORS

export interface MockSkin {
  id: string
  name: string
  skin: string
  wear: string
  rarity: SkinRarity
  price: number
}

export const MOCK_SKINS: MockSkin[] = [
  { id: '1', name: 'AK-47', skin: 'Redline', wear: 'Field-Tested', rarity: 'restricted', price: 1250 },
  { id: '2', name: 'AWP', skin: 'Asiimov', wear: 'Field-Tested', rarity: 'classified', price: 9500 },
  { id: '3', name: 'M4A4', skin: 'Howl', wear: 'Minimal Wear', rarity: 'contraband', price: 89000 },
  { id: '4', name: 'Glock-18', skin: 'Fade', wear: 'Factory New', rarity: 'classified', price: 4500 },
  { id: '5', name: 'USP-S', skin: 'Orion', wear: 'Factory New', rarity: 'covert', price: 8200 },
  { id: '6', name: 'Desert Eagle', skin: 'Blaze', wear: 'Factory New', rarity: 'covert', price: 6700 },
  { id: '7', name: 'AK-47', skin: 'Vulcan', wear: 'Minimal Wear', rarity: 'classified', price: 2800 },
  { id: '8', name: 'M4A1-S', skin: 'Hyper Beast', wear: 'Field-Tested', rarity: 'restricted', price: 1800 },
  { id: '9', name: 'Karambit', skin: 'Doppler', wear: 'Factory New', rarity: 'contraband', price: 123000 },
  { id: '10', name: 'AWP', skin: 'Dragon Lore', wear: 'Factory New', rarity: 'contraband', price: 182300 },
  { id: '11', name: 'P250', skin: 'Sand Dune', wear: 'Battle-Scarred', rarity: 'consumer', price: 30 },
  { id: '12', name: 'Famas', skin: 'Crypsis', wear: 'Field-Tested', rarity: 'milspec', price: 120 },
  { id: '13', name: 'MP7', skin: 'Skulls', wear: 'Minimal Wear', rarity: 'industrial', price: 80 },
  { id: '14', name: 'SSG 08', skin: 'Blood in the Water', wear: 'Factory New', rarity: 'covert', price: 15000 },
  { id: '15', name: 'Five-SeveN', skin: 'Flame Test', wear: 'Field-Tested', rarity: 'milspec', price: 200 },
  { id: '16', name: 'CZ75-Auto', skin: 'Emerald Quartz', wear: 'Minimal Wear', rarity: 'restricted', price: 800 },
  { id: '17', name: 'Butterfly Knife', skin: 'Marble Fade', wear: 'Factory New', rarity: 'contraband', price: 95000 },
  { id: '18', name: 'MP9', skin: 'Hot Rod', wear: 'Factory New', rarity: 'classified', price: 3200 },
  { id: '19', name: 'Nova', skin: 'Antique', wear: 'Well-Worn', rarity: 'consumer', price: 25 },
  { id: '20', name: 'SG 553', skin: 'Cyrex', wear: 'Factory New', rarity: 'restricted', price: 950 },
]

export function getTicketsEarned(casePrice: number, rarity: SkinRarity): number {
  let tickets = 1
  if (casePrice >= 500) {
    tickets = 10
  } else if (casePrice >= 100) {
    tickets = 3
  }

  if (rarity === 'classified') tickets += 5
  if (rarity === 'covert') tickets += 20

  return tickets
}
