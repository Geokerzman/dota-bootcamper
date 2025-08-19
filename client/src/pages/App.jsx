import React from 'react'
import { Link, Route, Routes, Navigate } from 'react-router-dom'
import Live from './Live.jsx'
import Scenarios from './Scenarios.jsx'
import Player from './Player.jsx'
import ProPlayers from './ProPlayers.jsx'

export default function App() {
  return (
    <div className="container mt-4">
      <nav className="mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item"><Link to="/live" className="nav-link">Live</Link></li>
          <li className="nav-item"><Link to="/scenarios" className="nav-link">Scenarios</Link></li>
          <li className="nav-item"><Link to="/player" className="nav-link">Player</Link></li>
          <li className="nav-item"><Link to="/pros" className="nav-link">Pro Players</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/live" replace />} />
        <Route path="/live" element={<Live />} />
        <Route path="/scenarios" element={<Scenarios />} />
        <Route path="/player" element={<Player />} />
        <Route path="/pros" element={<ProPlayers />} />
      </Routes>
    </div>
  )
}


