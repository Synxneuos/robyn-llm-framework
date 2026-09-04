'use client'

import React from 'react'

export default function FrameworkArchitecture() {
  const PIPELINE_STEPS = [
    {
      step: '01',
      title: 'Intent & Client Ingestion',
      desc: 'Accepts natural language commands via Web3 dApps, Telegram, Discord, or Python API.',
      tag: 'NLP INGESTION',
      code: 'user: "Sweep 30% meme profits to NVDA"',
    },
    {
      step: '02',
      title: 'Robyn Neural LLM Brain',
      desc: 'Parses intent into structured Hermes <tool_call> JSON format with strict safety constraints.',
      tag: 'HERMES PARSER',
      code: '<tool_call> {"name": "hedge_rwa", "args": {...}}',
    },
    {
      step: '03',
      title: 'Sub-100ms Orbit Dispatcher',
      desc: 'Synthesizes EVM bytecode and dispatches to Robinhood Nitro Sequencer via WebSocket feed.',
      tag: 'NITRO SEQUENCER',
      code: 'eth_sendRawTransaction(calldata_0x6a7b...)',
    },
    {
      step: '04',
      title: 'On-Chain Settlement',
      desc: 'Atomic execution on Robinhood Chain with tokenized equity escrow and cryptographic audit log.',
      tag: 'ORBIT SETTLEMENT',
      code: 'Block #54,345,100 · Latency: 18ms · 0.36 Gwei',
    },
  ]

  const TECH_SPECS = [
    {
      title: '100ms Sub-Second Blocks',
      val: '100ms',
      desc: 'Faster block execution than Solana with Ethereum Layer-2 rollup security and finality.',
      icon: '⚡',
    },
    {
      title: 'Robyn Neural Model',
      val: '0.5B Params',
      desc: 'Lightweight, ultra-fast tool-calling model optimized for financial and EVM execution.',
      icon: '🧠',
    },
    {
      title: 'Near-Zero Gas Fees',
      val: '~0.36 Gwei',
      desc: 'Micro-cent execution costs enable continuous autonomous AI agent swarms without treasury drain.',
      icon: '⛽',
    },
    {
      title: 'TradFi Equity Collateral',
      val: '$NVDA / $AAPL',
      desc: 'Seamlessly interacts with tokenized US equities and degen liquidity on Robinhood Chain.',
      icon: '🏛️',
    },
  ]

  return (
    <section id="architecture" className="space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="bg-[#00C805]/10 border border-[#00C805]/30 text-[#00C805] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
          Architecture & Engine
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
          How the Robyn OS Framework Works
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-2">
          From natural language input to atomic sub-second blockchain settlement across Robinhood Chain.
        </p>
      </div>

      {/* 4-Step Pipeline */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PIPELINE_STEPS.map((item) => (
          <div
            key={item.step}
            className="rounded-2xl bg-[#090B0E] border border-white/10 p-6 flex flex-col justify-between hover:border-[#00C805]/40 transition shadow-lg relative group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black text-[#00C805] font-mono">{item.step}</span>
                <span className="text-[10px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase">
                  {item.tag}
                </span>
              </div>
              <h3 className="font-extrabold text-white text-base mb-2 group-hover:text-[#00C805] transition">
                {item.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">{item.desc}</p>
            </div>
            <div className="bg-black/80 border border-white/10 rounded-lg p-2 font-mono text-[10px] text-gray-300 overflow-x-auto">
              <code>{item.code}</code>
            </div>
          </div>
        ))}
      </div>

      {/* 4 Technical Highlights */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TECH_SPECS.map((spec) => (
          <div
            key={spec.title}
            className="rounded-2xl bg-[#090B0E] border border-white/10 p-6 shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{spec.title}</span>
              <span className="text-lg">{spec.icon}</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">{spec.val}</div>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">{spec.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
