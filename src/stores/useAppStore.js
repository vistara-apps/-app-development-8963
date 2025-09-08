import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAppStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      tokenBalance: 50,
      
      // App state
      currentView: 'dashboard',
      selectedMood: null,
      recommendations: [],
      savedLists: [],
      userPreferences: {
        favoriteGenres: ['Indie', 'Electronic', 'Alternative'],
        recentActivity: [],
        savedLists: []
      },
      
      // UI state
      loading: false,
      error: null,
      
      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setCurrentView: (view) => set({ currentView: view }),
      
      setSelectedMood: (mood) => set({ selectedMood: mood }),
      
      setRecommendations: (recommendations) => set({ recommendations }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
      setTokenBalance: (balance) => set({ tokenBalance: balance }),
      
      deductTokens: (amount) => set((state) => ({
        tokenBalance: Math.max(0, state.tokenBalance - amount)
      })),
      
      addTokens: (amount) => set((state) => ({
        tokenBalance: state.tokenBalance + amount
      })),
      
      // User preferences
      updateUserPreferences: (preferences) => set((state) => ({
        userPreferences: { ...state.userPreferences, ...preferences }
      })),
      
      addToFavoriteGenres: (genre) => set((state) => ({
        userPreferences: {
          ...state.userPreferences,
          favoriteGenres: [...new Set([...state.userPreferences.favoriteGenres, genre])]
        }
      })),
      
      removeFromFavoriteGenres: (genre) => set((state) => ({
        userPreferences: {
          ...state.userPreferences,
          favoriteGenres: state.userPreferences.favoriteGenres.filter(g => g !== genre)
        }
      })),
      
      // Saved lists management
      createSavedList: (list) => set((state) => ({
        savedLists: [...state.savedLists, {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          ...list
        }]
      })),
      
      updateSavedList: (listId, updates) => set((state) => ({
        savedLists: state.savedLists.map(list =>
          list.id === listId ? { ...list, ...updates } : list
        )
      })),
      
      deleteSavedList: (listId) => set((state) => ({
        savedLists: state.savedLists.filter(list => list.id !== listId)
      })),
      
      addToSavedList: (listId, item) => set((state) => ({
        savedLists: state.savedLists.map(list =>
          list.id === listId
            ? {
                ...list,
                items: [...list.items, {
                  id: Date.now().toString(),
                  addedAt: new Date().toISOString(),
                  ...item
                }]
              }
            : list
        )
      })),
      
      removeFromSavedList: (listId, itemId) => set((state) => ({
        savedLists: state.savedLists.map(list =>
          list.id === listId
            ? {
                ...list,
                items: list.items.filter(item => item.id !== itemId)
              }
            : list
        )
      })),
      
      // Recent activity
      addToRecentActivity: (activity) => set((state) => ({
        userPreferences: {
          ...state.userPreferences,
          recentActivity: [
            {
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              ...activity
            },
            ...state.userPreferences.recentActivity.slice(0, 49) // Keep last 50 activities
          ]
        }
      })),
      
      clearRecentActivity: () => set((state) => ({
        userPreferences: {
          ...state.userPreferences,
          recentActivity: []
        }
      })),
      
      // Reset functions
      resetUser: () => set({
        user: null,
        isAuthenticated: false,
        tokenBalance: 0,
        savedLists: [],
        userPreferences: {
          favoriteGenres: [],
          recentActivity: [],
          savedLists: []
        }
      }),
      
      resetApp: () => set({
        currentView: 'dashboard',
        selectedMood: null,
        recommendations: [],
        loading: false,
        error: null
      })
    }),
    {
      name: 'vibesync-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        tokenBalance: state.tokenBalance,
        savedLists: state.savedLists,
        userPreferences: state.userPreferences,
        selectedMood: state.selectedMood
      })
    }
  )
)

export default useAppStore
