import { useState, useRef, useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useTelegram } from '@/hooks/useTelegram'
import clsx from 'clsx'

interface FloatingCoin {
  id: number
  x: number
  y: number
  value: number
}

const XP_FOR_LEVEL = (level: number) => level * 500

export function HomePage() {
  const { user, tapCoin } = useAppStore()
  const { haptic } = useTelegram()
  const [floaters, setFloaters] = useState<FloatingCoin[]>([])
  const [tapScale, setTapScale] = useState(1)
  const [checkedIn, setCheckedIn] = useState(false)
  const nextId = useRef(0)

  const handleTap = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (user.energy <= 0) return
    haptic('medium')
    tapCoin()

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const x = clientX - rect.left
    const y = clientY - rect.top
    const gain = Math.ceil(user.level * 1.5)

    const id = nextId.current++
    setFloaters(f => [...f, { id, x, y, value: gain }])
    setTimeout(() => setFloaters(f => f.filter(c => c.id !== id)), 800)

    setTapScale(0.93)
    setTimeout(() => setTapScale(1), 120)
  }, [user.energy, user.level, haptic, tapCoin])

  const energyPct = Math.round((user.energy / user.maxEnergy) * 100)
  const xpPct = Math.round((user.xp / XP_FOR_LEVEL(user.level)) * 100)

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-2 gap-4 overflow-y-auto animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-xs font-body">Welcome back</p>
          <h1 className="font-display text-2xl font-semibold text-text-primary tracking-wide">
            {user.username}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-bg-raised border border-border rounded-xl px-3 py-1.5 flex items-center gap-1.5">
            <span className="text-gold text-sm">◈</span>
            <span className="font-mono text-sm font-medium text-text-primary">
              {user.coins.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Level + XP */}
      <div className="bg-bg-raised border border-border rounded-2xl p-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-display text-base font-semibold text-text-primary tracking-wide">
            Level {user.level}
          </span>
          <span className="text-xs text-text-secondary font-body">
            {user.xp} / {XP_FOR_LEVEL(user.level)} XP
          </span>
        </div>
        <div className="h-1.5 bg-bg-overlay rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-orange to-gold transition-all duration-500"
            style={{ width: `${xpPct}%` }}
          />
        </div>
      </div>

      {/* Daily Check-In */}
      {!checkedIn && (
        <button
          onClick={() => { setCheckedIn(true); haptic('heavy') }}
          className="bg-accent-orange/10 border border-accent-orange/40 rounded-2xl p-3 flex items-center gap-3 active:scale-95 transition-transform animate-glow-pulse text-left w-full"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-orange/20 flex items-center justify-center shrink-0">
            <span className="text-lg">🎁</span>
          </div>
          <div>
            <p className="font-display text-base font-semibold text-accent-orange tracking-wide">Daily check-in</p>
            <p className="text-xs text-text-secondary font-body">Claim your daily reward — Day 3 streak</p>
          </div>
          <div className="ml-auto shrink-0">
            <span className="font-display text-lg font-semibold text-gold">+250</span>
            <span className="text-gold text-xs">◈</span>
          </div>
        </button>
      )}
      {checkedIn && (
        <div className="bg-bg-raised border border-border/50 rounded-2xl p-3 flex items-center gap-3 opacity-60">
          <div className="w-10 h-10 rounded-xl bg-bg-overlay flex items-center justify-center shrink-0">
            <span className="text-lg">✓</span>
          </div>
          <div>
            <p className="font-display text-base font-semibold text-text-secondary tracking-wide">Claimed today</p>
            <p className="text-xs text-text-muted font-body">Come back tomorrow for Day 4</p>
          </div>
        </div>
      )}

      {/* Tapper */}
      <div className="flex flex-col items-center flex-1 justify-center gap-4 py-2">
        <p className="text-xs text-text-secondary font-body">Tap to earn coins</p>

        <div className="relative">
          <button
            onTouchStart={handleTap}
            onClick={handleTap}
            className="relative w-36 h-36 rounded-full select-none"
            style={{ transform: `scale(${tapScale})`, transition: 'transform 0.12s ease' }}
          >
            {/* Outer glow ring */}
            <div className={clsx(
              'absolute inset-0 rounded-full border-2 transition-colors duration-200',
              user.energy > 0 ? 'border-accent-orange/40' : 'border-border'
            )} />
            {/* Inner button */}
            <div className={clsx(
              'absolute inset-2 rounded-full flex items-center justify-center',
              user.energy > 0
                ? 'bg-gradient-to-br from-accent-orange/30 via-bg-raised to-bg-overlay border border-accent-orange/30'
                : 'bg-bg-raised border border-border'
            )}>
              <span className="text-4xl select-none">⚡</span>
            </div>
          </button>

          {/* Floating coin numbers */}
          {floaters.map(f => (
            <div
              key={f.id}
              className="absolute pointer-events-none coin-float font-display font-semibold text-gold text-xl"
              style={{ left: f.x - 20, top: f.y - 20 }}
            >
              +{f.value}
            </div>
          ))}
        </div>

        {/* Energy bar */}
        <div className="w-full">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-text-secondary font-body">Energy</span>
            <span className="text-xs font-mono text-text-secondary">
              {user.energy} / {user.maxEnergy}
            </span>
          </div>
          <div className="h-2 bg-bg-overlay rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full transition-all duration-300',
                energyPct > 50 ? 'bg-accent-orange' : energyPct > 20 ? 'bg-gold' : 'bg-rarity-covert'
              )}
              style={{ width: `${energyPct}%` }}
            />
          </div>
          {user.energy === 0 && (
            <p className="text-center text-xs text-text-secondary mt-1.5">
              Energy recharges over time — or level up!
            </p>
          )}
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-bg-raised border border-border rounded-2xl p-3 mb-1">
        <p className="text-xs text-text-muted font-body mb-2 uppercase tracking-wider">Announcements</p>
        <div className="flex items-center gap-2 text-sm text-text-secondary font-body">
          <span className="text-accent-orange">◆</span>
          New Clutch Case skins added — check the market!
        </div>
      </div>

    </div>
  )
}
