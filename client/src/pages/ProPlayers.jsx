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

  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div>
      <h1 className="main-title text-center">Dota 2 Pro Players Info</h1>
      <div className="card shadow-lg p-4 mt-4">
        <div className="card-header"><h2 className="card-title">Pro Players</h2></div>
        <div className="card-body">
          <div id="playerResults" className="mt-4">
            {players.length ? (
              players.map(player => (
                <div className="player-card d-flex align-items-center mt-3" key={player.account_id}>
                  <img src={player.avatarmedium || 'default-avatar.jpg'} alt="Player Avatar" className="player-avatar" />
                  <div className="ms-3">
                    <p><strong>Account ID:</strong> {player.account_id || 'N/A'}</p>
                    <p><strong>Steam ID:</strong> {player.steamid || 'N/A'}</p>
                    <p><strong>Persona Name:</strong> {player.personaname || 'N/A'}</p>
                    <p><strong>Nickname:</strong> {player.name || 'N/A'}</p>
                    <p><strong>Team Name:</strong> {player.team_name || 'N/A'}</p>
                    <a href={player.profileurl} target="_blank" className="btn btn-secondary mt-3" rel="noreferrer">View Steam Profile</a>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-warning">No players data found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


