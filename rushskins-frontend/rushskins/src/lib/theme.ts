export type RushSkinsTheme = 'dark' | 'light' | 'custom'

const THEME_KEY = 'rushskins_theme'
const ACCENT_KEY = 'rushskins_accent'

export function applyTheme(theme: RushSkinsTheme, accent = '#FF5C00') {
  const root = document.documentElement
  const isLight = theme === 'light'
  const bg = isLight ? '#FFFFFF' : '#0A0A0C'
  const text = isLight ? '#0A0A0C' : '#FFFFFF'
  const colorAccent = theme === 'custom' ? accent : '#FF5C00'

  root.style.setProperty('--bg-primary', bg)
  root.style.setProperty('--text-primary', text)
  root.style.setProperty('--color-accent', colorAccent)
  root.style.setProperty('--rs-bg', bg)
  root.style.setProperty('--rs-text', text)
  root.style.setProperty('--rs-accent', colorAccent)
}

export function saveTheme(theme: RushSkinsTheme, accent?: string) {
  localStorage.setItem(THEME_KEY, theme)
  if (accent) localStorage.setItem(ACCENT_KEY, accent)
  applyTheme(theme, accent ?? localStorage.getItem(ACCENT_KEY) ?? '#FF5C00')
}

export function applyStoredTheme() {
  const theme = (localStorage.getItem(THEME_KEY) as RushSkinsTheme | null) ?? 'dark'
  const accent = localStorage.getItem(ACCENT_KEY) ?? '#FF5C00'
  applyTheme(theme, accent)
}

