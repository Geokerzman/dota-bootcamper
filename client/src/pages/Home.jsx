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

      <section className="grid md:grid-cols-3 gap-6">
        <Card title="Live Matches" desc="Watch scores and rosters update in real-time." to="/live"/>
        <Card title="Scenarios" desc="Query item timings, lane roles and more." to="/scenarios"/>
        <Card title="Pro Players" desc="Browse the pro scene and player profiles." to="/pros"/>
      </section>
    </div>
  )
}

function Card({ title, desc, to }){
  return (
    <Link to={to} className="dota-card p-6 hover:shadow-xl hover:shadow-dotaAccent/20 transition block">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-400 mt-2">{desc}</p>
      <span className="inline-block mt-4 text-dotaAccent">Explore →</span>
    </Link>
  )
}


