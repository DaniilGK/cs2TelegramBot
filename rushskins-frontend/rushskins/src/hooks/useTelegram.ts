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

interface BackendUser {
  id: string
  username?: string
  firstName?: string
  balanceCents?: number
  coins?: number
  energy?: number
  maxEnergy?: number
  level?: number
  xp?: number
  avatarUrl?: string
  tradeUrl?: string
}

interface TelegramAuthResponse {
  token?: string
  accessToken?: string
  user?: BackendUser
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
    // Временный debug — показываем статус на экране
    const debugDiv = document.createElement('div')
    debugDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:red;color:white;font-size:12px;padding:4px;word-break:break-all'
    debugDiv.textContent = `API:${API_BASE} | initData:${initData ? 'YES(' + initData.length + ')' : 'NO'}`
    document.body.appendChild(debugDiv)

    if (initData && API_BASE) {
      console.log('initData:', initData)
      fetch(`${API_BASE}/api/auth/telegram`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ initData }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const message = await res.text()
            throw new Error(message || `Telegram auth failed: ${res.status}`)
          }
          return res.json() as Promise<TelegramAuthResponse>
        })
        .then(({ token, accessToken, user: dbUser }) => {
          console.log('auth response:', { token, user: dbUser })
          const jwt = token ?? accessToken
          if (!jwt || !dbUser) return

          localStorage.setItem('rushskins_token', jwt)
          setUser({
            id:        dbUser.id,
            username:  dbUser.username ?? dbUser.firstName ?? 'Player',
            balance:   dbUser.balanceCents ?? 0,
            coins:     dbUser.coins ?? 0,
            energy:    dbUser.energy ?? 0,
            maxEnergy: dbUser.maxEnergy ?? 0,
            level:     dbUser.level ?? 0,
            xp:        dbUser.xp ?? 0,
            avatarUrl: dbUser.avatarUrl,
            tradeUrl:  dbUser.tradeUrl,
          })
        })
        .catch(error => {
          console.error('auth error:', error)
          debugDiv.style.background = 'darkred'
          debugDiv.textContent = 'AUTH ERROR: ' + error.message
        })
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
