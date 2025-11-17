import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Alerts() {
  const { isAuthenticated } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState('all') // 'all', 'active', 'triggered', 'disabled'
  const [newAlert, setNewAlert] = useState({
    alertType: 'player_match',
    alertName: '',
    targetId: '',
    conditions: {},
  })

  useEffect(() => {
    if (isAuthenticated) {
      loadAlerts()
    }
  }, [isAuthenticated, filter])

  const loadAlerts = async () => {
    try {
      setLoading(true)
      const url = filter === 'all' ? '/api/alerts' : `/api/alerts?status=${filter}`
      const { data } = await axios.get(url)
      setAlerts(data)
    } catch (error) {
      console.error('Failed to load alerts:', error)
      setAlerts([])
    } finally {
      setLoading(false)
    }
  }

  const createAlert = async () => {
    if (!newAlert.alertName.trim()) {
      alert('Please enter an alert name')
      return
    }

    try {
      await axios.post('/api/alerts', {
        ...newAlert,
        targetId: newAlert.targetId ? parseInt(newAlert.targetId, 10) : undefined,
      })
      setShowCreateModal(false)
      setNewAlert({
        alertType: 'player_match',
        alertName: '',
        targetId: '',
        conditions: {},
      })
      loadAlerts()
      alert('Alert created!')
    } catch (error) {
      console.error('Failed to create alert:', error)
      alert('Failed to create alert')
    }
  }

  const updateAlert = async (alertId, updates) => {
    try {
      await axios.put(`/api/alerts/${alertId}`, updates)
      loadAlerts()
    } catch (error) {
      console.error('Failed to update alert:', error)
      alert('Failed to update alert')
    }
  }

  const deleteAlert = async (alertId) => {
    if (!confirm('Are you sure you want to delete this alert?')) return

    try {
      await axios.delete(`/api/alerts/${alertId}`)
      loadAlerts()
    } catch (error) {
      console.error('Failed to delete alert:', error)
      alert('Failed to delete alert')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400'
      case 'triggered':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'disabled':
        return 'bg-gray-500/20 text-gray-400'
      default:
        return 'bg-white/10 text-gray-300'
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'player_match':
        return 'Player Match'
      case 'player_rank_change':
        return 'Rank Change'
      case 'match_started':
        return 'Match Started'
      case 'custom':
        return 'Custom'
      default:
        return type
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="dota-card p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please log in to manage alerts</p>
          <a href="/login" className="dota-btn">Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">🔔 Alerts & Notifications</h1>
          <p className="text-gray-400">Set up alerts for players, matches, and events</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="dota-btn">
          + Create Alert
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'active', 'triggered', 'disabled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              filter === status
                ? 'bg-dotaAccent text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400">Loading alerts...</div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="dota-card p-12 text-center">
          <div className="text-6xl mb-4">🔔</div>
          <h2 className="text-2xl font-bold mb-2">No alerts yet</h2>
          <p className="text-gray-400 mb-6">Create your first alert to get notified about important events</p>
          <button onClick={() => setShowCreateModal(true)} className="dota-btn">
            Create Alert
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {alerts.map((alert) => (
            <div key={alert.id} className="dota-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{alert.alert_name}</h3>
                  <div className="flex gap-2 items-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                    <span className="text-sm text-gray-400">{getTypeLabel(alert.alert_type)}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="text-red-400 hover:text-red-300"
                  title="Delete alert"
                >
                  ×
                </button>
              </div>

              {alert.target_id && (
                <div className="text-sm text-gray-400 mb-2">
                  Target ID: {alert.target_id}
                </div>
              )}

              {alert.last_triggered && (
                <div className="text-sm text-gray-400 mb-4">
                  Last triggered: {new Date(alert.last_triggered).toLocaleString()}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {alert.status === 'active' && (
                  <button
                    onClick={() => updateAlert(alert.id, { status: 'disabled' })}
                    className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-md"
                  >
                    Disable
                  </button>
                )}
                {alert.status === 'disabled' && (
                  <button
                    onClick={() => updateAlert(alert.id, { status: 'active' })}
                    className="px-3 py-1 text-sm bg-green-500/20 hover:bg-green-500/30 rounded-md text-green-400"
                  >
                    Enable
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="dota-card p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Create New Alert</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Alert Name</label>
                <input
                  type="text"
                  className="dota-input w-full"
                  placeholder="e.g., Miracle- Playing"
                  value={newAlert.alertName}
                  onChange={(e) => setNewAlert({ ...newAlert, alertName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Alert Type</label>
                <select
                  className="dota-input w-full"
                  value={newAlert.alertType}
                  onChange={(e) => setNewAlert({ ...newAlert, alertType: e.target.value })}
                >
                  <option value="player_match">Player Match</option>
                  <option value="player_rank_change">Rank Change</option>
                  <option value="match_started">Match Started</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target ID (optional)</label>
                <input
                  type="text"
                  className="dota-input w-full"
                  placeholder="Account ID or Match ID"
                  value={newAlert.targetId}
                  onChange={(e) => setNewAlert({ ...newAlert, targetId: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={createAlert} className="dota-btn flex-1">
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setNewAlert({
                    alertType: 'player_match',
                    alertName: '',
                    targetId: '',
                    conditions: {},
                  })
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

