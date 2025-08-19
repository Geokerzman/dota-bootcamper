import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Live() {
  const [matches, setMatches] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get('/api/live')
      .then(res => setMatches(res.data))
      .catch(() => setError('Error loading matches.'))
  }, [])

  if (error) return <div className="alert alert-danger">{error}</div>
  if (!matches.length) return <p className="text-center">No live matches available.</p>

  return (
    <div>
      <h1 className="text-center mb-4">Live Match Details</h1>
      {matches.map(match => (
        <div key={match.match_id} className="card mb-4 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">Match ID: {match.match_id}</h3>
            <p><strong>League:</strong> {match.league_name || 'Regular Match'}</p>
            <p><strong>Spectators:</strong> {match.spectators}</p>
          </div>
          <div className="d-flex justify-content-between align-items-center p-3">
            <div className="text-success">
              <span className="fw-bold">{match.radiant_team}</span>
              <span className="h4">({match.radiant_score})</span>
            </div>
            <span>VS</span>
            <div className="text-danger">
              <span className="fw-bold">{match.dire_team}</span>
              <span className="h4">({match.dire_score})</span>
            </div>
          </div>

          <TeamTable title="Radiant Players" players={match.players.filter(p => p.team === 'Radiant')} />
          <TeamTable title="Dire Players" players={match.players.filter(p => p.team === 'Dire')} />
        </div>
      ))}
    </div>
  )
}

function TeamTable({ title, players }) {
  return (
    <>
      <h4 className="mt-4">{title}</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Player Name</th>
            <th>Rank</th>
            <th>Hero</th>
            <th>Kills</th>
            <th>Deaths</th>
            <th>Assists</th>
          </tr>
        </thead>
        <tbody>
          {players.map(player => (
            <tr key={player.account_id + player.hero_id}>
              <td><img src={player.avatar} alt={`${player.name}'s Avatar`} className="rounded-circle" width="40" height="40" /></td>
              <td>{player.name || 'Unknown'}</td>
              <td>{player.rank || 'Unranked'}</td>
              <td>{player.hero_name || 'Unknown Hero'}</td>
              <td>{player.kills || 0}</td>
              <td>{player.deaths || 0}</td>
              <td>{player.assists || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}


