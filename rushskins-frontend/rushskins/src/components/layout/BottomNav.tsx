import { useNavigate } from 'react-router-dom'
import { Home, Package, Sword, Trophy, User } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useTelegram } from '@/hooks/useTelegram'
import clsx from 'clsx'

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
    <nav className="fixed bottom-0 left-0 right-0 z-50"
         style={{ paddingBottom: 'var(--safe-bottom)' }}>
      <div className="bg-bg-surface border-t border-border/60 backdrop-blur-xl">
        <div className="flex items-stretch">
          {TABS.map(tab => {
            const active = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                className={clsx(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all duration-150 active:scale-90',
                  active ? 'text-[#FF5C00]' : 'text-[#555555]'
                )}
                onClick={() => {
                  haptic('light')
                  setActiveTab(tab.id)
                  navigate(tab.path)
                }}
              >
                <Icon size={22} className={active ? 'text-[#FF5C00]' : 'text-[#555555]'} />
                <span className={clsx(
                  'font-sans text-[10px] font-medium leading-none',
                  active ? 'text-[#FF5C00]' : 'text-[#555555]'
                )}>
                  {tab.label}
                </span>
                {active && (
                  <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-[#FF5C00]" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
