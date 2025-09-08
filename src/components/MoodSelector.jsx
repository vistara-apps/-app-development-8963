import { useState } from 'react'

const MoodSelector = ({ selectedMood, setSelectedMood, compact = false }) => {
  const moods = [
    { name: 'Chill', emoji: '😌', color: 'bg-blue-500' },
    { name: 'Energized', emoji: '⚡', color: 'bg-yellow-500' },
    { name: 'Nostalgic', emoji: '🌙', color: 'bg-purple-500' },
    { name: 'Happy', emoji: '😊', color: 'bg-green-500' },
    { name: 'Melancholic', emoji: '🌧️', color: 'bg-gray-500' },
    { name: 'Adventurous', emoji: '🚀', color: 'bg-red-500' },
    { name: 'Romantic', emoji: '💕', color: 'bg-pink-500' },
    { name: 'Focus', emoji: '🎯', color: 'bg-indigo-500' }
  ]

  const genres = [
    'Indie Rock', 'Electronic', 'Jazz', 'Classical', 'Hip Hop', 
    'Ambient', 'Synthwave', 'Lo-fi', 'Post-Rock', 'Experimental'
  ]

  return (
    <div className="space-y-6">
      {!compact && (
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">What's your vibe?</h1>
          <p className="text-text-secondary">
            Select a mood to get personalized recommendations
          </p>
        </div>
      )}

      {/* Mood Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Moods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {moods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => setSelectedMood(mood.name)}
              className={`
                p-4 rounded-lg text-center transition-all duration-200
                ${selectedMood === mood.name 
                  ? 'bg-primary shadow-lg scale-105' 
                  : 'bg-surface hover:bg-gray-700'
                }
              `}
            >
              <div className="text-2xl mb-2">{mood.emoji}</div>
              <div className="text-sm font-medium">{mood.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Genre Chips */}
      {!compact && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Favorite Genres</h3>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                className="px-3 py-1 bg-surface hover:bg-primary rounded-full text-sm transition-colors duration-200"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MoodSelector