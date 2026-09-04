import React, { useState, useEffect, useRef } from 'react'

type Mode = 'workflow' | 'multiagent' | 'collateral'
type NodeState = 'idle' | 'running' | 'complete' | 'waiting'

interface LogEntry {
  time: string
  source: string
  text: string
  nodeId?: string
}

export default function EcosystemVisualizer() {
  const [activeMode, setActiveMode] = useState<Mode>('workflow')
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Execution states for workflow nodes
  const [nodeStates, setNodeStates] = useState<Record<string, NodeState>>({
    input: 'idle',
    robyn: 'idle',
    router: 'idle',
    market: 'idle',
    risk: 'idle',
    portfolio: 'idle',
    output: 'idle',
  })

  // Multi-Agent states
  const [multiAgentStates, setMultiAgentStates] = useState<Record<string, NodeState>>({
    core: 'idle',
    marketAgent: 'idle',
    riskAgent: 'idle',
    portfolioAgent: 'idle',
    researchAgent: 'idle',
    executionAgent: 'idle',
  })

  // Collateral flow states
  const [collateralStates, setCollateralStates] = useState<Record<string, NodeState>>({
    token: 'idle',
    vault: 'idle',
    riskCheck: 'idle',
    asset: 'idle',
    settlement: 'idle',
  })

  // Terminal Logs synced with visual execution
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: '00:00.00', source: 'SYSTEM', text: 'Robyn OS Runtime Kernel initialized. Listening on Arbitrum Orbit (100ms).' },
    { time: '00:00.05', source: 'STATUS', text: 'All sub-agents and tool routers idle. Ready for user prompt.' },
  ])

  const [isExecuting, setIsExecuting] = useState<boolean>(false)
  const [activePrompt, setActivePrompt] = useState<string>('Analyze portfolio & hedge risk')
  const [customInput, setCustomInput] = useState<string>('')
  const [executionProgress, setExecutionProgress] = useState<number>(0)

  // Track mouse coordinates for subtle radial spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // Synchronized Execution Sequencer
  const runExecution = (promptText: string) => {
    if (isExecuting) return
    setIsExecuting(true)
    setExecutionProgress(0)

    const now = () => {
      const d = new Date()
      return `${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${String(Math.floor(d.getMilliseconds() / 10)).padStart(2, '0')}`
    }

    if (activeMode === 'workflow') {
      // 1. Reset all nodes
      setNodeStates({
        input: 'running',
        robyn: 'idle',
        router: 'idle',
        market: 'idle',
        risk: 'idle',
        portfolio: 'idle',
        output: 'idle',
      })
      setLogs([
        { time: now(), source: 'USER', text: `Intent received: "${promptText}"`, nodeId: 'input' },
      ])

      // 2. Robyn Ingest
      setTimeout(() => {
        setExecutionProgress(20)
        setNodeStates(prev => ({ ...prev, input: 'complete', robyn: 'running' }))
        setLogs(prev => [
          ...prev,
          { time: now(), source: 'ROBYN', text: 'Hermes 0.5B reasoning core parsed intent. Generating tool plan...', nodeId: 'robyn' }
        ])
      }, 550)

      // 3. Tool Router Dispatched
      setTimeout(() => {
        setExecutionProgress(40)
        setNodeStates(prev => ({ ...prev, robyn: 'complete', router: 'running' }))
        setLogs(prev => [
          ...prev,
          { time: now(), source: 'ROUTER', text: 'Tool Router activating parallel branches: market_data() & risk_engine()...', nodeId: 'router' }
        ])
      }, 1100)

      // 4. Parallel Tools (Market & Risk)
      setTimeout(() => {
        setExecutionProgress(65)
        setNodeStates(prev => ({ ...prev, router: 'complete', market: 'running', risk: 'running', portfolio: 'running' }))
        setLogs(prev => [
          ...prev,
          { time: now(), source: 'TOOLS', text: '[market_data] Oracle stream verified: $NVDA $128.50, $ETH $2,540.00', nodeId: 'market' },
          { time: now(), source: 'RISK', text: '[risk_check] Portfolio LTV = 62.4% (Safe threshold < 75%)', nodeId: 'risk' }
        ])
      }, 1800)

      // 5. Tools Complete & Decision
      setTimeout(() => {
        setExecutionProgress(85)
        setNodeStates(prev => ({ ...prev, market: 'complete', risk: 'complete', portfolio: 'complete', output: 'running' }))
        setLogs(prev => [
          ...prev,
          { time: now(), source: 'ROBYN', text: 'Tools completed. Synthesizing deterministic settlement instructions...', nodeId: 'output' }
        ])
      }, 2600)

      // 6. Output Verified
      setTimeout(() => {
        setExecutionProgress(100)
        setNodeStates(prev => ({ ...prev, output: 'complete' }))
        setLogs(prev => [
          ...prev,
          { time: now(), source: 'SETTLED', text: '✓ EXECUTION COMPLETE. Direct Arbitrum Orbit block finalized (84.2ms).', nodeId: 'output' }
        ])
        setIsExecuting(false)
      }, 3400)
    } else if (activeMode === 'multiagent') {
      // Multi-Agent Execution Flow
      setMultiAgentStates({
        core: 'running',
        marketAgent: 'idle',
        riskAgent: 'idle',
        portfolioAgent: 'idle',
        researchAgent: 'idle',
        executionAgent: 'idle',
      })
      setLogs([{ time: now(), source: 'ROBYN OS', text: `Orchestrator initiating swarm consensus for: "${promptText}"`, nodeId: 'core' }])

      setTimeout(() => {
        setExecutionProgress(35)
        setMultiAgentStates(prev => ({ ...prev, core: 'complete', marketAgent: 'running', researchAgent: 'running' }))
        setLogs(prev => [
          ...prev,
          { time: now(), source: 'SWARM', text: 'Market Agent & Research Agent streaming live cross-chain orderbook liquidity...', nodeId: 'marketAgent' }
        ])
      }, 700)

      setTimeout(() => {
        setExecutionProgress(70)
        setMultiAgentStates(prev => ({ ...prev, marketAgent: 'complete', researchAgent: 'complete', riskAgent: 'running', executionAgent: 'running' }))
        setLogs(prev => [
          ...prev,
          { time: now(), source: 'EXEC', text: 'Risk Agent approved slippage tolerance. Execution Agent submitting Flashbots bundle...', nodeId: 'executionAgent' }
        ])
      }, 1600)

      setTimeout(() => {
        setExecutionProgress(100)
        setMultiAgentStates(prev => ({ ...prev, riskAgent: 'complete', executionAgent: 'complete', core: 'idle' }))
        setLogs(prev => [
          ...prev,
          { time: now(), source: 'COMPLETE', text: '✓ Swarm consensus fulfilled. 5 agents synchronized in 89ms.', nodeId: 'core' }
        ])
        setIsExecuting(false)
      }, 2500)
    } else {
      // Collateral Flow
      setCollateralStates({
        token: 'running',
        vault: 'idle',
        riskCheck: 'idle',
        asset: 'idle',
        settlement: 'idle',
      })
      setLogs([{ time: now(), source: 'COLLATERAL', text: 'Simulated $ROBYN staking signal received. Staking 5,000 $ROBYN tokens...', nodeId: 'token' }])

      setTimeout(() => {
        setExecutionProgress(30)
        setCollateralStates(prev => ({ ...prev, token: 'complete', vault: 'running' }))
        setLogs(prev => [
          ...prev,
          { time: now(), source: 'VAULT', text: 'Smart Vault locked $ROBYN. Valued at $7,250 USD benchmark.', nodeId: 'vault' }
        ])
      }, 650)

      setTimeout(() => {
        setExecutionProgress(60)
        setCollateralStates(prev => ({ ...prev, vault: 'complete', riskCheck: 'running' }))
        setLogs(prev => [
          ...prev,
          { time: now(), source: 'RISK', text: 'Simulating LTV bound: 70% Max LTV -> Approved 39.49 $NVDA tokenized units.', nodeId: 'riskCheck' }
        ])
      }, 1400)

      setTimeout(() => {
        setExecutionProgress(85)
        setCollateralStates(prev => ({ ...prev, riskCheck: 'complete', asset: 'running', settlement: 'running' }))
        setLogs(prev => [
          ...prev,
          { time: now(), source: 'MINT', text: 'Issued tokenized Stock Exposure ($NVDA). Zero-liquidation safety ratio verified.', nodeId: 'asset' }
        ])
      }, 2100)

      setTimeout(() => {
        setExecutionProgress(100)
        setCollateralStates(prev => ({ ...prev, asset: 'complete', settlement: 'complete' }))
        setLogs(prev => [
          ...prev,
          { time: now(), source: 'SETTLED', text: '✓ SIMULATION COMPLETE: Non-custodial position recorded on Robinhood Chain.', nodeId: 'settlement' }
        ])
        setIsExecuting(false)
      }, 2900)
    }
  }

  // Preset Prompts
  const prompts = [
    { title: 'Portfolio & Risk Check', text: 'Analyze portfolio exposure & calculate hedge' },
    { title: 'DEX Arbitrage & Snipe', text: 'Execute sub-80ms zero-approval DEX swap' },
    { title: 'Token Collateral Lock', text: 'Stake 5,000 $ROBYN tokens for $NVDA exposure' },
  ]

  // Status Badge Helper
  const renderStatus = (state: NodeState) => {
    switch (state) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            RUNNING
          </span>
        )
      case 'complete':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
            <span>✓</span> COMPLETE
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-500 bg-zinc-900/60 border border-zinc-800">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            READY
          </span>
        )
    }
  }

  return (
    <section id="visualizer" className="space-y-6 scroll-mt-20">
      {/* 1. Header Bar with Mode Switcher */}
      <div className="border border-zinc-800/80 bg-[#06080D] p-6 sm:p-7 rounded-xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM ARCHITECTURE & EXECUTION CANVAS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Autonomous Agent Orchestration
              <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded border border-zinc-700/80 bg-zinc-900/80 text-zinc-400">
                Arbitrum Orbit 100ms
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
              Real-time visualization of Robyn OS: from natural language perception and tool calls to deterministic risk controls and sub-80ms on-chain settlement.
            </p>
          </div>

          {/* View Modes */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/80 p-1.5 rounded-lg border border-zinc-800 self-start lg:self-auto">
            <button
              onClick={() => { setActiveMode('workflow'); setIsExecuting(false); }}
              className={`px-3.5 py-2 text-xs font-mono rounded-md transition-all flex items-center gap-2 ${
                activeMode === 'workflow'
                  ? 'bg-zinc-800 text-white font-semibold border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              01 Agent Workflow
            </button>
            <button
              onClick={() => { setActiveMode('multiagent'); setIsExecuting(false); }}
              className={`px-3.5 py-2 text-xs font-mono rounded-md transition-all flex items-center gap-2 ${
                activeMode === 'multiagent'
                  ? 'bg-zinc-800 text-white font-semibold border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              02 Multi-Agent Swarm
            </button>
            <button
              onClick={() => { setActiveMode('collateral'); setIsExecuting(false); }}
              className={`px-3.5 py-2 text-xs font-mono rounded-md transition-all flex items-center gap-2 ${
                activeMode === 'collateral'
                  ? 'bg-zinc-800 text-white font-semibold border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              03 Collateral & Value Flow
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Execution Controls (Prompt Trigger Bar) */}
      <div className="border border-zinc-800/80 bg-[#080B11] p-4 sm:p-5 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span className="text-emerald-400 font-bold">&gt;_</span>
            <span>Interactive Execution Sandbox:</span>
            <span className="text-zinc-500 text-[11px] hidden md:inline">Select a preset command or enter a custom prompt</span>
          </div>

          {activeMode === 'collateral' && (
            <div className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
              SIMULATED DEMO EXECUTION • NO REAL VALUE AT RISK
            </div>
          )}
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {prompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActivePrompt(p.text)
                setCustomInput(p.text)
                runExecution(p.text)
              }}
              disabled={isExecuting}
              className={`px-3 py-1.5 text-xs font-mono rounded border transition-all ${
                activePrompt === p.text
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                  : 'border-zinc-800 bg-black/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <span className="text-emerald-500 mr-1.5">⚡</span>
              {p.title}
            </button>
          ))}
        </div>

        {/* Input Field + Run Button */}
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={customInput || activePrompt}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isExecuting) {
                  runExecution(customInput || activePrompt)
                }
              }}
              placeholder="Enter custom agent command (e.g. rebalance portfolio exposure)..."
              className="w-full bg-black/80 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>

          <button
            onClick={() => runExecution(customInput || activePrompt)}
            disabled={isExecuting}
            className={`px-5 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              isExecuting
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-not-allowed'
                : 'bg-[#00C805] hover:bg-[#00C805]/90 text-black shadow-lg shadow-[#00C805]/20 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isExecuting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span>EXECUTING ({executionProgress}%)...</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>RUN PIPELINE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. MAIN INTERACTIVE EXECUTION CANVAS */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="border border-zinc-800/90 bg-[#04060A] rounded-xl p-6 sm:p-10 relative overflow-hidden min-h-[580px] flex flex-col justify-between"
      >
        {/* Subtle Background Dot Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Soft Cursor Reactive Spotlight */}
        <div
          className="absolute pointer-events-none rounded-full blur-3xl transition-opacity duration-300"
          style={{
            width: '420px',
            height: '420px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.07) 0%, transparent 70%)',
            left: `${mousePos.x - 210}px`,
            top: `${mousePos.y - 210}px`,
          }}
        />

        {/* Canvas Content based on Active Mode */}
        <div className="relative z-10 w-full flex-1 flex flex-col justify-center">
          {/* ========================================================= */}
          {/* MODE 1: AGENT WORKFLOW (Input -> Robyn -> Tools -> Output) */}
          {/* ========================================================= */}
          {activeMode === 'workflow' && (
            <div className="w-full space-y-10">
              {/* Top Row: User Input -> Robyn Agent -> Tool Router */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Node 1: User Input */}
                <div
                  onMouseEnter={() => setHoveredNode('input')}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`md:col-span-3 border rounded-xl p-5 bg-[#080B12]/90 backdrop-blur-md transition-all duration-300 relative ${
                    nodeStates.input === 'running'
                      ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                      : hoveredNode === 'input'
                      ? 'border-zinc-700 bg-zinc-900/60'
                      : 'border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 font-mono text-xs">◉</span>
                      <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                        01. User Input
                      </span>
                    </div>
                    {renderStatus(nodeStates.input)}
                  </div>
                  <div className="text-sm font-bold text-white mb-1">Intent Stream</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Natural language prompt ingested via RPC, Telegram, or Webhook.
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>Latency</span>
                    <span className="text-emerald-400">12.4ms</span>
                  </div>
                </div>

                {/* Arrow / Dataflow connector 1 */}
                <div className="hidden md:flex md:col-span-1 justify-center items-center">
                  <div className="relative w-full flex items-center">
                    <div className="h-[2px] w-full bg-zinc-800 relative overflow-hidden">
                      <div className={`h-full bg-emerald-400 transition-all duration-500 ${isExecuting ? 'w-full animate-pulse' : 'w-0'}`} />
                    </div>
                    <span className="absolute right-0 text-zinc-600 font-mono text-xs">▶</span>
                  </div>
                </div>

                {/* Node 2: Robyn Agent Core */}
                <div
                  onMouseEnter={() => setHoveredNode('robyn')}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`md:col-span-4 border rounded-xl p-5 bg-[#080B12]/95 backdrop-blur-md transition-all duration-300 relative ${
                    nodeStates.robyn === 'running'
                      ? 'border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)] scale-[1.02]'
                      : hoveredNode === 'robyn'
                      ? 'border-emerald-500/50'
                      : 'border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                        Robyn Agent Core
                      </span>
                    </div>
                    {renderStatus(nodeStates.robyn)}
                  </div>
                  <div className="text-base font-bold text-white mb-1 flex items-center gap-2">
                    Hermes 0.5B Engine
                    <span className="text-[10px] font-mono px-1.5 py-0.2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded">
                      Local
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Deterministic tool caller with structured schema validation and zero hallucinations.
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>Inference Time</span>
                    <span className="text-emerald-400 font-bold">&lt; 38ms</span>
                  </div>
                </div>

                {/* Arrow / Dataflow connector 2 */}
                <div className="hidden md:flex md:col-span-1 justify-center items-center">
                  <div className="relative w-full flex items-center">
                    <div className="h-[2px] w-full bg-zinc-800 relative overflow-hidden">
                      <div className={`h-full bg-emerald-400 transition-all duration-500 ${isExecuting ? 'w-full animate-pulse' : 'w-0'}`} />
                    </div>
                    <span className="absolute right-0 text-zinc-600 font-mono text-xs">▶</span>
                  </div>
                </div>

                {/* Node 3: Tool Router */}
                <div
                  onMouseEnter={() => setHoveredNode('router')}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`md:col-span-3 border rounded-xl p-5 bg-[#080B12]/90 backdrop-blur-md transition-all duration-300 relative ${
                    nodeStates.router === 'running'
                      ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                      : hoveredNode === 'router'
                      ? 'border-zinc-700 bg-zinc-900/60'
                      : 'border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-mono text-xs">❖</span>
                      <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                        03. Tool Router
                      </span>
                    </div>
                    {renderStatus(nodeStates.router)}
                  </div>
                  <div className="text-sm font-bold text-white mb-1">Execution Dispatcher</div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Dispatches atomic function calls across on-chain contracts and telemetry feeds.
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>Active Branches</span>
                    <span className="text-cyan-400">3 Parallel</span>
                  </div>
                </div>
              </div>

              {/* Branching SVG Curved Wires & Sub-Tools */}
              <div className="relative">
                {/* Visual Branch Header */}
                <div className="flex items-center gap-3 my-2">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                  <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                    PARALLEL TOOL & VERIFICATION BRANCHES
                  </span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                </div>

                {/* 3 Sub-Tool Nodes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Branch A: Market Data */}
                  <div
                    onMouseEnter={() => setHoveredNode('market')}
                    onMouseLeave={() => setHoveredNode(null)}
                    className={`border rounded-xl p-4.5 bg-[#080B12]/80 backdrop-blur-md transition-all duration-300 relative ${
                      nodeStates.market === 'running'
                        ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                        : nodeStates.market === 'complete'
                        ? 'border-emerald-500/40 bg-emerald-950/20'
                        : 'border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-white">Market Data Oracle</span>
                      {renderStatus(nodeStates.market)}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">
                      get_prices() • NVDA $128.50 | ETH $2,540
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-2">
                      Sub-second Pyth / Chainlink price feed validation.
                    </div>
                  </div>

                  {/* Branch B: Risk Engine */}
                  <div
                    onMouseEnter={() => setHoveredNode('risk')}
                    onMouseLeave={() => setHoveredNode(null)}
                    className={`border rounded-xl p-4.5 bg-[#080B12]/80 backdrop-blur-md transition-all duration-300 relative ${
                      nodeStates.risk === 'running'
                        ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                        : nodeStates.risk === 'complete'
                        ? 'border-emerald-500/40 bg-emerald-950/20'
                        : 'border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-white">Risk & LTV Engine</span>
                      {renderStatus(nodeStates.risk)}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">
                      calculate_ltv() • Health 1.45 (Optimal)
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-2">
                      Zero-liquidation guardrail with Flashbots simulation.
                    </div>
                  </div>

                  {/* Branch C: Portfolio Settlement */}
                  <div
                    onMouseEnter={() => setHoveredNode('portfolio')}
                    onMouseLeave={() => setHoveredNode(null)}
                    className={`border rounded-xl p-4.5 bg-[#080B12]/80 backdrop-blur-md transition-all duration-300 relative ${
                      nodeStates.portfolio === 'running'
                        ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                        : nodeStates.portfolio === 'complete'
                        ? 'border-emerald-500/40 bg-emerald-950/20'
                        : 'border-zinc-800/80 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-white">Portfolio & Output</span>
                      {renderStatus(nodeStates.portfolio)}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">
                      100ms Orbit Batch Settlement
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-2">
                      Arbitrum Orbit sequencer broadcast with &lt;$0.0009 gas.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODE 2: MULTI-AGENT SWARM (Central Robyn OS + Sub-Agents)  */}
          {/* ========================================================= */}
          {activeMode === 'multiagent' && (
            <div className="w-full py-4 space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  Multi-Agent Orchestration Topology
                </div>
                <p className="text-xs text-zinc-400">
                  Robyn OS acts as the primary coordinator, directing specialized sub-agents with dynamic P2P consensus.
                </p>
              </div>

              {/* Swarm Star Layout */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Left Agent 1: Market */}
                <div className={`border rounded-xl p-4 bg-[#080B12] transition-all ${
                  multiAgentStates.marketAgent === 'running' ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]' : 'border-zinc-800'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">Market Agent</span>
                    {renderStatus(multiAgentStates.marketAgent)}
                  </div>
                  <p className="text-[11px] text-zinc-400">Monitors orderbooks and cross-DEX liquidity depth.</p>
                </div>

                {/* Left Agent 2: Risk */}
                <div className={`border rounded-xl p-4 bg-[#080B12] transition-all ${
                  multiAgentStates.riskAgent === 'running' ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]' : 'border-zinc-800'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">Risk Agent</span>
                    {renderStatus(multiAgentStates.riskAgent)}
                  </div>
                  <p className="text-[11px] text-zinc-400">Enforces collateral margins and MEV protection.</p>
                </div>

                {/* Center: Central Robyn OS Coordinator */}
                <div className="border-2 border-emerald-500 bg-[#0A0E18] rounded-xl p-6 text-center shadow-[0_0_30px_rgba(16,185,129,0.25)] relative group">
                  <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-sm font-bold font-mono text-white">ROBYN OS CORE</div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-1">Swarm Orchestrator</div>
                  <div className="text-[10px] text-zinc-500 mt-2">Dynamic Consensus Engine</div>
                </div>

                {/* Right Agent 3: Research */}
                <div className={`border rounded-xl p-4 bg-[#080B12] transition-all ${
                  multiAgentStates.researchAgent === 'running' ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)]' : 'border-zinc-800'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">Research Agent</span>
                    {renderStatus(multiAgentStates.researchAgent)}
                  </div>
                  <p className="text-[11px] text-zinc-400">Fetches whitepapers, GitHub commits, and sentiment.</p>
                </div>

                {/* Right Agent 4: Execution */}
                <div className={`border rounded-xl p-4 bg-[#080B12] transition-all ${
                  multiAgentStates.executionAgent === 'running' ? 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]' : 'border-zinc-800'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-white">Execution Agent</span>
                    {renderStatus(multiAgentStates.executionAgent)}
                  </div>
                  <p className="text-[11px] text-zinc-400">Submits 100ms atomic transactions to Sequencer.</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODE 3: TOKEN / COLLATERAL / ASSET FLOW (Financial Model) */}
          {/* ========================================================= */}
          {activeMode === 'collateral' && (
            <div className="w-full py-4 space-y-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    Financial Collateral Architecture (Simulation)
                  </span>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Demonstration of token locking, collateral valuation, and asset credit lines.
                  </p>
                </div>
                <span className="text-xs font-mono text-zinc-400 bg-black/60 px-3 py-1 rounded border border-zinc-800">
                  $ROBYN Oracle: <strong className="text-emerald-400">$1.45 USD</strong>
                </span>
              </div>

              {/* 5-Stage Value Conduits */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Stage 1: Robyn Token */}
                <div className={`border rounded-xl p-4.5 bg-[#080B12] transition-all ${
                  collateralStates.token === 'running' ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-zinc-800'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-zinc-500">01. STAKE</span>
                    {renderStatus(collateralStates.token)}
                  </div>
                  <div className="text-sm font-bold text-white">$ROBYN Token</div>
                  <div className="text-xs text-emerald-400 font-mono mt-1">5,000 $ROBYN</div>
                  <div className="text-[10px] text-zinc-500 mt-2">Valuation: $7,250 USD</div>
                </div>

                {/* Stage 2: Smart Vault */}
                <div className={`border rounded-xl p-4.5 bg-[#080B12] transition-all ${
                  collateralStates.vault === 'running' ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-zinc-800'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-zinc-500">02. LOCK</span>
                    {renderStatus(collateralStates.vault)}
                  </div>
                  <div className="text-sm font-bold text-white">Collateral Vault</div>
                  <div className="text-xs text-zinc-300 font-mono mt-1">Non-Custodial</div>
                  <div className="text-[10px] text-zinc-500 mt-2">Time-locked contract</div>
                </div>

                {/* Stage 3: Risk / LTV Guard */}
                <div className={`border rounded-xl p-4.5 bg-[#080B12] transition-all ${
                  collateralStates.riskCheck === 'running' ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-zinc-800'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-zinc-500">03. GUARD</span>
                    {renderStatus(collateralStates.riskCheck)}
                  </div>
                  <div className="text-sm font-bold text-white">LTV Calculation</div>
                  <div className="text-xs text-amber-400 font-mono mt-1">70% Max LTV</div>
                  <div className="text-[10px] text-zinc-500 mt-2">Liq. Threshold: 85%</div>
                </div>

                {/* Stage 4: Asset Exposure */}
                <div className={`border rounded-xl p-4.5 bg-[#080B12] transition-all ${
                  collateralStates.asset === 'running' ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.2)]' : 'border-zinc-800'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-zinc-500">04. ISSUANCE</span>
                    {renderStatus(collateralStates.asset)}
                  </div>
                  <div className="text-sm font-bold text-white">Stock / ETH Line</div>
                  <div className="text-xs text-cyan-400 font-mono mt-1">39.49 $NVDA</div>
                  <div className="text-[10px] text-zinc-500 mt-2">Value: $5,075 USD</div>
                </div>

                {/* Stage 5: Settlement */}
                <div className={`border rounded-xl p-4.5 bg-[#080B12] transition-all ${
                  collateralStates.settlement === 'running' ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-zinc-800'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-mono text-zinc-500">05. RESULT</span>
                    {renderStatus(collateralStates.settlement)}
                  </div>
                  <div className="text-sm font-bold text-white">Settlement</div>
                  <div className="text-xs text-emerald-400 font-mono mt-1">Health: 1.45 HF</div>
                  <div className="text-[10px] text-zinc-500 mt-2">Arbitrum Orbit Direct</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. SYNCHRONIZED TECHNICAL AUDIT TERMINAL */}
        <div className="relative z-10 mt-8 border border-zinc-800 bg-black/95 rounded-lg overflow-hidden shadow-2xl">
          {/* Terminal Titlebar */}
          <div className="px-4 py-2 bg-zinc-950/90 border-b border-zinc-800/80 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-zinc-300 font-bold">ROBYN OS RUNTIME LOGS</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-500">STDOUT / TELEMETRY</span>
            </div>
            <div className="text-zinc-500 text-[10px]">
              Active Channel: Arbitrum Orbit (100ms)
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-4 max-h-36 overflow-y-auto space-y-1.5 font-mono text-xs text-zinc-300">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-zinc-600 select-none text-[11px]">{log.time}</span>
                <span className="text-emerald-400 font-semibold select-none text-[11px]">[{log.source}]</span>
                <span className="text-zinc-300 leading-relaxed text-xs">{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
