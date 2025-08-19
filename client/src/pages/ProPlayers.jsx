import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ProPlayers() {
  const [players, setPlayers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get('/api/proplayers')
      .then(({ data }) => setPlayers(data))
      .catch(() => setError('Failed to load pro players'))
  }, [])

  if (error) return <div className="dota-card p-4 text-red-300">{error}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold">Dota 2 Pro Players Info</h1>
      <div className="dota-card p-4 mt-4">
        <div className="border-b border-white/5 pb-2 mb-4"><h2 className="text-xl font-semibold">Pro Players</h2></div>
        <div id="playerResults" className="mt-4 space-y-3">
          {players.length ? (
            players.map(player => (
              <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5" key={player.account_id}>
                <img src={player.avatarmedium || 'default-avatar.jpg'} alt="Player Avatar" className="w-14 h-14 rounded-full border border-white/10" />
                <div className="space-y-1">
                  <p><span className="text-gray-400">Account ID:</span> {player.account_id || 'N/A'}</p>
                  <p><span className="text-gray-400">Persona:</span> {player.personaname || 'N/A'} <span className="text-gray-400">Nick:</span> {player.name || 'N/A'}</p>
                  <p><span className="text-gray-400">Team:</span> {player.team_name || 'N/A'}</p>
                  <a href={player.profileurl} target="_blank" className="dota-btn mt-2" rel="noreferrer">View Steam Profile</a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400">No players data found.</div>
          )}
        </div>
      </div>
    </div>
  )
}


