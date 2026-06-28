import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Diamond, Ticket } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { MOCK_CASES, MOCK_SKINS, MockSkin, RARITY_COLORS } from './mockData'

const CARD_HEIGHT = 152
const WIN_INDEX = 90

export function CaseOpenPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAppStore()
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'result'>('idle')
  const [quantity, setQuantity] = useState(1)
  const [isSpinning, setIsSpinning] = useState(false)
  const [offset, setOffset] = useState(0)
  const [rouletteItems, setRouletteItems] = useState<typeof MOCK_SKINS>([])
  const [wonSkins, setWonSkins] = useState<typeof MOCK_SKINS>([])
  const [currentSpin, setCurrentSpin] = useState(0)
  const [totalSpins, setTotalSpins] = useState(0)
  const [ticketsEarned, setTicketsEarned] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const caseItem = MOCK_CASES.find(item => item.id === id)
  const caseName = caseItem?.name ?? 'Кейс'
  const casePrice = caseItem?.price ?? 0

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2000)
  }

  useEffect(() => {
    const items = Array.from({ length: 6 }).flatMap(() =>
      [...MOCK_SKINS].sort(() => Math.random() - 0.5)
    )
    setRouletteItems(items)

    const rouletteHeight = window.innerHeight - 250
    setOffset(rouletteHeight / 2 - CARD_HEIGHT / 2 - 10 * CARD_HEIGHT)
  }, [])

  const calcTickets = (skin: MockSkin) => {
    let t = casePrice < 100 ? 1 : casePrice < 500 ? 3 : 10
    if (skin.rarity === 'classified') t += 5
    if (skin.rarity === 'covert' || skin.rarity === 'contraband') t += 20
    return t
  }

  const runSpinSequence = (spinsLeft: number, accumulated: typeof MOCK_SKINS) => {
    if (spinsLeft === 0) {
      setWonSkins(accumulated)
      setTicketsEarned(accumulated.reduce((sum, skin) => sum + calcTickets(skin), 0))
      setCurrentSpin(0)
      setTotalSpins(0)
      setPhase('result')
      return
    }

    const won = MOCK_SKINS[Math.floor(Math.random() * MOCK_SKINS.length)]
    const items = buildRouletteItems(won)

    setCurrentSpin(accumulated.length + 1)
    setIsSpinning(false)
    setOffset(0)
    setRouletteItems([])

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRouletteItems(items)
        setIsSpinning(true)

        window.setTimeout(() => {
          const rouletteHeight = window.innerHeight - 250
          const finalOffset = -(WIN_INDEX * CARD_HEIGHT) + rouletteHeight / 2 - CARD_HEIGHT / 2
          setOffset(finalOffset)
        }, 50)

        window.setTimeout(() => {
          setIsSpinning(false)
          window.setTimeout(() => {
            runSpinSequence(spinsLeft - 1, [...accumulated, won])
          }, 800)
        }, 4200)
      })
    })
  }

  const handleSpin = () => {
    if (isSpinning || phase === 'spinning') return
    if (user.balance < casePrice * quantity) {
      showToast('Недостаточно RC')
      return
    }

    setWonSkins([])
    setTicketsEarned(0)
    setTotalSpins(quantity)
    setCurrentSpin(1)
    setPhase('spinning')
    runSpinSequence(quantity, [])
  }

  return (
    <div className="fixed inset-0 bg-[#0D0D0D] flex flex-col" style={{ paddingBottom: '64px' }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-shrink-0 z-30 relative">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[#A0A0A0] text-sm font-medium active:text-white transition-colors"
        >
          <ChevronLeft size={18} />
          Назад
        </button>
        <p className="text-base font-bold text-white">{caseName}</p>
        <div className="w-16" />
      </div>

      {isSpinning && totalSpins > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#1A1A1A] border border-[#FF5C00]/30 rounded-xl px-4 py-2">
          <span className="text-sm font-bold text-white">{currentSpin} / {totalSpins}</span>
        </div>
      )}

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20">
          <ChevronRight size={32} className="text-[#FF5C00] drop-shadow-lg" />
        </div>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
          <ChevronLeft size={32} className="text-[#FF5C00] drop-shadow-lg" />
        </div>

        <div
          className="absolute left-0 right-0 h-px bg-[#FF5C00]/50 z-10 pointer-events-none"
          style={{ top: 'calc(50% - 76px)' }}
        />
        <div
          className="absolute left-0 right-0 h-px bg-[#FF5C00]/50 z-10 pointer-events-none"
          style={{ top: 'calc(50% + 76px)' }}
        />

        <div
          className="absolute top-0 left-0 right-0 h-40 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #0D0D0D 20%, transparent)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-40 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #0D0D0D 20%, transparent)' }}
        />

        <div
          className="absolute left-0 right-0 flex flex-col items-center"
          style={{
            transform: `translateY(${offset}px)`,
            transition: isSpinning
              ? 'transform 4s cubic-bezier(0.05, 0.0, 0.1, 1.0)'
              : 'none',
          }}
        >
          {rouletteItems.map((skin, i) => (
            <div
              key={`${skin.id}-${i}`}
              className="w-52 flex-shrink-0 rounded-2xl my-1.5 flex flex-col items-center justify-center p-3"
              style={{
                background: RARITY_COLORS[skin.rarity].bg + '22',
                border: `1px solid ${RARITY_COLORS[skin.rarity].bg}44`,
                height: '140px',
              }}
            >
              <div
                className="w-20 h-20 rounded-xl"
                style={{ background: RARITY_COLORS[skin.rarity].bg + '66' }}
              />
              <p className="text-xs font-bold text-white mt-2 text-center line-clamp-1">
                {skin.name} | {skin.skin}
              </p>
              <p
                className="text-xs font-bold mt-0.5"
                style={{ color: RARITY_COLORS[skin.rarity].bg }}
              >
                {skin.price} RC
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 bg-[#0D0D0D] border-t border-[#1A1A1A] px-4 pt-3 pb-6">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
            <button
              key={n}
              onClick={() => !isSpinning && phase !== 'spinning' && setQuantity(n)}
              className={`flex-shrink-0 w-12 h-10 rounded-xl font-bold text-sm transition-all ${
                quantity === n
                  ? 'bg-[#FF5C00] text-white'
                  : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#A0A0A0]'
              }`}
            >
              ×{n}
            </button>
          ))}
        </div>

        <button
          onClick={handleSpin}
          disabled={isSpinning || phase === 'spinning'}
          className={`w-full py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 transition-all ${
            isSpinning || phase === 'spinning'
              ? 'bg-[#333333] opacity-50'
              : 'bg-[#FF5C00] active:scale-95'
          }`}
        >
          {isSpinning || phase === 'spinning' ? 'Крутим...' : `Крутить${quantity > 1 ? ` ×${quantity}` : ''}`}
          {phase !== 'spinning' && !isSpinning && (
            <span className="flex items-center gap-1 bg-black/20 rounded-lg px-2 py-0.5 text-sm">
              <Diamond size={12} />
              {casePrice * quantity} RC
            </span>
          )}
        </button>
      </div>

      {phase === 'result' && (
        <ResultOverlay
          wonSkins={wonSkins}
          ticketsEarned={ticketsEarned}
          onSell={() => {
            showToast(`Продано! +${wonSkins.reduce((sum, skin) => sum + Math.floor(skin.price * 0.7), 0)} RC`)
            setPhase('idle')
          }}
          onKeep={() => {
            showToast(wonSkins.length > 1 ? 'Скины в инвентаре' : 'Скин в инвентаре')
            setPhase('idle')
          }}
          onSpinAgain={() => setPhase('idle')}
        />
      )}

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-5 py-3 text-sm font-medium text-white shadow-2xl whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  )
}

