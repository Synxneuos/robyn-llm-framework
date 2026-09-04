'use client'

import React, { useState } from 'react'

const SDK_TABS = [
  {
    id: 'quickstart',
    title: 'Python SDK Quickstart',
    lang: 'python',
    code: `from robyn import RobynAgent
from robyn.chain import RobinhoodClient

# Initialize Robinhood Orbit L2 client (Chain ID: 4663)
client = RobinhoodClient(rpc_url="https://rpc.mainnet.chain.robinhood.com")

# Initialize autonomous AI Agent with Robyn Neural 0.5B
agent = RobynAgent(
    model="robynhooood/Robyn-Agent",
    client=client,
    session_key="0xYourRestrictedSessionKey..."
)

# Run autonomous agent loop
agent.run_autonomous_cycle()`,
  },
  {
    id: 'contracts',
    title: 'Smart Contracts (Solidity)',
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
    function executeAutonomousHedge(address memeToken, uint256 amount) external {
        vault.executeMemeToStockHedge(memeToken, amount, "NVDA");
    }
}`,
  },
  {
    id: 'cli',
    title: 'CLI Agent Daemon',
    lang: 'bash',
    code: `# Install official framework package
pip install robyn-framework

# Launch autonomous daemon on Robinhood Chain
robyn-cli start --network mainnet --model robynhooood/Robyn-Agent

# Output:
# [INFO] Connected to Robinhood Chain (ID: 4663, Latency: 18ms)
# [INFO] Loaded Robyn-Agent Hermes Tool Parser
# [INFO] Autonomous agent running in background...`,
  },
]

export default function DeveloperSDK() {
  const [activeTab, setActiveTab] = useState(SDK_TABS[0].id)
  const currentTab = SDK_TABS.find((t) => t.id === activeTab) || SDK_TABS[0]

  return (
    <section id="sdk" className="space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="bg-[#00C805]/10 border border-[#00C805]/30 text-[#00C805] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
          Developer SDK
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
          Build On Robyn OS
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-2">
          Open-source Python SDK, Solidity contracts, and CLI daemons engineered for rapid integration.
        </p>
      </div>

      {/* Code Container */}
      <div className="rounded-3xl bg-[#090B0E] border border-white/10 overflow-hidden shadow-2xl">
        {/* Tab Header */}
        <div className="flex border-b border-white/10 bg-black/60 overflow-x-auto">
          {SDK_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white/5 text-[#00C805] border-b-2 border-[#00C805]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Code Body */}
        <div className="p-6 sm:p-8 bg-black font-mono text-xs overflow-x-auto">
          <pre className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            <code>{currentTab.code}</code>
          </pre>
        </div>

        {/* Footer info strip */}
        <div className="p-4 bg-[#0D0E11] border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4 text-gray-400">
            <span>License: <strong className="text-white font-mono">Apache-2.0</strong></span>
            <span>·</span>
            <span>Python: <strong className="text-white font-mono">&gt;= 3.10</strong></span>
            <span>·</span>
            <span>Network: <strong className="text-[#00C805] font-mono">Robinhood Chain (ID: 4663)</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/robynhood-fw/robyn-llm-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#00C805] hover:bg-[#00E806] text-black font-extrabold px-4 py-2 rounded-lg text-xs transition"
            >
              View on GitHub ↗
            </a>
            <a
              href="https://huggingface.co/robynhooood/Robyn-Agent"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/15 font-semibold px-4 py-2 rounded-lg text-xs transition"
            >
              Hugging Face ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
