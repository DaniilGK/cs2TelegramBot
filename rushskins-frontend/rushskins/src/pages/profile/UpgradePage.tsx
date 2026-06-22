import { useNavigate } from 'react-router-dom'

export function UpgradePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-6 animate-fade-in">
      <button onClick={() => navigate('/profile')} className="self-start text-sm text-text-secondary active:text-accent-orange">
        ← Назад
      </button>
      <div className="flex flex-1 items-center justify-center">
        <p className="font-display text-3xl font-semibold text-text-primary tracking-wide">Скоро</p>
      </div>
    </div>
  )
}

