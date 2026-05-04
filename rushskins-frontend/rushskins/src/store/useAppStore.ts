import { create } from 'zustand'

export interface User {
  id: string
  username: string
  steamId?: string
  balance: number        // fiat balance in cents
  coins: number          // internal click-to-earn currency
  energy: number
  maxEnergy: number
  level: number
  xp: number
  avatarUrl?: string
  tradeUrl?: string
}

export interface SkinItem {
  id: string
  name: string
  weapon: string
  wear: string
  rarity: 'consumer' | 'industrial' | 'milspec' | 'restricted' | 'classified' | 'covert' | 'contraband'
  price: number          // in cents
  imageUrl: string
  float?: number
  inInventory?: boolean
}

interface AppState {
  user: User
  marketItems: SkinItem[]
  cartItems: string[]
  activeTab: 'home' | 'market' | 'cases' | 'friends' | 'profile'

  // actions
  tapCoin: () => void
  setActiveTab: (tab: AppState['activeTab']) => void
  addToCart: (id: string) => void
  removeFromCart: (id: string) => void
  setMarketItems: (items: SkinItem[]) => void
  refillEnergy: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  user: {
    id: 'demo-user',
    username: 'Rush_Player',
    balance: 4250_00,       // $4,250.00
    coins: 12_480,
    energy: 340,
    maxEnergy: 500,
    level: 7,
    xp: 2340,
    avatarUrl: undefined,
  },
  marketItems: [],
  cartItems: [],
  activeTab: 'home',

  tapCoin: () => set(state => {
    if (state.user.energy <= 0) return state
    const gain = Math.ceil(state.user.level * 1.5)
    return {
      user: {
        ...state.user,
        coins: state.user.coins + gain,
        energy: Math.max(0, state.user.energy - 1),
      },
    }
  }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  addToCart: (id) => set(state => ({
    cartItems: state.cartItems.includes(id) ? state.cartItems : [...state.cartItems, id],
  })),

  removeFromCart: (id) => set(state => ({
    cartItems: state.cartItems.filter(i => i !== id),
  })),

  setMarketItems: (items) => set({ marketItems: items }),

  refillEnergy: () => set(state => ({
    user: { ...state.user, energy: state.user.maxEnergy },
  })),
}))
