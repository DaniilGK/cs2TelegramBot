import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useTelegram } from '@/hooks/useTelegram'
import { useAppStore } from '@/store/useAppStore'
import { BottomNav } from '@/components/layout/BottomNav'
import { HomePage } from '@/pages/HomePage'
import { MarketPage } from '@/pages/MarketPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { EditProfilePage } from '@/pages/profile/EditProfilePage'
import { AppSettingsPage } from '@/pages/profile/AppSettingsPage'
import { UpgradePage } from '@/pages/profile/UpgradePage'
import { applyStoredTheme } from '@/lib/theme'

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
    else if (topRoute === 'friends') setActiveTab('friends')
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
            <Route path="/friends" element={<FriendsPage />} />
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
