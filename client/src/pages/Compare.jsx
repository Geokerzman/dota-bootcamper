import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function Compare() {
  const { isAuthenticated } = useAuth()
  const [accountIds, setAccountIds] = useState(['', '', ''])
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(false)
  const [savedComparisons, setSavedComparisons] = useState([])
  const [comparisonName, setComparisonName] = useState('')
  const [showSaveModal, setShowSaveModal] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      loadSavedComparisons()
    }
  }, [isAuthenticated])

  const loadSavedComparisons = async () => {
    try {
      const { data } = await axios.get('/api/analytics/compare/saved')
      setSavedComparisons(data)
    } catch (error) {
      console.error('Failed to load saved comparisons:', error)
    }
  }

  const handleCompare = async () => {
    const validIds = accountIds.filter(id => id.trim() !== '').map(id => parseInt(id.trim(), 10))
    
    if (validIds.length < 2) {
      alert('Please enter at least 2 account IDs')
      return
    }
    if (validIds.length > 5) {
      alert('Maximum 5 players can be compared')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post('/api/analytics/compare', { accountIds: validIds })
      setComparison(data)
    } catch (error) {
      console.error('Failed to compare players:', error)
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to compare players'
      alert(`Failed to compare players: ${errorMsg}. Please check the account IDs.`)
    } finally {
      setLoading(false)
    }
  }

  const saveComparison = async () => {
    if (!comparisonName.trim()) {
      alert('Please enter a name for this comparison')
      return
    }

    const validIds = accountIds.filter(id => id.trim() !== '').map(id => parseInt(id.trim(), 10))
    
    try {
      await axios.post('/api/analytics/compare/save', {
        comparisonName: comparisonName.trim(),
        accountIds: validIds,
      })
      setShowSaveModal(false)
      setComparisonName('')
      loadSavedComparisons()
      alert('Comparison saved!')
    } catch (error) {
      console.error('Failed to save comparison:', error)
      alert('Failed to save comparison')
    }
  }

  const loadSavedComparison = (saved) => {
    setAccountIds(saved.player_ids.map(id => id.toString()).concat(['', '', '', '']).slice(0, 5))
    setComparison(saved.comparison_data)
  }

  const addPlayerField = () => {
    if (accountIds.length < 5) {
      setAccountIds([...accountIds, ''])
    }
  }

  const removePlayerField = (index) => {
    setAccountIds(accountIds.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">⚔️ Player Comparison</h1>
        <p className="text-gray-400">Compare up to 5 players side-by-side</p>
      </div>

      {/* Input Section */}
      <div className="dota-card p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Enter Account IDs</h2>
        <div className="space-y-3 mb-4">
          {accountIds.map((id, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                className="dota-input flex-1"
                placeholder={`Player ${index + 1} Account ID`}
                value={id}
                onChange={(e) => {
                  const newIds = [...accountIds]
                  newIds[index] = e.target.value
                  setAccountIds(newIds)
                }}
              />
              {accountIds.length > 2 && (
                <button
                  onClick={() => removePlayerField(index)}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-md text-red-400"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={handleCompare} className="dota-btn" disabled={loading}>
            {loading ? 'Comparing...' : 'Compare Players'}
          </button>
          {accountIds.length < 5 && (
            <button
              onClick={addPlayerField}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md"
            >
              + Add Player
            </button>
          )}
        </div>
      </div>

      {/* Saved Comparisons */}
      {isAuthenticated && savedComparisons.length > 0 && (
        <div className="dota-card p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Saved Comparisons</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedComparisons.map((saved) => (
              <div
                key={saved.id}
                className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                onClick={() => loadSavedComparison(saved)}
              >
                <h3 className="font-semibold mb-2">{saved.comparison_name}</h3>
                <p className="text-sm text-gray-400">
                  {saved.player_ids.length} players
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(saved.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Comparison Results</h2>
            {isAuthenticated && (
              <button
                onClick={() => setShowSaveModal(true)}
                className="dota-btn"
              >
                Save Comparison
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <div className="dota-card p-6">
              <div className="grid grid-cols-6 gap-4 min-w-[1000px]">
                {/* Header */}
                <div className="font-semibold text-gray-400">Metric</div>
                {comparison.players.map((player, idx) => (
                  <div key={idx} className="text-center">
                    {player.error ? (
                      <div className="text-red-400">Error</div>
                    ) : (
                      <>
                        <img
                          src={player.profile?.avatarmedium || '/default-avatar.png'}
                          alt="Avatar"
                          className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-white/20"
                        />
                        <div className="font-semibold text-sm">
                          {player.profile?.personaname || `Player ${idx + 1}`}
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* Win Rate */}
                <div className="font-medium">Win Rate</div>
                {comparison.players.map((player, idx) => (
                  <div key={idx} className="text-center">
                    {player.error ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      <span className="text-lg font-bold">{player.winRate?.toFixed(1)}%</span>
                    )}
                  </div>
                ))}

                {/* Total Matches */}
                <div className="font-medium">Total Matches</div>
                {comparison.players.map((player, idx) => (
                  <div key={idx} className="text-center">
                    {player.error ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      <span>{player.totalMatches || 0}</span>
                    )}
                  </div>
                ))}

                {/* Wins/Losses */}
                <div className="font-medium">Wins / Losses</div>
                {comparison.players.map((player, idx) => (
                  <div key={idx} className="text-center">
                    {player.error ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      <span>
                        <span className="text-green-400">{player.wins || 0}</span>
                        {' / '}
                        <span className="text-red-400">{player.losses || 0}</span>
                      </span>
                    )}
                  </div>
                ))}

                {/* Average KDA */}
                <div className="font-medium">Avg KDA</div>
                {comparison.players.map((player, idx) => (
                  <div key={idx} className="text-center">
                    {player.error ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      <span className="font-semibold">{player.avgKDA?.toFixed(2) || '0.00'}</span>
                    )}
                  </div>
                ))}

                {/* Avg Kills */}
                <div className="font-medium">Avg Kills</div>
                {comparison.players.map((player, idx) => (
                  <div key={idx} className="text-center">
                    {player.error ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      <span>{player.avgKills?.toFixed(1) || '0.0'}</span>
                    )}
                  </div>
                ))}

                {/* Avg Deaths */}
                <div className="font-medium">Avg Deaths</div>
                {comparison.players.map((player, idx) => (
                  <div key={idx} className="text-center">
                    {player.error ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      <span className="text-red-400">{player.avgDeaths?.toFixed(1) || '0.0'}</span>
                    )}
                  </div>
                ))}

                {/* Avg Assists */}
                <div className="font-medium">Avg Assists</div>
                {comparison.players.map((player, idx) => (
                  <div key={idx} className="text-center">
                    {player.error ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      <span className="text-blue-400">{player.avgAssists?.toFixed(1) || '0.0'}</span>
                    )}
                  </div>
                ))}

                {/* Rank Tier */}
                <div className="font-medium">Rank</div>
                {comparison.players.map((player, idx) => (
                  <div key={idx} className="text-center">
                    {player.error ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      <span>{player.rankTier || 'Unranked'}</span>
                    )}
                  </div>
                ))}

                {/* Solo Rank */}
                <div className="font-medium">Solo MMR</div>
                {comparison.players.map((player, idx) => (
                  <div key={idx} className="text-center">
                    {player.error ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      <span>{player.soloRank || 'N/A'}</span>
                    )}
                  </div>
                ))}

                {/* Top Heroes */}
                <div className="font-medium">Top Heroes</div>
                {comparison.players.map((player, idx) => (
                  <div key={idx} className="text-center text-sm">
                    {player.error ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      <div className="space-y-1">
                        {player.topHeroes?.slice(0, 3).map((hero, hIdx) => (
                          <div key={hIdx} className="text-xs">
                            Hero {hero.heroId} ({hero.winRate?.toFixed(0)}% WR)
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="dota-card p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">Save Comparison</h3>
            <input
              type="text"
              className="dota-input w-full mb-4"
              placeholder="Enter comparison name..."
              value={comparisonName}
              onChange={(e) => setComparisonName(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={saveComparison} className="dota-btn flex-1">
                Save
              </button>
              <button
                onClick={() => {
                  setShowSaveModal(false)
                  setComparisonName('')
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

