import React from 'react'
import { Link, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import Live from './Live.jsx'
import Scenarios from './Scenarios.jsx'
import Player from './Player.jsx'
import ProPlayers from './ProPlayers.jsx'
import Home from './Home.jsx'

export default function App() {
  const location = useLocation()
  const nav = [
    { to: '/', label: 'Home' },
    { to: '/live', label: 'Live' },
    { to: '/scenarios', label: 'Scenarios' },
    { to: '/player', label: 'Player' },
    { to: '/pros', label: 'Pro Players' },
  ]
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/ranks/Immortal.png" alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold">Dota Bootcamper</span>
        </div>
        <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
          {nav.map(item => {
            const active = location.pathname === item.to
            return (
              <Link key={item.to} to={item.to} className={`px-3 py-2 rounded-md text-sm font-medium transition ${active ? 'bg-dotaAccent text-white' : 'hover:bg-white/10 text-gray-200'}`}>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>

      <main className="mt-8 space-y-6">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/live" element={<Live />} />
        <Route path="/scenarios" element={<Scenarios />} />
        <Route path="/player" element={<Player />} />
        <Route path="/pros" element={<ProPlayers />} />
      </Routes>
      </main>
    </div>
  )
}