function ResultOverlay({
  wonSkins,
  ticketsEarned,
  onSell,
  onKeep,
  onSpinAgain,
}: {
  wonSkins: MockSkin[]
  ticketsEarned: number
  onSell: () => void
  onKeep: () => void
  onSpinAgain: () => void
}) {
  const firstSkin = wonSkins[0] ?? MOCK_SKINS[0]
  const rarity = RARITY_COLORS[firstSkin.rarity]

  return (
    <div className="fixed inset-0 bg-[#0D0D0D] z-50 flex flex-col overflow-hidden">
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <p className="text-xs text-[#A0A0A0] uppercase tracking-widest font-semibold text-center">
          {wonSkins.length > 1 ? `Выбито ${wonSkins.length} скинов` : 'Выпало'}
        </p>
      </div>

      {wonSkins.length === 1 ? (
        <div className="flex flex-col items-center justify-center flex-1 px-6">
          <div
            className="w-52 h-52 rounded-3xl flex items-center justify-center mb-5"
            style={{
              background: rarity.bg + '22',
              boxShadow: `0 0 80px ${rarity.glow}`,
              border: `2px solid ${rarity.bg}`,
            }}
          >
            <div
              className="w-36 h-36 rounded-2xl"
              style={{ background: rarity.bg + '66' }}
            />
          </div>
          <p className="text-2xl font-black text-white text-center">
            {firstSkin.name} | {firstSkin.skin}
          </p>
          <p className="text-sm text-[#A0A0A0] mt-1">{firstSkin.wear}</p>
          <div className="flex items-center gap-2 mt-4 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-xl px-4 py-2">
            <Ticket size={16} className="text-[#7C3AED]" />
            <span className="text-sm font-bold text-[#7C3AED]">+{ticketsEarned} тикетов</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4">
          <div className="grid grid-cols-3 gap-2 pb-4">
            {wonSkins.map((skin, i) => (
              <div
                key={`${skin.id}-${i}`}
                className="rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: RARITY_COLORS[skin.rarity].bg + '22',
                  border: `1px solid ${RARITY_COLORS[skin.rarity].bg}33`,
                }}
              >
                <div
                  className="w-full aspect-square"
                  style={{ background: RARITY_COLORS[skin.rarity].bg + '44' }}
                />
                <div className="p-1.5">
                  <p className="text-[10px] font-bold text-white leading-tight">{skin.name}</p>
                  <p className="text-[9px] text-[#A0A0A0] mt-0.5">{skin.skin}</p>
                  <p className="text-[10px] font-bold mt-1" style={{ color: RARITY_COLORS[skin.rarity].bg }}>
                    {skin.price} RC
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-shrink-0 px-4 pb-6 pt-3 border-t border-[#1A1A1A]">
        <div className="flex items-center gap-2 justify-center mb-4 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-xl px-4 py-2">
          <Ticket size={16} className="text-[#7C3AED]" />
          <span className="text-sm font-bold text-[#7C3AED]">+{ticketsEarned} тикетов</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onSell}
            className="flex-1 py-3.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl font-semibold text-sm text-[#A0A0A0] active:scale-95 transition-all"
          >
            Продать всё
          </button>
          <button
            onClick={onKeep}
            className="flex-1 py-3.5 bg-[#FF5C00] rounded-2xl font-bold text-sm text-white active:scale-95 transition-all"
          >
            В инвентарь
          </button>
        </div>

        <button
          onClick={onSpinAgain}
          className="w-full mt-3 text-sm text-[#555555] font-medium active:text-[#A0A0A0] transition-colors"
        >
          Крутить ещё
        </button>
      </div>
    </div>
  )
}

function buildRouletteItems(wonSkin: MockSkin): MockSkin[] {
  const shuffled = Array.from({ length: 6 }).flatMap(() =>
    [...MOCK_SKINS].sort(() => Math.random() - 0.5)
  )
  shuffled[WIN_INDEX] = wonSkin
  return shuffled
}
