import React, { useState } from 'react'

interface Milestone {
  id: string
  title: string
  phase: string
  timeline: string
  status: 'COMPLETED' | '85% IN FLIGHT' | 'IN DEVELOPMENT' | 'PLANNED' | 'HORIZON'
  category: 'core' | 'defi' | 'omni' | 'zkml' | 'swarms'
  deliverables: string[]
  technicalSpecs: {
    kpi: string
    latency: string
    verification: string
  }
}

const ROADMAP_DATA: Milestone[] = [
  {
    id: 'phase-1',
    title: 'Core Kernel & Robyn Engine Execution',
    phase: 'PHASE 01',
    timeline: 'Q1 2026',
    status: 'COMPLETED',
    category: 'core',
    deliverables: [
      '0.5B Parameter Local Tool-Calling Execution Engine',
      'SQLite & Chroma Vector Memory Persistence',
      'CLI 3-Step Setup & ElizaOS Dual-Directional Adapter',
      'Production robynos.xyz Host & Robinhood Chain RPC Telemetry',
      'Plugin Architecture Monorepo (@robyn-os/plugin-core)',
    ],
    technicalSpecs: {
      kpi: '100% Shipped & Live',
      latency: '< 32ms cognitive step',
      verification: 'GitHub: Synxneuos/robyn-llm-framework',
    },
  },
  {
    id: 'phase-2',
    title: 'Collateral Vault & Omni-Channel Swarms',
    phase: 'PHASE 02',
    timeline: 'Q2 2026',
    status: '85% IN FLIGHT',
    category: 'defi',
    deliverables: [
      '$ROBYN Token Collateral Staking Vault & Yield Distributor',
      'Tokenized Stocks / ETH Credit Line Borrowing & Liquidations',
      'Telegram, WhatsApp & Discord Real-time Alert Daemons',
      'Pump.fun & Robinhood Multi-Chain Mobile Terminal (Expo SDK 57)',
      'AES-256-GCM Hardware Vault & Session Signer Mode',
    ],
    technicalSpecs: {
      kpi: '85% Implemented & Tested',
      latency: '100ms block finality',
      verification: 'Contracts: 0x71C8...F033',
    },
  },
  {
    id: 'phase-3',
    title: 'Multi-Agent Swarms & Autonomous Arb Mesh',
    phase: 'PHASE 03',
    timeline: 'Q3 2026',
    status: 'IN DEVELOPMENT',
    category: 'swarms',
    deliverables: [
      'P2P Agent-to-Agent Consensus Protocol (Actor Model)',
      'Cross-Chain Liquidity Routing (Robinhood Orbit ↔ Solana ↔ Base)',
      'Deterministic Nonce Queues & Auto-Bump Gas Relayer',
      'Collaborative Bonding Curve Sniping & Whale Defense Swarms',
      'Zero-Trust Memory Sync across decentralized agent nodes',
    ],
    technicalSpecs: {
      kpi: 'Active Prototyping',
      latency: '< 15ms inter-agent sync',
      verification: 'P2P GossipSub libp2p specs',
    },
  },
  {
    id: 'phase-4',
    title: 'zkML & Verifiable Autonomous Execution',
    phase: 'PHASE 04',
    timeline: 'DECEMBER 2026 TARGET',
    status: 'PLANNED',
    category: 'zkml',
    deliverables: [
      'Zero-Knowledge Proofs for LLM Inference Steps (zkML)',
      'Cryptographic Formal Verification of Pre-Trade Bytecode',
      'AWS Nitro Enclave / TEE Isolated Hardware Key Signers',
      'Fully Autonomous Protocol Governance & Auto-Upgrade Daemons',
      'Decentralized Agent Staking slashing conditions',
    ],
    technicalSpecs: {
      kpi: 'Dec 2026 Convergence',
      latency: 'SNARK proof < 2.5s',
      verification: 'Halo2 / Circom on-chain verifier',
    },
  },
  {
    id: 'phase-5',
    title: 'Sovereign Agentic Economy',
    phase: 'PHASE 05',
    timeline: '2027+ HORIZON',
    status: 'HORIZON',
    category: 'core',
    deliverables: [
      'Self-Funding Agent DAOs with Autonomous Balance Sheets',
      'Native Sub-Millisecond Sequencer L3 Architecture',
      'Autonomous Protocol Upgrades without human intervention',
      'Universal Multichain Agentic Execution Standard (UMAES)',
    ],
    technicalSpecs: {
      kpi: 'Long-term Horizon',
      latency: 'Sub-10ms L3 blocks',
      verification: 'Sovereign Rollup Consensus',
    },
  },
]

