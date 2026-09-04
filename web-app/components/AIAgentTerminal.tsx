'use client'

import React, { useState } from 'react'

const PRESET_PROMPTS = [
  {
    title: 'TradFi Equity Hedging',
    prompt: 'Rebalance 30% of meme trading pool fees into tokenized NVDA shares in escrow.',
    intent: 'TRADFI_EQUITY_HEDGE',
    target: '0x3cA8513cDF8a7863152d0E377f09CeFe6e4bE713',
    gas: '42,180 gas (0.36 Gwei)',
    calldata: '0x6a7b3c010000000000000000000000003ca8513cdf8a7863152d0e377f09cefe6e4be713000000000000000000000000000000000000000000000000000000000000001e',
    executionTime: '24ms',
    summary: 'Detected $12,400 accumulated LP fee yield. Executed atomic OTC swap into 100 tokenized NVDA shares. Assets locked into Collateral Escrow.',
  },
  {
    title: '100ms Arbitrage Swarm',
    prompt: 'Scan Robinhood Chain AMMs for sub-100ms price delta on ROBYN/ETH and execute atomic backrun.',
    intent: 'ATOMIC_ARBITRAGE_ORBIT',
    target: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    gas: '68,490 gas (0.36 Gwei)',
    calldata: '0x38ed17390000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000000000000000080',
    executionTime: '18ms',
    summary: 'Discovered 1.4% price delta between Pool A and Pool B. Bundled and executed in block #54,345,102 (latency: 18ms). Net profit streamed to Staking Vault.',
  },
  {
    title: 'Concentrated Liquidity Manager (CLM)',
    prompt: 'Optimize Uniswap v3 / Orbit tick bounds around current retail orderbook volume to capture 3x fee velocity.',
    intent: 'CLM_DYNAMIC_TICK_REBALANCE',
    target: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    gas: '89,120 gas (0.36 Gwei)',
    calldata: '0x0c49ccbe000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000186a0',
    executionTime: '31ms',
    summary: 'Adjusted concentrated liquidity bounds [-180, +180 ticks]. Fee efficiency increased by 310% relative to standard 50/50 liquidity.',
  },
  {
    title: 'Verifiable AI Inference Oracle',
    prompt: 'Generate cryptographic zk-proof of off-chain sentiment index and commit state to Robinhood Chain.',
    intent: 'ORACLE_ZK_STATE_COMMIT',
    target: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    gas: '51,200 gas (0.36 Gwei)',
    calldata: '0x8f32d59b00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000040',
    executionTime: '42ms',
    summary: 'Autonomous cryptographic proof synthesized and verified on-chain. Zero central server dependency.',
  },
]

