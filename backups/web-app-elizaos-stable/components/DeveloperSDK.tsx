'use client'

import React, { useState } from 'react'

const SDK_TABS = [
  {
    id: 'ts-bun',
    title: 'TypeScript / Bun',
    lang: 'typescript',
    code: `import { AgentRuntime, RobinhoodPlugin, UniswapPlugin } from "@robyn-os/core";

// 1. Initialize Multi-Agent Runtime on Robinhood Chain
const runtime = new AgentRuntime({
  character: "./characters/robyn.character.json",
  plugins: [
    new RobinhoodPlugin({
      rpcUrl: "https://rpc.mainnet.chain.robinhood.com",
      chainId: 420120,
      latencyMs: 100,
    }),
    new UniswapPlugin(),
  ],
  model: "robynhooood/Robyn-Agent", // 0.5B Hermes Tool LLM
});

// 2. Start perception loop & autonomous on-chain execution
await runtime.initialize();
await runtime.startAutonomousLoop();`,
  },
  {
    id: 'python',
    title: 'Python SDK',
    lang: 'python',
    code: `from robyn import RobynAgent
from robyn.chain import RobinhoodClient

# Initialize Robinhood Orbit L2 client
client = RobinhoodClient(rpc_url="https://rpc.mainnet.chain.robinhood.com")

# Initialize autonomous AI Agent with Robyn-Agent 0.5B
agent = RobynAgent(
    model="robynhooood/Robyn-Agent",
    client=client
)

# Start autonomous loop with 100ms flash arbitrage & CLM rebalance
agent.start()`,
  },
  {
    id: 'contracts',
    title: 'Solidity Contracts',
    lang: 'solidity',
    code: `// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "./interfaces/IRobynVault.sol";

contract RobynIntegration {
    IRobynVault public immutable vault;

    constructor(address _vault) {
        vault = IRobynVault(_vault);
    }

    // Direct interaction on Robinhood Chain (Arbitrum Orbit)
    function executeAutonomousAction(bytes calldata proof) external {
        vault.settleFlashAction(proof);
    }
}`,
  },
  {
    id: 'cli',
    title: 'CLI (3 Steps)',
    lang: 'bash',
    code: `# 1. Install CLI globally via Bun or NPM
bun i -g @robyn-os/cli     # or: pip install robyn-framework

# 2. Scaffold a new character project
robyn create my-agent

# 3. Boot agent on Robinhood Chain
robyn start

# [Robyn Runtime] Connected to Robinhood Chain (Chain ID: 420120, Latency: 100ms)
# [Robyn Runtime] Loaded Robyn-Agent 0.5B Hermes model
# [Robyn Runtime] Autonomous agent active. Scanning mempool...`,
  },
]

export default function DeveloperSDK() {
  const [activeTab, setActiveTab] = useState(SDK_TABS[0].id)
  const [copied, setCopied] = useState(false)
  const currentTab = SDK_TABS.find((t) => t.id === activeTab) || SDK_TABS[0]

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTab.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="sdk" className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#00C805]">
            <span>// 06_DEVELOPER_SDK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Build on Robyn OS
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Native SDKs in TypeScript/Bun, Python, and Solidity engineered for rapid integration on Robinhood Chain.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="font-mono text-xs text-gray-300 hover:text-white bg-black border border-white/15 px-3 py-1.5 rounded-xl self-start sm:self-auto hover:bg-white/5 transition"
        >
          {copied ? '✓ Copied Code' : 'Copy Snippet'}
        </button>
      </div>

      {/* Code Container */}
      <div className="rounded-2xl bg-[#030608] border border-[#00C805]/30 overflow-hidden shadow-2xl">
        {/* Tab Header */}
        <div className="flex border-b border-white/10 bg-black/80 overflow-x-auto font-mono text-xs">
          {SDK_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white/5 text-[#00C805] border-b-2 border-[#00C805]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Code View */}
        <div className="p-5 font-mono text-xs text-emerald-400/95 overflow-x-auto bg-[#010204] leading-relaxed">
          <pre className="whitespace-pre-wrap">
            <code>{currentTab.code}</code>
          </pre>
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-2.5 bg-black/60 border-t border-white/10 flex items-center justify-between font-mono text-[11px] text-gray-400">
          <span>Target Chain: Robinhood Mainnet (Arbitrum Orbit)</span>
          <span className="text-[#00C805]">Apache-2.0 Open Source</span>
        </div>
      </div>
    </section>
  )
}