export default function RobynRoadmapProtocol({ onBackToMain }: { onBackToMain: () => void }) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'architecture' | 'deliverables' | 'principles'>('timeline')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const filteredMilestones = filterCategory === 'all'
    ? ROADMAP_DATA
    : ROADMAP_DATA.filter((m) => m.category === filterCategory)

  return (
    <div className="min-h-screen bg-[#020509] text-[#E2E8F0] selection:bg-[#00C805] selection:text-black font-sans pb-24">
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-800/80 bg-black/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToMain}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-xs font-mono text-zinc-300 transition-colors"
            >
              <span>←</span> Back to Framework
            </button>
            <div className="h-4 w-[1px] bg-zinc-800" />
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] animate-pulse" />
              <span className="font-mono text-xs font-bold text-white tracking-wider">
                ROBYN // ROADMAP HORIZON
              </span>
              <span className="text-[10px] font-mono bg-[#A855F7]/20 text-[#C084FC] border border-[#A855F7]/40 px-2 py-0.5 rounded-full">
                DEC 2026 TARGET
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">Route:</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-1 rounded">
              robynos.xyz/#roadmap
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 space-y-10">
        {/* Hero Header */}
        <div className="border border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 via-black/80 to-black/90 p-6 sm:p-10 rounded-2xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#A855F7]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/40 bg-purple-950/30 text-purple-300 font-mono text-xs font-bold">
              <span>🚀</span> ENGINEERING MASTERPLAN & ARCHITECTURE CONVERGENCE
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              From Autonomous Kernel to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400">
                Sovereign Agentic Economy
              </span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Robyn Engine is not another speculative meme wrapper. It is a dual-loop autonomous infrastructure platform:
              stochastic LLM strategy coupled with deterministic bytecode verification, sub-100ms block latency, and formal safety guardrails.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 font-mono text-xs">
              <div className="p-3 bg-black/60 border border-zinc-800 rounded-xl">
                <div className="text-zinc-500 text-[10px]">CURRENT PHASE</div>
                <div className="text-white font-bold text-sm mt-0.5">Phase 02 (Q2 2026)</div>
                <div className="text-cyan-400 text-[10px]">85% In Flight</div>
              </div>
              <div className="p-3 bg-black/60 border border-zinc-800 rounded-xl">
                <div className="text-zinc-500 text-[10px]">CONVERGENCE TARGET</div>
                <div className="text-white font-bold text-sm mt-0.5">Dec 2026</div>
                <div className="text-purple-400 text-[10px]">zkML & Swarms</div>
              </div>
              <div className="p-3 bg-black/60 border border-zinc-800 rounded-xl">
                <div className="text-zinc-500 text-[10px]">LATENCY BENCHMARK</div>
                <div className="text-white font-bold text-sm mt-0.5">100ms Finality</div>
                <div className="text-emerald-400 text-[10px]">Robinhood Orbit</div>
              </div>
              <div className="p-3 bg-black/60 border border-zinc-800 rounded-xl">
                <div className="text-zinc-500 text-[10px]">VERIFICATION ENGINE</div>
                <div className="text-white font-bold text-sm mt-0.5">Deterministic</div>
                <div className="text-blue-400 text-[10px]">RiskSentinel V1</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 font-mono text-xs overflow-x-auto gap-2">
          {[
            { id: 'timeline', label: '⏱️ Milestone Timeline', badge: '5 Phases' },
            { id: 'architecture', label: '🏛️ Tech Stack Architecture', badge: '5 Layers' },
            { id: 'deliverables', label: '📦 Deliverables & KPIs', badge: 'Live Metrics' },
            { id: 'principles', label: '🛡️ Core Principles', badge: 'Non-Negotiable' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 border-b-2 font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#00C805] text-white bg-zinc-900/40'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Tab 1: Milestone Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            {/* Filter Buttons */}
            <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto pb-2">
              <span className="text-zinc-500 mr-2">Filter Track:</span>
              {[
                { id: 'all', label: 'All Tracks' },
                { id: 'core', label: '⚡ Core Kernel' },
                { id: 'defi', label: '💰 Vault & DeFi' },
                { id: 'swarms', label: '🐝 Agent Swarms' },
                { id: 'zkml', label: '🔐 zkML & Proofs' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterCategory(filter.id)}
                  className={`px-3 py-1 rounded-lg border transition-all ${
                    filterCategory === filter.id
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Timeline Stepper Cards */}
            <div className="space-y-6">
              {filteredMilestones.map((item, idx) => {
                const isCompleted = item.status === 'COMPLETED'
                const isInFlight = item.status === '85% IN FLIGHT'
                const isDecTarget = item.timeline.includes('DECEMBER 2026')

                return (
                  <div
                    key={item.id}
                    className={`border rounded-xl p-6 sm:p-7 relative transition-all ${
                      isCompleted
                        ? 'border-emerald-500/40 bg-[#040A06]'
                        : isInFlight
                        ? 'border-cyan-500/50 bg-[#040810] shadow-lg shadow-cyan-950/20'
                        : isDecTarget
                        ? 'border-purple-500/50 bg-[#090514] shadow-lg shadow-purple-950/20'
                        : 'border-zinc-800 bg-[#06080D]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-extrabold text-zinc-500">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <div className="text-xs font-mono font-bold tracking-wider text-zinc-400">
                            {item.phase} • {item.timeline}
                          </div>
                          <h3 className="text-lg font-bold text-white mt-0.5">{item.title}</h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs px-3 py-1 rounded-full font-bold border ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : isInFlight
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                              : isDecTarget
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
                      <div className="lg:col-span-8 space-y-3">
                        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                          Core Architectural Deliverables
                        </div>
                        <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                          {item.deliverables.map((del, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className={isCompleted ? 'text-emerald-400' : isInFlight ? 'text-cyan-400' : 'text-purple-400'}>
                                {isCompleted ? '✓' : '✦'}
                              </span>
                              <span>{del}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="lg:col-span-4 bg-black/60 border border-zinc-800/80 rounded-xl p-4 font-mono text-xs space-y-3">
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                          Technical Telemetry
                        </div>
                        <div>
                          <div className="text-zinc-400 text-[11px]">Execution Latency:</div>
                          <div className="text-white font-bold">{item.technicalSpecs.latency}</div>
                        </div>
                        <div>
                          <div className="text-zinc-400 text-[11px]">Target KPI:</div>
                          <div className="text-emerald-400 font-bold">{item.technicalSpecs.kpi}</div>
                        </div>
                        <div>
                          <div className="text-zinc-400 text-[11px]">Verification Source:</div>
                          <div className="text-zinc-300 truncate text-[11px]">{item.technicalSpecs.verification}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Tech Stack Architecture */}
        {activeTab === 'architecture' && (
          <div className="border border-zinc-800 bg-[#060910] rounded-2xl p-6 sm:p-8 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white font-mono">5-LAYER DUAL-LOOP ARCHITECTURAL CONVERGENCE</h2>
              <p className="text-xs text-zinc-400 mt-1">
                How Robyn isolates stochastic LLM models from deterministic on-chain execution guarantees.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  layer: 'LAYER 1: PERCEPTION & INGESTION',
                  name: 'Omni-Channel Stream (WebSocket / RPC)',
                  color: '#00F0FF',
                  desc: 'Ingests real-time commands from Telegram bot daemons, Discord events, DexScreener websockets, and mempool transactions.',
                  tech: 'Erlang-style Actor Ingest · Tokio async runtime · SocketIO',
                },
                {
                  layer: 'LAYER 2: COGNITION CORE (STOCHASTIC)',
                  name: 'Robyn Engine (0.5B Tool-Calling LLM)',
                  color: '#00C805',
                  desc: 'Analyzes macro sentiment, parses user intents, and proposes candidate execution DAG plans (without key access).',
                  tech: 'Transformers.js · Quantized GGUF inference · Local SQLite vector memory',
                },
                {
                  layer: 'LAYER 3: INTERCEPTOR & GUARDRAILS (DETERMINISTIC)',
                  name: 'RiskSentinel Pre-Trade Bytecode Gatekeeper',
                  color: '#F59E0B',
                  desc: 'Pure mathematical rules engine: enforces max slippage limits (1-5%), contract whitelists, balance checks, and anti-drain protection.',
                  tech: 'Rust bytecode validation · Formal invariant solvers · Static ABI validation',
                },
                {
                  layer: 'LAYER 4: ISOLATED KEY VAULT & ENCLAVE',
                  name: 'AES-256-GCM Hardware / TEE Vault',
                  color: '#A855F7',
                  desc: 'Cryptographic signer completely isolated from context window. Signs only if Layer 3 interceptor verifies mathematical safety.',
                  tech: 'AES-256-GCM · AWS Nitro Enclaves / Local HSM · Ephemeral session keys',
                },
                {
                  layer: 'LAYER 5: ON-CHAIN EXECUTION',
                  name: '100ms Nitro Sequencer (Robinhood Orbit / Solana)',
                  color: '#EC4899',
                  desc: 'Direct sub-block transaction broadcast with optimistic nonce management, flashbots protection, and zero MEV leakage.',
                  tech: 'Arbitrum Orbit 100ms · Jupiter V6 / Pump.fun bonding curves · Ethers/Viem',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="border border-zinc-800 bg-black/60 rounded-xl p-5 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="font-mono text-xs font-bold" style={{ color: item.color }}>
                      {item.layer}
                    </div>
                    <div className="font-mono text-[11px] text-zinc-500 bg-zinc-900 px-2.5 py-1 rounded">
                      {item.tech}
                    </div>
                  </div>
                  <div className="text-base font-bold text-white mb-1">{item.name}</div>
                  <p className="text-xs text-zinc-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Deliverables & KPIs */}
        {activeTab === 'deliverables' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-zinc-800 bg-[#060910] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Current Production Metrics (Q1 - Q2 2026)
              </h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Core Kernel Tool Execution:</span>
                  <span className="text-white font-bold">100% Operational</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Robinhood RPC Block Finality:</span>
                  <span className="text-emerald-400 font-bold">78 - 100ms</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Multichain Mobile Terminal:</span>
                  <span className="text-cyan-400 font-bold">1,069 Modules Bundled</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Plugin Ecosystem Monorepo:</span>
                  <span className="text-white font-bold">5 Core Packages Live</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Vault Contract Architecture:</span>
                  <span className="text-purple-400 font-bold">70% Protocol / 30% DEX</span>
                </div>
              </div>
            </div>

            <div className="border border-zinc-800 bg-[#060910] rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-mono font-bold text-purple-400 uppercase tracking-wider">
                Dec 2026 Target Milestones
              </h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">zkML SNARK Proof Generation:</span>
                  <span className="text-purple-300 font-bold">&lt; 2.5s Target</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Inter-Agent P2P Swarm Nodes:</span>
                  <span className="text-purple-300 font-bold">50+ Sovereign Nodes</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Cross-Chain Atomic Settlement:</span>
                  <span className="text-purple-300 font-bold">Robinhood ↔ Solana</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Autonomous TVL Capacity:</span>
                  <span className="text-purple-300 font-bold">$10M+ Collateral Cap</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">TEE Hardware Isolation:</span>
                  <span className="text-purple-300 font-bold">100% Enclave Enforced</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Core Principles */}
        {activeTab === 'principles' && (
          <div className="border border-zinc-800 bg-[#060910] rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white font-mono">NON-NEGOTIABLE PROTOCOL INVARIANTS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-xl border border-emerald-500/30 bg-black/60 space-y-2">
                <div className="text-emerald-400 font-mono text-xs font-bold">01. ZERO PROMPT-BASED SIGNING</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The LLM never directly touches private keys or environmental secrets. Keys live inside isolated enclaves; only mathematically validated bytecode payloads can be signed.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-cyan-500/30 bg-black/60 space-y-2">
                <div className="text-cyan-400 font-mono text-xs font-bold">02. MATHEMATICAL FAIR LAUNCH</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Bonding curves hit $69,000 graduation mathematically. 100% of initial LP tokens are burned on-chain. Rug-pulls and insider pre-mines are rendered impossible by bytecode invariants.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-purple-500/30 bg-black/60 space-y-2">
                <div className="text-purple-400 font-mono text-xs font-bold">03. 100MS EXECUTION VELOCITY</div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Decentralized systems must compete with Web2 execution speed. By combining Arbitrum Orbit sub-blocks with client-side encrypted fast signers, trading velocity reaches parity with centralized order books.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
