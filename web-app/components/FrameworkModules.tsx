'use client'

import React, { useState } from 'react'

interface PluginItem {
  id: string
  name: string
  version: string
  category: string
  desc: string
  install: string
  capabilities: string[]
  icon: string
}

const PLUGINS: PluginItem[] = [
  {
    id: 'plugin-robinhood',
    name: '@robyn-os/plugin-robinhood',
    version: 'v1.0.0',
    category: 'CORE / EXECUTION',
    desc: 'Sub-100ms Arbitrum Orbit Nitro RPC connector, private sequencer bundling, and block stream listeners.',
    install: 'robyn plugins add @robyn-os/plugin-robinhood',
    capabilities: ['100ms Orbit Nitro RPC', 'Private Sequencer Bundles', 'Mempool Block Watchers'],
    icon: '⚡'
  },
  {
    id: 'plugin-evm',
    name: '@robyn-os/plugin-evm',
    version: 'v1.0.0',
    category: 'ACCOUNT ABSTRACTION',
    desc: 'ERC-4337 smart accounts, autonomous ephemeral session keys, and zero-revert pre-flight simulation.',
    install: 'robyn plugins add @robyn-os/plugin-evm',
    capabilities: ['ERC-4337 Session Keys', 'Gas Sponsorship', 'Multi-Call Batching'],
    icon: '🔐'
  },
  {
    id: 'plugin-uniswap',
    name: '@robyn-os/plugin-uniswap',
    version: 'v1.0.0',
    category: 'DEFI & LIQUIDITY',
    desc: 'Automated Uniswap V3 concentrated liquidity management, flash arbitrage scanning, and pool routing.',
    install: 'robyn plugins add @robyn-os/plugin-uniswap',
    capabilities: ['V3 Tick Re-centering', 'Flash Arb Scanning', 'Optimal Fee Capture'],
    icon: '📈'
  },
  {
    id: 'plugin-hermes',
    name: '@robyn-os/plugin-hermes',
    version: 'v1.0.0',
    category: 'AI MODEL RUNTIME',
    desc: 'High-speed inference runtime for robynhooood/Robyn-Agent (0.5B Hermes fine-tuned tool-calling model).',
    install: 'robyn plugins add @robyn-os/plugin-hermes',
    capabilities: ['0.5B Tool Calling', 'Sub-50ms Inference', 'Local GGUF / vLLM Ready'],
    icon: '🧠'
  },
  {
    id: 'plugin-telegram',
    name: '@robyn-os/plugin-telegram',
    version: 'v1.0.0',
    category: 'CLIENT / MESSAGING',
    desc: 'Natural language chat interface for Telegram channels, instant trade dispatching, and alert webhooks.',
    install: 'robyn plugins add @robyn-os/plugin-telegram',
    capabilities: ['Chat NLP Directives', 'Real-time PnL Alerts', 'Secure Webhooks'],
    icon: '💬'
  },
  {
    id: 'plugin-proofs',
    name: '@robyn-os/plugin-proofs',
    version: 'v1.0.0',
    category: 'SECURITY & VERIFIABILITY',
    desc: 'Generates on-chain cryptographic execution receipts and audit proofs for full transparent verification.',
    install: 'robyn plugins add @robyn-os/plugin-proofs',
    capabilities: ['Merkle State Receipts', 'Blockscout Anchors', 'Tamper-Proof Audit Log'],
    icon: '🛡️'
  }
]

export default function FrameworkModules() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section id="plugins" className="space-y-6 pt-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#00C805]">
            <span>// 03_PLUGIN_REGISTRY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Modular Plugin Ecosystem
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Extensible architecture inspired by ElizaOS. Plug in Robinhood RPCs, Uniswap V3, Telegram, or Hermes models with one line.
          </p>
        </div>

        <div className="font-mono text-xs text-[#00C805] border border-[#00C805]/30 bg-black/80 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          6 OFFICIAL PLUGINS ACTIVE
        </div>
      </div>

      {/* Grid of 6 Plugins */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLUGINS.map((plugin) => (
          <div
            key={plugin.id}
            className="group relative bg-[#04070A] hover:bg-[#070B10] border border-white/10 hover:border-[#00C805]/50 rounded-2xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            <div>
              {/* Header with Icon & Category */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl p-2.5 bg-black rounded-xl border border-white/10 group-hover:border-[#00C805]/40 transition">
                  {plugin.icon}
                </span>
                <div className="text-right font-mono">
                  <span className="text-[10px] font-bold tracking-wider text-[#00C805] block">
                    {plugin.category}
                  </span>
                  <span className="text-[10px] text-gray-500">{plugin.version}</span>
                </div>
              </div>

              {/* Plugin Name */}
              <h3 className="font-mono text-sm sm:text-base font-extrabold text-white group-hover:text-[#00C805] transition">
                {plugin.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                {plugin.desc}
              </p>

              {/* Capability Badges */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {plugin.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] bg-black/60 border border-white/10 rounded-md px-2 py-0.5 text-gray-300"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Install Box */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="bg-black/90 border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between font-mono text-[11px]">
                <span className="text-gray-400 truncate mr-2">{plugin.install}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(plugin.id, plugin.install)}
                  className="text-xs font-sans text-gray-400 hover:text-white font-bold px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 transition shrink-0"
                >
                  {copiedId === plugin.id ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
