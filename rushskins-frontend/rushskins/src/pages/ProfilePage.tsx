import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useTelegram } from '@/hooks/useTelegram'
import { createTelegramTopUpInvoice } from '@/lib/payments'

function formatUSD(cents: number) {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

export function ProfilePage() {
  const { user, addBalance } = useAppStore()
  const { haptic, openInvoice, tgUser } = useTelegram()
  const [steamLinked] = useState(false)
  const [showTradeInput, setShowTradeInput] = useState(false)
  const [tradeUrl, setTradeUrl] = useState('')
  const [isDepositing, setIsDepositing] = useState(false)
  const [depositError, setDepositError] = useState<string | null>(null)

  const displayName = user.username || tgUser?.first_name || 'Player'
  const initials = displayName.slice(0, 2).toUpperCase()

  const handleDeposit = async () => {
    if (isDepositing) return
    haptic('medium')
    setDepositError(null)
    setIsDepositing(true)

    try {
      const amountCents = 1000
      const invoice = await createTelegramTopUpInvoice({ userId: user.id, amountCents })
      const status = await openInvoice(invoice.invoiceLink)

      if (status === 'paid') {
        addBalance(invoice.amountCents)
        haptic('heavy')
      } else if (status !== 'pending') {
        setDepositError('Payment was not completed.')
      }
    } catch (error) {
      setDepositError(error instanceof Error ? error.message : 'Payment failed.')
    } finally {
      setIsDepositing(false)
    }
  }

  return (
    <div className="flex flex-col px-4 pt-4 pb-4 gap-4 overflow-y-auto animate-fade-in">

      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-accent-orange/20 border border-accent-orange/30 flex items-center justify-center shrink-0">
          <span className="font-display text-2xl font-semibold text-accent-orange">{initials}</span>
        </div>
        <div className="flex-1">
          <h1 className="font-display text-xl font-semibold text-text-primary tracking-wide">{displayName}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-body text-text-secondary">Level {user.level}</span>
            <span className="text-text-muted">·</span>
            <span className="text-xs font-body text-text-secondary">{user.coins.toLocaleString()} coins</span>
          </div>
        </div>
      </div>

      {/* Balance card */}
      <div className="bg-bg-raised border border-border rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-text-muted font-body mb-1">Balance</p>
          <p className="font-display text-2xl font-semibold text-text-primary">{formatUSD(user.balance)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDeposit}
            disabled={isDepositing}
            className="px-4 py-2 bg-accent-orange text-white rounded-xl font-display text-sm font-semibold active:bg-accent-dim active:scale-95 transition-all disabled:opacity-60"
          >
            {isDepositing ? 'Opening...' : 'Deposit'}
          </button>
          <button
            onClick={() => haptic('light')}
            className="px-4 py-2 bg-bg-overlay border border-border text-text-secondary rounded-xl font-display text-sm font-semibold active:scale-95 transition-all"
          >
            Withdraw
          </button>
        </div>
      </div>
      {depositError && (
        <p className="text-xs text-rarity-covert font-body -mt-2">{depositError}</p>
      )}

      {/* Steam section */}
      <div className="bg-bg-raised border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎮</span>
            <span className="font-display text-base font-semibold text-text-primary tracking-wide">Steam</span>
          </div>
          <div className={`text-xs font-body px-2 py-0.5 rounded-full ${
            steamLinked
              ? 'bg-rarity-milspec/20 text-rarity-milspec'
              : 'bg-rarity-covert/20 text-rarity-covert'
          }`}>
            {steamLinked ? 'Linked' : 'Not linked'}
          </div>
        </div>
        {!steamLinked ? (
          <div className="px-4 py-4 flex flex-col gap-3">
            <p className="text-sm text-text-secondary font-body">
              Link your Steam account to receive skins after purchase.
            </p>
            <button
              onClick={() => haptic('medium')}
              className="w-full py-2.5 bg-[#1B2838] border border-[#2A475E] rounded-xl font-display text-sm font-semibold text-[#66C0F4] tracking-wide active:opacity-80 transition-opacity"
            >
              Sign in with Steam
            </button>
          </div>
        ) : (
          <div className="px-4 py-3">
            <p className="text-sm text-text-secondary font-body">Linked as SteamUser123</p>
          </div>
        )}
      </div>

      {/* Trade URL */}
      <div className="bg-bg-raised border border-border rounded-2xl overflow-hidden">
        <button
          className="w-full px-4 py-3 flex items-center justify-between"
          onClick={() => setShowTradeInput(v => !v)}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🔗</span>
            <span className="font-display text-base font-semibold text-text-primary tracking-wide">Trade URL</span>
          </div>
          <svg className={`w-4 h-4 text-text-muted transition-transform ${showTradeInput ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
        {showTradeInput && (
          <div className="px-4 pb-4 flex gap-2">
            <input
              type="url"
              value={tradeUrl}
              onChange={e => setTradeUrl(e.target.value)}
              placeholder="https://steamcommunity.com/tradeoffer/new/?partner=..."
              className="flex-1 bg-bg-overlay border border-border rounded-xl px-3 py-2 text-xs font-mono text-text-primary placeholder-text-muted outline-none focus:border-accent-orange/50"
            />
            <button
              onClick={() => haptic('light')}
              className="px-3 py-2 bg-accent-orange rounded-xl text-white text-sm font-display font-semibold active:bg-accent-dim"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Purchased', value: '0' },
          { label: 'Opened cases', value: '0' },
          { label: 'Friends', value: '0' },
        ].map(s => (
          <div key={s.label} className="bg-bg-raised border border-border rounded-xl p-3 text-center">
            <p className="font-display text-xl font-semibold text-text-primary">{s.value}</p>
            <p className="text-[10px] text-text-muted font-body mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
