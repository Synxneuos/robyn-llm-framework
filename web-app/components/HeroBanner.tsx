'use client'

import React from 'react'

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061208] via-[#030604] to-[#010201] border border-green-500/30 p-6 sm:p-10 shadow-2xl shadow-green-950/50 mb-10">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Cyberpunk Grid lines overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34, 197, 94, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Typography & Value Proposition */}
        <div className="lg:col-span-7 space-y-6">
          {/* Robinhood Badge */}
          <div className="inline-flex items-center gap-2.5 bg-green-500/10 border border-green-500/40 rounded-full px-4 py-1.5 backdrop-blur-md shadow-sm">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-green-400 uppercase tracking-wider">
              Robyn OS - FW · Robinhood Chain Nitro L2
            </span>
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-10 h-10 text-green-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L4 10h5v10h6V10h5L12 2z" />
              </svg>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
                Robyn OS <span className="text-green-400 font-extrabold">- FW</span>
              </h1>
            </div>
            <p className="text-sm font-semibold tracking-widest text-green-400/90 uppercase mt-1">
              TRADE SMARTER · BUILD FREER · ON-CHAIN FOR A BRIGHTER TOMORROW
            </p>
          </div>

          {/* Core explanation */}
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
            Engineered natively on Robinhood Chain (<strong className="text-white">Arbitrum Orbit 100ms L2</strong>). Robyn OS fuses sub-second EVM algorithmic agency with <strong className="text-white">TradFi Wall Street Equity Collateral</strong> escrow. Programmatic yield, automated $NVDA equity floor backing, and natural language on-chain execution.
          </p>

          {/* Tech Feature Badges */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            {[
              { icon: '⚡', label: '100ms Sub-Second Orbit Nitro' },
              { icon: '🏛️', label: 'TradFi Equity Escrow ($NVDA)' },
              { icon: '🧠', label: 'Autonomous EVM Agent OS' },
              { icon: '💎', label: '1,000,000,000 Total Supply' },
            ].map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 bg-black/50 border border-green-500/25 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-200 backdrop-blur-sm"
              >
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </span>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="#agent-terminal"
              className="bg-green-500 hover:bg-green-400 text-black font-extrabold px-7 py-3.5 rounded-xl text-sm transition shadow-lg shadow-green-500/30 flex items-center gap-2"
            >
              <span>Launch AI Agent Terminal</span>
              <span>🤖</span>
            </a>
            <a
              href="#vault-actions"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/20 px-6 py-3.5 rounded-xl text-sm font-semibold transition backdrop-blur-sm flex items-center gap-2"
            >
              <span>Collateral Vault</span>
              <span>↓</span>
            </a>
            <a
              href="#tokenomics-sim"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/20 px-6 py-3.5 rounded-xl text-sm font-semibold transition backdrop-blur-sm flex items-center gap-2"
            >
              <span>1B Math Simulator</span>
              <span>🧮</span>
            </a>
          </div>
        </div>

        {/* Right column: Graphic Artwork with Character */}
        <div className="lg:col-span-5 flex justify-center relative">
          {/* Glowing Aura Ring */}
          <div className="relative w-72 sm:w-80 h-72 sm:h-80">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-green-500/30 to-emerald-400/20 blur-2xl animate-pulse" />
            
            {/* Character circle frame */}
            <div className="relative w-full h-full rounded-full border-2 border-green-400/60 p-2 shadow-2xl shadow-green-500/40 bg-black/80 overflow-hidden">
              <img
                src="/robyn_avatar.jpg"
                alt="Robyn OS - FW Character"
                className="w-full h-full object-cover rounded-full filter contrast-110 hover:scale-105 transition duration-500"
              />
            </div>

            {/* Floating Live Badge 1 (Top-Left) */}
            <div className="absolute -top-3 -left-4 bg-black/90 border border-green-500/40 rounded-xl px-3.5 py-2 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-semibold">EVM Engine</div>
                <div className="font-bold text-white text-xs">Autonomous Agent Active</div>
              </div>
            </div>

            {/* Floating Live Badge 2 (Bottom-Right) */}
            <div className="absolute -bottom-3 -right-4 bg-black/90 border border-green-500/40 rounded-xl px-3.5 py-2 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs">
              <div className="text-right">
                <div className="text-[10px] text-gray-400 uppercase font-semibold">Max Lock Multiplier</div>
                <div className="font-bold text-green-400 text-xs">2.5x Weighted Shares</div>
              </div>
              <span className="text-base">💎</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tech specs strip at bottom of banner */}
      <div className="mt-10 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="text-center sm:text-left">
          <span className="text-gray-500 block text-[10px] uppercase font-bold">Protocol Architecture</span>
          <span className="text-white font-bold text-sm">Robyn Autonomous OS</span>
        </div>
        <div className="text-center sm:text-left">
          <span className="text-gray-500 block text-[10px] uppercase font-bold">L2 Block Latency</span>
          <span className="text-green-400 font-bold text-sm">100ms Arbitrum Orbit</span>
        </div>
        <div className="text-center sm:text-left">
          <span className="text-gray-500 block text-[10px] uppercase font-bold">Total Genesis Supply</span>
          <span className="text-white font-bold text-sm">1,000,000,000 $ROBYN</span>
        </div>
        <div className="text-center sm:text-left">
          <span className="text-gray-500 block text-[10px] uppercase font-bold">Network & Consensus</span>
          <span className="text-green-400 font-bold text-sm">Robinhood Chain (ID: 4663)</span>
        </div>
      </div>
    </div>
  )
}
