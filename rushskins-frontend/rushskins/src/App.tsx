import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useTelegram } from '@/hooks/useTelegram'
import { useAppStore } from '@/store/useAppStore'
import { BottomNav } from '@/components/layout/BottomNav'
import { HomePage } from '@/pages/HomePage'
import { MarketPage } from '@/pages/MarketPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { ArenaPage } from '@/pages/ArenaPage'
import { LeaderboardPage } from '@/pages/LeaderboardPage'
import { DepositPage } from '@/pages/DepositPage'
import { CasesPage } from '@/pages/cases/CasesPage'
import { CaseDetailPage } from '@/pages/cases/CaseDetailPage'
import { CaseOpenPage } from '@/pages/cases/CaseOpenPage'
import { EditProfilePage } from '@/pages/profile/EditProfilePage'
import { AppSettingsPage } from '@/pages/profile/AppSettingsPage'
import { UpgradePage } from '@/pages/profile/UpgradePage'
import { applyStoredTheme } from '@/lib/theme'

export default function App() {
  useTelegram()
  const location = useLocation()
  const setActiveTab = useAppStore(s => s.setActiveTab)

  useEffect(() => {
    applyStoredTheme()
  }, [])

  useEffect(() => {
    const topRoute = location.pathname.split('/')[1]
    if (topRoute === 'market') setActiveTab('market')
    else if (topRoute === 'cases') setActiveTab('cases')
    else if (topRoute === 'arena') setActiveTab('arena')
    else if (topRoute === 'leaderboard') setActiveTab('leaderboard')
    else if (topRoute === 'profile') setActiveTab('profile')
    else setActiveTab('home')
  }, [location.pathname, setActiveTab])

  return (
    <div className="flex flex-col h-screen overflow-hidden select-none">
      {/* Main content area — leaves room for bottom nav */}
      <main className="flex-1 overflow-hidden" style={{ paddingBottom: 'calc(60px + var(--safe-bottom))' }}>
        <div className="h-full overflow-y-auto overscroll-contain">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/cases/:id" element={<CaseDetailPage />} />
            <Route path="/cases/:id/open" element={<CaseOpenPage />} />
            <Route path="/arena" element={<ArenaPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/deposit" element={<DepositPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit-profile" element={<EditProfilePage />} />
            <Route path="/profile/app-settings" element={<AppSettingsPage />} />
            <Route path="/profile/upgrade" element={<UpgradePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