export default function AIAgentTerminal() {
  const [selectedPrompt, setSelectedPrompt] = useState(PRESET_PROMPTS[0])
  const [customInput, setCustomInput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<'console' | 'modules'>('console')
  const [executionLog, setExecutionLog] = useState<string[] | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleExecute = (preset = selectedPrompt) => {
    setIsRunning(true)
    setIsSuccess(false)
    setExecutionLog([
      '[1/4] Parsing natural language intent via Robyn Neural Engine...',
    ])

    setTimeout(() => {
      setExecutionLog((prev) => [
        ...(prev || []),
        `[2/4] Intent verified: [${preset.intent}]. Generating EVM ABI calldata...`,
      ])
    }, 400)

    setTimeout(() => {
      setExecutionLog((prev) => [
        ...(prev || []),
        `[3/4] Routing to Robinhood Orbit Sequencer (Latency: ${preset.executionTime}). Target: ${preset.target.slice(0, 10)}...`,
      ])
    }, 800)

    setTimeout(() => {
      setExecutionLog((prev) => [
        ...(prev || []),
        `[4/4] Execution Complete. Gas: ${preset.gas}. Block inclusion verified.`,
      ])
      setIsRunning(false)
      setIsSuccess(true)
    }, 1200)
  }

  return (
    <div id="agent-terminal" className="rounded-3xl bg-gradient-to-b from-[#061208] via-[#040805] to-[#020402] border border-green-500/25 p-6 sm:p-10 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-green-500/20 text-green-400 text-xs font-extrabold px-3 py-1 rounded-full border border-green-500/30 uppercase tracking-wide">
              WORLD'S FIRST ON-CHAIN AI OS
            </span>
            <span className="text-xs text-gray-400 font-mono">Arbitrum Orbit 100ms Nitro</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
            Robyn Autonomous Agent Terminal
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            Beyond basic staking: Robyn OS is a native EVM algorithmic intelligence executing high-speed arbitrage, TradFi equity hedging, dynamic liquidity, and verifiable zero-knowledge state proofs.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('console')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'console'
                ? 'bg-green-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Agent Console
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('modules')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'modules'
                ? 'bg-green-500 text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            5 AI Breakthroughs
          </button>
        </div>
      </div>

      {activeTab === 'console' ? (
        <div className="grid lg:grid-cols-12 gap-8 mt-8">
          {/* Left Column: Preset Prompts & Natural Language Input */}
          <div className="lg:col-span-6 space-y-5">
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
              Select Autonomous Agent Directive:
            </label>

            <div className="space-y-2.5">
              {PRESET_PROMPTS.map((item) => (
                <div
                  key={item.title}
                  onClick={() => {
                    setSelectedPrompt(item)
                    setExecutionLog(null)
                    setIsSuccess(false)
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    selectedPrompt.title === item.title
                      ? 'border-green-400 bg-green-500/10 shadow-lg shadow-green-500/10'
                      : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-sm text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      {item.title}
                    </span>
                    <span className="text-[11px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                      {item.executionTime}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.prompt}</p>
                </div>
              ))}
            </div>

            {/* Custom Natural Language Command */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-300 uppercase mb-2">
                <span>Custom Natural Language EVM Intent:</span>
                <span className="text-[10px] text-green-400 font-mono">NLP -&gt; Calldata Compiler</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Stake 50,000 $ROBYN and rebalance dividends into NVDA..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-green-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleExecute()}
                  disabled={isRunning}
                  className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-extrabold px-5 py-3 rounded-xl text-xs transition flex items-center gap-1.5 shrink-0"
                >
                  {isRunning ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <span>Synthesize</span>
                      <span>⚡</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Terminal Visualizer */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="rounded-2xl bg-black/80 border border-green-500/30 p-5 flex-1 flex flex-col justify-between font-mono text-xs shadow-xl">
              {/* Terminal Titlebar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  <span className="text-gray-400 text-[11px] ml-2 font-semibold">
                    robyn-agent-core :: orbit-rpc:4663
                  </span>
                </div>
                <span className="text-green-400 text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
                  ONLINE · 100ms
                </span>
              </div>

              {/* Terminal Code / Execution Output */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] text-gray-300">
                <div>
                  <span className="text-green-400 font-bold">robyn@node01:~$</span>{' '}
                  <span className="text-white font-semibold">agent.dispatch(directive: "{selectedPrompt.title}")</span>
                </div>

                <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5 space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-gray-400">
                    <span>INTENT_CLASSIFIER:</span>
                    <span className="text-green-400 font-bold">{selectedPrompt.intent}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>TARGET_CONTRACT:</span>
                    <span className="text-white">{selectedPrompt.target}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>SUB-SECOND LATENCY:</span>
                    <span className="text-green-400">{selectedPrompt.executionTime} (&lt;100ms block)</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>GAS CONSUMPTION:</span>
                    <span className="text-gray-300">{selectedPrompt.gas}</span>
                  </div>
                </div>

                {/* Bytecode Preview */}
                <div>
                  <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">
                    Generated EVM Orbit Calldata:
                  </span>
                  <div className="p-2 bg-black rounded border border-white/10 text-[10px] text-green-300/80 break-all">
                    {selectedPrompt.calldata}
                  </div>
                </div>

                {/* Execution Logs */}
                {executionLog && (
                  <div className="pt-2 border-t border-white/10 space-y-1 text-[11px]">
                    {executionLog.map((line, i) => (
                      <div key={i} className="text-green-400 font-semibold">
                        {line}
                      </div>
                    ))}
                  </div>
                )}

                {/* Success Receipt */}
                {isSuccess && (
                  <div className="p-3 bg-green-500/10 border border-green-500/40 rounded-xl text-green-300 text-[11px] space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-white">
                      <span>✅</span>
                      <span>Verified On-Chain Autonomous Result:</span>
                    </div>
                    <p className="text-gray-300 text-[11px] leading-relaxed">
                      {selectedPrompt.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Execution Action Button */}
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">
                  State: {isRunning ? 'Executing sub-second...' : isSuccess ? 'Dispatched' : 'Idle standby'}
                </span>
                <button
                  type="button"
                  onClick={() => handleExecute()}
                  disabled={isRunning}
                  className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs transition shadow-lg shadow-green-500/20 flex items-center gap-1.5"
                >
                  <span>{isRunning ? 'Running...' : 'Run Simulation'}</span>
                  <span>▶</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 5 Breakthrough Modules Showcase */
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            {
              title: '1. TradFi Stock Hedging',
              icon: '🏛️',
              desc: 'Autonomously sweeps degen meme DEX fees and converts them into tokenized US equities ($NVDA, $AAPL, $TSLA) stored in an on-chain transparent escrow pool.',
              tag: 'WALL STREET COLLATERAL',
            },
            {
              title: '2. Sub-100ms Arbitrage Swarms',
              icon: '⚡',
              desc: 'Taps directly into Arbitrum Orbit 100ms Nitro block finality to backrun DEX trades and exploit cross-pool mispricings before external MEV bots can react.',
              tag: 'HIGH FREQUENCY ARB',
            },
            {
              title: '3. Concentrated Liquidity (CLM)',
              icon: '💎',
              desc: 'Dynamic AI engine continuously adjusts Uniswap v3 / Orbit tick ranges to track Robinhood retail flow, yielding 3x higher fee returns than passive LPing.',
              tag: 'LP REBALANCER',
            },
            {
              title: '4. Verifiable Proof Oracle',
              icon: '🛡️',
              desc: 'Replaces centralized off-chain REST API servers with zero-knowledge cryptographic state proofs, guaranteeing verifiable decentralized AI outputs.',
              tag: 'CRYPTOGRAPHIC TRUST',
            },
            {
              title: '5. Natural Language EVM Intent',
              icon: '🗣️',
              desc: 'Allows users to execute multi-step DeFi transactions simply by speaking or typing plain English, with automated security guards and gas optimization.',
              tag: 'CONVERSATIONAL EVM',
            },
            {
              title: '6. Fixed 1B Mathematical Vault',
              icon: '📐',
              desc: 'Rigid 1,000,000,000 token model with weighted share distribution (1.0x to 2.5x). Fully open source and audited on Robinhood Chain Blockscout.',
              tag: 'TRANSPARENT MATH',
            },
          ].map((mod) => (
            <div
              key={mod.title}
              className="rounded-2xl bg-black/40 border border-green-500/20 p-5 hover:border-green-500/40 transition group shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center text-lg">
                  {mod.icon}
                </div>
                <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 uppercase">
                  {mod.tag}
                </span>
              </div>
              <h4 className="font-extrabold text-white text-sm mb-2 group-hover:text-green-400 transition">
                {mod.title}
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed">{mod.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
