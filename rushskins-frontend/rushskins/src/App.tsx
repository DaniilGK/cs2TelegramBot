import { useTelegram } from '@/hooks/useTelegram'
import { useAppStore } from '@/store/useAppStore'
import { BottomNav } from '@/components/layout/BottomNav'
import { HomePage } from '@/pages/HomePage'
import { MarketPage } from '@/pages/MarketPage'
import { ProfilePage } from '@/pages/ProfilePage'

function CasesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 px-4 animate-fade-in">
      <span className="text-5xl">📦</span>
      <h1 className="font-display text-2xl font-semibold text-text-primary tracking-wide">Cases</h1>
      <p className="text-text-secondary font-body text-sm text-center">
        Case system coming in Sprint 3.<br/>Algorithm generates custom cases from available inventory.
      </p>
    </div>
  )
}

function FriendsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 px-4 animate-fade-in">
      <span className="text-5xl">👥</span>
      <h1 className="font-display text-2xl font-semibold text-text-primary tracking-wide">Friends</h1>
      <p className="text-text-secondary font-body text-sm text-center">
        Referral & friends system coming in Sprint 5.<br/>Invite friends, track their activity, earn rewards.
      </p>
    </div>
  )
}

const PAGES = {
  home:    <HomePage />,
  market:  <MarketPage />,
  cases:   <CasesPage />,
  friends: <FriendsPage />,
  profile: <ProfilePage />,
}

export default function App() {
  useTelegram()
  const activeTab = useAppStore(s => s.activeTab)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-base select-none">
      {/* Main content area — leaves room for bottom nav */}
      <main className="flex-1 overflow-hidden" style={{ paddingBottom: 'calc(60px + var(--safe-bottom))' }}>
        <div className="h-full overflow-y-auto overscroll-contain">
          {PAGES[activeTab]}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
