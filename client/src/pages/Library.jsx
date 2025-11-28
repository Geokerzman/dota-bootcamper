import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Library() {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all') // 'all', 'player', 'hero', 'match'
  const [loading, setLoading] = useState(true)
  const [editingNote, setEditingNote] = useState(null)
  const [noteText, setNoteText] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      loadLibrary()
    }
  }, [isAuthenticated, filter])

  const loadLibrary = async () => {
    try {
      setLoading(true)
      const url = filter === 'all' ? '/api/library' : `/api/library?type=${filter}`
      const { data } = await axios.get(url)
      setItems(data)
    } catch (error) {
      console.error('Failed to load library:', error)
      // Check if token expired
      if (error.response?.status === 401) {
        const shouldLogin = confirm('Your session has expired. Please log in again to access your library.')
        if (shouldLogin) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        setItems([])
        return
      }
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (itemType, itemId) => {
    try {
      await axios.delete(`/api/library/${itemType}/${itemId}`)
      loadLibrary()
    } catch (error) {
      console.error('Failed to remove item:', error)
      if (error.response?.status === 401) {
        const shouldLogin = confirm('Your session has expired. Please log in again.')
        if (shouldLogin) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return
      }
      alert('Failed to remove item from library')
    }
  }

  const updateNote = async (itemType, itemId) => {
    if (!itemType || !itemId) {
      console.error('Invalid itemType or itemId:', { itemType, itemId })
      alert('Invalid item data. Please try again.')
      return
    }
    
    try {
      await axios.put(`/api/library/${itemType}/${itemId}/notes`, { notes: noteText })
      setEditingNote(null)
      setNoteText('')
      loadLibrary()
    } catch (error) {
      console.error('Failed to update note:', error)
      if (error.response?.status === 401) {
        const shouldLogin = confirm('Your session has expired. Please log in again.')
        if (shouldLogin) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return
      }
      const errorMsg = error.response?.data?.message || 'Failed to update note'
      alert(errorMsg)
    }
  }

  const addToLibrary = async (itemType, itemId, itemName) => {
    try {
      await axios.post('/api/library', { itemType, itemId, notes: '' })
      loadLibrary()
      alert(`${itemName} added to library!`)
    } catch (error) {
      if (error.response?.status === 400) {
        alert('Item already in library')
      } else {
        alert('Failed to add item to library')
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="dota-card p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please log in to access your library</p>
          <a href="/login" className="dota-btn">Login</a>
        </div>
      </div>
    )
  }

  const getItemIcon = (itemType) => {
    switch (itemType) {
      case 'player':
        return '👤'
      case 'hero':
        return '⚔️'
      case 'match':
        return '🎮'
      default:
        return '📌'
    }
  }

  const getItemLink = (itemType, itemId) => {
    switch (itemType) {
      case 'player':
        return `/player?accountId=${itemId}`
      case 'hero':
        return `#hero-${itemId}`
      case 'match':
        return `/match/${itemId}`
      default:
        return '#'
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">📚 My Library</h1>
        <p className="text-gray-400">Your bookmarked players, heroes, and matches</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'player', 'hero', 'match'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              filter === type
                ? 'bg-dotaAccent text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}s
            {filter === type && items.length > 0 && (
              <span className="ml-2 text-sm">({items.length})</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400">Loading library...</div>
        </div>
      ) : items.length === 0 ? (
        <div className="dota-card p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold mb-2">Your library is empty</h2>
          <p className="text-gray-400 mb-6">
            Start bookmarking players, heroes, and matches to build your collection
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            // Handle both camelCase and snake_case property names
            const itemType = item.itemType || item.item_type
            const itemId = item.itemId || item.item_id
            const itemName = item.itemName || item.item_name
            const itemAvatar = item.metadata?.avatar || ''
            const rankTier = item.metadata?.rankTier
            const notes = item.notes || ''

            console.log(item)
            
            return (
              <div key={`${itemType}-${itemId}`} className="dota-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                        src={itemAvatar}
                        alt={itemName || `Item ${itemId}`}
                        className="w-16 h-16 rounded-full border border-gray-500/10"
                    />                    <div>
                      <h3 className="font-semibold text-lg">{itemName || `Item ${itemId}`}</h3>
                    {rankTier ? (
                        <p className="text-sm text-white/60">Rank: {rankTier}</p>
                    ) : (
                        <p className="text-sm text-white/40">No rank data</p>
                    )}
                      <p className="text-sm text-gray-400 capitalize">{itemType}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(itemType, itemId)}
                    className="text-red-400 hover:text-red-300 text-xl"
                    title="Remove from library"
                  >
                    ×
                  </button>
                </div>

                {item.metadata && (
                  <div className="mb-4 text-sm text-gray-400">
                    {itemType === 'player' && item.metadata.rankTier && (
                      <div>Rank: {item.metadata.rankTier}</div>
                    )}
                    {itemType === 'hero' && item.metadata.primaryAttr && (
                      <div>Attribute: {item.metadata.primaryAttr}</div>
                    )}
                    {itemType === 'match' && item.metadata.duration && (
                      <div>Duration: {Math.floor(item.metadata.duration / 60)}:{(item.metadata.duration % 60).toString().padStart(2, '0')}</div>
                    )}
                  </div>
                )}

                {editingNote === `${itemType}-${itemId}` ? (
                  <div className="space-y-2">
                    <textarea
                      className="dota-input w-full text-sm"
                      rows="3"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add a note..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateNote(itemType, itemId)}
                        className="dota-btn text-sm px-3 py-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingNote(null)
                          setNoteText('')
                        }}
                        className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {notes ? (
                      <p className="text-sm text-gray-300 mb-2">{notes}</p>
                    ) : (
                      <p className="text-sm text-gray-500 italic mb-2">No notes</p>
                    )}
                    <button
                      onClick={() => {
                        setEditingNote(`${itemType}-${itemId}`)
                        setNoteText(notes || '')
                      }}
                      className="text-sm text-dotaAccent hover:underline"
                    >
                      {notes ? 'Edit note' : 'Add note'}
                    </button>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-white/10">
                  <a
                    href={getItemLink(itemType, itemId)}
                    className="text-sm text-dotaAccent hover:underline"
                  >
                    View Details →
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

