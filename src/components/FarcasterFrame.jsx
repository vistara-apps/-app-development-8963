import { useState, useEffect } from 'react'
import { Sparkles, Share2, Heart, RefreshCw } from 'lucide-react'
import { generateRecommendations } from '../lib/openai'
import { shareRecommendation, createCast } from '../lib/farcaster'
import useAppStore from '../stores/useAppStore'
import toast from 'react-hot-toast'

const FarcasterFrame = ({ frameData, onAction }) => {
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [currentMood, setCurrentMood] = useState('')
  const [step, setStep] = useState('input') // input, recommendations, share
  
  const { user, userPreferences } = useAppStore()

  const moods = [
    { id: 'energized', label: '⚡ Energized', color: 'bg-yellow-500' },
    { id: 'chill', label: '😌 Chill', color: 'bg-blue-500' },
    { id: 'nostalgic', label: '🌅 Nostalgic', color: 'bg-purple-500' },
    { id: 'adventurous', label: '🏔️ Adventurous', color: 'bg-green-500' },
    { id: 'romantic', label: '💕 Romantic', color: 'bg-pink-500' },
    { id: 'focused', label: '🎯 Focused', color: 'bg-indigo-500' }
  ]

  const handleMoodSelect = async (mood) => {
    setCurrentMood(mood)
    setLoading(true)
    setStep('recommendations')

    try {
      const recs = await generateRecommendations(mood, userPreferences, 'both')
      setRecommendations(recs.slice(0, 3)) // Limit to 3 for frame display
      
      // Notify parent component of action
      if (onAction) {
        onAction({
          type: 'mood_selected',
          mood,
          recommendations: recs.slice(0, 3)
        })
      }
    } catch (error) {
      console.error('Error generating recommendations:', error)
      toast.error('Failed to generate recommendations')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async (recommendation) => {
    setLoading(true)
    
    try {
      const result = await shareRecommendation(recommendation, 
        `Just discovered this gem through VibeSync! Perfect for my ${currentMood} mood 🎵`
      )
      
      if (result.success) {
        toast.success('Shared to Farcaster!')
        setStep('share')
        
        if (onAction) {
          onAction({
            type: 'recommendation_shared',
            recommendation,
            castHash: result.hash
          })
        }
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error('Failed to share recommendation')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep('input')
    setCurrentMood('')
    setRecommendations([])
  }

  // Input step - mood selection
  if (step === 'input') {
    return (
      <div className="bg-gradient-to-br from-primary to-accent p-6 rounded-lg text-white min-h-[400px] flex flex-col">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={24} />
            <h1 className="text-2xl font-bold">VibeSync</h1>
          </div>
          <p className="text-white/80">
            Discover music & movies that match your vibe
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-lg font-semibold mb-4 text-center">
            What's your current mood?
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                disabled={loading}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all disabled:opacity-50 text-center"
              >
                <div className="text-lg font-medium">
                  {mood.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-white/60 mt-4">
          Powered by AI • Built for Farcaster
        </div>
      </div>
    )
  }

  // Recommendations step
  if (step === 'recommendations') {
    return (
      <div className="bg-surface p-6 rounded-lg min-h-[400px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
            <h2 className="text-lg font-semibold">
              {currentMood.charAt(0).toUpperCase() + currentMood.slice(1)} Vibes
            </h2>
          </div>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-text-secondary">Generating recommendations...</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{rec.title}</h3>
                    <p className="text-text-secondary text-xs">
                      {rec.artist || rec.director} • {rec.genre}
                    </p>
                    <p className="text-xs text-accent mt-1">{rec.platform}</p>
                  </div>
                  <button
                    onClick={() => handleShare(rec)}
                    disabled={loading}
                    className="p-2 bg-accent text-black rounded hover:bg-accent/90 transition-colors disabled:opacity-50"
                  >
                    <Share2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={() => handleMoodSelect(currentMood)}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm"
          >
            <RefreshCw size={14} className="inline mr-2" />
            Get More
          </button>
        </div>
      </div>
    )
  }

  // Share confirmation step
  if (step === 'share') {
    return (
      <div className="bg-surface p-6 rounded-lg min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
          <Heart size={24} className="text-white" />
        </div>
        
        <h2 className="text-xl font-semibold mb-2">Shared Successfully!</h2>
        <p className="text-text-secondary mb-6">
          Your recommendation has been shared to Farcaster
        </p>

        <div className="space-y-3 w-full max-w-xs">
          <button
            onClick={handleReset}
            className="w-full py-2 px-4 bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors"
          >
            Discover More
          </button>
          
          <button
            onClick={() => window.open('https://warpcast.com', '_blank')}
            className="w-full py-2 px-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
          >
            View on Warpcast
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default FarcasterFrame
