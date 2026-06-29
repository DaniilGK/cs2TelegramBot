import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Diamond,
  Link2,
  Megaphone,
  MessageCircle,
  ShoppingCart,
  Target,
  Ticket,
  UserPlus,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useTelegram } from '@/hooks/useTelegram'

const drops = [
  { name: 'AWP Dragon Lore', player: 'Daniil', price: '1823', rarityColor: '#E4AE39' },
  { name: 'AK-47 Redline', player: 'Alex', price: '12.50', rarityColor: '#8847FF' },
  { name: 'M4A4 Howl', player: 'Ivan', price: '890', rarityColor: '#EB4B4B' },
  { name: 'Glock Fade', player: 'Max', price: '45', rarityColor: '#D32CE6' },
  { name: 'USP Orion', player: 'Kirill', price: '8.20', rarityColor: '#4B69FF' },
  { name: 'Desert Eagle Blaze', player: 'Roma', price: '67', rarityColor: '#EB4B4B' },
  { name: 'AK Vulcan', player: 'Sasha', price: '28', rarityColor: '#D32CE6' },
  { name: 'AWP Asiimov', player: 'Nikita', price: '95', rarityColor: '#EB4B4B' },
  { name: 'M4A1-S Hyper Beast', player: 'Denis', price: '18', rarityColor: '#8847FF' },
  { name: 'Knife Doppler', player: 'Artem', price: '234', rarityColor: '#E4AE39' },
]

const TASKS = [
  { Icon: UserPlus, color: 'bg-[#FF5C00]', label: 'Пригласи друга с CS2', reward: '+50 RC' },
  { Icon: Link2, color: 'bg-[#1A9FFF]', label: 'Подключи Steam', reward: '+30 RC' },
  { Icon: Target, color: 'bg-[#FF5500]', label: 'Подключи Faceit', reward: '+30 RC' },
  { Icon: MessageCircle, color: 'bg-[#7C3AED]', label: 'Вступи в комьюнити', reward: '+20 RC' },
]

const ANNOUNCEMENTS = [
  {
    title: 'Новые кейсы добавлены',
    date: '23 июн',
    text: 'Проверь раздел Cases — новые кейсы уже доступны!',
  },
  {
    title: 'Сезон 1 начался',
    date: '20 июн',
    text: 'Борись за топ-3 и получи эксклюзивный приз в конце месяца',
  },
]

function getEndOfDayMs() {
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  return Math.max(0, end.getTime() - Date.now())
}

function getEndOfWeekMs() {
  const end = new Date()
  const day = end.getDay()
  const daysUntilSunday = (7 - day) % 7
  end.setDate(end.getDate() + daysUntilSunday)
  end.setHours(23, 59, 59, 999)
  return Math.max(0, end.getTime() - Date.now())
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const time = [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':')

  if (days > 0) return `${days} дн ${time}`
  return time
}

