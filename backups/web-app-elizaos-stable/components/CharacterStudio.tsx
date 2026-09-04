'use client'

import React, { useState } from 'react'

interface CharacterPreset {
  id: string
  name: string
  role: string
  json: Record<string, any>
  streamLogs: string[]
}

const PRESETS: CharacterPreset[] = [
  {
    id: 'robyn-arb',
    name: 'Robyn (Flash Arb)',
    role: 'Autonomous 100ms Arbitrage & Liquidity Optimizer',
    json: {
      name: "Robyn-Arb",
      clients: ["robinhood", "telegram"],
      modelProvider: "huggingface/robynhooood/Robyn-Agent",
      settings: {
        secrets: {
          ROBINHOOD_RPC_URL: "https://rpc.mainnet.chain.robinhood.com",
          CHAIN_ID: 420120,
          EXECUTION_LATENCY_MS: 100
        }
      },
      plugins: [
        "@robyn-os/plugin-robinhood",
        "@robyn-os/plugin-uniswap",
        "@robyn-os/plugin-evm"
      ],
      bio: [
        "High-frequency autonomous execution agent on Robinhood Chain (Arbitrum Orbit).",
        "Scans mempool blocks every 100ms to capitalize on cross-DEX price discrepancies."
      ],
      system: "You are Robyn-Arb. Automatically execute flash swaps when profit margin > 0.35% and gas < 2 Gwei."
    },
    streamLogs: [
      "[00:00.100] [PERCEPTION] Ingested Block #54,440,747 (Arbitrum Nitro)",
      "[00:00.180] [EVALUATION] Price imbalance detected on CASHCAT/ETH (0.72% spread)",
      "[00:00.220] [SIMULATION] Simulating 10.0 ETH flash swap via Robinhood RPC... REVERT_RATE: 0.00%",
      "[00:00.290] [ACTION] Executed TX: 0x4f8a...c7b2 (Gas: 0.00012 ETH, Net Yield: +0.072 ETH)",
      "[00:00.350] [ORACLE] Cryptographic state proof anchored to Blockscout."
    ]
  },
  {
    id: 'robyn-rwa',
    name: 'Robyn (RWA Collateral)',
    role: 'Real-World Asset Treasury & Tokenized Stock Vault',
    json: {
      name: "Robyn-Collateral",
      clients: ["robinhood"],
      modelProvider: "huggingface/robynhooood/Robyn-Agent",
      plugins: [
        "@robyn-os/plugin-robinhood",
        "@robyn-os/plugin-rwa-collateral",
        "@robyn-os/plugin-proofs"
      ],
      bio: [
        "Autonomous treasury guardian managing on-chain backing of tokenized equity ($NVDA, $AAPL).",
        "Streams dividends and guarantees over-collateralization ratios."
      ],
      system: "Verify escrowed equity backing and stream staking yield to verified holders."
    },
    streamLogs: [
      "[00:01.000] [TELEMETRY] Querying Robinhood Chain Collateral Vault Escrow",
      "[00:01.120] [ORACLE] NVDA Stock Price: $128.40 | Vault Backing Ratio: 142.5%",
      "[00:01.250] [DIVIDEND] Streaming dividend yield distribution to stakers pool",
      "[00:01.320] [SETTLEMENT] TX 0x9b1c...fa44 verified on Robinhood Blockscout."
    ]
  },
  {
    id: 'robyn-clm',
    name: 'Robyn (CLM Concentrated Yield)',
    role: 'Dynamic Uniswap V3 Range Re-centering Daemon',
    json: {
      name: "Robyn-CLM",
      clients: ["robinhood"],
      modelProvider: "huggingface/robynhooood/Robyn-Agent",
      plugins: [
        "@robyn-os/plugin-uniswap",
        "@robyn-os/plugin-robinhood"
      ],
      bio: [
        "Automated liquidity manager maintaining maximum fee generation inside high-volume tick ranges."
      ],
      system: "Monitor tick volatility. When spot price exits 1.5% delta, burn and re-mint optimal range."
    },
    streamLogs: [
      "[00:02.050] [MONITOR] Scanning Uniswap V3 NVDA/USDC tick range...",
      "[00:02.140] [TRIGGER] Spot price at boundary tick 85120. Volatility index: 0.42",
      "[00:02.210] [RECENTER] Re-centering concentrated liquidity around spot +/- 1.25%",
      "[00:02.310] [CONFIRMED] Position rebalanced with 0 impermanent loss penalty."
    ]
  }
]

