import { useState, useEffect } from 'react'
import { Search, Filter, RefreshCw, Sparkles } from 'lucide-react'
import RecommendationCard from './RecommendationCard'
import FilterChips from './FilterChips'

const RecommendationEngine = ({ selectedMood, userPreferences }) => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    type: 'all',
    genre: 'all',
    platform: 'all'
  })
  const [searchQuery, setSearchQuery] = useState('')

  // Extended mock data
  const mockData = [
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
      genre: 'Sci-Fi',
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
    },
    {
      id: 4,
      type: 'movie',
      title: 'Café Chronicles',
      director: 'Emma Rodriguez',
      genre: 'Indie Drama',
      mood: 'Melancholic',
      platform: 'Hulu',
      image: 'https://images.unsplash.com/photo-1489599142094-da5cdba4bc09?w=300&h=400&fit=crop',
      duration: '95 min'
    },
    {
      id: 5,
      type: 'music',
      title: 'Electric Nights',
      artist: 'Digital Dreams',
      genre: 'Electronic',
      mood: 'Energized',
      platform: 'SoundCloud',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
      duration: '6:21'
    },
    {
      id: 6,
      type: 'movie',
      title: 'Mountain Escape',
      director: 'James Wilson',
      genre: 'Adventure',
      mood: 'Adventurous',
      platform: 'Prime Video',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop',
      duration: '142 min'
    }
  ]

  const generateRecommendations = () => {
    setLoading(true)
    
    // Simulate AI recommendation logic
    setTimeout(() => {
      let filtered = [...mockData]
      
      // Filter by mood if selected
      if (selectedMood) {
        filtered = filtered.filter(item => 
          item.mood.toLowerCase() === selectedMood.toLowerCase()
        )
      }
      
      // Apply filters
      if (filters.type !== 'all') {
        filtered = filtered.filter(item => item.type === filters.type)
      }
      
      if (filters.genre !== 'all') {
        filtered = filtered.filter(item => 
          item.genre.toLowerCase().includes(filters.genre.toLowerCase())
        )
      }
      
      if (filters.platform !== 'all') {
        filtered = filtered.filter(item => item.platform === filters.platform)
      }
      
      // Search filter
      if (searchQuery) {
        filtered = filtered.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.artist && item.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.director && item.director.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      }
      
      // If no results, show all
      if (filtered.length === 0) {
        filtered = mockData
      }
      
      setRecommendations(filtered)
      setLoading(false)
    }, 1500)
  }

  useEffect(() => {
    generateRecommendations()
  }, [selectedMood, filters, searchQuery])

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="text-accent" size={24} />
          <h1 className="text-3xl font-bold">Discover</h1>
        </div>
        <p className="text-text-secondary">
          AI-powered recommendations based on your mood and preferences
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
          <input
            type="text"
            placeholder="Search for music, movies, or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface rounded-lg border border-gray-700 focus:border-accent focus:outline-none"
          />
        </div>

        {/* Filter Chips */}
        <FilterChips filters={filters} setFilters={setFilters} />

        {/* Generate Button */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-text-secondary">
            {selectedMood && `Filtering by mood: ${selectedMood}`}
          </div>
          <button
            onClick={generateRecommendations}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {loading ? 'Generating recommendations...' : `${recommendations.length} recommendations`}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
    </div>
  )
}

export default RecommendationEngine