export function HomePage() {
  const { user } = useAppStore()
  const { haptic } = useTelegram()
  const navigate = useNavigate()
  const [toast, setToast] = useState<string | null>(null)
  const [dailyMs, setDailyMs] = useState(getEndOfDayMs())
  const [weeklyMs, setWeeklyMs] = useState(getEndOfWeekMs())
  const displayName = user.username || 'Player'
  const initials = displayName.slice(0, 1).toUpperCase()

  useEffect(() => {
    const timer = setInterval(() => {
      setDailyMs(getEndOfDayMs())
      setWeeklyMs(getEndOfWeekMs())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const showSoonToast = () => {
    haptic('light')
    setToast('Скоро доступно')
    setTimeout(() => setToast(null), 2000)
  }

  return (
    // <div className="flex flex-col h-full gap-4 overflow-y-auto animate-fade-in bg-[#0D0D0D]">
    <div className="flex flex-col min-h-screen gap-4 overflow-y-auto animate-fade-in bg-[#0D0D0D] pb-28">
      <div className="overflow-hidden bg-[#141414] border-b border-[#1A1A1A] w-full">
        <div className="flex animate-marquee w-max">
          {[...drops, ...drops].map((drop, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5 border-r border-[#1A1A1A]">
              <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{background: drop.rarityColor}} />
              <div>
                <p className="text-[11px] font-semibold text-white whitespace-nowrap">{drop.name}</p>
                <p className="text-[10px] text-[#A0A0A0] whitespace-nowrap">{drop.player}</p>
              </div>
              <p className="text-[11px] font-bold text-[#F59E0B] ml-2 whitespace-nowrap">${drop.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#FF5C00] flex items-center justify-center overflow-hidden flex-shrink-0">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-white">{user.username?.[0]?.toUpperCase()}</span>
            )}
          </div>
          <span className="text-sm font-semibold text-white">{displayName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/deposit')}
            className="flex items-center gap-1.5 bg-[#FF5C00]/10 border border-[#FF5C00]/30 rounded-full px-3 py-1.5 active:scale-95 transition-all"
          >
            <Diamond size={13} className="text-[#FF5C00]" />
            <span className="text-xs font-bold text-[#FF5C00]">{Math.floor(user.balance / 100).toLocaleString()} RC</span>
          </button>
          <div className="flex items-center gap-1.5 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-full px-3 py-1.5">
            <Ticket size={13} className="text-[#7C3AED]" />
            <span className="text-xs font-bold text-[#7C3AED]">{user.tickets.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <section className="px-4">
        <p className="text-xs text-[#555555] font-semibold mb-2 uppercase tracking-wider">ЗАДАНИЯ</p>
        <div className="bg-[#141414] border border-[#1A1A1A] rounded-2xl overflow-hidden">
          {TASKS.map(task => (
            <button
              key={task.label}
              onClick={showSoonToast}
              className="w-full px-4 py-3 flex items-center gap-3 border-b border-[#1A1A1A] last:border-b-0 active:bg-[#1A1A1A] transition-colors"
            >
              <div className={`w-9 h-9 rounded-xl ${task.color} flex items-center justify-center flex-shrink-0`}>
                <task.Icon size={18} className="text-white" />
              </div>
              <span className="flex-1 text-sm font-semibold text-white text-left">{task.label}</span>
              <span className="text-xs font-bold text-[#10B981] shrink-0">{task.reward}</span>
              <ChevronRight size={16} className="text-[#555555]" />
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="text-xs text-[#555555] font-semibold mb-2 uppercase tracking-wider px-4">РОЗЫГРЫШИ</p>
        <div className="flex gap-3 overflow-x-auto px-4">
          <RaffleCard
            title="Дейли розыгрыш"
            prize="AK-47 Redline"
            timer={formatCountdown(dailyMs)}
            cost="5 тикетов"
            participants="47 участников"
            onJoin={showSoonToast}
          />
          <RaffleCard
            title="Недельный розыгрыш"
            prize="AWP Asiimov"
            timer={formatCountdown(weeklyMs)}
            cost="20 тикетов"
            participants="203 участника"
            onJoin={showSoonToast}
          />
        </div>
      </section>

      <button
        onClick={() => navigate('/market')}
        className="mx-4 w-[calc(100%-2rem)] flex items-center gap-3 bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4 active:scale-[0.98] transition-all"
      >
        <div className="w-10 h-10 rounded-xl bg-[#FF5C00]/10 flex items-center justify-center">
          <ShoppingCart size={20} className="text-[#FF5C00]" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-white">Маркет скинов</p>
          <p className="text-xs text-[#A0A0A0]">Купи скин напрямую</p>
        </div>
        <ChevronRight size={16} className="text-[#555555]" />
      </button>

      <section className="px-4 pb-4">
        <p className="text-xs text-[#555555] font-semibold mb-2 uppercase tracking-wider">АНОНСЫ</p>
        <div className="flex flex-col gap-2">
          {ANNOUNCEMENTS.map(item => (
            <div key={item.title} className="bg-[#141414] rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <Megaphone size={14} className="text-[#FF5C00]" />
                <p className="text-sm font-semibold text-white flex-1">{item.title}</p>
                <span className="text-[10px] text-[#555555]">{item.date}</span>
              </div>
              <p className="text-xs text-[#A0A0A0] mt-1 line-clamp-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {toast && (
        <div className="fixed left-1/2 bottom-24 z-[60] -translate-x-1/2 rounded-xl bg-bg-overlay border border-border px-4 py-2 text-sm text-text-primary shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

function RaffleCard({
  title,
  prize,
  timer,
  cost,
  participants,
  onJoin,
}: {
  title: string
  prize: string
  timer: string
  cost: string
  participants: string
  onJoin: () => void
}) {
  return (
    <div className="w-64 flex-shrink-0 bg-[#141414] border border-[#FF5C00]/20 rounded-2xl p-4">
      <p className="font-bold text-white text-sm">{title}</p>
      <p className="text-[#F59E0B] text-xs font-semibold mt-1">{prize}</p>
      <p className="text-white font-black text-lg mt-3">{timer}</p>
      <div className="flex items-center gap-1.5 mt-2">
        <Ticket size={13} className="text-[#7C3AED]" />
        <p className="text-[#7C3AED] text-xs">{cost}</p>
      </div>
      <p className="text-[#A0A0A0] text-xs mt-1">{participants}</p>
      <button
        onClick={onJoin}
        className="w-full mt-3 px-4 py-2 bg-[#FF5C00] text-white rounded-xl text-sm font-semibold active:scale-95 transition-all"
      >
        Участвовать
      </button>
    </div>
  )
}
