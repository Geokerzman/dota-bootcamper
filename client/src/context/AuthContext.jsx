import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Optionally fetch user data here
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
    setLoading(false)
  }, [token])

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password })
      setToken(data.token)
      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' }
    }
  }

  const register = async (username, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/register', { username, email, password })
      setToken(data.token)
      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    token,
    user,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

