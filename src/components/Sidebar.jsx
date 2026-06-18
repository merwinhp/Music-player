import { Library, ListMusic, Sun, Moon } from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { id: 'library', label: 'Library', icon: Library },
  { id: 'playlists', label: 'Playlists', icon: ListMusic },
]

export default function Sidebar({ activeView, onNavigate }) {
  const { theme, toggleTheme } = useApp()

  return (
    <aside
      className="w-20 lg:w-56 backdrop-blur-sm border-r flex flex-col items-center lg:items-start py-8 px-3 gap-2 shrink-0"
      style={{ backgroundColor: 'var(--side-bg)', borderColor: 'var(--side-border)' }}
    >
      <div className="text-2xl mb-4 hidden lg:flex items-center justify-between w-full font-bold text-kawaii-pink px-3">
        <span>♪</span>
        <span className="text-base flex items-center gap-2"><span>(´꒳`)</span><span>♪</span><span>(´∀｀*)</span></span>
      </div>
      <div className="text-2xl mb-6 lg:hidden font-bold text-kawaii-pink">
        ♪
      </div>
      <div className="w-full px-3 mb-3">
        <div className="h-px w-full" style={{ backgroundColor: 'var(--divider)' }} />
      </div>
      <div className="flex-1 w-full flex flex-col gap-2">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-kawaii-pink/20 text-kawaii-pink font-bold shadow-sm'
                  : 'hover:text-kawaii-text'
              }`}
              style={!isActive ? { color: 'var(--side-muted)' } : undefined}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'var(--side-hover)' } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent' } }}
            >
              <Icon size={22} />
              <span className="hidden lg:block text-sm">{item.label}</span>
            </button>
          )
        })}
      </div>
      <button
        onClick={toggleTheme}
        className="w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all duration-200 hover:text-kawaii-text"
        style={{ color: 'var(--side-muted)' }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--side-hover)' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        <span className="hidden lg:block text-sm">{theme === 'light' ? 'Dark' : 'Light'}</span>
      </button>
    </aside>
  )
}
