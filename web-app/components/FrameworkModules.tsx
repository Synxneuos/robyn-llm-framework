import React, { useState } from 'react'

interface Plugin {
  name: string
  category: string
  version: string
  status: 'STABLE' | 'ACTIVE'
  desc: string
  command: string
  capabilities: string[]
}

const PLUGINS: Plugin[] = [
  {
    name: '@robyn-os/plugin-robinhood',
    category: 'CORE / RPC',
    version: 'v1.0.0',
    status: 'STABLE',
    desc: 'Sub-100ms Arbitrum Orbit Nitro RPC connector, private sequencer bundling, and block stream listeners.',
    command: 'robyn plugins add @robyn-os/plugin-robinhood',
    capabilities: ['100ms Orbit Nitro RPC', 'Private Sequencer Bundles', 'Mempool Watchers'],
  },
  {
    name: '@robyn-os/plugin-evm',
    category: 'ACCOUNT ABSTRACTION',
    version: 'v1.0.0',
    status: 'STABLE',
    desc: 'ERC-4337 smart accounts, autonomous ephemeral session keys, and zero-revert pre-flight simulation.',
    command: 'robyn plugins add @robyn-os/plugin-evm',
    capabilities: ['ERC-4337 Session Keys', 'Gas Sponsorship', 'Multi-Call Batching'],
  },
  {
    name: '@robyn-os/plugin-uniswap',
    category: 'DEFI & LIQUIDITY',
    version: 'v1.0.0',
    status: 'STABLE',
    desc: 'Automated Uniswap V3 concentrated liquidity management, flash arbitrage scanning, and pool routing.',
    command: 'robyn plugins add @robyn-os/plugin-uniswap',
    capabilities: ['V3 Tick Re-centering', 'Flash Arb Scanning', 'Optimal Fee Capture'],
  },
  {
    name: '@robyn-os/plugin-hermes',
    category: 'AI MODEL RUNTIME',
    version: 'v1.0.0',
    status: 'STABLE',
    desc: 'High-speed inference runtime for robynhooood/Robyn-Agent (0.5B Hermes fine-tuned tool-calling model).',
    command: 'robyn plugins add @robyn-os/plugin-hermes',
    capabilities: ['0.5B Tool Calling', 'Sub-20ms Inference', 'Local GGUF / vLLM Ready'],
  },
  {
    name: '@robyn-os/plugin-telegram',
    category: 'CLIENT / MESSAGING',
    version: 'v1.0.0',
    status: 'ACTIVE',
    desc: 'Natural language chat interface for Telegram channels, instant trade dispatching, and alert webhooks.',
    command: 'robyn plugins add @robyn-os/plugin-telegram',
    capabilities: ['Chat NLP Directives', 'Real-time Alerts', 'Secure Webhooks'],
  },
  {
    name: '@robyn-os/plugin-proofs',
    category: 'SECURITY & AUDIT',
    version: 'v1.0.0',
    status: 'STABLE',
    desc: 'Generates on-chain cryptographic execution receipts and audit proofs for full transparent verification.',
    command: 'robyn plugins add @robyn-os/plugin-proofs',
    capabilities: ['Merkle State Receipts', 'Blockscout Anchors', 'Tamper-Proof Audit Log'],
  },
]

export default function FrameworkModules() {
  const [copiedName, setCopiedName] = useState<string | null>(null)

  const handleCopy = (name: string, cmd: string) => {
    navigator.clipboard.writeText(cmd)
    setCopiedName(name)
    setTimeout(() => setCopiedName(null), 2000)
  }

  return (
    <section id="plugins" className="space-y-6 pt-10">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 hairline-border-b pb-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#00C805] uppercase">
            <span>// 04_PLUGIN_REGISTRY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Plugin Ecosystem
          </h2>
          <p className="text-[#8B949E] text-xs sm:text-sm mt-1">
            Modular developer extensions connecting Robyn agents to RPCs, DEX AMMs, smart accounts, and messaging channels.
          </p>
        </div>

        <div className="font-mono text-xs text-[#8B949E]">
          6 OFFICIAL PLUGINS ACTIVE
        </div>
      </div>

      {/* Plugin Table / List (Open Developer Layout) */}
      <div className="space-y-3">
        {PLUGINS.map((plugin) => (
          <div
            key={plugin.name}
            className="bg-[#05070A] hairline-border rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition group"
          >
            <div className="space-y-1.5 max-w-xl">
              <div className="flex flex-wrap items-center gap-2.5 font-mono">
                <span className="font-semibold text-white text-sm group-hover:text-[#00C805] transition">
                  {plugin.name}
                </span>
                <span className="text-[10px] text-[#8B949E] bg-white/5 hairline-border px-1.5 py-0.5 rounded">
                  {plugin.category}
                </span>
                <span className="text-[10px] text-[#8B949E]">{plugin.version}</span>
                <span className="text-[10px] text-[#00C805] font-semibold">{plugin.status}</span>
              </div>

              <p className="text-xs text-[#8B949E] leading-relaxed">
                {plugin.desc}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {plugin.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] text-[#6E7681] bg-black px-2 py-0.5 rounded hairline-border"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Install Box */}
            <div className="shrink-0 flex items-center gap-2 bg-[#020406] hairline-border px-3 py-2 rounded-lg font-mono text-xs">
              <span className="text-[#8B949E] truncate max-w-[240px] sm:max-w-none">{plugin.command}</span>
              <button
                type="button"
                onClick={() => handleCopy(plugin.name, plugin.command)}
                className="text-[11px] text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition ml-2"
              >
                {copiedName === plugin.name ? '✓' : 'Copy'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
