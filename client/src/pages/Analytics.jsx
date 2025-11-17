import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Analytics() {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('recommendations') // 'recommendations', 'meta', 'trends'
  const [accountId, setAccountId] = useState('')
  const [recommendations, setRecommendations] = useState(null)
  const [meta, setMeta] = useState(null)
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadMeta()
  }, [])

  const loadMeta = async () => {
    try {
      const { data } = await axios.get('/api/analytics/meta')
      setMeta(data)
    } catch (error) {
      console.error('Failed to load meta:', error)
    }
  }

  const loadRecommendations = async () => {
    if (!accountId.trim()) {
      alert('Please enter an account ID')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.get(`/api/analytics/recommendations/${accountId}`)
      setRecommendations(data)
    } catch (error) {
      console.error('Failed to load recommendations:', error)
      alert('Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  const loadTrends = async () => {
    if (!accountId.trim()) {
      alert('Please enter an account ID')
      return
    }

    if (!isAuthenticated) {
      alert('Please log in to view performance trends')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.get(`/api/analytics/trends/${accountId}?days=30`)
      setTrends(data)
    } catch (error) {
      console.error('Failed to load trends:', error)
      alert('Failed to load trends')
    } finally {
      setLoading(false)
    }
  }

  const recordTrend = async () => {
    if (!accountId.trim()) {
      alert('Please enter an account ID')
      return
    }

    if (!isAuthenticated) {
      alert('Please log in to record trends')
      return
    }

    try {
      await axios.post('/api/analytics/trends/record', { accountId: parseInt(accountId, 10) })
      alert('Performance trend recorded!')
      loadTrends()
    } catch (error) {
      console.error('Failed to record trend:', error)
      alert('Failed to record trend')
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">📊 Analytics & Insights</h1>
        <p className="text-gray-400">Get personalized recommendations and meta analysis</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10">
        {[
          { id: 'recommendations', label: '🎯 Hero Recommendations' },
          { id: 'meta', label: '📈 Meta Analysis' },
          { id: 'trends', label: '📊 Performance Trends' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              activeTab === tab.id
                ? 'border-dotaAccent text-dotaAccent'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="dota-card p-6">
            <h2 className="text-2xl font-semibold mb-4">Get Hero Recommendations</h2>
            <div className="flex gap-3">
              <input
                type="text"
                className="dota-input flex-1"
                placeholder="Enter Account ID"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              />
              <button onClick={loadRecommendations} className="dota-btn" disabled={loading}>
                {loading ? 'Loading...' : 'Get Recommendations'}
              </button>
            </div>
          </div>

          {recommendations && (
            <div className="space-y-6">
              {/* Unplayed Heroes */}
              {recommendations.unplayedHeroes?.length > 0 && (
                <div className="dota-card p-6">
                  <h3 className="text-xl font-semibold mb-4">Heroes You Haven't Played Much</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.unplayedHeroes.map((hero) => (
                      <div key={hero.heroId} className="p-4 bg-white/5 rounded-lg">
                        <div className="font-semibold">{hero.name}</div>
                        <div className="text-sm text-gray-400 mt-1">
                          {hero.primaryAttr} • {hero.roles?.join(', ')}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">{hero.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Best Heroes */}
              {recommendations.bestHeroes?.length > 0 && (
                <div className="dota-card p-6">
                  <h3 className="text-xl font-semibold mb-4">Your Best Heroes</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {recommendations.bestHeroes.map((hero) => (
                      <div key={hero.heroId} className="p-4 bg-white/5 rounded-lg">
                        <div className="font-semibold text-lg">{hero.name}</div>
                        <div className="mt-2 space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Games:</span>
                            <span className="font-semibold">{hero.games}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Win Rate:</span>
                            <span className="font-semibold text-green-400">{hero.winRate}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta Heroes */}
              {recommendations.metaHeroes?.length > 0 && (
                <div className="dota-card p-6">
                  <h3 className="text-xl font-semibold mb-4">Current Meta Heroes</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {recommendations.metaHeroes.map((hero) => (
                      <div key={hero.heroId} className="p-4 bg-white/5 rounded-lg text-center">
                        <div className="font-semibold">{hero.name}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {hero.primaryAttr}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Meta Analysis */}
      {activeTab === 'meta' && (
        <div className="space-y-6">
          {meta ? (
            <>
              <div className="dota-card p-6">
                <h2 className="text-2xl font-semibold mb-4">Current Meta Statistics</h2>
                <p className="text-gray-400 mb-4">
                  Based on {meta.totalMatchesAnalyzed} recent pro matches
                </p>
              </div>

              {meta.mostPickedHeroes?.length > 0 && (
                <div className="dota-card p-6">
                  <h3 className="text-xl font-semibold mb-4">Most Picked Heroes</h3>
                  <div className="space-y-2">
                    {meta.mostPickedHeroes.map((hero, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div>
                          <div className="font-semibold">{hero.name}</div>
                          <div className="text-sm text-gray-400">
                            {hero.picks} picks • {hero.winRate}% win rate
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-dotaAccent">#{idx + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {meta.highestWinRate?.length > 0 && (
                <div className="dota-card p-6">
                  <h3 className="text-xl font-semibold mb-4">Highest Win Rate Heroes</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {meta.highestWinRate.map((hero, idx) => (
                      <div key={idx} className="p-4 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-semibold">{hero.name}</div>
                          <div className="text-green-400 font-bold">{hero.winRate}%</div>
                        </div>
                        <div className="text-sm text-gray-400">
                          {hero.games} games
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400">Loading meta analysis...</div>
            </div>
          )}
        </div>
      )}

      {/* Performance Trends */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="dota-card p-6">
            <h2 className="text-2xl font-semibold mb-4">Performance Trends</h2>
            <p className="text-gray-400 mb-4">
              Track your performance over time (requires authentication)
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                className="dota-input flex-1"
                placeholder="Enter Account ID"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              />
              <button onClick={loadTrends} className="dota-btn" disabled={loading || !isAuthenticated}>
                {loading ? 'Loading...' : 'Load Trends'}
              </button>
              {isAuthenticated && (
                <button onClick={recordTrend} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md">
                  Record Snapshot
                </button>
              )}
            </div>
          </div>

          {trends && trends.length > 0 ? (
            <div className="dota-card p-6">
              <h3 className="text-xl font-semibold mb-4">Trend History (Last 30 Days)</h3>
              <div className="space-y-4">
                {trends.map((trend, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-semibold">
                        {new Date(trend.recorded_at).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(trend.recorded_at).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Win Rate</div>
                        <div className="font-semibold text-lg">{trend.metrics.winRate}%</div>
                      </div>
                      <div>
                        <div className="text-gray-400">KDA</div>
                        <div className="font-semibold text-lg">{trend.metrics.kda?.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">MMR</div>
                        <div className="font-semibold text-lg">{trend.metrics.mmr || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Matches</div>
                        <div className="font-semibold text-lg">{trend.metrics.matchesPlayed}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : trends && trends.length === 0 ? (
            <div className="dota-card p-12 text-center">
              <div className="text-gray-400">No trend data available. Record a snapshot to start tracking!</div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

