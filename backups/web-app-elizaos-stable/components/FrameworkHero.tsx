'use client'

import React, { useState } from 'react'

type PackageManager = 'bun' | 'pnpm' | 'npm' | 'pip'

interface CommandSet {
  install: string
  create: string
  start: string
}

const COMMANDS: Record<PackageManager, CommandSet> = {
  bun: {
    install: 'bun i -g @robyn-os/cli',
    create: 'robyn create my-agent',
    start: 'robyn start',
  },
  pnpm: {
    install: 'pnpm add -g @robyn-os/cli',
    create: 'robyn create my-agent',
    start: 'robyn start',
  },
  npm: {
    install: 'npm i -g @robyn-os/cli',
    create: 'robyn create my-agent',
    start: 'robyn start',
  },
  pip: {
    install: 'pip install robyn-framework',
    create: 'robyn create my-agent',
    start: 'robyn start',
  },
}

export default function FrameworkHero() {
  const [pm, setPm] = useState<PackageManager>('bun')
  const [copied, setCopied] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  const activeCmds = COMMANDS[pm]
  const fullText = `# 1. Install the CLI\n${activeCmds.install}\n\n# 2. Create your project\n${activeCmds.create}\n\n# 3. Your agent is live\n${activeCmds.start}`

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#050709]/95 border border-[#00C805]/25 p-6 sm:p-12 shadow-2xl backdrop-blur-xl">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#102213_1px,transparent_1px),linear-gradient(to_bottom,#102213_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* Neon Glow Flares */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#00C805]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[350px] h-[350px] bg-[#00C805]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: ElizaOS Style Branding & 3-Step CLI */}
        <div className="lg:col-span-7 space-y-6">
          {/* ElizaOS Tag Pill */}
          <div className="inline-flex items-center gap-2.5 bg-black/80 border border-[#00C805]/40 rounded-full px-3.5 py-1.5 font-mono text-[11px] text-[#00C805] shadow-sm shadow-[#00C805]/20">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C805] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C805]"></span>
            </span>
            <span className="font-bold tracking-wider">[ v1.0.0-PROD ]</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-300">AUTONOMOUS MULTI-AGENT OS</span>
          </div>

          {/* Main Title */}
          <div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Autonomous AI Agents.{' '}
              <span className="bg-gradient-to-r from-[#00C805] via-[#4EFA66] to-white bg-clip-text text-transparent">
                Built for Robinhood Chain.
              </span>
            </h1>
            <p className="font-mono text-xs sm:text-sm font-semibold tracking-widest text-[#00C805] uppercase mt-3 flex items-center gap-2">
              <span>//</span> 100MS ARBITRUM ORBIT NITRO · SUB-BLOCK ACTIONS · 0.5B ON-DEVICE HERMES
            </p>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
            The open-source multi-agent framework to build, customize, and deploy autonomous trading agents, flash arbitrage bots, and real-world asset controllers on <strong className="text-white">Robinhood Chain</strong>.
          </p>

          {/* 3-Step CLI Quickstart Box (ElizaOS Style) */}
          <div className="bg-[#020406] border border-[#00C805]/30 rounded-2xl overflow-hidden shadow-2xl">
            {/* Tab Bar Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-black/70 border-b border-white/10 font-mono text-xs">
              <div className="flex items-center gap-1.5">
                {(['bun', 'pnpm', 'npm', 'pip'] as PackageManager[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setPm(tab)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                      pm === tab
                        ? 'bg-[#00C805] text-black shadow-md shadow-[#00C805]/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="text-gray-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-white/5 transition"
              >
                <span>{copied ? '✓ Copied All' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] space-y-2 leading-relaxed bg-[#020406] text-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-600 select-none mr-2"># 1. Install the CLI</span>
                  <div className="text-[#00C805] font-semibold">
                    <span className="text-gray-500 mr-2">$</span>
                    {activeCmds.install}
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-gray-600 select-none mr-2"># 2. Create your agent</span>
                <div className="text-white font-semibold">
                  <span className="text-gray-500 mr-2">$</span>
                  {activeCmds.create}
                </div>
              </div>

              <div className="pt-1">
                <span className="text-gray-600 select-none mr-2"># 3. Launch live on Robinhood Chain</span>
                <div className="text-[#4EFA66] font-semibold">
                  <span className="text-gray-500 mr-2">$</span>
                  {activeCmds.start}
                </div>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="https://github.com/robynhood-fw/robyn-llm-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#00C805] hover:bg-[#00E806] text-black font-black px-6 py-3 rounded-xl text-xs sm:text-sm transition shadow-lg shadow-[#00C805]/20 flex items-center gap-2"
            >
              <span>⭐ Star on GitHub</span>
            </a>
            <a
              href="https://huggingface.co/robynhooood/Robyn-Agent"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/80 hover:bg-white/5 text-white border border-white/20 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2"
            >
              <span>🤗 Hugging Face (0.5B)</span>
            </a>
            <button
              type="button"
              onClick={() => setIsSimulating(!isSimulating)}
              className="font-mono text-xs text-[#00C805] hover:underline px-3 py-2 flex items-center gap-1.5"
            >
              <span>{isSimulating ? '▶ Hide Terminal Demo' : '▶ Simulate Live CLI'}</span>
            </button>
          </div>

          {/* Live Simulated Output if Triggered */}
          {isSimulating && (
            <div className="bg-black/90 border border-[#00C805]/40 rounded-xl p-4 font-mono text-xs text-gray-300 space-y-1.5 animate-fadeIn">
              <div className="text-[#00C805] font-bold">⚡ [Robyn OS] Autonomous Runtime Initialized</div>
              <div>• Chain: Robinhood Chain Mainnet (Orbit Nitro) | RPC: rpc.mainnet.chain.robinhood.com</div>
              <div>• Plugins: [@robyn-os/plugin-robinhood, @robyn-os/plugin-evm, @robyn-os/plugin-uniswap]</div>
              <div>• Latency: 100ms | Mempool scanning ACTIVE | Zero-revert simulation PASSED</div>
              <div className="text-gray-400">✓ Agent listening for triggers. Ready for autonomous deployment.</div>
            </div>
          )}
        </div>

        {/* Right Column: ElizaOS Signature Cybernetic Avatar & Status Badge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm">
            {/* Outer Glow Halo */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00C805] via-[#4EFA66] to-[#00C805] rounded-3xl blur-xl opacity-30 animate-pulse" />

            <div className="relative bg-[#020406] border border-[#00C805]/50 rounded-3xl p-6 shadow-2xl space-y-5">
              {/* Header Box */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00C805] animate-ping" />
                  <span className="font-mono text-xs font-bold text-white tracking-wider">ROBYN_AGENT_CORE</span>
                </div>
                <span className="font-mono text-[10px] text-[#00C805] border border-[#00C805]/30 px-2 py-0.5 rounded-full">
                  ONLINE
                </span>
              </div>

              {/* Avatar Frame with Colored Anime Avatar */}
              <div className="relative rounded-2xl overflow-hidden border border-[#00C805]/40 bg-black aspect-square shadow-inner">
                <img
                  src="/robyn_avatar.jpg"
                  alt="Robyn Autonomous AI Avatar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/60 to-transparent p-3 flex items-center justify-between">
                  <div className="font-mono text-xs font-bold text-white">Robyn (0.5B Hermes)</div>
                  <span className="font-mono text-[10px] text-[#00C805]">Chain #420120</span>
                </div>
              </div>

              {/* Runtime Metric Pill Grid */}
              <div className="grid grid-cols-2 gap-2.5 font-mono text-[11px]">
                <div className="bg-black/60 border border-white/10 rounded-xl p-2.5">
                  <div className="text-gray-500 text-[10px]">EXECUTION SPEED</div>
                  <div className="text-[#00C805] font-extrabold text-sm mt-0.5">100ms Nitro</div>
                </div>
                <div className="bg-black/60 border border-white/10 rounded-xl p-2.5">
                  <div className="text-gray-500 text-[10px]">MODEL CORE</div>
                  <div className="text-white font-extrabold text-sm mt-0.5">0.5B Tool-LLM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
