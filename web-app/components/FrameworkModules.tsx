'use client'

import React, { useState } from 'react'

const MODULES = [
  {
    id: 'hedging',
    icon: '🛡️',
    title: 'Meme-to-Stock Autonomous Hedging',
    tag: 'RWA HEDGING',
    contract: 'contracts/MemeToStockVault.sol',
    summary: 'Autonomously sweeps degen meme token trading profits into tokenized US tech equities ($NVDA, $AAPL) on Robinhood Chain.',
    problem: '95% of meme traders round-trip their 10x–50x gains because taking profit manually is psychologically difficult and slow.',
    solution: 'User sets an automated directive: "When my meme token pumps 2x on Pons, autonomously sweep 30% of profits into tokenized Nvidia ($NVDA)". The agent executes automatically.',
    code: `// Python SDK: Auto-Hedge Rule
agent.register_hedging_rule(
    token_in="0xMemeTokenAddress...",
    trigger_gain_pct=100, // 2x pump
    take_profit_pct=30,   // sweep 30%
    target_rwa="NVDA"     // tokenized Nvidia
)`,
  },
  {
    id: 'equimeme',
    icon: '🏛️',
    title: 'Stock-Backed Meme Launchpad ("Equi-Meme")',
    tag: 'FLOOR PROTECTION',
    contract: 'contracts/EquiMemeToken.sol',
    summary: 'Launches community tokens with an unruggable, real-world asset collateral floor price guaranteed by US equity reserves.',
    problem: 'Thousands of meme tokens launch daily with zero underlying backing and collapse to zero when momentum fades.',
    solution: 'Equi-Meme locks a fixed 10% of bonding curve capital directly into tokenized US equities in on-chain escrow, creating a mathematical floor price.',
    code: `// Python SDK: Launch Equi-Meme Token
token = agent.launch_equi_meme(
    name="Robyn AI",
    symbol="ROBYN",
    initial_supply=1_000_000_000,
    equity_backing_asset="NVDA",
    equity_reserve_bps=1000 // 10%
)`,
  },
  {
    id: 'arbitrage',
    icon: '⚡',
    title: '100ms Flash-Arbitrage Swarm Engine',
    tag: 'SUB-SECOND ARB',
    contract: 'robyn/modules/flash_arbitrage.py',
    summary: 'Executes atomic cross-DEX arbitrage in sub-100ms intervals between Pons AMM and Uniswap V3 on Robinhood Chain.',
    problem: 'Liquidity fragmentation between AMMs creates price discrepancies that manual traders cannot capture fast enough.',
    solution: 'Robyn monitors Arbitrum Nitro WebSocket feeds with pre-compiled bytecode routing, executing atomic flash-swaps with zero human delay.',
    code: `// Python SDK: Flash Arbitrage Monitor
agent.start_flash_arbitrage_swarm(
    pair=("ROBYN", "WETH"),
    min_profit_bps=25,
    max_latency_ms=100
)`,
  },
  {
    id: 'hedgefund',
    icon: '💼',
    title: 'ERC-4337 AI Portfolio Manager & Session Keys',
    tag: 'SMART ACCOUNTS',
    contract: 'robyn/chain/wallet.py',
    summary: 'Non-custodial algorithmic portfolio management using account abstraction session keys on Robinhood Orbit.',
    problem: 'Giving full private keys to automated bots creates catastrophic security risks.',
    solution: 'Users grant restricted session keys to Robyn with strict spending limits and whitelisted contracts, maintaining 100% self-custody.',
    code: `// Python SDK: Session Key Portfolio Rebalance
agent.set_portfolio_target({
    "RWAs (NVDA/AAPL/SPY)": 0.50,
    "Bluechip DeFi (ETH/USDC)": 0.30,
    "Momentum Memes": 0.20
})`,
  },
  {
    id: 'oracle',
    icon: '📡',
    title: 'On-Chain Hype & Sentiment Oracle',
    tag: 'VERIFIABLE PROOF',
    contract: 'contracts/RobynTradeProofOracle.sol',
    summary: 'Computes real-time social sentiment scores and publishes verifiable cryptographic proofs directly to smart contracts.',
    problem: 'DeFi protocols rely on centralized Web2 APIs for social metrics, making them vulnerable to single points of failure.',
    solution: 'Robyn generates cryptographic trade proof receipts and commits sentiment indices (0–100) on-chain for dynamic lending and liquidation triggers.',
    code: `// Python SDK: Verifiable State Oracle
sentiment_score = agent.get_on_chain_sentiment("ROBYN")
print(f"Verified On-Chain Hype Score: {sentiment_score}/100")`,
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
          Breakthrough Capabilities
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
          5 Core AI Framework Modules
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-2">
          Pioneering autonomous EVM intelligence natively integrated with Robinhood Chain's financial primitives.
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
          {/* Left Column: Problem, Solution & Contract */}
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

            <div className="space-y-4 pt-1">
              <div className="p-4 bg-black/60 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                  The Problem in Web3:
                </span>
                <p className="text-gray-400 text-xs leading-relaxed">{currentModule.problem}</p>
              </div>

              <div className="p-4 bg-black/60 rounded-xl border border-[#00C805]/20 space-y-1">
                <span className="text-[10px] font-bold text-[#00C805] uppercase tracking-wider block">
                  Robyn's Autonomous Solution:
                </span>
                <p className="text-gray-300 text-xs leading-relaxed">{currentModule.solution}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 pt-2 font-mono">
              <span>Source File:</span>
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
