import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-white/5 shadow-glow">
        <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react//home/heroes_bg.jpg" alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-30"/>
        <div className="relative p-10 md:p-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Become Better, One Match at a Time</h1>
          <p className="mt-4 max-w-2xl text-gray-300">Analyze live games, explore scenarios, and dive into player stats. Built for Dota players who want to improve.</p>
          <div className="mt-8 flex gap-3">
            <Link to="/live" className="dota-btn">See Live Games</Link>
            <Link to="/player" className="dota-btn bg-white/10 hover:bg-white/20">Check Player</Link>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Live Matches" desc="Watch scores and rosters update in real-time." to="/live" icon="🎮"/>
        <Card title="Player Stats" desc="Search and analyze player profiles." to="/player" icon="👤"/>
        <Card title="Compare Players" desc="Compare up to 5 players side-by-side." to="/compare" icon="⚔️"/>
        <Card title="Analytics" desc="Hero recommendations and meta analysis." to="/analytics" icon="📊"/>
        <Card title="My Library" desc="Bookmark players, heroes, and matches." to="/library" icon="📚"/>
        <Card title="Alerts" desc="Set up custom notifications." to="/alerts" icon="🔔"/>
        <Card title="Pro Players" desc="Browse the pro scene and player profiles." to="/pros" icon="⭐"/>
        <Card title="Scenarios" desc="Query item timings, lane roles and more." to="/scenarios" icon="🔍"/>
      </section>
    </div>
  )
}

function Card({ title, desc, to, icon }){
  return (
    <Link to={to} className="dota-card p-6 hover:shadow-xl hover:shadow-dotaAccent/20 transition block group">
      <div className="flex items-start gap-4">
        <span className="text-3xl">{icon}</span>
        <div className="flex-1">
          <h3 className="text-xl font-semibold group-hover:text-dotaAccent transition">{title}</h3>
          <p className="text-gray-400 mt-2">{desc}</p>
          <span className="inline-block mt-4 text-dotaAccent opacity-0 group-hover:opacity-100 transition">Explore →</span>
        </div>
      </div>
    </Link>
  )
}