export default function CharacterStudio() {
  const [selectedId, setSelectedId] = useState<string>('robyn-arb')
  const [copied, setCopied] = useState(false)

  const activePreset = PRESETS.find((p) => p.id === selectedId) || PRESETS[0]

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(activePreset.json, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="character-studio" className="space-y-6 pt-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#00C805]">
            <span>// 02_CHARACTER_ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Character Studio & Live Execution Stream
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Configure declarative agent specifications in JSON, load plugins, and witness sub-100ms real-time execution.
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div className="flex items-center gap-2 bg-black border border-white/10 p-1.5 rounded-xl font-mono text-xs">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setSelectedId(preset.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedId === preset.id
                  ? 'bg-[#00C805] text-black shadow-md shadow-[#00C805]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Split View: Left = Character.json | Right = Live Terminal Logs */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Side: character.json Editor */}
        <div className="lg:col-span-6 bg-[#030608] border border-[#00C805]/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between px-4 py-3 bg-black/80 border-b border-white/10 font-mono text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-[#00C805]">●</span>
              <span className="font-bold">characters/{String(activePreset.json['name']).toLowerCase()}.character.json</span>
            </div>
            <button
              type="button"
              onClick={handleCopyJson}
              className="text-gray-400 hover:text-white text-xs px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 transition"
            >
              {copied ? '✓ Copied JSON' : 'Copy JSON'}
            </button>
          </div>

          <div className="p-4 sm:p-5 font-mono text-xs text-gray-300 overflow-x-auto leading-relaxed bg-[#020406]">
            <pre className="text-emerald-400/90 whitespace-pre-wrap font-mono">
              {JSON.stringify(activePreset.json, null, 2)}
            </pre>
          </div>

          <div className="px-4 py-2.5 bg-black/60 border-t border-white/10 font-mono text-[11px] text-gray-400 flex items-center justify-between">
            <span>Model: Hermes 0.5B Tool LLM</span>
            <span className="text-[#00C805]">EVM Smart Account: 0x4337...</span>
          </div>
        </div>

        {/* Right Side: Real-time Execution Stream */}
        <div className="lg:col-span-6 bg-[#020406] border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between px-4 py-3 bg-black/80 border-b border-white/10 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00C805] animate-ping" />
              <span className="font-bold text-white tracking-wider">LIVE_AGENT_EXECUTION_TRACE</span>
            </div>
            <span className="text-[10px] text-[#00C805] font-mono border border-[#00C805]/30 px-2 py-0.5 rounded-full">
              LATENCY: 100ms
            </span>
          </div>

          <div className="p-4 sm:p-5 font-mono text-xs space-y-3 bg-[#010203] text-gray-200 overflow-x-auto min-h-[260px]">
            {activePreset.streamLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 leading-relaxed">
                <span className="text-gray-500 select-none">›</span>
                <span className={index === activePreset.streamLogs.length - 1 ? 'text-[#00C805] font-bold' : 'text-gray-300'}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          <div className="px-4 py-3 bg-black/60 border-t border-white/10 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-[#00C805]">✓</span>
              <span>Arbitrum Orbit Sequencer: SYNCED</span>
            </div>
            <a
              href="https://robinhoodchain.blockscout.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00C805] hover:underline flex items-center gap-1"
            >
              <span>Blockscout Explorer</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
