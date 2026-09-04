'use client'

import React from 'react'

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#070d08] border border-green-500/20 p-8 sm:p-12 shadow-2xl">
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Title, Value Prop & Clean Actions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Robinhood Badge */}
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-3.5 py-1.5 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-green-400 tracking-wide uppercase">
              Robinhood Chain · 100ms Orbit Nitro L2
            </span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Robyn OS <span className="text-green-400 font-extrabold">- FW</span>
            </h1>
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-green-400/80 uppercase mt-1">
              THE FIRST AUTONOMOUS AI OS ON ROBINHOOD CHAIN
            </p>
          </div>

          {/* Core Description */}
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
            Bridging <strong className="text-white">TradFi Wall Street Equity Collateral</strong> with <strong className="text-white">On-Chain Liquidity</strong>. Lock tokens to secure real <strong className="text-green-400">$NVDA</strong> treasury floor backing and earn streaming quarterly distributions directly in your Web3 wallet.
          </p>

          {/* Clean 4-Item Feature Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Latency</span>
              <span className="text-green-400 font-extrabold text-sm">100ms Blocks</span>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Fixed Supply</span>
              <span className="text-white font-extrabold text-sm">1B $ROBYN</span>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Collateral</span>
              <span className="text-green-400 font-extrabold text-sm">$NVDA Escrow</span>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-center">
              <span className="text-gray-400 text-[10px] uppercase font-bold block">Chain ID</span>
              <span className="text-white font-extrabold text-sm">4663 Mainnet</span>
            </div>
          </div>

          {/* Clean Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#vault-actions"
              className="bg-green-500 hover:bg-green-400 text-black font-extrabold px-6 py-3.5 rounded-xl text-sm transition shadow-lg shadow-green-500/20 inline-flex items-center gap-2"
            >
              <span>Launch Staking Vault</span>
              <span>↓</span>
            </a>
            <a
              href="#tokenomics-sim"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/15 px-6 py-3.5 rounded-xl text-sm font-semibold transition inline-flex items-center gap-2"
            >
              <span>1B Tokenomics Simulator</span>
              <span>🧮</span>
            </a>
          </div>
        </div>

        {/* Right Column: Clean Artwork Avatar */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-64 sm:w-72 h-64 sm:h-72">
            <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl animate-pulse" />
            <div className="relative w-full h-full rounded-full border-2 border-green-400/50 p-2 bg-black/70 shadow-2xl shadow-green-950/80 overflow-hidden">
              <img
                src="/robyn_avatar.jpg"
                alt="Robyn OS Character"
                className="w-full h-full object-cover rounded-full filter contrast-105"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
