import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import MoodSelector from './components/MoodSelector'
import RecommendationEngine from './components/RecommendationEngine'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [selectedMood, setSelectedMood] = useState(null)
  const [userPreferences, setUserPreferences] = useState({
    favoriteGenres: ['Indie', 'Electronic', 'Alternative'],
    recentActivity: [],
    savedLists: []
  })

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-4 lg:p-6">
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
          </div>
        </main>
      </div>
    </div>
  )
}

export default App