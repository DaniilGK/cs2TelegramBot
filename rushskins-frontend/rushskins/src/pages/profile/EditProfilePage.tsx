import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PrivacyOption, useAppStore } from '@/store/useAppStore'

const PRIVACY_OPTIONS: { value: PrivacyOption; label: string }[] = [
  { value: 'everyone', label: 'Все' },
  { value: 'friends', label: 'Друзья' },
  { value: 'nobody', label: 'Никто' },
]

const NEXT_PRIVACY: Record<PrivacyOption, PrivacyOption> = {
  everyone: 'friends',
  friends: 'nobody',
  nobody: 'everyone',
}

const TOGGLE_KNOB_CLASS: Record<PrivacyOption, string> = {
  everyone: 'translate-x-0',
  friends: 'translate-x-3',
  nobody: 'translate-x-7',
}

export function EditProfilePage() {
  const navigate = useNavigate()
  const { user, updateUser } = useAppStore()
  const [username, setUsername] = useState(user.username)
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [bio, setBio] = useState(user.bio ?? '')
  const [bioDraft, setBioDraft] = useState(user.bio ?? '')
  const [isBioOpen, setIsBioOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? '')
  const [itemsPrivacy, setItemsPrivacy] = useState<PrivacyOption>(user.itemsPrivacy ?? 'everyone')
  const [followersPrivacy, setFollowersPrivacy] = useState<PrivacyOption>(user.followersPrivacy ?? 'everyone')
  const [messagesPrivacy, setMessagesPrivacy] = useState<PrivacyOption>(user.messagesPrivacy ?? 'everyone')
  const [toast, setToast] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const initials = (user.username || 'P').slice(0, 1).toUpperCase()

  const showToast = () => {
    setToast('Сохранено')
    setTimeout(() => setToast(null), 2000)
  }

  const handleAvatarSelect = (file?: File) => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const nextAvatarUrl = String(reader.result)
      setAvatarUrl(nextAvatarUrl)
      updateUser({ avatarUrl: nextAvatarUrl })
      showToast()
    }
    reader.readAsDataURL(file)
  }

  const handleUsernameBlur = () => {
    updateUser({ username: username.trim() })
    setIsEditingUsername(false)
    showToast()
  }

  const handleBioDone = () => {
    const nextBio = bioDraft.trim()
    setBio(nextBio)
    updateUser({ bio: nextBio })
    setIsBioOpen(false)
    showToast()
  }

  const cyclePrivacy = (
    value: PrivacyOption,
    setValue: (value: PrivacyOption) => void,
    key: 'itemsPrivacy' | 'followersPrivacy' | 'messagesPrivacy',
  ) => {
    const next = NEXT_PRIVACY[value]
    setValue(next)
    updateUser({ [key]: next })
    showToast()
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
        <h1 className="font-sans text-2xl font-semibold text-text-primary tracking-wide">Edit Profile</h1>
        <p className="text-xs text-text-secondary font-sans">Manage your public RushSkins profile.</p>
      </div>

      <div className="flex justify-center">
        <div className="relative w-20 h-20 rounded-full bg-accent-orange flex items-center justify-center overflow-hidden shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={user.username || 'Player'} className="w-full h-full object-cover" />
          ) : (
            <span className="font-sans text-2xl font-semibold text-white">{initials}</span>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 left-0 right-0 h-7 bg-black/50 rounded-b-full text-[9px] text-white font-sans flex items-center justify-center"
          >
            Изменить
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleAvatarSelect(e.target.files?.[0])}
      />

      <div className="bg-bg-raised border border-border rounded-2xl overflow-hidden">
        <div
          onClick={() => setIsEditingUsername(true)}
          className="w-full px-4 py-3 flex items-center justify-between border-b border-border/60 active:bg-bg-overlay transition-colors"
        >
          <span className="font-sans text-base font-semibold text-text-primary tracking-wide">Никнейм</span>
          {isEditingUsername ? (
            <input
              value={username}
              maxLength={32}
              autoFocus
              onChange={e => setUsername(e.target.value)}
              onBlur={handleUsernameBlur}
              onClick={e => e.stopPropagation()}
              className="bg-bg-overlay border border-border rounded-xl px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-orange/50 text-right"
            />
          ) : (
            <span className="text-sm text-text-secondary font-sans">{user.username || 'Player'}</span>
          )}
        </div>
        <button
          onClick={() => {
            setBioDraft(bio)
            setIsBioOpen(true)
          }}
          className="w-full px-4 py-3 flex items-center justify-between active:bg-bg-overlay transition-colors"
        >
          <span className="font-sans text-base font-semibold text-text-primary tracking-wide">BIO</span>
          <span className="text-sm text-text-secondary font-sans truncate">{bio || 'Добавить'}</span>
        </button>
      </div>

      <div className="bg-bg-raised border border-border rounded-2xl p-4 flex flex-col gap-4">
        <p className="text-xs text-text-muted font-sans uppercase tracking-wider">НАСТРОЙКИ ПРИВАТНОСТИ</p>
        <PrivacyToggle label="Кто видит мои предметы" value={itemsPrivacy} onClick={() => cyclePrivacy(itemsPrivacy, setItemsPrivacy, 'itemsPrivacy')} />
        <PrivacyToggle label="Кто видит моих подписчиков" value={followersPrivacy} onClick={() => cyclePrivacy(followersPrivacy, setFollowersPrivacy, 'followersPrivacy')} />
        <PrivacyToggle label="Кто может писать мне" value={messagesPrivacy} onClick={() => cyclePrivacy(messagesPrivacy, setMessagesPrivacy, 'messagesPrivacy')} />
      </div>

      {isBioOpen && (
        <div className="fixed inset-0 z-[70] bg-bg-base/95 px-4 pt-4 pb-4 flex flex-col gap-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-2xl font-semibold text-text-primary tracking-wide">BIO</h2>
            <button
              onClick={handleBioDone}
              className="px-4 py-2 bg-accent-orange text-white rounded-xl font-sans text-sm font-semibold active:bg-accent-dim active:scale-95 transition-all"
            >
              Готово
            </button>
          </div>
          <textarea
            value={bioDraft}
            maxLength={150}
            onChange={e => setBioDraft(e.target.value)}
            rows={8}
            className="bg-bg-overlay border border-border rounded-xl px-3 py-2 text-sm text-text-primary outline-none resize-none focus:border-accent-orange/50"
          />
          <span className="text-[10px] text-text-muted text-right">{bioDraft.length}/150</span>
        </div>
      )}
      {toast && (
        <div className="fixed left-1/2 bottom-24 z-[60] -translate-x-1/2 rounded-xl bg-bg-overlay border border-border px-4 py-2 text-sm text-text-primary shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

function PrivacyToggle({
  label,
  value,
  onClick,
}: {
  label: string
  value: PrivacyOption
  onClick: () => void
}) {
  const option = PRIVACY_OPTIONS.find(item => item.value === value)

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-text-primary font-sans">{label}</span>
      <button
        type="button"
        onClick={onClick}
        className="shrink-0 flex items-center gap-2 active:scale-95 transition-all"
      >
        <span className="text-xs text-text-secondary font-sans">{option?.label}</span>
        <span className="w-14 h-7 rounded-full bg-bg-overlay border border-border p-1">
          <span className={`block w-5 h-5 rounded-full bg-accent-orange transition-transform ${TOGGLE_KNOB_CLASS[value]}`} />
        </span>
      </button>
    </div>
  )
}

