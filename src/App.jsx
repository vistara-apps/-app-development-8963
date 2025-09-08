import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './components/AuthProvider'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import MoodSelector from './components/MoodSelector'
import RecommendationEngine from './components/RecommendationEngine'
import SavedLists from './components/SavedLists'
import FarcasterFrame from './components/FarcasterFrame'
import TokenBalance from './components/TokenBalance'
import useAppStore from './stores/useAppStore'
import { getUserTokenBalance } from './lib/stripe.js'

function AppContent() {
  const { 
    currentView, 
    setCurrentView, 
    selectedMood, 
    setSelectedMood, 
    userPreferences,
    user,
    setTokenBalance
  } = useAppStore()

  // Update token balance when user changes
  useEffect(() => {
    if (user?.id) {
      getUserTokenBalance(user.id).then(balance => {
        setTokenBalance(balance)
      })
    }
  }, [user, setTokenBalance])

  // Check if we're in frame mode (for Farcaster)
  const isFrameMode = window.location.pathname.includes('/frame')

  if (isFrameMode) {
    return (
      <div className="min-h-screen bg-bg text-text-primary p-4">
        <FarcasterFrame />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Top Bar with Token Balance */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold capitalize">
                  {currentView === 'recommendations' ? 'Discover' : currentView}
                </h2>
              </div>
              
              {user && (
                <div className="flex items-center gap-4">
                  <TokenBalance compact={true} />
                  <div className="flex items-center gap-2">
                    <img 
                      src={user.farcaster?.pfp_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium">
                      {user.farcaster?.displayName || user.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 lg:p-6 overflow-hidden">
              {currentView === 'dashboard' && (
                <Dashboard 
                  selectedMood={selectedMood}
                  setSelectedMood={setSelectedMood}
                  userPreferences={userPreferences}
                />
              )}
              {currentView === 'recommendations' && (
                <RecommendationEngine 
                  selectedMood={selectedMood}
                  userPreferences={userPreferences}
                />
              )}
              {currentView === 'moods' && (
                <MoodSelector 
                  selectedMood={selectedMood}
                  setSelectedMood={setSelectedMood}
                />
              )}
              {currentView === 'lists' && (
                <SavedLists />
              )}
              {currentView === 'tokens' && (
                <div className="max-w-md">
                  <TokenBalance showPurchaseButton={true} />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(230 15% 16%)',
            color: 'hsl(0 0% 95%)',
            border: '1px solid hsl(230 15% 20%)'
          }
        }}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
