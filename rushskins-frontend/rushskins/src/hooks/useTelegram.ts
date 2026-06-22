// src/hooks/useTelegram.ts
// Добавлена авторизация: при старте шлём initData на бэкенд, получаем JWT

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/+$/, '')

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}

interface UseTelegramReturn {
  tgUser: TelegramUser | null
  isTelegram: boolean
  isAuthReady: boolean          // true когда JWT получен и юзер загружен
  haptic: (type?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
  openInvoice: (invoiceLink: string) => Promise<'paid' | 'cancelled' | 'failed' | 'pending'>
  expand: () => void
  close: () => void
}

export function useTelegram(): UseTelegramReturn {
  const [tgUser, setTgUser]       = useState<TelegramUser | null>(null)
  const [isAuthReady, setAuthReady] = useState(false)

  const { setUser } = useAppStore()
  const tg = (window as any).Telegram?.WebApp

  useEffect(() => {
    if (!tg) {
      setAuthReady(true)   // в браузере без Telegram — продолжаем с demo
      return
    }

    tg.ready()
    tg.expand()
    tg.setHeaderColor('#0A0A0C')
    tg.setBackgroundColor('#0A0A0C')

    const user = tg.initDataUnsafe?.user
    if (user) setTgUser(user)

    // Авторизация: шлём initData на бэкенд
    const initData = tg.initData
    if (initData && API_BASE) {
      fetch(`${API_BASE}/api/auth/telegram`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ initData }),
      })
        .then(r => r.json())
        .then(({ token, user: dbUser }) => {
          if (token) {
            localStorage.setItem('rushskins_token', token)
            // Обновляем store реальными данными из БД
            setUser({
              id:          dbUser.id,
              username:    dbUser.username ?? dbUser.firstName ?? 'Player',
              balance:     dbUser.balanceCents,
              coins:       dbUser.coins,
              energy:      dbUser.energy,
              maxEnergy:   dbUser.maxEnergy,
              level:       dbUser.level,
              xp:          dbUser.xp,
              avatarUrl:   dbUser.avatarUrl,
              tradeUrl:    dbUser.tradeUrl,
            })
          }
        })
        .catch(err => console.error('Auth error:', err))
        .finally(() => setAuthReady(true))
    } else {
      setAuthReady(true)
    }
  }, [])

  const haptic = (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
    tg?.HapticFeedback?.impactOccurred(type)
  }

  const openInvoice = (invoiceLink: string) =>
    new Promise<'paid' | 'cancelled' | 'failed' | 'pending'>((resolve) => {
      if (!tg?.openInvoice) {
        window.open(invoiceLink, '_blank', 'noopener,noreferrer')
        resolve('pending')
        return
      }
      tg.openInvoice(invoiceLink, (status: 'paid' | 'cancelled' | 'failed' | 'pending') => {
        resolve(status)
      })
    })

  return {
    tgUser,
    isTelegram: !!tg,
    isAuthReady,
    haptic,
    openInvoice,
    expand: () => tg?.expand(),
    close:  () => tg?.close(),
  }
}
