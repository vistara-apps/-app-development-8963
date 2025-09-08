import { useState } from 'react'
import { 
  Home, 
  Music, 
  Film, 
  Heart, 
  List, 
  Settings, 
  User,
  Menu,
  X
} from 'lucide-react'

const Sidebar = ({ currentView, setCurrentView }) => {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'recommendations', icon: Music, label: 'Discover' },
    { id: 'moods', icon: Heart, label: 'Moods' },
    { id: 'movies', icon: Film, label: 'Movies' },
    { id: 'lists', icon: List, label: 'My Lists' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 h-full bg-surface border-r border-gray-800 z-40
      `}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 gradient-bg rounded-md flex items-center justify-center">
              <Music size={18} className="text-white" />
            </div>
            <h1 className="text-xl font-bold">VibeSync</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id)
                    setIsOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-md text-left
                    transition-colors duration-200
                    ${currentView === item.id 
                      ? 'bg-primary text-white' 
                      : 'text-text-secondary hover:bg-gray-800 hover:text-text-primary'
                    }
                  `}
                >
                  <IconComponent size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* User Section */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-md">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Anonymous</p>
              <p className="text-xs text-text-secondary">Free Tier</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar