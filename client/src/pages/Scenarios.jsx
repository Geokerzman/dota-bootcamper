import React, { useState } from 'react'
import axios from 'axios'

export default function Scenarios() {
  const [live, setLive] = useState([])
  const [itemResults, setItemResults] = useState([])
  const [laneResults, setLaneResults] = useState([])
  const [miscResults, setMiscResults] = useState([])
  const [itemName, setItemName] = useState('')
  const [heroIdItem, setHeroIdItem] = useState('')
  const [laneRole, setLaneRole] = useState('1')
  const [heroIdLane, setHeroIdLane] = useState('')
  const [scenario, setScenario] = useState('')

  React.useEffect(() => {
    axios.get('/api/live')
      .then(r => setLive(r.data))
      .catch(() => setLive([]))
  }, [])

  const submitItem = async (e) => {
    e.preventDefault()
    try {
      // Placeholder: scenarios API not available in backend
      const { data } = await axios.get(`https://api.opendota.com/api/scenarios/itemTimings`, { params: { item: itemName, hero_id: heroIdItem } })
      setItemResults(data)
    } catch {
      setItemResults([])
    }
  }

  const submitLane = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.get(`https://api.opendota.com/api/scenarios/laneRoles`, { params: { lane_role: laneRole, hero_id: heroIdLane } })
      setLaneResults(data)
    } catch {
      setLaneResults([])
    }
  }

  const submitMisc = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.get(`https://api.opendota.com/api/scenarios/misc`, { params: { scenario } })
      setMiscResults(data)
    } catch {
      setMiscResults([])
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Dota 2 Live Games and Scenarios</h1>

      <div className="mt-4 grid grid-cols-2 gap-2 max-w-md">
        <button className="dota-btn">Live Games</button>
        <button className="dota-btn bg-white/10 hover:bg-white/20">Item Timings</button>
        <button className="dota-btn bg-white/10 hover:bg-white/20">Lane Roles</button>
        <button className="dota-btn bg-white/10 hover:bg-white/20">Misc Scenarios</button>
      </div>

      <div className="mt-6 space-y-8">
        <div className="dota-card p-4">
          {live.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {live.map(game => (
                <div className="dota-card p-4" key={game.match_id}>
                  <div className="border-b border-white/5 pb-2 mb-3">
                    <h5 className="text-lg font-semibold">League: {game.league_name || 'Unknown'}</h5>
                  </div>
                  <p><span className="text-gray-400">Match ID:</span> {game.match_id}</p>
                  <p><span className="text-gray-400">Spectators:</span> {game.spectators || '0'}</p>
                  <p><span className="text-gray-400">Radiant Team:</span> {game.radiant_team || 'N/A'}</p>
                  <p><span className="text-gray-400">Dire Team:</span> {game.dire_team || 'N/A'}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400">No live matches available at the moment.</div>
          )}
        </div>

        <div className="dota-card p-4">
          <form onSubmit={submitItem} className="mb-3 space-y-3">
            <div className="mb-3">
              <label className="block text-sm mb-1">Item Name</label>
              <input type="text" className="dota-input w-full" value={itemName} onChange={e=>setItemName(e.target.value)} placeholder="e.g., spirit_vessel" />
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Hero ID</label>
              <input type="number" className="dota-input w-full" value={heroIdItem} onChange={e=>setHeroIdItem(e.target.value)} placeholder="e.g., 1" />
            </div>
            <button type="submit" className="dota-btn">Get Item Timings</button>
          </form>
          <div>
            {itemResults.length ? itemResults.map((r, idx) => (
              <div key={idx}>
                <p><strong>Hero ID:</strong> {r.hero_id}</p>
                <p><strong>Item:</strong> {r.item}</p>
                <p><strong>Time:</strong> {r.time}</p>
                <p><strong>Games:</strong> {r.games}</p>
                <p><strong>Wins:</strong> {r.wins}</p>
              </div>
            )) : null}
          </div>
        </div>

        <div className="dota-card p-4">
          <form onSubmit={submitLane} className="mb-3 space-y-3">
            <div className="mb-3">
              <label className="block text-sm mb-1">Lane Role</label>
              <select className="dota-input w-full" value={laneRole} onChange={e=>setLaneRole(e.target.value)}>
                <option value="1">Safe Lane</option>
                <option value="2">Mid Lane</option>
                <option value="3">Off Lane</option>
                <option value="4">Jungle</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-sm mb-1">Hero ID</label>
              <input type="number" className="dota-input w-full" value={heroIdLane} onChange={e=>setHeroIdLane(e.target.value)} placeholder="e.g., 1" />
            </div>
            <button type="submit" className="dota-btn">Get Lane Roles</button>
          </form>
          <div>
            {laneResults.length ? laneResults.map((r, idx) => (
              <div key={idx}>
                <p><strong>Hero ID:</strong> {r.hero_id}</p>
                <p><strong>Lane Role:</strong> {r.lane_role}</p>
                <p><strong>Time:</strong> {r.time}</p>
                <p><strong>Games:</strong> {r.games}</p>
                <p><strong>Wins:</strong> {r.wins}</p>
              </div>
            )) : null}
          </div>
        </div>

        <div className="dota-card p-4">
          <form onSubmit={submitMisc} className="mb-3 space-y-3">
            <div className="mb-3">
              <label className="block text-sm mb-1">Scenario Name</label>
              <input type="text" className="dota-input w-full" value={scenario} onChange={e=>setScenario(e.target.value)} placeholder="e.g., comeback" />
            </div>
            <button type="submit" className="dota-btn">Get Misc Scenarios</button>
          </form>
          <div>
            {miscResults.length ? miscResults.map((r, idx) => (
              <div key={idx}>
                <p><strong>Scenario:</strong> {scenario}</p>
                <p><strong>Games:</strong> {r.games}</p>
                <p><strong>Wins:</strong> {r.wins}</p>
              </div>
            )) : null}
          </div>
        </div>
      </div>
    </div>
  )
}


