'use client'

import React, { useState } from 'react'

const MODULES = [
  {
    id: 'agent',
    icon: '🧠',
    title: 'Autonomous EVM Execution Engine',
    tag: 'CORE RUNTIME',
    contract: 'robyn/core/agent.py',
    summary: 'Autonomous coordination loop that translates natural language directives and quantitative market signals into validated EVM transactions.',
    capability: 'Hermes JSON tool calling, automated parameter validation, simulation before broadcast, and multi-step on-chain coordination.',
    architecture: 'Connects directly to Robinhood Nitro Sequencer with sub-20ms inference and zero gas waste.',
    code: `# Python SDK: Autonomous EVM Agent
agent = RobynAgent(
    model="robynhooood/Robyn-Agent",
    chain_id=4663, # Robinhood Chain
    autonomous=True
)

# Start autonomous execution loop
agent.run_autonomous_cycle()`,
  },
  {
    id: 'arbitrage',
    icon: '⚡',
    title: 'Sub-100ms Flash Arbitrage Swarms',
    tag: 'SUB-SECOND ARB',
    contract: 'robyn/modules/flash_arbitrage.py',
    summary: 'High-frequency atomic cross-DEX routing optimized for Robinhood Chain Arbitrum Orbit 100ms blocks.',
    capability: 'Taps into low-latency WebSocket sequencer feeds to capture micro-second liquidity disparities between AMMs atomically.',
    architecture: 'Sub-100ms block inclusion ensures zero front-running and MEV-resistant settlement.',
    code: `# Python SDK: Flash Arbitrage Monitor
agent.start_flash_arbitrage_swarm(
    target_pairs=["ROBYN/ETH", "USDC/ETH"],
    min_profit_bps=20,
    max_latency_ms=100
)`,
  },
  {
    id: 'clm',
    icon: '💎',
    title: 'Concentrated Liquidity Manager (CLM)',
    tag: 'DYNAMIC LIQUIDITY',
    contract: 'contracts/RobynCLMVault.sol',
    summary: 'Algorithmic liquidity management that dynamically adjusts price tick bounds around Robinhood retail orderbook volume.',
    capability: 'Continuously rebalances LP ranges to capture maximum trading fee velocity while minimizing impermanent loss.',
    architecture: 'Automated on-chain rebalancing without manual LP intervention.',
    code: `# Python SDK: Dynamic CLM Tick Optimizer
clm = agent.get_clm_module(pool="0xRobinhoodPool...")
clm.rebalance_ticks(
    range_width_bps=200,
    auto_compound=True
)`,
  },
  {
    id: 'accounts',
    icon: '🛡️',
    title: 'ERC-4337 Smart Accounts & Session Keys',
    tag: 'NON-CUSTODIAL',
    contract: 'robyn/chain/wallet.py',
    summary: 'Non-custodial agent delegation using account abstraction session keys on Robinhood Orbit.',
    capability: 'Users grant restricted session keys with strict spending limits, contract whitelists, and expiry timestamps.',
    architecture: 'Maintains 100% self-custody while enabling 24/7 autonomous agent execution.',
    code: `# Python SDK: Create Restricted Session Key
session = agent.create_session_key(
    spending_limit_eth=0.5,
    valid_duration_hours=24,
    whitelisted_contracts=["0xVault...", "0xRouter..."]
)`,
  },
  {
    id: 'oracle',
    icon: '📡',
    title: 'Verifiable State & Inference Oracle',
    tag: 'CRYPTOGRAPHIC AUDIT',
    contract: 'contracts/RobynTradeProofOracle.sol',
    summary: 'Generates on-chain cryptographic receipts and verifiable audit proofs for all autonomous actions.',
    capability: 'Commits verifiable inference hashes and trade receipts directly to smart contracts without centralized API trust.',
    architecture: 'Decentralized verification guarantees transparent on-chain AI outputs.',
    code: `# Python SDK: Verifiable State Verification
receipt = agent.get_latest_execution_proof()
print(f"Proof Hash: {receipt.proof_hash}")
print(f"Block Height: #{receipt.block_number}")`,
  },
]

export default function FrameworkModules() {
  const [activeTab, setActiveTab] = useState(MODULES[0].id)
  const currentModule = MODULES.find((m) => m.id === activeTab) || MODULES[0]

  return (
    <section id="modules" className="space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="bg-[#00C805]/10 border border-[#00C805]/30 text-[#00C805] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
          Framework Primitives
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
          5 Core AI Framework Modules
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-2">
          Pioneering autonomous EVM intelligence natively integrated with Robinhood Chain's financial infrastructure.
        </p>
      </div>

      {/* Module Selector Pill Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {MODULES.map((mod) => (
          <button
            key={mod.id}
            type="button"
            onClick={() => setActiveTab(mod.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === mod.id
                ? 'bg-[#00C805] text-black shadow-lg shadow-[#00C805]/20 font-extrabold'
                : 'bg-[#090B0E] border border-white/10 text-gray-300 hover:text-white hover:border-white/20'
            }`}
          >
            <span>{mod.icon}</span>
            <span>{mod.title.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Active Module Detail Card */}
      <div className="rounded-3xl bg-[#090B0E] border border-white/10 p-6 sm:p-10 shadow-2xl">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-[#00C805]/10 border border-[#00C805]/30 flex items-center justify-center text-2xl">
                {currentModule.icon}
              </span>
              <div>
                <span className="text-[10px] font-bold text-[#00C805] uppercase tracking-wider">
                  {currentModule.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {currentModule.title}
                </h3>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">{currentModule.summary}</p>

            <div className="space-y-3 pt-1">
              <div className="p-4 bg-black/60 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Core AI Capability:
                </span>
                <p className="text-gray-300 text-xs leading-relaxed">{currentModule.capability}</p>
              </div>

              <div className="p-4 bg-black/60 rounded-xl border border-[#00C805]/20 space-y-1">
                <span className="text-[10px] font-bold text-[#00C805] uppercase tracking-wider block">
                  Network Architecture:
                </span>
                <p className="text-gray-300 text-xs leading-relaxed">{currentModule.architecture}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 font-mono">
              <span>Module Source:</span>
              <span className="text-[#00C805] bg-white/5 px-2.5 py-1 rounded border border-white/10">
                {currentModule.contract}
              </span>
            </div>
          </div>

          {/* Right Column: Code Implementation Snippet */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-black border border-white/15 p-5 font-mono text-xs shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                  <span className="text-gray-400 text-[11px] ml-2 font-semibold">SDK Execution Snippet</span>
                </div>
                <span className="text-[10px] text-[#00C805] font-bold">PYTHON 3.10+</span>
              </div>

              <pre className="text-gray-300 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                <code>{currentModule.code}</code>
              </pre>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-500">
                <span>Autonomous EVM Execution</span>
                <span className="text-[#00C805] font-semibold">100ms Block Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
