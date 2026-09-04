'use client'

import React, { useState } from 'react'

export default function FrameworkHero({ onOpenDocs }: { onOpenDocs: () => void }) {
  const [copied, setCopied] = useState(false)
  const installCmd = 'pip install robyn-framework'

  const handleCopy = () => {
    navigator.clipboard.writeText(installCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#090B0E] border border-white/10 p-8 sm:p-12 shadow-2xl">
      {/* Subtle Robinhood Ambient Lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C805]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00C805]/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Heading, Value Prop, Install & Actions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Robinhood Badge */}
          <div className="inline-flex items-center gap-2.5 bg-[#00C805]/10 border border-[#00C805]/30 rounded-full px-3.5 py-1.5 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C805] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C805]"></span>
            </span>
            <span className="text-xs font-bold text-[#00C805] tracking-wide uppercase">
              Robinhood Chain · Arbitrum Orbit 100ms L2 · AI Framework
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Robyn OS <span className="text-[#00C805] font-extrabold">- FW</span>
            </h1>
            <p className="text-xs sm:text-sm font-bold tracking-widest text-[#00C805] uppercase mt-1">
              THE AUTONOMOUS AI AGENT FRAMEWORK FOR ROBINHOOD CHAIN
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
            The first comprehensive autonomous AI agent runtime natively built for the <strong className="text-white">Robinhood Chain</strong>. Combines lightweight <strong className="text-white">Robyn-Neural 0.5B</strong> models with sub-100ms EVM execution, automated TradFi equity hedging, and verifiable on-chain actions.
          </p>

          {/* Install Command Box */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-lg">
            <div className="flex-1 bg-black/80 border border-white/15 rounded-xl px-4 py-3 flex items-center justify-between font-mono text-xs">
              <span className="text-gray-400 select-none mr-2">$</span>
              <span className="text-[#00C805] font-semibold flex-1 overflow-x-auto">{installCmd}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-gray-400 hover:text-white text-xs font-sans ml-3 transition"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <a
              href="https://github.com/robynhood-fw/robyn-llm-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/15 px-4 py-3 rounded-xl text-xs font-semibold transition text-center flex items-center justify-center gap-2"
            >
              <span>GitHub</span>
              <span>↗</span>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button
              type="button"
              onClick={onOpenDocs}
              className="bg-[#00C805] hover:bg-[#00E806] text-black font-extrabold px-6 py-3.5 rounded-xl text-sm transition shadow-lg shadow-[#00C805]/20 flex items-center gap-2"
            >
              <span>Explore Framework Docs</span>
              <span>→</span>
            </button>
            <a
              href="https://huggingface.co/robynhooood/Robyn-Agent"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/60 hover:bg-black text-white border border-white/20 px-6 py-3.5 rounded-xl text-sm font-semibold transition flex items-center gap-2"
            >
              <span>🤗 Hugging Face Model (0.5B)</span>
              <span>↗</span>
            </a>
            <a
              href="#architecture"
              className="text-gray-400 hover:text-[#00C805] text-xs font-semibold underline transition ml-1"
            >
              View Architecture ↓
            </a>
          </div>
        </div>

        {/* Right Column: Character Artwork & Telemetry */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-64 sm:w-80 h-64 sm:h-80">
            {/* Ambient Glow */}
            <div className="absolute inset-0 rounded-full bg-[#00C805]/20 blur-2xl animate-pulse" />
            
            {/* Character Frame */}
            <div className="relative w-full h-full rounded-full border-2 border-[#00C805]/40 p-2 bg-black/80 shadow-2xl shadow-black overflow-hidden">
              <img
                src="/robyn_avatar.jpg"
                alt="Robyn AI Framework Character"
                className="w-full h-full object-cover rounded-full filter contrast-105"
              />
            </div>

            {/* Float Badge: Model Specs */}
            <div className="absolute -bottom-2 -left-2 bg-[#0D0E11]/95 border border-white/15 rounded-xl px-3.5 py-2 shadow-xl backdrop-blur-md text-xs">
              <div className="text-[10px] text-gray-400 uppercase font-bold">Neural Engine</div>
              <div className="font-extrabold text-[#00C805] text-xs">Robyn-Agent 0.5B</div>
            </div>

            {/* Float Badge: Network */}
            <div className="absolute -top-2 -right-2 bg-[#0D0E11]/95 border border-white/15 rounded-xl px-3.5 py-2 shadow-xl backdrop-blur-md text-xs text-right">
              <div className="text-[10px] text-gray-400 uppercase font-bold">Execution Speed</div>
              <div className="font-extrabold text-white text-xs">100ms Arbitrum Orbit</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
