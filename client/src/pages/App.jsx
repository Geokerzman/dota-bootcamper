import React from 'react'
import { Link, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'
import Live from './Live.jsx'
import Scenarios from './Scenarios.jsx'
import Player from './Player.jsx'
import ProPlayers from './ProPlayers.jsx'
import Home from './Home.jsx'
import Library from './Library.jsx'
import Compare from './Compare.jsx'
import Analytics from './Analytics.jsx'
import Alerts from './Alerts.jsx'
import Login from './Login.jsx'

function AppContent() {
  const location = useLocation()
  const { isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  
  const nav = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/live', label: 'Live', icon: '🎮' },
    { to: '/player', label: 'Player', icon: '👤' },
    { to: '/compare', label: 'Compare', icon: '⚔️' },
    { to: '/analytics', label: 'Analytics', icon: '📊' },
    { to: '/library', label: 'Library', icon: '📚' },
    { to: '/alerts', label: 'Alerts', icon: '🔔' },
    { to: '/pros', label: 'Pros', icon: '⭐' },
  ]
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <header className="flex items-center justify-between mb-8">
        <Link to="/" className="flex items-center gap-3">
          <img src="/ranks/Immortal.png" alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold">Dota Bootcamper</span>
        </Link>
        <div className="flex items-center gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-lg">
            {nav.map(item => {
              const active = location.pathname === item.to
              return (
                <Link key={item.to} to={item.to} className={`px-3 py-2 rounded-md text-sm font-medium transition ${active ? 'bg-dotaAccent text-white' : 'hover:bg-white/10 text-gray-200'}`}>
                  {item.label}
                </Link>
              )
            })}
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden px-3 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm"
          >
            ☰
          </button>
          
          {/* Auth Button */}
          {isAuthenticated ? (
            <button onClick={logout} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm">
              Logout
            </button>
          ) : (
            <Link to="/login" className="dota-btn text-sm">
              Login
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mb-6 dota-card p-4">
          <nav className="grid grid-cols-2 gap-2">
            {nav.map(item => {
              const active = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition text-center ${
                    active ? 'bg-dotaAccent text-white' : 'bg-white/10 hover:bg-white/20 text-gray-200'
                  }`}
                >
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div>{item.label}</div>
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      <main className="mt-8 space-y-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/live" element={<Live />} />
          <Route path="/scenarios" element={<Scenarios />} />
          <Route path="/player" element={<Player />} />
          <Route path="/pros" element={<ProPlayers />} />
          <Route path="/library" element={<Library />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<Alerts />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}


