import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Chart } from 'chart.js/auto'

export default function Player() {
  const [playerName, setPlayerName] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [accountId, setAccountId] = useState('')
  const [playerInfo, setPlayerInfo] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

  const searchPlayers = async (e) => {
    e.preventDefault()
    if (!playerName) return
    try {
      const { data } = await axios.get(`https://api.opendota.com/api/search`, { params: { q: playerName } })
      setSearchResults(data)
    } catch {
      setSearchResults([])
    }
  }

  const fetchPlayer = async (e) => {
    e.preventDefault()
    if (!accountId) return
    try {
      const { data } = await axios.get(`/api/playerinfo`, { params: { account_id: accountId } })
      setPlayerInfo(data[0])
      setErrorMessage('')
      fetchLastMatchStats(accountId)
    } catch (err) {
      // Fallback: fetch directly from OpenDota
      try {
        const { data } = await axios.get(`https://api.opendota.com/api/players/${accountId}`)
        const profile = data.profile || {}
        setPlayerInfo({
          solo_competitive_rank: data.solo_competitive_rank ?? null,
          competitive_rank: data.competitive_rank ?? null,
          rank_tier: data.rank_tier ?? null,
          leaderboard_rank: data.leaderboard_rank ?? null,
          profile: {
            account_id: profile.account_id ?? null,
            personaname: profile.personaname ?? null,
            name: profile.name ?? null,
            steamid: profile.steamid ?? null,
            avatarmedium: profile.avatarmedium ?? null,
            last_login: profile.last_login ?? null,
            profileurl: profile.profileurl ?? null,
          },
        })
        setErrorMessage('')
        fetchLastMatchStats(accountId)
      } catch (fallbackErr) {
        setPlayerInfo(null)
        const serverMsg = err?.response?.data?.message || err?.message || 'Unknown error'
        setErrorMessage(`Failed to fetch player info: ${serverMsg}`)
      }
    }
  }

  const renderRank = () => {
    if (!playerInfo) return null
    const tier = playerInfo.rank_tier
    const tiers = { 1: 'Herald', 2: 'Guardian', 3: 'Crusader', 4: 'Archon', 5: 'Legend', 6: 'Ancient', 7: 'Divine', 8: 'Immortal' }
    const major = Math.floor((tier || 0) / 10)
    const division = (tier || 0) % 10
    const rankName = tiers[major] || 'Unranked'
    const base = '/ranks/'
    const nameLower = rankName.toLowerCase()
    const candidates = [
      `${base}${rankName}.png`,
      `${base}${nameLower}.png`,
      `${base}${rankName}.webp`,
      `${base}${nameLower}.webp`,
      `${base}Unranked.png`,
    ]
    return (
      <p>
        <strong>Rank:</strong> {rankName} {division && rankName !== 'Immortal' ? division : ''}
        {rankName && (
          <img
            src={candidates[0]}
            data-idx="0"
            alt={rankName}
            className="rank-image"
            onError={(e)=>{
              const el = e.currentTarget
              const idx = Number(el.getAttribute('data-idx')) || 0
              if (idx + 1 < candidates.length) {
                el.setAttribute('data-idx', String(idx + 1))
                el.src = candidates[idx + 1]
              } else {
                el.style.display = 'none'
              }
            }}
          />
        )}
      </p>
    )
  }

  const fetchLastMatchStats = async (id) => {
    try {
      const { data } = await axios.get(`https://api.opendota.com/api/players/${id}/matches`, { params: { limit: 1 } })
      if (!data || !data.length) return
      const match = data[0]
      const stats = {
        kills: match.kills || 0,
        deaths: match.deaths || 0,
        assists: match.assists || 0,
        gold_per_min: match.gold_per_min || 0,
        xp_per_min: match.xp_per_min || 0,
        hero_id: match.hero_id,
        game_mode: match.game_mode,
        duration: match.duration,
        radiant_win: match.radiant_win,
        player_slot: match.player_slot
      }

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }

      const ctx = chartRef.current.getContext('2d')
      chartInstanceRef.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Kills', 'Deaths', 'Assists', 'Gold per Min', 'XP per Min'],
          datasets: [{
            label: 'Last Match Stats',
            data: [stats.kills, stats.deaths, stats.assists, stats.gold_per_min, stats.xp_per_min],
            backgroundColor: 'rgba(52,45,83,0.9)',
            borderColor: 'rgb(235,151,54)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(35,27,50)'
          }]
        },
        options: { responsive: true }
      })
    } catch {}
  }

  return (
    <div>
      <h1 className="text-center mb-4">Dota 2 Player Info Viewer</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header"><h2>Search Player</h2></div>
            <div className="card-body">
              <form onSubmit={searchPlayers}>
                <div className="form-group">
                  <label>Enter Player Name:</label>
                  <input className="form-control" value={playerName} onChange={e=>setPlayerName(e.target.value)} placeholder="Enter Player Name" />
                </div>
                <button type="submit" className="btn btn-primary">Search Player</button>
              </form>
              <div className="mt-3">
                {searchResults.length ? (
                  <ul className="list-group">
                    {searchResults.map(p => (
                      <li key={p.account_id} className="list-group-item d-flex align-items-center">
                        <img src={p.avatarfull} alt="Avatar" className="img-thumbnail" />
                        <div>
                          <strong>{p.personaname || 'Unknown'}</strong>
                          <p>Account ID: {p.account_id}</p>
                          <button className="btn btn-secondary btn-sm" onClick={() => { setAccountId(p.account_id); }}>{'View Profile'}</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header"><h2>Player Info</h2></div>
            <div className="card-body">
              <form onSubmit={fetchPlayer}>
                <div className="form-group">
                  <label>Enter Account ID:</label>
                  <input className="form-control" value={accountId} onChange={e=>setAccountId(e.target.value)} placeholder="Enter Player Account ID" />
                </div>
                <button type="submit" className="btn btn-primary">Get Player Info</button>
              </form>
              <div className="mt-3">
                {errorMessage && (<div className="alert alert-danger">{errorMessage}</div>)}
                {playerInfo ? (
                  <div>
                    <h3>Player Information</h3>
                    <img src={playerInfo.profile.avatarmedium} alt="Player Avatar" className="img-thumbnail mb-3" />
                    <p><strong>Persona Name:</strong> {playerInfo.profile.personaname || 'N/A'}</p>
                    <p><strong>Account ID:</strong> {playerInfo.profile.account_id}</p>
                    <p><strong>Steam ID:</strong> {playerInfo.profile.steamid}</p>
                    <p><strong>Last Login:</strong> {playerInfo.profile.last_login || 'N/A'}</p>
                    {renderRank()}
                    <a href={playerInfo.profile.profileurl} target="_blank" className="btn btn-secondary" rel="noreferrer">View Steam Profile</a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="card mb-4 player-card border">
        <header className="card-header player-card bg-secondary text-white"><h2>Last Match Stats</h2></header>
        <div className="card-body player-card">
          <div id="lastMatchStats" className="chart-container player-card">
            <canvas ref={chartRef} />
          </div>
        </div>
      </section>
    </div>
  )
}


