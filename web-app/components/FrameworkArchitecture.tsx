'use client'

import React from 'react'

export default function FrameworkArchitecture() {
  const PIPELINE_STEPS = [
    {
      step: '01 // PERCEPTION',
      title: 'Orbit Ingestion & Signal Loop',
      desc: 'High-frequency WebSocket stream listening directly to Robinhood Nitro mempool at 100ms intervals.',
      tag: 'NITRO STREAM',
      code: 'stream.on("block", (b) => ingest(b.transactions))',
    },
    {
      step: '02 // REASONING',
      title: 'Robyn Neural 0.5B Tool Calling',
      desc: 'Fine-tuned Hermes LLM decomposes multi-step directives into deterministic EVM tool calls.',
      tag: 'TOOL CALLING',
      code: '<tool_call> {"name": "arb_swap", "params": {...}}',
    },
    {
      step: '03 // SIMULATION',
      title: 'Zero-Revert Pre-Flight Engine',
      desc: 'Simulates state transitions off-chain to guarantee gas efficiency and 100% execution success.',
      tag: 'EVM SIMULATOR',
      code: 'eth_call(tx) => status: SUCCESS, gasUsed: 42000',
    },
    {
      step: '04 // SETTLEMENT',
      title: 'Arbitrum Nitro Atomic Execution',
      desc: 'Broadcasts signed bundle to Robinhood Chain with sub-100ms inclusion and cryptographic receipt.',
      tag: 'ON-CHAIN SETTLE',
      code: 'tx_hash: 0x4f8a...c7b2 [Block #54,440,747]',
    },
  ]

  const TECH_SPECS = [
    {
      title: '100ms Block Latency',
      val: '100ms',
      desc: 'Ultra-low latency Arbitrum Orbit Nitro L2 rollup finality.',
      icon: '⚡',
    },
    {
      title: 'Robyn-Neural LLM',
      val: '0.5B Params',
      desc: 'Ultra-lightweight on-device tool calling model on Hugging Face.',
      icon: '🧠',
    },
    {
      title: 'Sub-Cent Gas Fees',
      val: '~0.36 Gwei',
      desc: 'Continuous autonomous agent swarms without treasury depletion.',
      icon: '⛽',
    },
    {
      title: 'Universal EVM',
      val: 'Orbit Nitro',
      desc: 'Zero friction compatibility with all ERC-20, AMM, and RWA contracts.',
      icon: '🌐',
    },
  ]

  return (
    <section id="architecture" className="space-y-10 pt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#00C805]">
            <span>// 04_RUNTIME_PIPELINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            4-Stage Autonomous Pipeline
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            How Robyn OS transitions from natural language intent to sub-100ms atomic on-chain settlement.
          </p>
        </div>

        <div className="font-mono text-xs text-gray-400 bg-black/60 border border-white/10 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          LATENCY TARGET: <span className="text-[#00C805] font-bold">&lt;100ms</span>
        </div>
      </div>

      {/* 4-Step Pipeline Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PIPELINE_STEPS.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl bg-[#030608] border border-white/10 hover:border-[#00C805]/40 p-5 flex flex-col justify-between transition-all duration-300 shadow-xl relative group"
          >
            <div>
              <div className="flex items-center justify-between mb-3 font-mono">
                <span className="text-xs font-bold text-[#00C805]">{item.step}</span>
                <span className="text-[9px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                  {item.tag}
                </span>
              </div>
              <h3 className="font-mono font-bold text-white text-sm sm:text-base mb-2 group-hover:text-[#00C805] transition">
                {item.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">{item.desc}</p>
            </div>
            <div className="bg-black/90 border border-white/10 rounded-lg p-2.5 font-mono text-[11px] text-[#4EFA66] overflow-x-auto">
              <code>{item.code}</code>
            </div>
          </div>
        ))}
      </div>

      {/* 4 Tech Specs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {TECH_SPECS.map((spec, index) => (
          <div
            key={index}
            className="bg-[#020406] border border-white/10 rounded-2xl p-5 hover:border-[#00C805]/30 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{spec.icon}</span>
              <span className="font-mono text-sm font-extrabold text-[#00C805]">{spec.val}</span>
            </div>
            <div className="font-mono text-xs font-bold text-white mt-1">{spec.title}</div>
            <div className="text-[11px] text-gray-400 mt-1 leading-relaxed">{spec.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
