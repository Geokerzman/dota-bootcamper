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
      const shouldLogin = confirm('Please log in to use the library feature. Would you like to go to the login page?')
      if (shouldLogin) {
        window.location.href = '/login'
      }
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
      
      // Check if token expired
      if (error.response?.status === 401) {
        const shouldLogin = confirm('Your session has expired. Please log in again to continue.')
        if (shouldLogin) {
          // Clear token and redirect
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        return
      }
      
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update library'
      alert(`Failed to update library: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={handleToggle}
        className="px-3 py-1.5 rounded-md text-sm font-medium bg-white/10 text-gray-300 hover:bg-white/20"
        title="Login to add to library"
      >
        ⭐ Login to Add
      </button>
    )
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

