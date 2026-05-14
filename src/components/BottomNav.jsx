import { NavLink } from 'react-router-dom'
import { Home, Search, BarChart3, Settings, Languages } from 'lucide-react'

const items = [
  { to: '/', label: 'Vocab', icon: Home, end: true },
  { to: '/hiragana', label: 'Hiragana', icon: Languages },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/progress', label: 'Progress', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 border-t border-line bg-bg/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-3xl mx-auto grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 py-3 text-xs transition ${
                isActive ? 'text-accent' : 'text-muted hover:text-ink'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
