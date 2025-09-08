import { useState, useEffect } from 'react'
import { Play, Heart, Share2, Clock, TrendingUp } from 'lucide-react'
import MoodSelector from './MoodSelector'
import RecommendationCard from './RecommendationCard'
import StatsCard from './StatsCard'

const Dashboard = ({ selectedMood, setSelectedMood, userPreferences }) => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  // Mock recommendations data
  const mockRecommendations = [
    {
      id: 1,
      type: 'music',
      title: 'Midnight Drive',
      artist: 'Synthwave Collective',
      genre: 'Synthwave',
      mood: 'Nostalgic',
      platform: 'Spotify',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      duration: '4:32'
    },
    {
      id: 2,
      type: 'movie',
      title: 'Neon Dreams',
      director: 'Alex Chen',
      genre: 'Sci-Fi Thriller',
      mood: 'Energized',
      platform: 'Netflix',
      image: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=400&fit=crop',
      duration: '118 min'
    },
    {
      id: 3,
      type: 'music',
      title: 'Forest Meditation',
      artist: 'Ambient Soundscapes',
      genre: 'Ambient',
      mood: 'Chill',
      platform: 'Apple Music',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
      duration: '8:45'
    }
  ]

  const stats = [
    { label: 'Discovered', value: '128', icon: TrendingUp, color: 'text-accent' },
    { label: 'Saved', value: '42', icon: Heart, color: 'text-red-400' },
    { label: 'Hours Listened', value: '67', icon: Clock, color: 'text-blue-400' },
  ]

  useEffect(() => {
    // Simulate API call for recommendations
    setLoading(true)
    setTimeout(() => {
      setRecommendations(mockRecommendations)
      setLoading(false)
    }, 1000)
  }, [selectedMood])

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-text-secondary">
          Discover new content that matches your vibe
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Mood Selector */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">How are you feeling?</h2>
        <MoodSelector 
          selectedMood={selectedMood} 
          setSelectedMood={setSelectedMood}
          compact={true}
        />
      </div>

      {/* Current Vibe Section */}
      {selectedMood && (
        <div className="mb-6 p-4 bg-surface rounded-lg glass-effect">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            <h3 className="text-lg font-semibold">Current Vibe: {selectedMood}</h3>
          </div>
          <p className="text-text-secondary text-sm">
            Finding content that matches your {selectedMood.toLowerCase()} mood...
          </p>
        </div>
      )}

      {/* Recommendations */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recommended for You</h2>
          <button className="text-accent hover:text-accent/80 text-sm font-medium">
            View All
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface rounded-lg p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-700 rounded-md mb-3"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((item) => (
              <RecommendationCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-surface rounded-lg p-4">
          <div className="text-center text-text-secondary py-8">
            <Clock size={32} className="mx-auto mb-2 opacity-50" />
            <p>No recent activity yet</p>
            <p className="text-sm">Start discovering to see your activity here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard