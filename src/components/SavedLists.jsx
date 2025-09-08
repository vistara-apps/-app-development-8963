import { useState } from 'react'
import { Plus, List, Music, Film, Share2, Trash2, Edit3, Eye, EyeOff } from 'lucide-react'
import useAppStore from '../stores/useAppStore'
import { sharePlaylist } from '../lib/farcaster'
import toast from 'react-hot-toast'

const SavedLists = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingList, setEditingList] = useState(null)
  const [newListName, setNewListName] = useState('')
  const [newListType, setNewListType] = useState('both')
  
  const { 
    savedLists, 
    createSavedList, 
    updateSavedList, 
    deleteSavedList,
    removeFromSavedList 
  } = useAppStore()

  const handleCreateList = () => {
    if (!newListName.trim()) {
      toast.error('Please enter a list name')
      return
    }

    createSavedList({
      name: newListName,
      type: newListType,
      items: [],
      isPublic: false
    })

    setNewListName('')
    setNewListType('both')
    setShowCreateModal(false)
    toast.success('List created successfully!')
  }

  const handleShareList = async (list) => {
    try {
      const result = await sharePlaylist(list, 
        `Check out my curated ${list.name} list! 🎵🎬`
      )
      
      if (result.success) {
        toast.success('List shared to Farcaster!')
      }
    } catch (error) {
      console.error('Error sharing list:', error)
      toast.error('Failed to share list')
    }
  }

  const handleToggleVisibility = (listId, currentVisibility) => {
    updateSavedList(listId, { isPublic: !currentVisibility })
    toast.success(`List is now ${!currentVisibility ? 'public' : 'private'}`)
  }

  const handleDeleteList = (listId, listName) => {
    if (window.confirm(`Are you sure you want to delete "${listName}"?`)) {
      deleteSavedList(listId)
      toast.success('List deleted')
    }
  }

  const getListIcon = (type) => {
    switch (type) {
      case 'music': return <Music size={16} />
      case 'movie': return <Film size={16} />
      default: return <List size={16} />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'music': return 'text-blue-400'
      case 'movie': return 'text-purple-400'
      default: return 'text-accent'
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Lists</h1>
          <p className="text-text-secondary">
            Organize your favorite discoveries
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-accent text-black px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
        >
          <Plus size={16} />
          New List
        </button>
      </div>

      {/* Lists Grid */}
      {savedLists.length === 0 ? (
        <div className="text-center py-12">
          <List size={48} className="mx-auto text-text-secondary mb-4" />
          <h3 className="text-xl font-semibold mb-2">No lists yet</h3>
          <p className="text-text-secondary mb-6">
            Create your first list to start organizing your discoveries
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-accent text-black px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
          >
            Create Your First List
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedLists.map((list) => (
            <div key={list.id} className="bg-surface rounded-lg p-6 border border-gray-700">
              {/* List Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={getTypeColor(list.type)}>
                    {getListIcon(list.type)}
                  </div>
                  <h3 className="font-semibold truncate">{list.name}</h3>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleVisibility(list.id, list.isPublic)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                    title={list.isPublic ? 'Make private' : 'Make public'}
                  >
                    {list.isPublic ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  
                  <button
                    onClick={() => setEditingList(list)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                    title="Edit list"
                  >
                    <Edit3 size={14} />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteList(list.id, list.name)}
                    className="p-1 hover:bg-gray-700 rounded transition-colors text-red-400"
                    title="Delete list"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* List Stats */}
              <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
                <span>{list.items?.length || 0} items</span>
                <span>{list.isPublic ? 'Public' : 'Private'}</span>
              </div>

              {/* Recent Items Preview */}
              <div className="space-y-2 mb-4">
                {(list.items || []).slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex-1 truncate">
                      <span className="font-medium">{item.title}</span>
                      {item.artist && (
                        <span className="text-text-secondary ml-2">by {item.artist}</span>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromSavedList(list.id, item.id)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors text-red-400 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                
                {(list.items?.length || 0) > 3 && (
                  <div className="text-xs text-text-secondary">
                    +{list.items.length - 3} more items
                  </div>
                )}
                
                {(list.items?.length || 0) === 0 && (
                  <div className="text-xs text-text-secondary italic">
                    No items yet
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleShareList(list)}
                  disabled={!list.items?.length}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <Share2 size={14} />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New List</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">List Name</label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="My Awesome Playlist"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-accent focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">List Type</label>
                <select
                  value={newListType}
                  onChange={(e) => setNewListType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-accent focus:outline-none"
                >
                  <option value="both">Music & Movies</option>
                  <option value="music">Music Only</option>
                  <option value="movie">Movies Only</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2 px-4 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateList}
                className="flex-1 py-2 px-4 bg-accent text-black rounded-lg hover:bg-accent/90 transition-colors"
              >
                Create List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SavedLists
