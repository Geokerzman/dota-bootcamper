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

  if (error) return <div className="dota-card p-4 text-red-300">{error}</div>
  if (!matches.length) return <p className="text-center text-gray-400">No live matches available.</p>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Live Match Details</h1>
      {matches.map(match => (
        <div key={match.match_id} className="dota-card mb-6">
          <div className="p-4 border-b border-white/5">
            <h3 className="text-xl font-semibold">Match ID: {match.match_id}</h3>
            <p className="text-gray-400"><span className="font-semibold text-gray-300">League:</span> {match.league_name || 'Regular Match'} · <span className="font-semibold text-gray-300">Spectators:</span> {match.spectators}</p>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="text-green-400">
              <span className="font-bold">{match.radiant_team}</span>
              <span className="text-lg"> ({match.radiant_score})</span>
            </div>
            <span className="text-gray-500">VS</span>
            <div className="text-red-400">
              <span className="font-bold">{match.dire_team}</span>
              <span className="text-lg"> ({match.dire_score})</span>
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
      <h4 className="mt-2 font-semibold px-4">{title}</h4>
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-gray-400 font-medium">Avatar</th>
            <th className="px-4 py-2 text-left text-gray-400 font-medium">Player Name</th>
            <th className="px-4 py-2 text-left text-gray-400 font-medium">Rank</th>
            <th className="px-4 py-2 text-left text-gray-400 font-medium">Hero</th>
            <th className="px-4 py-2 text-left text-gray-400 font-medium">Kills</th>
            <th className="px-4 py-2 text-left text-gray-400 font-medium">Deaths</th>
            <th className="px-4 py-2 text-left text-gray-400 font-medium">Assists</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {players.map(player => (
            <tr key={player.account_id + player.hero_id}>
              <td className="px-4 py-2"><img src={player.avatar} alt={`${player.name}'s Avatar`} className="rounded-full w-10 h-10" /></td>
              <td className="px-4 py-2">{player.name || 'Unknown'}</td>
              <td className="px-4 py-2">{player.rank || 'Unranked'}</td>
              <td className="px-4 py-2">{player.hero_name || 'Unknown Hero'}</td>
              <td className="px-4 py-2">{player.kills || 0}</td>
              <td className="px-4 py-2">{player.deaths || 0}</td>
              <td className="px-4 py-2">{player.assists || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}


