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
      <h1 className="text-center">Dota 2 Live Games and Scenarios</h1>

      <ul className="nav nav-tabs mt-4">
        <li className="nav-item"><button className="nav-link active" data-bs-toggle="tab" data-bs-target="#live">Live Games</button></li>
        <li className="nav-item"><button className="nav-link" data-bs-toggle="tab" data-bs-target="#item">Item Timings</button></li>
        <li className="nav-item"><button className="nav-link" data-bs-toggle="tab" data-bs-target="#lane">Lane Roles</button></li>
        <li className="nav-item"><button className="nav-link" data-bs-toggle="tab" data-bs-target="#misc">Misc Scenarios</button></li>
      </ul>

      <div className="tab-content mt-4">
        <div className="tab-pane fade show active" id="live">
          <div className="row">
            {live.length ? live.map(game => (
              <div className="col-md-6" key={game.match_id}>
                <div className="card mb-3">
                  <div className="card-header"><h5>League: {game.league_name || 'Unknown'}</h5></div>
                  <div className="card-body">
                    <p><strong>Match ID:</strong> {game.match_id}</p>
                    <p><strong>Spectators:</strong> {game.spectators || '0'}</p>
                    <p><strong>Radiant Team:</strong> {game.radiant_team || 'N/A'}</p>
                    <p><strong>Dire Team:</strong> {game.dire_team || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )) : <div className="alert alert-warning">No live matches available at the moment.</div>}
          </div>
        </div>

        <div className="tab-pane fade" id="item">
          <form onSubmit={submitItem} className="mb-3">
            <div className="mb-3">
              <label className="form-label">Item Name</label>
              <input type="text" className="form-control" value={itemName} onChange={e=>setItemName(e.target.value)} placeholder="e.g., spirit_vessel" />
            </div>
            <div className="mb-3">
              <label className="form-label">Hero ID</label>
              <input type="number" className="form-control" value={heroIdItem} onChange={e=>setHeroIdItem(e.target.value)} placeholder="e.g., 1" />
            </div>
            <button type="submit" className="btn btn-primary">Get Item Timings</button>
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

        <div className="tab-pane fade" id="lane">
          <form onSubmit={submitLane} className="mb-3">
            <div className="mb-3">
              <label className="form-label">Lane Role</label>
              <select className="form-select" value={laneRole} onChange={e=>setLaneRole(e.target.value)}>
                <option value="1">Safe Lane</option>
                <option value="2">Mid Lane</option>
                <option value="3">Off Lane</option>
                <option value="4">Jungle</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Hero ID</label>
              <input type="number" className="form-control" value={heroIdLane} onChange={e=>setHeroIdLane(e.target.value)} placeholder="e.g., 1" />
            </div>
            <button type="submit" className="btn btn-primary">Get Lane Roles</button>
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

        <div className="tab-pane fade" id="misc">
          <form onSubmit={submitMisc} className="mb-3">
            <div className="mb-3">
              <label className="form-label">Scenario Name</label>
              <input type="text" className="form-control" value={scenario} onChange={e=>setScenario(e.target.value)} placeholder="e.g., comeback" />
            </div>
            <button type="submit" className="btn btn-primary">Get Misc Scenarios</button>
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


