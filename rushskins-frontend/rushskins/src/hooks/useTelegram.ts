import { useEffect, useState } from 'react'

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
  haptic: (type?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
  expand: () => void
  close: () => void
  themeParams: Record<string, string>
}

export function useTelegram(): UseTelegramReturn {
  const [tgUser, setTgUser] = useState<TelegramUser | null>(null)
  const [themeParams, setThemeParams] = useState<Record<string, string>>({})

  const tg = (window as any).Telegram?.WebApp

  useEffect(() => {
    if (!tg) return
    tg.ready()
    tg.expand()
    tg.setHeaderColor('#0A0A0C')
    tg.setBackgroundColor('#0A0A0C')
    if (tg.initDataUnsafe?.user) setTgUser(tg.initDataUnsafe.user)
    if (tg.themeParams) setThemeParams(tg.themeParams)
  }, [])

  const haptic = (type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') => {
    tg?.HapticFeedback?.impactOccurred(type)
  }

  const expand = () => tg?.expand()
  const close  = () => tg?.close()

  return {
    tgUser,
    isTelegram: !!tg,
    haptic,
    expand,
    close,
    themeParams,
  }
}
