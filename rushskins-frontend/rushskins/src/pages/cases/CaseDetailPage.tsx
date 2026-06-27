import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Diamond, Package } from 'lucide-react'
import { MOCK_CASES, MOCK_SKINS, MockSkin, RARITY_COLORS } from './mockData'

export function CaseDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const caseItem = MOCK_CASES.find(item => item.id === id)
  const casePrice = caseItem?.price ?? 0

  if (!caseItem) {
    return (
      <div className="flex flex-col bg-[#0D0D0D] min-h-screen pb-20">
        <BackButton onClick={() => navigate(-1)} />
        <div className="flex flex-1 items-center justify-center px-4">
          <p className="text-sm font-semibold text-[#A0A0A0]">Кейс не найден</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-[#0D0D0D] min-h-screen pb-40 animate-fade-in">
      <BackButton onClick={() => navigate(-1)} />

      <div className="mx-4 aspect-video rounded-2xl bg-gradient-to-br from-[#FF5C00]/30 to-[#141414] flex items-center justify-center">
        <Package size={80} className="text-[#FF5C00]/50" />
      </div>

      <h1 className="text-2xl font-black text-white px-4 mt-3">{caseItem.name}</h1>

      <p className="px-4 text-xs font-bold text-[#555555] uppercase tracking-widest mt-5 mb-2">СОДЕРЖИМОЕ КЕЙСА</p>
      <div className="grid grid-cols-3 gap-2 px-4">
        {MOCK_SKINS.map(skin => (
          <SkinCard key={skin.id} skin={skin} />
        ))}
      </div>

      <div className="fixed bottom-16 left-0 right-0 bg-[#0D0D0D] border-t border-[#1A1A1A] px-4 py-3 z-40">
        <button
          onClick={() => navigate(`/cases/${id}/open`)}
          className="w-full py-3.5 bg-[#FF5C00] rounded-2xl font-bold text-white text-base active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Package size={18} />
          Открыть кейс
          <span className="flex items-center gap-1 bg-black/20 rounded-lg px-2 py-0.5 text-sm">
            <Diamond size={12} />
            {casePrice} RC
          </span>
        </button>
      </div>
    </div>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-[#A0A0A0] text-sm font-medium px-4 pt-4 pb-2 active:text-white transition-colors">
      <ChevronLeft size={18} />
      Назад
    </button>
  )
}

function SkinCard({ skin }: { skin: MockSkin }) {
  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: RARITY_COLORS[skin.rarity].bg + '22', border: `1px solid ${RARITY_COLORS[skin.rarity].bg}33` }}
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
  )
}
