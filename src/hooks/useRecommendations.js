import { useState, useCallback } from 'react'
import { generateRecommendations } from '../lib/openai'
import { deductTokens, canAffordAction, TOKEN_COSTS } from '../lib/stripe'
import useAppStore from '../stores/useAppStore'
import toast from 'react-hot-toast'

export const useRecommendations = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const {
    user,
    userPreferences,
    selectedMood,
    setRecommendations,
    deductTokens: deductStoreTokens,
    addToRecentActivity,
    tokenBalance
  } = useAppStore()

  const getRecommendations = useCallback(async (mood = null, type = 'both', forceRefresh = false) => {
    setLoading(true)
    setError(null)

    try {
      // Check if user can afford the action
      const affordability = await canAffordAction(user?.id, 'AI_RECOMMENDATION')
      
      if (!affordability.canAfford) {
        toast.error(`Insufficient tokens! You need ${affordability.shortfall} more tokens.`)
        setError(`Insufficient tokens. Need ${affordability.cost} tokens, have ${affordability.balance}.`)
        return []
      }

      const currentMood = mood || selectedMood
      const recommendations = await generateRecommendations(currentMood, userPreferences, type)
      
      // Deduct tokens for the recommendation
      if (user?.id) {
        await deductTokens(user.id, TOKEN_COSTS.AI_RECOMMENDATION, 'AI_RECOMMENDATION')
        deductStoreTokens(TOKEN_COSTS.AI_RECOMMENDATION)
      }

      // Add to recent activity
      addToRecentActivity({
        type: 'recommendation_generated',
        mood: currentMood,
        contentType: type,
        count: recommendations.length
      })

      setRecommendations(recommendations)
      
      toast.success(`Generated ${recommendations.length} recommendations!`)
      return recommendations

    } catch (err) {
      console.error('Error generating recommendations:', err)
      setError(err.message)
      toast.error('Failed to generate recommendations. Please try again.')
      return []
    } finally {
      setLoading(false)
    }
  }, [user, userPreferences, selectedMood, setRecommendations, deductStoreTokens, addToRecentActivity])

  const getRecommendationsByGenre = useCallback(async (genre, type = 'both') => {
    setLoading(true)
    setError(null)

    try {
      // For genre-based recommendations, we can use a simpler approach
      // or modify the OpenAI prompt to focus on genre
      const mockPreferences = {
        ...userPreferences,
        favoriteGenres: [genre]
      }

      const recommendations = await generateRecommendations(null, mockPreferences, type)
      
      addToRecentActivity({
        type: 'genre_exploration',
        genre,
        contentType: type,
        count: recommendations.length
      })

      return recommendations

    } catch (err) {
      console.error('Error generating genre recommendations:', err)
      setError(err.message)
      toast.error('Failed to generate genre recommendations.')
      return []
    } finally {
      setLoading(false)
    }
  }, [userPreferences, addToRecentActivity])

  const saveRecommendation = useCallback(async (recommendation, listId = null) => {
    try {
      if (listId) {
        // Add to existing list
        const { addToSavedList } = useAppStore.getState()
        addToSavedList(listId, recommendation)
      } else {
        // Create new list or add to default
        const { createSavedList } = useAppStore.getState()
        createSavedList({
          name: `${recommendation.type} Discoveries`,
          type: recommendation.type,
          items: [recommendation],
          isPublic: false
        })
      }

      addToRecentActivity({
        type: 'recommendation_saved',
        item: recommendation.title,
        contentType: recommendation.type
      })

      toast.success('Recommendation saved!')
      return true

    } catch (err) {
      console.error('Error saving recommendation:', err)
      toast.error('Failed to save recommendation.')
      return false
    }
  }, [addToRecentActivity])

  const shareRecommendation = useCallback(async (recommendation, comment = '') => {
    try {
      // Check token cost for sharing
      const affordability = await canAffordAction(user?.id, 'SOCIAL_SHARE')
      
      if (!affordability.canAfford) {
        toast.error('Insufficient tokens for sharing!')
        return false
      }

      // Import Farcaster sharing function
      const { shareRecommendation: shareToFarcaster } = await import('../lib/farcaster')
      const result = await shareToFarcaster(recommendation, comment)

      if (result.success) {
        // Deduct tokens
        if (user?.id) {
          await deductTokens(user.id, TOKEN_COSTS.SOCIAL_SHARE, 'SOCIAL_SHARE')
          deductStoreTokens(TOKEN_COSTS.SOCIAL_SHARE)
        }

        addToRecentActivity({
          type: 'recommendation_shared',
          item: recommendation.title,
          platform: 'farcaster',
          contentType: recommendation.type
        })

        toast.success('Shared to Farcaster!')
        return true
      } else {
        toast.error('Failed to share recommendation.')
        return false
      }

    } catch (err) {
      console.error('Error sharing recommendation:', err)
      toast.error('Failed to share recommendation.')
      return false
    }
  }, [user, deductStoreTokens, addToRecentActivity])

  return {
    loading,
    error,
    getRecommendations,
    getRecommendationsByGenre,
    saveRecommendation,
    shareRecommendation,
    tokenBalance,
    canAfford: (action) => tokenBalance >= (TOKEN_COSTS[action] || 0)
  }
}
