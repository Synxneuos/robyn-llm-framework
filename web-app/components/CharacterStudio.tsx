import React, { useState } from 'react'

interface Preset {
  id: string
  name: string
  role: string
  json: Record<string, any>
  logs: string[]
}

const PRESETS: Preset[] = [
  {
    id: 'robyn-arb',
    name: 'robyn-arb.json',
    role: 'Autonomous Arbitrage Agent',
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
    logs: [
      "[00:00.100] [PERCEPTION] Ingested Block #54,440,747 (Arbitrum Nitro)",
      "[00:00.180] [REASONING] Price spread detected on CASHCAT/ETH pair (0.72%)",
      "[00:00.220] [SIMULATION] Off-chain state transition simulation: STATUS_OK (Gas: 42k)",
      "[00:00.290] [SETTLEMENT] Dispatched TX 0x4f8a...c7b2 on Robinhood Chain (0.00012 ETH fee)",
      "[00:00.350] [VERIFICATION] Confirmed on Blockscout. State receipt anchored."
    ]
  },
  {
    id: 'robyn-treasury',
    name: 'robyn-treasury.json',
    role: 'RWA Collateral Guardian',
    json: {
      name: "Robyn-Treasury",
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
      system: "Verify escrowed equity backing and stream staking yield to stakers pool."
    },
    logs: [
      "[00:01.000] [PERCEPTION] Querying Collateral Vault Escrow state",
      "[00:01.120] [ORACLE] NVDA Stock Price: $128.40 | Vault Backing Ratio: 142.5%",
      "[00:01.250] [ACTION] Streaming dividend yield distribution to stakers pool",
      "[00:01.320] [SETTLEMENT] TX 0x9b1c...fa44 verified on Robinhood Blockscout."
    ]
  },
  {
    id: 'robyn-clm',
    name: 'robyn-clm.json',
    role: 'Concentrated Liquidity Manager',
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
    logs: [
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

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(activePreset.json, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="studio" className="space-y-6 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 hairline-border-b pb-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#00C805] uppercase">
            <span>// 03_CHARACTER_STUDIO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Agent Studio & Execution Trace
          </h2>
          <p className="text-[#8B949E] text-xs sm:text-sm mt-1">
            Declarative character configuration alongside real-time sub-100ms execution telemetry.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1 bg-[#05070A] hairline-border p-1 rounded-lg font-mono text-xs">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setSelectedId(preset.id)}
              className={`px-3 py-1 rounded text-xs transition ${
                selectedId === preset.id
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-[#8B949E] hover:text-white'
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Split Studio: Left = Config Editor | Right = Live Execution Logs */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: JSON Config */}
        <div className="lg:col-span-6 bg-[#05070A] hairline-border rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between">
          <div className="px-4 py-3 bg-[#020406] hairline-border-b flex items-center justify-between font-mono text-xs">
            <span className="text-white font-medium">characters/{activePreset.name}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-[11px] text-[#8B949E] hover:text-white px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 transition"
            >
              {copied ? '✓ Copied' : 'Copy JSON'}
            </button>
          </div>

          <div className="p-4 sm:p-5 font-mono text-xs text-[#C9D1D9] overflow-x-auto bg-[#030507] leading-relaxed">
            <pre className="whitespace-pre-wrap font-mono">
              {JSON.stringify(activePreset.json, null, 2)}
            </pre>
          </div>

          <div className="px-4 py-2.5 bg-[#020406] hairline-border-t font-mono text-[11px] text-[#8B949E] flex items-center justify-between">
            <span>Model: Robyn Engine</span>
            <span className="text-[#00C805]">Account: ERC-4337</span>
          </div>
        </div>

        {/* Right: Live Execution Trace */}
        <div className="lg:col-span-6 bg-[#05070A] hairline-border rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between">
          <div className="px-4 py-3 bg-[#020406] hairline-border-b flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C805] animate-pulse" />
              <span className="text-white font-medium">EXECUTION_TRACE_LOG</span>
            </div>
            <span className="text-[11px] text-[#8B949E]">LATENCY: 100ms NITRO</span>
          </div>

          <div className="p-4 sm:p-5 font-mono text-xs space-y-3 bg-[#030507] text-[#C9D1D9] overflow-x-auto min-h-[260px]">
            {activePreset.logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-[#6E7681] select-none">›</span>
                <span className={idx === activePreset.logs.length - 1 ? 'text-[#00C805] font-semibold' : 'text-[#C9D1D9]'}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          <div className="px-4 py-2.5 bg-[#020406] hairline-border-t font-mono text-[11px] text-[#8B949E] flex items-center justify-between">
            <span>Sequencer: Robinhood Nitro</span>
            <a
              href="https://robinhoodchain.blockscout.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00C805] hover:underline"
            >
              Blockscout Explorer ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
