import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { fetchMarketItems } from '@/lib/market'
import { SkinCard } from '@/components/market/SkinCard'
import type { SkinItem } from '@/store/useAppStore'

const RARITIES = ['all', 'covert', 'classified', 'restricted', 'milspec', 'contraband'] as const

export function MarketPage() {
  const { setMarketItems, marketItems, cartItems } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [rarity, setRarity] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rarity'>('rarity')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const items = await fetchMarketItems({
        search: search || undefined,
        rarity: rarity !== 'all' ? rarity : undefined,
      })
      setMarketItems(items)
      setLoading(false)
    }
    load()
  }, [search, rarity])

  const sorted = [...marketItems].sort((a, b) => {
    if (sortBy === 'price-asc')  return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    const order = ['contraband','covert','classified','restricted','milspec','industrial','consumer']
    return order.indexOf(a.rarity) - order.indexOf(b.rarity)
  })

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Header + search */}
      <div className="px-4 pt-4 pb-2 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold text-text-primary tracking-wide">Market</h1>
          {cartItems.length > 0 && (
            <div className="bg-accent-orange rounded-full w-7 h-7 flex items-center justify-center">
              <span className="font-mono text-xs font-medium text-white">{cartItems.length}</span>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search skins..."
            className="w-full bg-bg-raised border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm font-body text-text-primary placeholder-text-muted outline-none focus:border-accent-orange/50 transition-colors"
          />
        </div>

        {/* Rarity filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {RARITIES.map(r => (
            <button
              key={r}
              onClick={() => setRarity(r)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-body font-medium border transition-all ${
                rarity === r
                  ? 'bg-accent-orange/20 border-accent-orange/60 text-accent-orange'
                  : 'bg-bg-raised border-border text-text-secondary'
              }`}
            >
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="shrink-0 bg-bg-raised border border-border rounded-full px-3 py-1 text-xs font-body text-text-secondary outline-none"
          >
            <option value="rarity">By rarity</option>
            <option value="price-desc">Price ↓</option>
            <option value="price-asc">Price ↑</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-bg-raised border border-border rounded-2xl overflow-hidden">
                <div className="shimmer aspect-square" />
                <div className="p-2.5 flex flex-col gap-2">
                  <div className="shimmer h-3 w-16 rounded" />
                  <div className="shimmer h-4 w-24 rounded" />
                  <div className="shimmer h-8 w-full rounded-xl mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl opacity-40">🔍</span>
            <p className="text-text-secondary font-body text-sm">No skins found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sorted.map(item => (
              <SkinCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
