import { useNavigate } from 'react-router-dom'
import { Diamond, Package } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { MOCK_CASES } from './mockData'

export function CasesPage() {
  const navigate = useNavigate()
  const { user } = useAppStore()

  return (
    <div className="flex flex-col bg-[#0D0D0D] min-h-screen pb-20 animate-fade-in">
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <Package size={22} className="text-[#FF5C00]" />
          <h1 className="text-xl font-extrabold text-white uppercase tracking-wide">КЕЙСЫ</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-[#FF5C00]/10 border border-[#FF5C00]/30 rounded-full px-3 py-1.5">
          <Diamond size={13} className="text-[#FF5C00]" />
          <span className="text-xs font-bold text-[#FF5C00]">{Math.floor(user.balance / 100)} RC</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4">
        {MOCK_CASES.map(caseItem => (
          <button
            key={caseItem.id}
            onClick={() => navigate(`/cases/${caseItem.id}`)}
            className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden active:scale-95 transition-all"
          >
            <div className="w-full aspect-square bg-gradient-to-br from-[#FF5C00]/20 to-[#141414] flex items-center justify-center">
              <Package size={48} className="text-[#FF5C00]/40" />
            </div>
            <div className="p-3 text-left">
              <p className="text-sm font-bold text-white">{caseItem.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <Diamond size={11} className="text-[#FF5C00]" />
                <span className="text-xs font-bold text-[#FF5C00]">{caseItem.price} RC</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
