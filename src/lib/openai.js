import OpenAI from 'openai'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

if (!apiKey) {
  console.warn('OpenAI API key not found. Using mock recommendations.')
}

const openai = apiKey ? new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
}) : null

// Mock recommendations for development
const mockRecommendations = {
  music: [
    {
      title: 'Midnight Drive',
      artist: 'Synthwave Collective',
      genre: 'Synthwave',
      platform: 'Spotify',
      reason: 'Perfect for late night vibes with nostalgic 80s synths'
    },
    {
      title: 'Forest Meditation',
      artist: 'Ambient Soundscapes',
      genre: 'Ambient',
      platform: 'Apple Music',
      reason: 'Calming nature sounds for relaxation and focus'
    },
    {
      title: 'Electric Nights',
      artist: 'Digital Dreams',
      genre: 'Electronic',
      platform: 'SoundCloud',
      reason: 'High-energy beats for motivation and workout'
    }
  ],
  movies: [
    {
      title: 'Neon Dreams',
      director: 'Alex Chen',
      genre: 'Sci-Fi Thriller',
      platform: 'Netflix',
      reason: 'Cyberpunk aesthetics with mind-bending plot twists'
    },
    {
      title: 'Café Chronicles',
      director: 'Emma Rodriguez',
      genre: 'Indie Drama',
      platform: 'Hulu',
      reason: 'Intimate character study with beautiful cinematography'
    },
    {
      title: 'Mountain Escape',
      director: 'James Wilson',
      genre: 'Adventure',
      platform: 'Prime Video',
      reason: 'Breathtaking landscapes and inspiring journey'
    }
  ]
}

export const generateRecommendations = async (mood, preferences, type = 'both') => {
  if (!openai) {
    // Return mock data when OpenAI is not configured
    console.log('Using mock recommendations')
    const results = []
    
    if (type === 'both' || type === 'music') {
      results.push(...mockRecommendations.music.map(item => ({ ...item, type: 'music' })))
    }
    
    if (type === 'both' || type === 'movie') {
      results.push(...mockRecommendations.movies.map(item => ({ ...item, type: 'movie' })))
    }
    
    return results.slice(0, 6) // Limit to 6 recommendations
  }

  try {
    const prompt = `You are a hyper-niche content recommendation AI for music and movies. 

User Context:
- Current mood: ${mood || 'not specified'}
- Favorite genres: ${preferences?.favoriteGenres?.join(', ') || 'not specified'}
- Content type requested: ${type}

Please recommend ${type === 'both' ? '3 music tracks and 3 movies' : type === 'music' ? '6 music tracks' : '6 movies'} that match this user's mood and preferences. Focus on discovering hidden gems and niche content rather than mainstream hits.

For each recommendation, provide:
- Title
- Artist/Director
- Genre (be specific and niche)
- Platform (Spotify, Apple Music, Netflix, Hulu, etc.)
- Brief reason why it matches their mood/preferences

Format as JSON array with objects containing: title, artist/director, genre, platform, reason, type (music/movie).`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 1000
    })

    const content = completion.choices[0].message.content
    
    try {
      const recommendations = JSON.parse(content)
      return Array.isArray(recommendations) ? recommendations : []
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      return mockRecommendations[type] || []
    }

  } catch (error) {
    console.error('OpenAI API error:', error)
    // Fallback to mock data on error
    const results = []
    
    if (type === 'both' || type === 'music') {
      results.push(...mockRecommendations.music.map(item => ({ ...item, type: 'music' })))
    }
    
    if (type === 'both' || type === 'movie') {
      results.push(...mockRecommendations.movies.map(item => ({ ...item, type: 'movie' })))
    }
    
    return results.slice(0, 6)
  }
}

export const analyzeMoodFromText = async (text) => {
  if (!openai) {
    // Simple keyword-based mood detection for mock mode
    const moodKeywords = {
      'energized': ['energy', 'pump', 'excited', 'active', 'workout'],
      'chill': ['relax', 'calm', 'peaceful', 'zen', 'mellow'],
      'nostalgic': ['memories', 'past', 'vintage', 'classic', 'remember'],
      'melancholic': ['sad', 'blue', 'down', 'emotional', 'deep'],
      'adventurous': ['explore', 'journey', 'travel', 'discover', 'wild']
    }
    
    const lowerText = text.toLowerCase()
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return mood
      }
    }
    
    return 'chill' // Default mood
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Analyze the mood from this text and return one of these moods: energized, chill, nostalgic, melancholic, adventurous, focused, romantic, mysterious.

Text: "${text}"

Return only the mood word, nothing else.`
      }],
      temperature: 0.3,
      max_tokens: 10
    })

    return completion.choices[0].message.content.trim().toLowerCase()
  } catch (error) {
    console.error('Mood analysis error:', error)
    return 'chill'
  }
}
