'use client'

import React, { useState } from 'react'

export default function DocsPage({ onBackToApp }: { onBackToApp: () => void }) {
  const [activeSection, setActiveSection] = useState<'intro' | 'collateral' | 'token' | 'roadmap' | 'sdk'>('intro')

  const SECTIONS = [
    { id: 'intro', title: '1. Vision & Architecture', icon: '🌟' },
    { id: 'collateral', title: '2. TradFi Collateral System', icon: '🏛️' },
    { id: 'token', title: '3. 1B Token Supply & Utility', icon: '💎' },
    { id: 'roadmap', title: '4. Multi-Phase Roadmap', icon: '🗺️' },
    { id: 'sdk', title: '5. Developer Guide & GitHub', icon: '💻' },
  ] as const

  return (
    <div className="rounded-3xl bg-[#040805] border border-green-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center p-2.5 shadow-lg shadow-green-500/30">
            <svg className="w-full h-full text-black fill-current" viewBox="0 0 24 24">
              <path d="M12 2L4 10h5v10h6V10h5L12 2z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white tracking-tight">Robyn OS - FW Whitepaper & Docs</h2>
              <span className="bg-green-500/20 text-green-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-green-500/40 uppercase">
                v1.0.0 Official
              </span>
            </div>
            <p className="text-xs text-gray-400">
              The World's First Autonomous EVM AI Operating System for Robinhood Chain
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToApp}
          className="bg-green-500 hover:bg-green-400 text-black text-xs font-extrabold px-5 py-2.5 rounded-xl transition flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-green-500/20"
        >
          <span>← Return to Vault Dashboard</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 mt-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Documentation Index
          </div>
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition flex items-center gap-3 ${
                activeSection === sec.id
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40 shadow-lg shadow-green-950/50'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              <span className="text-base">{sec.icon}</span>
              <span>{sec.title}</span>
            </button>
          ))}

          {/* Quick Technical Specs Card */}
          <div className="mt-8 p-5 rounded-2xl bg-black/50 border border-green-500/20 space-y-3 text-xs">
            <div className="font-bold text-white uppercase text-[11px] tracking-wider text-green-400">
              ⚡ Protocol Telemetry
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Execution Layer:</span>
              <span className="text-white font-mono">Robinhood Chain (4663)</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Block Time:</span>
              <span className="text-green-400 font-bold font-mono">100ms (Nitro L2)</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Average Gas:</span>
              <span className="text-white font-mono">~0.36 Gwei ($0.0001)</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Total Fixed Supply:</span>
              <span className="text-white font-mono">1,000,000,000 $ROBYN</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 bg-black/40 rounded-2xl border border-white/10 p-6 sm:p-8 backdrop-blur-md">
          {/* SECTION 1: VISION & ARCHITECTURE */}
          {activeSection === 'intro' && (
            <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
              <div>
                <span className="text-xs text-green-400 uppercase font-bold tracking-widest block mb-1">
                  Genesis & Vision
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  The First Autonomous AI OS in Robinhood History
                </h3>
              </div>

              <p>
                In 2026, Robinhood launched an incredible <strong>100ms Ethereum Layer-2 (Arbitrum Orbit)</strong> engineered for tokenized stocks, ETFs, and meme liquidity. However, the network was missing the ultimate killer primitive:{' '}
                <strong className="text-white">Bridging TradFi Wall Street Equity Collateral with On-Chain Degen Liquidity.</strong>
              </p>

              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 font-medium">
                🎯 <strong>Robyn OS - FW</strong> is the world's first native, autonomous EVM AI operating system designed specifically for Robinhood Chain. It is an on-chain execution engine with autonomous wallet agency, sub-100ms execution logic, and real-time cryptographic audit proofs.
              </div>

              <h4 className="text-lg font-bold text-white pt-2">Why Robinhood Chain?</h4>
              <ul className="space-y-2 list-disc list-inside text-gray-400">
                <li>
                  <strong className="text-white">100ms Blocktimes:</strong> Settles transactions faster than Solana, with the battle-tested security of Ethereum L2.
                </li>
                <li>
                  <strong className="text-white">Dual Financial Economy:</strong> The only blockchain in existence uniting real tokenized US equities ($NVDA, $AAPL) alongside high-frequency meme liquidity.
                </li>
                <li>
                  <strong className="text-white">Near-Zero Gas Fees:</strong> Transactions execute at 0.36 Gwei (~$0.0001), enabling autonomous agent swarms to execute micro-hedging and arbitrage non-stop without draining treasuries.
                </li>
              </ul>
            </div>
          )}

          {/* SECTION 2: COLLATERAL SYSTEM */}
          {activeSection === 'collateral' && (
            <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
              <div>
                <span className="text-xs text-green-400 uppercase font-bold tracking-widest block mb-1">
                  Core Primitive
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  TradFi Equity Collateral & Dividend Vault
                </h3>
              </div>

              <p>
                The cornerstone of Robyn OS - FW is <code className="bg-black/60 px-2 py-0.5 rounded text-green-400 font-mono">RobinhoodCollateralVault.sol</code>. It solves the biggest problem in Web3: <em>retail crypto traders round-tripping gains because meme tokens lack fundamental backing.</em>
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white/[0.02] rounded-xl border border-white/10">
                  <h5 className="font-bold text-white mb-1">Duration Multiplier Tiers</h5>
                  <p className="text-xs text-gray-400 mb-3">Longer lockups mint weighted shares:</p>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-mono"><span>7 Days:</span><span className="text-green-400 font-bold">1.0x (4.8% APY)</span></div>
                    <div className="flex justify-between font-mono"><span>30 Days:</span><span className="text-green-400 font-bold">1.25x (6.0% APY)</span></div>
                    <div className="flex justify-between font-mono"><span>90 Days:</span><span className="text-green-400 font-bold">1.75x (8.4% APY)</span></div>
                    <div className="flex justify-between font-mono"><span>365 Days:</span><span className="text-green-400 font-bold">2.5x (12.0% APY)</span></div>
                  </div>
                </div>

                <div className="p-4 bg-white/[0.02] rounded-xl border border-white/10">
                  <h5 className="font-bold text-white mb-1">Principal Floor Protection</h5>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Stakers are backed by real tokenized <strong className="text-white">Nvidia ($NVDA)</strong> shares held in on-chain escrow. If crypto token prices fluctuate, your locked position maintains a hard mathematical floor guaranteed by the underlying US equity treasury.
                  </p>
                </div>
              </div>

              <h4 className="text-lg font-bold text-white pt-2">Automated Dividend Streaming</h4>
              <p>
                US equities distribute real quarterly dividends. Robyn's autonomous keeper agent sweeps corporate dividend disbursements into the contract via <code className="bg-black/60 px-2 py-0.5 rounded text-green-400 font-mono">depositDividends()</code>, allowing stakers to claim streaming cash flow straight to MetaMask or Phantom in real-time.
              </p>
            </div>
          )}

          {/* SECTION 3: TOKEN UTILITY */}
          {activeSection === 'token' && (
            <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
              <div>
                <span className="text-xs text-green-400 uppercase font-bold tracking-widest block mb-1">
                  1 Billion Fixed Supply
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  $ROBYN Token Utility & Mathematics
                </h3>
              </div>

              <p>
                With a strictly fixed supply of <strong className="text-white">1,000,000,000 $ROBYN</strong> tokens, the protocol uses transparent mathematical formulas to reward long-term stakers and liquidity providers:
              </p>

              <div className="space-y-3 pt-2">
                {[
                  {
                    title: '1. Weighted Share Pool Math (P_i = W_i / W_total)',
                    desc: 'Locking tokens for longer durations multiplies your staking weight from 1.0x up to 2.5x, granting a larger percentage of all distributed stock dividends and collateral.',
                  },
                  {
                    title: '2. Sub-50ms VIP Execution Channels',
                    desc: 'High-frequency traders staking $ROBYN gain access to dedicated priority WebSocket channels, ensuring their transactions are sequenced at the absolute head of 100ms Robinhood blocks.',
                  },
                  {
                    title: '3. Collateral Escrow Super-Multipliers',
                    desc: 'Stakers who pair $ROBYN with their locked ETH unlock an exclusive boost on their US stock collateral allocation, maximizing their share of the NVDA treasury.',
                  },
                  {
                    title: '4. Autonomous Zero-Gas Subsidies (ERC-4337)',
                    desc: '$ROBYN acts as gas fuel in account-abstraction paymasters. Users holding a minimum tier of $ROBYN execute transactions with zero gas fees across all Robyn dApps.',
                  },
                  {
                    title: '5. Concentrated Liquidity Dynamic Rebalancing (CLM)',
                    desc: 'Autonomous neural LP management continuously shifts tick ranges around Robinhood retail volume to capture maximum trading fee velocity.',
                  },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                    <h5 className="font-bold text-white text-sm mb-1">{item.title}</h5>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: ROADMAP */}
          {activeSection === 'roadmap' && (
            <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
              <div>
                <span className="text-xs text-green-400 uppercase font-bold tracking-widest block mb-1">
                  Strategic Horizon
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Robyn OS - FW Strategic Roadmap
                </h3>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/40">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-bold text-green-400 text-sm">Phase 1: Foundation (LIVE TODAY)</h5>
                    <span className="bg-green-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">Active</span>
                  </div>
                  <ul className="text-xs text-gray-300 list-disc list-inside space-y-1">
                    <li>Production Web3 dApp with MetaMask & Phantom integration</li>
                    <li>Verified RobinhoodCollateralVault.sol smart contract on Robinhood Chain</li>
                    <li>Transparent 1B Fixed Supply Mathematical Simulator</li>
                    <li>Sub-100ms Arbitrum Orbit Nitro deployment scripts</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <h5 className="font-bold text-white text-sm mb-1">Phase 2: Multi-Stock Equity Basket (Q3-Q4 2026)</h5>
                  <p className="text-xs text-gray-400">
                    Expand treasury backing beyond $NVDA to include tokenized Apple ($AAPL), Tesla ($TSLA), Microsoft ($MSFT), and S&P 500 ETF index funds ($SPY).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <h5 className="font-bold text-white text-sm mb-1">Phase 3: Autonomous Hedging AI Swarm (2027)</h5>
                  <p className="text-xs text-gray-400">
                    Deploy decentralized keeper swarms on Robinhood Chain to execute algorithmic delta-neutral strategies between on-chain perps and off-chain stock orderbooks.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: DEVELOPER & GITHUB */}
          {activeSection === 'sdk' && (
            <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
              <div>
                <span className="text-xs text-green-400 uppercase font-bold tracking-widest block mb-1">
                  Open Source Engine
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Developer Guide & On-Chain Integration
                </h3>
              </div>

              <p>
                Robyn OS - FW is 100% open source. Developers can interact with the verified smart contracts on Robinhood Chain using standard Web3 libraries (Viem, Ethers.js, Web3.py):
              </p>

              <div className="rounded-xl bg-black border border-white/10 p-4 font-mono text-xs overflow-x-auto text-green-400 space-y-1">
                <p className="text-gray-500">// Interact with Robinhood Collateral Vault</p>
                <p>const VAULT_ADDRESS = "0x3cA8513cDF8a7863152d0E377f09CeFe6e4bE713"</p>
                <p>const RPC_URL = "https://rpc.mainnet.chain.robinhood.com"</p>
                <p>const CHAIN_ID = 4663 // Robinhood Chain Arbitrum Orbit</p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="https://github.com/robynhood-fw/robyn-llm-framework"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2.5 rounded-xl text-xs transition"
                >
                  GitHub Repository ↗
                </a>
                <a
                  href="https://robinhoodchain.blockscout.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/20 font-semibold px-5 py-2.5 rounded-xl text-xs transition"
                >
                  Blockscout Explorer ↗
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
