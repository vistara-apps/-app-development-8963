import axios from 'axios'

const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2'

if (!NEYNAR_API_KEY) {
  console.warn('Neynar API key not found. Using mock Farcaster data.')
}

const neynarClient = axios.create({
  baseURL: NEYNAR_BASE_URL,
  headers: {
    'api_key': NEYNAR_API_KEY,
    'Content-Type': 'application/json'
  }
})

// Mock user data for development
const mockFarcasterUser = {
  fid: 12345,
  username: 'vibesync_user',
  display_name: 'VibeSync User',
  pfp_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
  follower_count: 128,
  following_count: 89,
  bio: 'Discovering the perfect vibe for every moment 🎵🎬'
}

export const getFarcasterUser = async (fid) => {
  if (!NEYNAR_API_KEY) {
    console.log('Using mock Farcaster user data')
    return mockFarcasterUser
  }

  try {
    const response = await neynarClient.get(`/farcaster/user?fid=${fid}`)
    return response.data.result.user
  } catch (error) {
    console.error('Error fetching Farcaster user:', error)
    return mockFarcasterUser
  }
}

export const getUserCasts = async (fid, limit = 10) => {
  if (!NEYNAR_API_KEY) {
    console.log('Using mock cast data')
    return [
      {
        hash: '0x123',
        text: 'Just discovered this amazing synthwave track! Perfect for late night coding sessions 🌃',
        timestamp: new Date().toISOString(),
        reactions: { likes: 12, recasts: 3 }
      },
      {
        hash: '0x456',
        text: 'Movie recommendation: "Blade Runner 2049" - the cinematography is absolutely stunning',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        reactions: { likes: 8, recasts: 2 }
      }
    ]
  }

  try {
    const response = await neynarClient.get(`/farcaster/casts?fid=${fid}&limit=${limit}`)
    return response.data.result.casts
  } catch (error) {
    console.error('Error fetching user casts:', error)
    return []
  }
}

export const createCast = async (text, parentHash = null) => {
  if (!NEYNAR_API_KEY) {
    console.log('Mock cast created:', text)
    return {
      success: true,
      hash: '0x' + Math.random().toString(16).substr(2, 8),
      message: 'Cast created successfully (mock)'
    }
  }

  try {
    const payload = {
      text,
      ...(parentHash && { parent: parentHash })
    }

    const response = await neynarClient.post('/farcaster/casts', payload)
    return {
      success: true,
      hash: response.data.result.cast.hash,
      message: 'Cast created successfully'
    }
  } catch (error) {
    console.error('Error creating cast:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export const shareRecommendation = async (recommendation, userComment = '') => {
  const castText = userComment 
    ? `${userComment}\n\n🎵 ${recommendation.title} by ${recommendation.artist || recommendation.director}\nGenre: ${recommendation.genre}\nPlatform: ${recommendation.platform}\n\n#VibeSync #${recommendation.type}`
    : `Just discovered: ${recommendation.title} by ${recommendation.artist || recommendation.director}\nGenre: ${recommendation.genre} on ${recommendation.platform}\n\nPerfect for my current vibe! 🎵\n\n#VibeSync #${recommendation.type}`

  return await createCast(castText)
}

export const sharePlaylist = async (playlist, userComment = '') => {
  const castText = userComment
    ? `${userComment}\n\n📝 My ${playlist.name} playlist (${playlist.items.length} items)\nCreated with VibeSync\n\n#VibeSync #playlist`
    : `Check out my "${playlist.name}" playlist! 📝\n${playlist.items.length} carefully curated ${playlist.type} recommendations\n\nCreated with VibeSync ✨\n\n#VibeSync #playlist`

  return await createCast(castText)
}

// Frame-specific functions for Farcaster frames
export const generateFrameMetadata = (title, description, imageUrl, actionUrl) => {
  return {
    'fc:frame': 'vNext',
    'fc:frame:title': title,
    'fc:frame:description': description,
    'fc:frame:image': imageUrl,
    'fc:frame:button:1': 'Get Recommendations',
    'fc:frame:button:2': 'Share Vibe',
    'fc:frame:post_url': actionUrl,
    'og:title': title,
    'og:description': description,
    'og:image': imageUrl
  }
}

export const handleFrameAction = async (frameData) => {
  // Process frame button clicks and return appropriate response
  const { buttonIndex, inputText, fid } = frameData

  switch (buttonIndex) {
    case 1: // Get Recommendations
      return {
        type: 'recommendations',
        data: await generateFrameRecommendations(fid, inputText)
      }
    case 2: // Share Vibe
      return {
        type: 'share',
        data: await shareCurrentVibe(fid, inputText)
      }
    default:
      return {
        type: 'error',
        message: 'Invalid action'
      }
  }
}

const generateFrameRecommendations = async (fid, mood) => {
  // This would integrate with the OpenAI service
  return {
    mood,
    recommendations: [
      { title: 'Midnight Drive', artist: 'Synthwave Collective', type: 'music' },
      { title: 'Neon Dreams', director: 'Alex Chen', type: 'movie' }
    ]
  }
}

const shareCurrentVibe = async (fid, vibe) => {
  const castText = `Current vibe: ${vibe} 🎵\n\nWhat's your vibe today? Drop it in the comments!\n\n#VibeSync #mood`
  return await createCast(castText)
}
