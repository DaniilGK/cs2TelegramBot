import type { SkinItem } from '@/store/useAppStore'
import { useAppStore } from '@/store/useAppStore'
import { useTelegram } from '@/hooks/useTelegram'
import clsx from 'clsx'

const RARITY_COLORS: Record<SkinItem['rarity'], string> = {
  consumer:    '#9AAFC4',
  industrial:  '#5E97C2',
  milspec:     '#4B69FF',
  restricted:  '#8847FF',
  classified:  '#D32CE6',
  covert:      '#EB4B4B',
  contraband:  '#E4AE33',
}

const RARITY_LABELS: Record<SkinItem['rarity'], string> = {
  consumer:    'Consumer',
  industrial:  'Industrial',
  milspec:     'Mil-Spec',
  restricted:  'Restricted',
  classified:  'Classified',
  covert:      'Covert',
  contraband:  'Contraband',
}

function formatPrice(cents: number): string {
  if (cents >= 100_000_00) return `$${Math.round(cents / 100_000_00 * 10) / 10}M`
  if (cents >= 1_000_00)   return `$${(cents / 100_000).toFixed(1)}k`
  return `$${(cents / 100).toFixed(2)}`
}

interface SkinCardProps {
  item: SkinItem
  onBuy?: (item: SkinItem) => void
}

export function SkinCard({ item, onBuy }: SkinCardProps) {
  const { cartItems, addToCart } = useAppStore()
  const { haptic } = useTelegram()
  const rarityColor = RARITY_COLORS[item.rarity]
  const inCart = cartItems.includes(item.id)

  const handleBuy = () => {
    haptic('medium')
    if (onBuy) onBuy(item)
    else addToCart(item.id)
  }

  return (
    <div
      className="bg-bg-raised border border-border rounded-2xl overflow-hidden flex flex-col"
      style={{ borderTopColor: rarityColor, borderTopWidth: 2 }}
    >
      {/* Image area */}
      <div className="relative bg-bg-overlay aspect-square flex items-center justify-center p-2">
        <img
          src={item.imageUrl}
          alt={`${item.weapon} | ${item.name}`}
          className="w-full h-full object-contain drop-shadow-lg"
          loading="lazy"
          onError={e => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>' }}
        />
        {/* Float badge */}
        {item.float !== undefined && (
          <div className="absolute bottom-1.5 right-1.5 bg-bg-surface/80 backdrop-blur-sm rounded-md px-1.5 py-0.5">
            <span className="font-sans text-[10px] text-text-secondary">
              {item.float.toFixed(4)}
            </span>
          </div>
        )}
        {/* Rarity dot */}
        <div
          className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full"
          style={{ backgroundColor: rarityColor, boxShadow: `0 0 6px ${rarityColor}99` }}
        />
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1 flex-1">
        <p className="text-[10px] font-sans text-text-muted uppercase tracking-wider">
          {item.weapon}
        </p>
        <p className="font-sans text-sm font-semibold text-text-primary tracking-wide leading-tight">
          {item.name}
        </p>
        <p className="text-[10px] font-sans" style={{ color: rarityColor }}>
          {RARITY_LABELS[item.rarity]}
        </p>
        <p className="text-[10px] text-text-muted font-sans">{item.wear}</p>
      </div>

      {/* Buy button */}
      <div className="px-2.5 pb-2.5">
        <button
          onClick={handleBuy}
          className={clsx(
            'w-full py-2 rounded-xl font-sans text-sm font-semibold tracking-wide transition-all active:scale-95',
            inCart
              ? 'bg-bg-overlay border border-border text-text-secondary'
              : 'bg-accent-orange text-white active:bg-accent-dim'
          )}
        >
          {inCart ? 'In cart' : formatPrice(item.price)}
        </button>
      </div>
    </div>
  )
}
