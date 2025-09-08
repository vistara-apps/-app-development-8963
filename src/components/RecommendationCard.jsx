import { useState } from 'react'
import { Play, Heart, Share2, Clock, Music, Film } from 'lucide-react'

const RecommendationCard = ({ item }) => {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
  }

  const handleSave = () => {
    setSaved(!saved)
  }

  const handleShare = () => {
    // Mock share functionality
    console.log('Sharing:', item.title)
  }

  return (
    <div className="bg-surface rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button className="w-12 h-12 bg-accent rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <Play size={20} className="text-white ml-1" />
          </button>
        </div>

        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <div className="flex items-center gap-1 bg-black bg-opacity-70 px-2 py-1 rounded-md">
            {item.type === 'music' ? <Music size={12} /> : <Film size={12} />}
            <span className="text-xs capitalize">{item.type}</span>
          </div>
        </div>

        {/* Duration */}
        <div className="absolute top-2 right-2">
          <div className="flex items-center gap-1 bg-black bg-opacity-70 px-2 py-1 rounded-md">
            <Clock size={12} />
            <span className="text-xs">{item.duration}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-text-primary mb-1 line-clamp-1">
            {item.title}
          </h3>
          <p className="text-sm text-text-secondary">
            {item.type === 'music' ? item.artist : item.director}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
            {item.genre}
          </span>
          <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
            {item.mood}
          </span>
        </div>

        {/* Platform */}
        <div className="text-xs text-text-secondary mb-3">
          Available on {item.platform}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors ${
                liked ? 'bg-red-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            </button>
            
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <Share2 size={16} />
            </button>
          </div>

          <button
            onClick={handleSave}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              saved 
                ? 'bg-accent text-black' 
                : 'bg-transparent border border-accent text-accent hover:bg-accent hover:text-black'
            }`}
          >
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RecommendationCard