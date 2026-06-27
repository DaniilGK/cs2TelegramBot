import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RushSkinsTheme, applyTheme, saveTheme } from '@/lib/theme'

const LANG_KEY = 'rushskins_language'
const ACCENT_PRESETS = [
  { label: 'Orange', value: '#FF6B00', className: 'bg-[#FF6B00]' },
  { label: 'Purple', value: '#8B5CF6', className: 'bg-[#8B5CF6]' },
  { label: 'Blue', value: '#3B82F6', className: 'bg-[#3B82F6]' },
  { label: 'Red', value: '#EF4444', className: 'bg-[#EF4444]' },
  { label: 'Green', value: '#10B981', className: 'bg-[#10B981]' },
  { label: 'Pink', value: '#EC4899', className: 'bg-[#EC4899]' },
  { label: 'Gold', value: '#F59E0B', className: 'bg-[#F59E0B]' },
  { label: 'White', value: '#FFFFFF', className: 'bg-white' },
]

export function AppSettingsPage() {
  const navigate = useNavigate()
  const [theme, setTheme] = useState<RushSkinsTheme>(() => (localStorage.getItem('rushskins_theme') as RushSkinsTheme | null) ?? 'dark')
  const [accent, setAccent] = useState(() => localStorage.getItem('rushskins_accent') ?? '#FF5C00')
  const [language, setLanguage] = useState(() => localStorage.getItem(LANG_KEY) ?? 'RU')

  useEffect(() => {
    saveTheme(theme, accent)
  }, [theme, accent])

  const handleTheme = (nextTheme: RushSkinsTheme) => {
    setTheme(nextTheme)
    localStorage.setItem('rushskins_theme', nextTheme)
    applyTheme(nextTheme, accent)
  }

  const handleAccent = (nextAccent: string) => {
    setAccent(nextAccent)
    localStorage.setItem('rushskins_accent', nextAccent)
    applyTheme('custom', nextAccent)
  }

  const handleLanguage = (nextLanguage: 'RU' | 'EN') => {
    setLanguage(nextLanguage)
    localStorage.setItem(LANG_KEY, nextLanguage)
  }

  return (
    <div className="flex flex-col px-4 pt-4 pb-4 gap-4 overflow-y-auto animate-fade-in">
      <button
        onClick={() => navigate('/profile')}
        className="w-full px-4 py-3 flex items-center gap-3 bg-bg-raised border border-border rounded-2xl active:bg-bg-overlay transition-colors"
      >
        <span className="w-8 h-8 rounded-xl bg-bg-overlay flex items-center justify-center text-accent-orange text-lg">←</span>
        <span className="font-sans text-base font-semibold text-text-primary tracking-wide">Назад</span>
      </button>

      <div>
        <h1 className="font-sans text-2xl font-semibold text-text-primary tracking-wide">App Settings</h1>
        <p className="text-xs text-text-secondary font-sans">Interface preferences and app info.</p>
      </div>

      <div className="bg-bg-raised border border-border rounded-2xl p-4 flex flex-col gap-3">
        <p className="text-xs text-text-muted font-sans uppercase tracking-wider">ИНТЕРФЕЙС</p>
        <div className="grid grid-cols-3 gap-2">
          <ThemeCard
            label="Тёмная"
            active={theme === 'dark'}
            variant="dark"
            onClick={() => handleTheme('dark')}
          />
          <ThemeCard
            label="Светлая"
            active={theme === 'light'}
            variant="light"
            onClick={() => handleTheme('light')}
          />
          <ThemeCard
            label="Кастомная"
            active={theme === 'custom'}
            variant="custom"
            onClick={() => handleTheme('custom')}
          />
        </div>

        {theme === 'custom' && (
          <div className="bg-bg-overlay border border-border rounded-xl px-3 py-3 flex flex-col gap-3">
            <span className="text-sm text-text-primary font-sans">Accent color</span>
            <div className="grid grid-cols-4 gap-3">
              {ACCENT_PRESETS.map(color => (
                <button
                  key={color.value}
                  onClick={() => handleAccent(color.value)}
                  className={`w-10 h-10 rounded-full border active:scale-95 transition-all ${color.className} ${accent === color.value ? 'border-accent-orange' : 'border-border'}`}
                  aria-label={color.label}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-bg-raised border border-border rounded-2xl p-4 flex flex-col gap-4">
        <p className="text-xs text-text-muted font-sans uppercase tracking-wider">ПРОЧЕЕ</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-primary font-sans">Язык</span>
          <div className="flex bg-bg-overlay border border-border rounded-xl p-1">
            {(['RU', 'EN'] as const).map(option => (
              <button
                key={option}
                onClick={() => handleLanguage(option)}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold transition-colors ${language === option ? 'bg-accent-orange text-white' : 'text-text-secondary'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-primary font-sans">Версия приложения</span>
          <span className="text-sm text-text-secondary font-sans">v1.0.0</span>
        </div>
      </div>
    </div>
  )
}

function ThemeCard({
  label,
  active,
  variant,
  onClick,
}: {
  label: string
  active: boolean
  variant: RushSkinsTheme
  onClick: () => void
}) {
  const variantClass = {
    dark: 'bg-bg-overlay text-white',
    light: 'bg-white text-bg-base',
    custom: 'bg-bg-overlay text-accent-orange',
  }[variant]

  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-3 text-left active:scale-95 transition-all ${variantClass} ${active ? 'border-accent-orange' : 'border-border'}`}
    >
      <span className="font-sans text-sm font-semibold">{label}</span>
      <span className={`block mt-3 h-1.5 w-8 rounded-full ${active ? 'bg-accent-orange' : 'bg-text-muted'}`} />
    </button>
  )
}

