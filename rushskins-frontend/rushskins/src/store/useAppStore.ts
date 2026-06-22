// src/store/useAppStore.ts  — добавлен setUser + реальный тип User

import { create } from 'zustand'

export interface User {
  id: string
  username: string
  bio?: string
  balance: number      // в центах
  coins: number
  energy: number
  maxEnergy: number
  level: number
  xp: number
  avatarUrl?: string
  tradeUrl?: string
  itemsPrivacy?: PrivacyOption
  followersPrivacy?: PrivacyOption
  messagesPrivacy?: PrivacyOption
  showProfilePhoto?: boolean
}

export type PrivacyOption = 'everyone' | 'friends' | 'nobody'

export interface SkinItem {
  id: string
  name: string
  weapon: string
  wear: string
  rarity: 'consumer' | 'industrial' | 'milspec' | 'restricted' | 'classified' | 'covert' | 'contraband'
  price: number
  imageUrl: string
  float?: number
  inInventory?: boolean
}

interface AppState {
  user: User
  marketItems: SkinItem[]
  cartItems: string[]
  activeTab: 'home' | 'market' | 'cases' | 'friends' | 'profile'

  setUser: (user: User) => void                          // ← новый action
  updateUser: (user: Partial<User>) => void
  tapCoin: () => void
  setActiveTab: (tab: AppState['activeTab']) => void
  addToCart: (id: string) => void
  removeFromCart: (id: string) => void
  setMarketItems: (items: SkinItem[]) => void
  refillEnergy: () => void
  addBalance: (amountCents: number) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  user: {
    id:       'demo-user',
    username: '',
    balance:  0,
    coins:    0,
    energy:   500,
    maxEnergy: 500,
    level:    1,
    xp:       0,
    itemsPrivacy: 'everyone',
    followersPrivacy: 'everyone',
    messagesPrivacy: 'everyone',
    showProfilePhoto: true,
  },
  marketItems: [],
  cartItems:   [],
  activeTab:   'home',

  // ─── Загружаем реального пользователя из бэкенда ────────────────────────
  setUser: (user) => set(state => ({ user: { ...state.user, ...user } })),
  updateUser: (user) => set(state => ({ user: { ...state.user, ...user } })),

  tapCoin: () => set(state => {
    if (state.user.energy <= 0) return state
    const gain = Math.ceil(state.user.level * 1.5)
    return {
      user: {
        ...state.user,
        coins:  state.user.coins + gain,
        energy: Math.max(0, state.user.energy - 1),
      },
    }
  }),

  setActiveTab:    (tab)   => set({ activeTab: tab }),
  addToCart:       (id)    => set(s => ({ cartItems: s.cartItems.includes(id) ? s.cartItems : [...s.cartItems, id] })),
  removeFromCart:  (id)    => set(s => ({ cartItems: s.cartItems.filter(i => i !== id) })),
  setMarketItems:  (items) => set({ marketItems: items }),
  refillEnergy:    ()      => set(s => ({ user: { ...s.user, energy: s.user.maxEnergy } })),
  addBalance:      (amt)   => set(s => ({ user: { ...s.user, balance: s.user.balance + amt } })),
}))
