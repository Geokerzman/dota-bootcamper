import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Chart } from 'chart.js/auto'

export default function Player() {
  const [searchMode, setSearchMode] = useState('name') // 'name' | 'id'
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [accountId, setAccountId] = useState('')
  const [playerInfo, setPlayerInfo] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isLoadingStats, setIsLoadingStats] = useState(false)
  const [lastStats, setLastStats] = useState(null)
  const [heroesData, setHeroesData] = useState({})
  const [showSearch, setShowSearch] = useState(true)
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

  // Load heroes data once
  useEffect(() => {
    const loadHeroes = async () => {
      try {
        const { data } = await axios.get('/api/heroes')
        const heroesMap = {}
        data.forEach(hero => {
          heroesMap[hero.id] = hero
        })
        setHeroesData(heroesMap)
      } catch (err) {
        console.error('Failed to load heroes:', err)
      }
    }
    loadHeroes()
  }, [])

  const searchPlayers = async (e) => {
    e.preventDefault()
    if (!query) return
    if (searchMode === 'name') {
      try {
        const { data } = await axios.get(`https://api.opendota.com/api/search`, { params: { q: query } })
        setSearchResults(data)
      } catch {
        setSearchResults([])
      }
    } else {
      setSearchResults([])
      setAccountId(query)
      await loadPlayer(query)
    }
  }

  const loadPlayer = async (idToLoad) => {
    if (!idToLoad) return
    setIsLoadingProfile(true)
    setErrorMessage('')
    try {
      // Try the overview endpoint first, fallback to individual calls if it fails
      try {
        const { data } = await axios.get(`/api/playerinfo/overview`, { params: { account_id: idToLoad } })
        console.log('Overview data:', data) // Debug log
        
        // The overview endpoint returns data directly, not nested under profile
        const profile = data.profile || {}
        setPlayerInfo({
          rank_tier: data.profile?.rank_tier ?? null,
          profile: {
            account_id: profile.account_id ?? null,
            personaname: profile.personaname ?? null,
            name: profile.name ?? null,
            steamid: profile.steamid ?? null,
            avatarmedium: profile.avatarmedium ?? null,
            last_login: profile.last_login ?? null,
            profileurl: profile.profileurl ?? null,
          },
          wl: data.wl,
          recentMatches: data.recentMatches,
          heroes: data.heroes,
          peers: data.peers,
          totals: data.totals,
          counts: data.counts,
          ratings: data.ratings,
        })
      } catch (overviewErr) {
        console.log('Overview endpoint failed, using fallback:', overviewErr.message)
        // Fallback to individual API calls
        const [profileData, wlData, recentData, heroesData, peersData] = await Promise.all([
          axios.get(`https://api.opendota.com/api/players/${idToLoad}`),
          axios.get(`https://api.opendota.com/api/players/${idToLoad}/wl`),
          axios.get(`https://api.opendota.com/api/players/${idToLoad}/recentMatches`),
          axios.get(`https://api.opendota.com/api/players/${idToLoad}/heroes`),
          axios.get(`https://api.opendota.com/api/players/${idToLoad}/peers`),
        ])
        
        const profile = profileData.data.profile || {}
        setPlayerInfo({
          rank_tier: profileData.data.rank_tier ?? null,
          profile: {
            account_id: profile.account_id ?? null,
            personaname: profile.personaname ?? null,
            name: profile.name ?? null,
            steamid: profile.steamid ?? null,
            avatarmedium: profile.avatarmedium ?? null,
            last_login: profile.last_login ?? null,
            profileurl: profile.profileurl ?? null,
          },
          wl: wlData.data,
          recentMatches: recentData.data,
          heroes: heroesData.data,
          peers: peersData.data,
          totals: [],
          counts: [],
          ratings: [],
        })
      }
      setShowSearch(false)
      await fetchLastMatchStats(idToLoad)
          } catch (err) {
        setPlayerInfo(null)
        const serverMsg = err?.response?.data?.message || err?.message || 'Unknown error'
        setErrorMessage(`Failed to fetch player info: ${serverMsg}`)
      } finally {
        setIsLoadingProfile(false)
      }
  }

  const fetchPlayer = async (e) => {
    e.preventDefault()
    await loadPlayer(accountId)
  }

  const renderRank = () => {
    if (!playerInfo) return null
    const tier = playerInfo.rank_tier
    if (!tier) return <div className="text-sm text-gray-400">Unranked</div>
    
    // Correct rank calculation based on OpenDota's system
    const major = Math.floor(tier / 10)
    const minor = tier % 10
    
    const rankNames = {
      1: 'Herald', 2: 'Guardian', 3: 'Crusader', 4: 'Archon',
      5: 'Legend', 6: 'Ancient', 7: 'Divine', 8: 'Immortal'
    }
    
    const rankName = rankNames[major] || 'Unknown'
    const rankLevel = minor || 5
    
    // Create a single image element that tries different sources
    const getRankImageSrc = () => {
      const possibleSources = [
        `/ranks/${rankName}.png`,
        `/ranks/${rankName.toLowerCase()}.png`,
        `/ranks/${rankName}.webp`,
        `/ranks/${rankName.toLowerCase()}.webp`,
        `/ranks/Unranked.png` // fallback
      ]
      return possibleSources[0] // Start with the first one
    }
    
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm font-semibold">{rankName} {rankLevel}</div>
        <img
          src={getRankImageSrc()}
          alt={rankName}
          className="w-16 h-16"
          onError={(e) => {
            // Try next source on error
            const currentSrc = e.target.src
            const possibleSources = [
              `/ranks/${rankName}.png`,
              `/ranks/${rankName.toLowerCase()}.png`,
              `/ranks/${rankName}.webp`,
              `/ranks/${rankName.toLowerCase()}.webp`,
              `/ranks/Unranked.png`
            ]
            const currentIndex = possibleSources.findIndex(src => src.includes(currentSrc.split('/').pop()))
            const nextIndex = (currentIndex + 1) % possibleSources.length
            e.target.src = possibleSources[nextIndex]
          }}
        />
      </div>
    )
  }

  const fetchLastMatchStats = async (id) => {
    setIsLoadingStats(true)
    try {
      const { data } = await axios.get(`https://api.opendota.com/api/players/${id}/recentMatches`)
      if (data && data.length > 0) {
        const lastMatch = data[0]
        setLastStats(lastMatch)
        
        // Create chart
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy()
        }
        
        const ctx = chartRef.current.getContext('2d')
        chartInstanceRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Kills', 'Deaths', 'Assists', 'GPM', 'XPM'],
            datasets: [{
              label: 'Last Match Stats',
              data: [
                lastMatch.kills || 0,
                lastMatch.deaths || 0,
                lastMatch.assists || 0,
                Math.round((lastMatch.gold_per_min || 0) / 10),
                Math.round((lastMatch.xp_per_min || 0) / 10)
              ],
              backgroundColor: [
                'rgba(34, 197, 94, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(168, 85, 247, 0.8)'
              ],
              borderColor: [
                'rgba(34, 197, 94, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(245, 158, 11, 1)',
                'rgba(168, 85, 247, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              },
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)'
                }
              }
            }
          }
        })
      }
    } catch (err) {
      console.error('Failed to fetch last match stats:', err)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const getHeroName = (heroId) => {
    const hero = heroesData[heroId]
    return hero ? hero.localized_name : `Hero ${heroId}`
  }

  const getHeroImage = (heroId) => {
    const hero = heroesData[heroId]
    if (!hero) return null
    return `https://cdn.dota2.com/apps/dota2/images/heroes/${hero.name.replace('npc_dota_hero_', '')}_sb.png`
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown'
    // Handle both Unix timestamp (seconds) and milliseconds
    const date = timestamp > 1000000000000 ? new Date(timestamp) : new Date(timestamp * 1000)
    return date.toLocaleDateString()
  }

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Search interface
  if (showSearch) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Dota 2 Player Explorer</h1>
          <p className="text-gray-400">Search for players by name or Steam ID</p>
        </div>
        
        <div className="dota-card max-w-2xl mx-auto">
          <div className="border-b border-white/5 p-6">
            <h2 className="text-2xl font-semibold mb-4">Search Player</h2>
            <form onSubmit={searchPlayers}>
              <div className="mb-6 flex items-center justify-center gap-4">
                <span className={`text-lg ${searchMode === 'name' ? 'text-white' : 'text-gray-400'}`}>Name</span>
                <button 
                  type="button" 
                  role="switch" 
                  aria-checked={searchMode === 'id'} 
                  onClick={() => setSearchMode(prev => prev === 'name' ? 'id' : 'name')} 
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition ${searchMode === 'id' ? 'bg-dotaAccent' : 'bg-white/20'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${searchMode === 'id' ? 'translate-x-9' : 'translate-x-1'}`} />
                </button>
                <span className={`text-lg ${searchMode === 'id' ? 'text-white' : 'text-gray-400'}`}>ID</span>
              </div>
              <div className="mb-6">
                <label className="block text-lg mb-2">{searchMode === 'name' ? 'Enter Player Name' : 'Enter Account ID'}</label>
                <input 
                  className="dota-input w-full text-lg p-4" 
                  value={query} 
                  onChange={e => setQuery(e.target.value)} 
                  placeholder={searchMode === 'name' ? 'e.g. Miracle-' : 'e.g. 123456789'} 
                />
              </div>
              <button type="submit" className="dota-btn w-full text-lg p-4">Search</button>
            </form>
          </div>
          
          {searchResults.length > 0 && (
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Search Results</h3>
              <div className="space-y-4">
                {searchResults.map(p => (
                  <div key={p.account_id} className="p-4 rounded-xl bg-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                    <img src={p.avatarfull} alt="Avatar" className="w-16 h-16 rounded-full border border-white/10" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg">{p.personaname || 'Unknown'}</div>
                          <div className="text-sm text-gray-400">Account ID: {p.account_id}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <a 
                            href={`https://www.opendota.com/players/${p.account_id}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-sm text-dotaAccent hover:underline"
                          >
                            OpenDota
                          </a>
                          <button 
                            className="dota-btn" 
                            onClick={() => { setAccountId(p.account_id); loadPlayer(p.account_id); }}
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Player profile view
  if (!playerInfo) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <button onClick={() => setShowSearch(true)} className="dota-btn mb-6">← Back to Search</button>
          {errorMessage && <div className="dota-card p-6 text-red-300">{errorMessage}</div>}
          {isLoadingProfile && <div className="text-gray-400">Loading player profile...</div>}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-white/10">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setShowSearch(true)} className="dota-btn">← Back to Search</button>
            <a href={playerInfo.profile.profileurl} target="_blank" className="dota-btn" rel="noreferrer">
              Steam Profile
            </a>
          </div>
          
          <div className="flex items-center gap-6">
            <img 
              src={playerInfo.profile.avatarmedium} 
              alt="Player Avatar" 
              className="w-32 h-32 rounded-full border-4 border-white/10" 
            />
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{playerInfo.profile.personaname}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <span>Account ID: {playerInfo.profile.account_id}</span>
                <span>Steam ID: {playerInfo.profile.steamid}</span>
                <span>Last Login: {formatDate(playerInfo.profile.last_login)}</span>
              </div>
            </div>
            <div className="text-center">
              {renderRank()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="dota-card p-6 text-center">
            <div className="text-3xl font-bold text-green-400">{playerInfo.wl?.win || 0}</div>
            <div className="text-gray-400">Wins</div>
          </div>
          <div className="dota-card p-6 text-center">
            <div className="text-3xl font-bold text-red-400">{playerInfo.wl?.lose || 0}</div>
            <div className="text-gray-400">Losses</div>
          </div>
          <div className="dota-card p-6 text-center">
            <div className="text-3xl font-bold text-blue-400">
              {playerInfo.wl ? Math.round((playerInfo.wl.win / (playerInfo.wl.win + playerInfo.wl.lose)) * 100) : 0}%
            </div>
            <div className="text-gray-400">Win Rate</div>
          </div>
          <div className="dota-card p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400">{playerInfo.wl ? playerInfo.wl.win + playerInfo.wl.lose : 0}</div>
            <div className="text-gray-400">Total Games</div>
          </div>
        </div>

        {/* Last Match Stats */}
        <section className="dota-card mb-8">
          <div className="border-b border-white/5 p-6">
            <h2 className="text-2xl font-semibold">Last Match Performance</h2>
          </div>
          <div className="p-6 grid md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2">
              <div className="bg-white/5 rounded-lg p-4 h-64">
                <canvas ref={chartRef} />
              </div>
            </div>
            <div className="md:col-span-1">
              {isLoadingStats && <div className="text-gray-400">Loading stats...</div>}
              {lastStats && (
                <div className="space-y-4">
                  <div className="dota-card p-4">
                    <h3 className="font-semibold mb-3">Match Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration</span>
                        <span className="font-semibold">{formatDuration(lastStats.duration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Result</span>
                        <span className={`font-semibold ${lastStats.radiant_win === (lastStats.player_slot < 128) ? 'text-green-400' : 'text-red-400'}`}>
                          {lastStats.radiant_win === (lastStats.player_slot < 128) ? 'Victory' : 'Defeat'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hero</span>
                        <span className="font-semibold">{getHeroName(lastStats.hero_id)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="dota-card p-4">
                    <h3 className="font-semibold mb-3">Performance</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">K/D/A</span>
                        <span className="font-semibold">{lastStats.kills}/{lastStats.deaths}/{lastStats.assists}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">GPM</span>
                        <span className="font-semibold">{lastStats.gold_per_min}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">XPM</span>
                        <span className="font-semibold">{lastStats.xp_per_min}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Hits</span>
                        <span className="font-semibold">{lastStats.last_hits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Denies</span>
                        <span className="font-semibold">{lastStats.denies}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recent Matches */}
        <section className="dota-card mb-8">
          <div className="border-b border-white/5 p-6">
            <h2 className="text-2xl font-semibold">Recent Matches</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Hero</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">K/D/A</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">GPM</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">XPM</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Duration</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {playerInfo.recentMatches?.slice(0, 10).map((match, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {getHeroImage(match.hero_id) && (
                            <img 
                              src={getHeroImage(match.hero_id)} 
                              alt={getHeroName(match.hero_id)}
                              className="w-8 h-8 rounded"
                            />
                          )}
                          <span className="font-medium">{getHeroName(match.hero_id)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-green-400">{match.kills}</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-red-400">{match.deaths}</span>
                        <span className="text-gray-400">/</span>
                        <span className="text-blue-400">{match.assists}</span>
                      </td>
                      <td className="py-3 px-4">{match.gold_per_min}</td>
                      <td className="py-3 px-4">{match.xp_per_min}</td>
                      <td className="py-3 px-4">{formatDuration(match.duration)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          match.radiant_win === (match.player_slot < 128) 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {match.radiant_win === (match.player_slot < 128) ? 'Win' : 'Loss'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Top Heroes */}
        <section className="dota-card mb-8">
          <div className="border-b border-white/5 p-6">
            <h2 className="text-2xl font-semibold">Most Played Heroes</h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playerInfo.heroes?.slice(0, 9).map((hero, idx) => (
                <div key={idx} className="dota-card p-4">
                  <div className="flex items-center gap-4 mb-3">
                    {getHeroImage(hero.hero_id) && (
                      <img 
                        src={getHeroImage(hero.hero_id)} 
                        alt={getHeroName(hero.hero_id)}
                        className="w-12 h-12 rounded"
                      />
                    )}
                    <div>
                      <div className="font-semibold">{getHeroName(hero.hero_id)}</div>
                      <div className="text-sm text-gray-400">{hero.games} games</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Wins</span>
                      <span className="text-green-400 font-semibold">{hero.win}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Win Rate</span>
                      <span className="font-semibold">{Math.round((hero.win / hero.games) * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Avg KDA</span>
                      <span className="font-semibold">
                        {Math.round((hero.kills + hero.assists) / Math.max(hero.deaths, 1) * 10) / 10}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Peers */}
        {playerInfo.peers && playerInfo.peers.length > 0 && (
          <section className="dota-card mb-8">
            <div className="border-b border-white/5 p-6">
              <h2 className="text-2xl font-semibold">Frequent Teammates</h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {playerInfo.peers.slice(0, 6).map((peer, idx) => (
                  <div key={idx} className="dota-card p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={peer.avatar} 
                        alt="Peer Avatar" 
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-semibold">{peer.personaname}</div>
                        <div className="text-sm text-gray-400">{peer.games} games together</div>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Win Rate</span>
                        <span className="font-semibold">{Math.round((peer.win / peer.games) * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">With</span>
                        <span className="font-semibold">{peer.with_games}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Against</span>
                        <span className="font-semibold">{peer.against_games}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function Field({ label, value }){
  return (
    <div className="bg-white/5 rounded-lg p-3">
      <div className="text-xs uppercase tracking-wide text-gray-400">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  )
}
