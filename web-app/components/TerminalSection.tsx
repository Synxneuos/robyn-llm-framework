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

export default function TerminalSection() {
  const [pm, setPm] = useState<PackageManager>('bun')
  const [copied, setCopied] = useState(false)

  const activeCmds = COMMANDS[pm]
  const fullScript = `${activeCmds.install}\n${activeCmds.create}\ncd my-agent\n${activeCmds.start}`

  const handleCopy = () => {
    navigator.clipboard.writeText(fullScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="terminal" className="space-y-6 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 hairline-border-b pb-4">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#00C805] uppercase">
            <span>// 01_COMMAND_LINE_INTERFACE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Developer CLI Quickstart
          </h2>
          <p className="text-[#8B949E] text-xs sm:text-sm mt-1">
            Install the CLI, scaffold declarative character configurations, and boot your autonomous agent on Robinhood Chain in seconds.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-[#05070A] hairline-border p-1 rounded-lg font-mono text-xs">
          {(['bun', 'pnpm', 'npm', 'pip'] as PackageManager[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setPm(tab)}
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                pm === tab
                  ? 'bg-white/10 text-white font-semibold'
                  : 'text-[#8B949E] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Presentation */}
      <div className="bg-[#05070A] hairline-border rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
        {/* Terminal Titlebar */}
        <div className="px-4 py-3 bg-[#020406] hairline-border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#30363D]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#30363D]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#30363D]" />
            <span className="text-[#8B949E] text-[11px] ml-2 font-medium">bash — robyn-cli</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="text-[11px] text-[#8B949E] hover:text-white px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 transition"
          >
            {copied ? '✓ Copied' : 'Copy commands'}
          </button>
        </div>

        {/* Terminal Content */}
        <div className="p-5 sm:p-6 space-y-4 text-[#C9D1D9] leading-relaxed">
          <div>
            <span className="text-[#6E7681] block mb-1"># 1. Install CLI package globally</span>
            <div className="text-white font-medium flex items-center gap-2">
              <span className="text-[#00C805]">$</span>
              <span>{activeCmds.install}</span>
            </div>
          </div>

          <div>
            <span className="text-[#6E7681] block mb-1"># 2. Scaffold new agent project with character.json</span>
            <div className="text-white font-medium flex items-center gap-2">
              <span className="text-[#00C805]">$</span>
              <span>{activeCmds.create}</span>
            </div>
          </div>

          <div>
            <span className="text-[#6E7681] block mb-1"># 3. Launch live agent on Robinhood Chain</span>
            <div className="text-white font-medium flex items-center gap-2">
              <span className="text-[#00C805]">$</span>
              <span>cd my-agent && {activeCmds.start}</span>
            </div>
          </div>

          {/* Simulated Boot Output */}
          <div className="pt-3 hairline-border-t border-white/5 text-[11px] text-[#8B949E] space-y-1">
            <div className="text-[#00C805] font-semibold">[Robyn Runtime] Connected to Robinhood Chain (Arbitrum Orbit)</div>
            <div>[Robyn Runtime] Loaded character: characters/my-agent.character.json</div>
            <div>[Robyn Runtime] Neural Core: robynhooood/Robyn-Agent (0.5B Tool Calling)</div>
            <div>[Robyn Runtime] Mempool scanner ACTIVE · Latency: 100ms Nitro</div>
          </div>
        </div>
      </div>
    </section>
  )
}
