import { useAppStore } from '@/store/useAppStore'
import { useTelegram } from '@/hooks/useTelegram'
import clsx from 'clsx'

const TABS = [
  {
    id: 'home' as const,
    label: 'Home',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? '#FF5C00' : 'currentColor'} strokeWidth="1.8">
        <path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'market' as const,
    label: 'Market',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? '#FF5C00' : 'currentColor'} strokeWidth="1.8">
        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h14M9 19a1 1 0 100 2 1 1 0 000-2zm10 0a1 1 0 100 2 1 1 0 000-2z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'cases' as const,
    label: 'Cases',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? '#FF5C00' : 'currentColor'} strokeWidth="1.8">
        <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v4M10 14h4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'friends' as const,
    label: 'Friends',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? '#FF5C00' : 'currentColor'} strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'profile' as const,
    label: 'Profile',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke={active ? '#FF5C00' : 'currentColor'} strokeWidth="1.8">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore()
  const { haptic } = useTelegram()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50"
         style={{ paddingBottom: 'var(--safe-bottom)' }}>
      <div className="bg-bg-surface border-t border-border/60 backdrop-blur-xl">
        <div className="flex items-stretch">
          {TABS.map(tab => {
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                className={clsx(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-all duration-150 active:scale-90',
                  active ? 'text-accent-orange' : 'text-text-muted hover:text-text-secondary'
                )}
                onClick={() => {
                  haptic('light')
                  setActiveTab(tab.id)
                }}
              >
                {tab.icon(active)}
                <span className={clsx(
                  'font-body text-[10px] font-medium leading-none',
                  active ? 'text-accent-orange' : 'text-text-muted'
                )}>
                  {tab.label}
                </span>
                {active && (
                  <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-accent-orange" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
