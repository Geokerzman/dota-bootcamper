import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function AddToLibrary({ itemType, itemId, itemName }) {
  const { isAuthenticated } = useAuth()
  const [isInLibrary, setIsInLibrary] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (isAuthenticated && itemId) {
      checkInLibrary()
    } else {
      setChecking(false)
    }
  }, [isAuthenticated, itemType, itemId])

  const checkInLibrary = async () => {
    try {
      const { data } = await axios.get(`/api/library/check/${itemType}/${itemId}`)
      setIsInLibrary(data.isInLibrary)
    } catch (error) {
      console.error('Failed to check library status:', error)
      setIsInLibrary(false)
    } finally {
      setChecking(false)
    }
  }

  const handleToggle = async () => {
    if (!isAuthenticated) {
      alert('Please log in to use the library feature')
      return
    }

    setLoading(true)
    try {
      if (isInLibrary) {
        await axios.delete(`/api/library/${itemType}/${itemId}`)
        setIsInLibrary(false)
      } else {
        await axios.post('/api/library', { itemType, itemId, notes: '' })
        setIsInLibrary(true)
      }
    } catch (error) {
      console.error('Failed to update library:', error)
      alert('Failed to update library')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || checking) {
    return null
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
        isInLibrary
          ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
          : 'bg-white/10 text-gray-300 hover:bg-white/20'
      }`}
      title={isInLibrary ? 'Remove from library' : 'Add to library'}
    >
      {loading ? '...' : isInLibrary ? '⭐ In Library' : '⭐ Add to Library'}
    </button>
  )
}

