import { useNavigate } from 'react-router-dom'
import { Home, Package, Sword, Trophy, User } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useTelegram } from '@/hooks/useTelegram'

const TABS = [
  {
    id: 'home' as const,
    path: '/',
    label: 'Home',
    icon: Home,
  },
  {
    id: 'cases' as const,
    path: '/cases',
    label: 'Cases',
    icon: Package,
  },
  {
    id: 'arena' as const,
    path: '/arena',
    label: 'Arena',
    icon: Sword,
  },
  {
    id: 'leaderboard' as const,
    path: '/leaderboard',
    label: 'Leaderboard',
    icon: Trophy,
  },
  {
    id: 'profile' as const,
    path: '/profile',
    label: 'Profile',
    icon: User,
  },
]

export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore()
  const { haptic } = useTelegram()
  const navigate = useNavigate()

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div
        className="flex items-center justify-around py-3 px-2 rounded-full"
        style={{
          background: 'rgba(20, 20, 20, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        {TABS.map(tab => {
          const active = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.path}
              onClick={() => {
                haptic('light')
                setActiveTab(tab.id)
                navigate(tab.path)
              }}
              className="flex flex-col items-center gap-1 px-4 py-1 rounded-full transition-all active:scale-95"
              style={{
                background: active ? 'rgba(255,92,0,0.15)' : 'transparent',
              }}
            >
              <Icon
                size={22}
                className={active ? 'text-[#FF5C00]' : 'text-[#555555]'}
              />
              <span className={`text-[10px] font-medium ${active ? 'text-[#FF5C00]' : 'text-[#555555]'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
