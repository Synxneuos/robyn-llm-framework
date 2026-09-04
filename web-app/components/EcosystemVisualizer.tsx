import React, { useState, useEffect, useRef } from 'react'

type TabMode = 'pipeline' | 'trace' | 'swarm' | 'collateral'
type NodeState = 'idle' | 'active' | 'complete'

interface PipelineStep {
  id: string
  name: string
  subtitle: string
  status: NodeState
  icon: string
  latency: string
  details: {
    input: string
    output: string
    technicalDetails: string
    params: Record<string, string | number>
  }
}

export default function EcosystemVisualizer() {
  const [activeTab, setActiveTab] = useState<TabMode>('pipeline')

  // Pipeline Execution State
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1)
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string>('robyn')
  const [userQuery, setUserQuery] = useState<string>('Analyze my portfolio & calculate hedge')
  const [customInputText, setCustomInputText] = useState<string>('')

  // Tool Trace State
  const [expandedTool, setExpandedTool] = useState<number | null>(0)

  // Swarm State
  const [activeSwarmAgent, setActiveSwarmAgent] = useState<string>('risk')

  // Collateral State
  const [lockedRobynAmount, setLockedRobynAmount] = useState<number>(5000)
  const [targetAsset, setTargetAsset] = useState<'NVDA' | 'AAPL' | 'TSLA' | 'ETH'>('NVDA')
  const [collateralFlowStep, setCollateralFlowStep] = useState<number>(0)

  // Canvas Ref for subtle dot matrix & background particle flow
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Asset Price Config
  const assetConfig = {
    NVDA: { name: 'NVIDIA Corp (Tokenized)', price: 128.50, ltv: 0.70, liq: 0.85, ticker: '$NVDA' },
    AAPL: { name: 'Apple Inc (Tokenized)', price: 224.20, ltv: 0.75, liq: 0.88, ticker: '$AAPL' },
    TSLA: { name: 'Tesla Inc (Tokenized)', price: 215.80, ltv: 0.65, liq: 0.80, ticker: '$TSLA' },
    ETH:  { name: 'Native Ether', price: 2540.00, ltv: 0.80, liq: 0.90, ticker: '$ETH' },
  }

  const robynPrice = 1.45
  const collateralValuation = lockedRobynAmount * robynPrice
  const activeAssetData = assetConfig[targetAsset]
  const maxBorrowUsd = collateralValuation * activeAssetData.ltv
  const maxBorrowUnits = (maxBorrowUsd / activeAssetData.price).toFixed(3)
  const safeBorrowUnits = ((maxBorrowUsd * 0.85) / activeAssetData.price).toFixed(3)

  // 1. Pipeline Steps Definition
  const pipelineSteps: PipelineStep[] = [
    {
      id: 'input',
      name: 'User Input',
      subtitle: 'Natural Language Ingest',
      status: currentStepIndex >= 0 ? (currentStepIndex === 0 ? 'active' : 'complete') : 'idle',
      icon: '💬',
      latency: '12ms',
      details: {
        input: `"${userQuery}"`,
        output: 'Tokenized intent tensor { action: "ANALYZE_PORTFOLIO", target: "PORTFOLIO", hedge: true }',
        technicalDetails: 'Parsed via Robyn Semantic Router with zero latency overhead.',
        params: { channel: 'RPC_DIRECT', format: 'JSON_SCHEMA_V2', auth: 'SESSION_VERIFIED' }
      }
    },
    {
      id: 'robyn',
      name: 'Robyn Engine',
      subtitle: 'Autonomous Reasoning Core',
      status: currentStepIndex >= 1 ? (currentStepIndex === 1 ? 'active' : 'complete') : 'idle',
      icon: '⚡',
      latency: '34ms',
      details: {
        input: 'Intent Tensor + System Context',
        output: 'DAG Execution Plan [get_positions -> market_data -> calculate_exposure -> hedge_route]',
        technicalDetails: 'Robyn Core Reasoning Engine generates deterministic tool-call signatures.',
        params: { engine: 'Robyn-Core-v1.0', mode: 'DETERMINISTIC', temperature: 0.0 }
      }
    },
    {
      id: 'tools',
      name: 'Tool Router',
      subtitle: 'Parallel Tool Dispatch',
      status: currentStepIndex >= 2 ? (currentStepIndex === 2 ? 'active' : 'complete') : 'idle',
      icon: '❖',
      latency: '18ms',
      details: {
        input: 'DAG Plan (3 parallel calls)',
        output: 'Dispatched to Market Oracle, Position Indexer, Risk Guard',
        technicalDetails: 'Atomic parallel RPC dispatch on 100ms Arbitrum Orbit sequencer.',
        params: { concurrency: 3, timeout_ms: 100, flashbots_sim: true }
      }
    },
    {
      id: 'market',
      name: 'Data & Market',
      subtitle: 'On-Chain Oracle Feeds',
      status: currentStepIndex >= 3 ? (currentStepIndex === 3 ? 'active' : 'complete') : 'idle',
      icon: '📊',
      latency: '24ms',
      details: {
        input: 'Asset Pairs: NVDA/USDC, ETH/USDC, ROBYN/USD',
        output: 'Verified Price Oracles: NVDA=$128.50, ETH=$2,540.00, ROBYN=$1.45',
        technicalDetails: 'Sub-second real-time Pyth & Uniswap V3 concentrated liquidity state.',
        params: { pool_depth: '$4.2M', tick_drift: '+0.12%', slippage_est: '0.04%' }
      }
    },
    {
      id: 'risk',
      name: 'Decision & Risk',
      subtitle: 'LTV & Safety Circuit Breaker',
      status: currentStepIndex >= 4 ? (currentStepIndex === 4 ? 'active' : 'complete') : 'idle',
      icon: '🛡️',
      latency: '15ms',
      details: {
        input: 'Current Portfolio Value: $14,500 | Max LTV Threshold: 70%',
        output: 'Approved Safety Margin: Health Factor 1.45 (Optimal Safe)',
        technicalDetails: 'Prevents liquidation with non-custodial threshold circuit breakers.',
        params: { current_ltv: '62.4%', max_ltv: '70.0%', liquidation_barrier: '85.0%' }
      }
    },
    {
      id: 'output',
      name: 'Settlement Output',
      subtitle: 'Arbitrum Orbit Finality',
      status: currentStepIndex >= 5 ? 'complete' : 'idle',
      icon: '✓',
      latency: '21ms',
      details: {
        input: 'Signed Transaction Payload',
        output: 'Block Confirmed: 0x63cf2dd4c771ce8b11d3dfd37a59fc55bab3e6b626818c177f16d4c051a6aefd',
        technicalDetails: 'Direct block finality on Robinhood Chain with <$0.0009 gas fee.',
        params: { block_time: '100ms', gas_used: '42,190', gas_usd: '$0.00042' }
      }
    }
  ]

  // Step Forward Handler
  const handleStepForward = () => {
    if (currentStepIndex < 5) {
      const next = currentStepIndex + 1
      setCurrentStepIndex(next)
      setSelectedNodeId(pipelineSteps[next].id)
    } else {
      setCurrentStepIndex(0)
      setSelectedNodeId(pipelineSteps[0].id)
    }
  }

  // Auto-play sequencer
  const handleAutoRun = (prompt?: string) => {
    if (prompt) setUserQuery(prompt)
    setIsAutoPlaying(true)
    setCurrentStepIndex(0)
    setSelectedNodeId(pipelineSteps[0].id)

    const timers = [
      setTimeout(() => { setCurrentStepIndex(1); setSelectedNodeId(pipelineSteps[1].id); }, 600),
      setTimeout(() => { setCurrentStepIndex(2); setSelectedNodeId(pipelineSteps[2].id); }, 1200),
      setTimeout(() => { setCurrentStepIndex(3); setSelectedNodeId(pipelineSteps[3].id); }, 1800),
      setTimeout(() => { setCurrentStepIndex(4); setSelectedNodeId(pipelineSteps[4].id); }, 2400),
      setTimeout(() => { setCurrentStepIndex(5); setSelectedNodeId(pipelineSteps[5].id); setIsAutoPlaying(false); }, 3000)
    ]

    return () => timers.forEach(clearTimeout)
  }

  // Collateral Particle flow sequencer
  const triggerCollateralFlow = () => {
    setCollateralFlowStep(1)
    setTimeout(() => setCollateralFlowStep(2), 600)
    setTimeout(() => setCollateralFlowStep(3), 1200)
    setTimeout(() => setCollateralFlowStep(4), 1800)
    setTimeout(() => setCollateralFlowStep(0), 3200)
  }

  // Track Mouse Spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  // Canvas particle stream
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; alpha: number }> = []
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1,
        alpha: Math.random() * 0.4 + 0.15
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.fillStyle = '#00C805'
        ctx.globalAlpha = p.alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
      })
      animId = requestAnimationFrame(render)
    }
    render()

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [activeTab])

  const selectedNode = pipelineSteps.find(s => s.id === selectedNodeId) || pipelineSteps[1]

  // Tool trace items
  const toolTraces = [
    {
      name: 'get_balance(wallet: "0xRobyn...0d45")',
      returns: '{ robyn: 14500.0, usdc: 3200.0, eth: 1.45 }',
      latency: '14ms',
      status: 'VERIFIED',
      desc: 'Queries on-chain balance via Robinhood Orbit Sequencer Direct.'
    },
    {
      name: 'get_positions(protocol: "RobynVault")',
      returns: '{ open_debt_usd: 0.00, active_collateral_usd: 7250.00 }',
      latency: '22ms',
      status: 'VERIFIED',
      desc: 'Retrieves active collateral lines and outstanding credit exposure.'
    },
    {
      name: 'check_collateral(target_asset: "NVDA")',
      returns: '{ price_usd: 128.50, max_ltv: 0.70, safe_borrow: 39.49 }',
      latency: '18ms',
      status: 'VERIFIED',
      desc: 'Validates Oracle price feed and calculates optimal zero-liquidation ratio.'
    },
    {
      name: 'calculate_exposure(hedge_ratio: 0.35)',
      returns: '{ status: "APPROVED", available_borrow_usd: 10150.00, health: 1.45 }',
      latency: '12ms',
      status: 'VERIFIED',
      desc: 'Applies deterministic circuit-breaker logic before issuing collateral voucher.'
    }
  ]

  return (
    <section id="visualizer" className="space-y-6 scroll-mt-20">
      {/* 1. SECTION HEADER */}
      <div className="border border-zinc-800/80 bg-[#06080D] p-6 sm:p-7 rounded-xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ROBYN OS • INTERACTIVE EXECUTION CANVAS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Robyn Engine Workflow
              <span className="text-[11px] font-mono font-normal px-2.5 py-0.5 rounded border border-zinc-700/80 bg-zinc-900/80 text-zinc-400">
                Clickable & Step-by-Step
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
              Explore how the Robyn Engine processes inputs, coordinates multi-agent swarms, traces tool calls, and manages token collateral in real-time.
            </p>
          </div>

          {/* 4 Specialized Modules Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/80 p-1.5 rounded-lg border border-zinc-800 self-start lg:self-auto">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-2 text-xs font-mono rounded-md transition-all flex items-center gap-2 ${
                activeTab === 'pipeline'
                  ? 'bg-zinc-800 text-white font-semibold border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="text-emerald-400">01</span> Agent Pipeline
            </button>
            <button
              onClick={() => setActiveTab('trace')}
              className={`px-3 py-2 text-xs font-mono rounded-md transition-all flex items-center gap-2 ${
                activeTab === 'trace'
                  ? 'bg-zinc-800 text-white font-semibold border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="text-cyan-400">02</span> Tool Call Trace
            </button>
            <button
              onClick={() => setActiveTab('swarm')}
              className={`px-3 py-2 text-xs font-mono rounded-md transition-all flex items-center gap-2 ${
                activeTab === 'swarm'
                  ? 'bg-zinc-800 text-white font-semibold border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="text-purple-400">03</span> Multi-Agent Swarm
            </button>
            <button
              onClick={() => setActiveTab('collateral')}
              className={`px-3 py-2 text-xs font-mono rounded-md transition-all flex items-center gap-2 ${
                activeTab === 'collateral'
                  ? 'bg-zinc-800 text-white font-semibold border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="text-emerald-400">04</span> Collateral Flow
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODULE 1: AGENT EXECUTION PIPELINE (CLICKABLE & STEPPING) */}
      {/* ========================================================= */}
      {activeTab === 'pipeline' && (
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="border border-zinc-800/90 bg-[#04060A] rounded-xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
        >
          {/* Subtle Dot Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Mouse Spotlight */}
          <div
            className="absolute pointer-events-none rounded-full blur-3xl transition-opacity duration-300"
            style={{
              width: '380px',
              height: '380px',
              background: 'radial-gradient(circle, rgba(0, 200, 5, 0.08) 0%, transparent 70%)',
              left: `${mousePos.x - 190}px`,
              top: `${mousePos.y - 190}px`,
            }}
          />

          {/* Prompt Sandbox & Step Controls */}
          <div className="relative z-10 bg-[#080B12] border border-zinc-800 p-4 sm:p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1 w-full space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span className="text-emerald-400 font-bold">&gt; Ask Robyn:</span>
                <span>Click any node below to inspect its internal logic, or run step-by-step:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  'Analyze my portfolio & calculate hedge',
                  'Find available collateral in $NVDA',
                  'Execute sub-80ms zero-approval DEX swap'
                ].map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setUserQuery(promptText)
                      handleAutoRun(promptText)
                    }}
                    className={`text-xs font-mono px-3 py-1.5 rounded border transition-all ${
                      userQuery === promptText
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                        : 'border-zinc-800 bg-black/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    ⚡ {promptText}
                  </button>
                ))}
              </div>
            </div>

            {/* Stepping Action Buttons */}
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={handleStepForward}
                disabled={isAutoPlaying}
                className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 transition-all"
              >
                <span>Step Next</span>
                <span>▶</span>
              </button>

              <button
                onClick={() => handleAutoRun()}
                disabled={isAutoPlaying}
                className="px-4 py-2 rounded-lg bg-[#00C805] hover:bg-[#00C805]/90 text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-[#00C805]/20 transition-all"
              >
                {isAutoPlaying ? (
                  <>
                    <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>RUNNING...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>AUTO PLAY</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 6 Sequential Nodes (Clickable Interactive Flow) */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 pt-2">
            {pipelineSteps.map((step, idx) => {
              const isSelected = selectedNodeId === step.id
              const isCurrentActive = currentStepIndex === idx

              return (
                <div
                  key={step.id}
                  onClick={() => {
                    setSelectedNodeId(step.id)
                    setCurrentStepIndex(idx)
                  }}
                  className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 relative group flex flex-col justify-between min-h-[150px] ${
                    isCurrentActive
                      ? 'border-[#00C805] bg-[#00C805]/15 shadow-xl shadow-[#00C805]/20 scale-[1.03]'
                      : isSelected
                      ? 'border-emerald-500/60 bg-zinc-900/90'
                      : step.status === 'complete'
                      ? 'border-emerald-500/30 bg-[#080B12]/90'
                      : 'border-zinc-800/80 bg-[#080B12]/60 hover:border-zinc-700'
                  }`}
                >
                  {/* Active Indicator Top Line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] transition-all ${
                      isCurrentActive
                        ? 'bg-[#00C805]'
                        : isSelected
                        ? 'bg-emerald-500/60'
                        : 'bg-transparent'
                    }`}
                  />

                  {/* Header */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base">{step.icon}</span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                          step.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 animate-pulse'
                            : step.status === 'complete'
                            ? 'bg-emerald-950/60 text-emerald-300'
                            : 'bg-zinc-900 text-zinc-500'
                        }`}
                      >
                        {step.status === 'active' ? '● RUNNING' : step.status === 'complete' ? '✓ DONE' : '● READY'}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {step.name}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                      {step.subtitle}
                    </div>
                  </div>

                  {/* Footer Connection Port */}
                  <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-500">0{idx + 1}</span>
                    <span className="text-emerald-400">{step.latency}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Node Inspector Panel (Shows details of clicked node) */}
          <div className="relative z-10 border border-zinc-800 bg-[#080B12] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{selectedNode.icon}</span>
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    {selectedNode.name} Inspector
                    <span className="text-[10px] font-normal px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Step 0{pipelineSteps.findIndex(s => s.id === selectedNode.id) + 1} / 06
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">{selectedNode.subtitle}</p>
                </div>
              </div>

              <span className="text-xs font-mono text-emerald-400 bg-black/60 px-3 py-1 rounded border border-zinc-800">
                Latency: <strong>{selectedNode.latency}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5 bg-black/60 p-3.5 rounded-lg border border-zinc-800/80">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Node Ingest Data:</div>
                <div className="text-zinc-200 leading-relaxed break-words">{selectedNode.details.input}</div>
              </div>

              <div className="space-y-1.5 bg-black/60 p-3.5 rounded-lg border border-zinc-800/80">
                <div className="text-[10px] text-emerald-400 uppercase tracking-wider">Node Output Result:</div>
                <div className="text-emerald-300 leading-relaxed break-words">{selectedNode.details.output}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-[11px] font-mono text-zinc-400 border-t border-zinc-800/80">
              <div className="text-zinc-400">
                <strong className="text-white">Mechanism:</strong> {selectedNode.details.technicalDetails}
              </div>
              <div className="text-zinc-500">
                Sequencer: Arbitrum Orbit (100ms)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODULE 2: TOOL CALLING TRACE (DEVELOPER TREE VIEW)        */}
      {/* ========================================================= */}
      {activeTab === 'trace' && (
        <div className="border border-zinc-800/90 bg-[#04060A] rounded-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-sm font-mono text-white font-bold tracking-wider uppercase flex items-center gap-2">
                <span className="text-cyan-400">❖</span>
                ROBYN ENGINE • ATOMIC TOOL TRACE LOGS
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Visual tree view of deterministic tool execution. Click any tool below to inspect exact schema return values.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded">
              Total DAG Execution: 66ms
            </span>
          </div>

          {/* Tree-style Trace Container */}
          <div className="border border-zinc-800 bg-black/90 rounded-xl p-6 font-mono text-xs space-y-4">
            <div className="text-zinc-400 flex items-center gap-2">
              <span className="text-emerald-400 font-bold">&gt; User:</span>
              <span className="text-white">"Find available collateral & check liquidation exposure"</span>
            </div>

            <div className="border-l-2 border-emerald-500/50 pl-4 space-y-3 mt-4">
              <div className="text-emerald-400 font-bold flex items-center gap-2">
                <span>🤖 Robyn Engine (Orchestrator)</span>
                <span className="text-[10px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">Active Session</span>
              </div>

              {toolTraces.map((tool, idx) => (
                <div
                  key={idx}
                  onClick={() => setExpandedTool(expandedTool === idx ? null : idx)}
                  className={`border rounded-lg p-3.5 cursor-pointer transition-all ${
                    expandedTool === idx
                      ? 'border-cyan-500/60 bg-cyan-950/20'
                      : 'border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">{idx === toolTraces.length - 1 ? '└─' : '├─'}</span>
                      <span className="font-bold text-white">{tool.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span className="text-zinc-400 text-[11px]">{tool.latency}</span>
                    </div>
                  </div>

                  {expandedTool === idx && (
                    <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2 text-[11px]">
                      <div className="text-zinc-400">
                        <strong className="text-cyan-400">Return Schema:</strong>{' '}
                        <code className="text-emerald-300">{tool.returns}</code>
                      </div>
                      <div className="text-zinc-500">{tool.desc}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓ FINAL RESULT:</span>
                <span className="text-white font-bold">$10,150 USD Available Collateral</span>
              </div>
              <div className="text-emerald-400 font-mono">
                Health Factor: 1.45 (Optimal Safe) • Verified in Block #849,201
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODULE 3: MULTI-AGENT SWARM (STAR TOPOLOGY)               */}
      {/* ========================================================= */}
      {activeTab === 'swarm' && (
        <div className="border border-zinc-800/90 bg-[#04060A] rounded-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-sm font-mono text-white font-bold tracking-wider uppercase flex items-center gap-2">
                <span className="text-purple-400">●</span>
                MULTI-AGENT SWARM ORCHESTRATION
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Central Robyn OS coordinates specialized sub-agents. Click any agent below to illuminate its route.
              </p>
            </div>
            <span className="text-xs font-mono text-purple-400 bg-purple-950/40 border border-purple-500/30 px-3 py-1 rounded">
              P2P Agent Consensus Protocol
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center py-4">
            {/* Left Agents */}
            <div className="md:col-span-4 space-y-4">
              <div
                onClick={() => setActiveSwarmAgent('market')}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${
                  activeSwarmAgent === 'market'
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-500/20'
                    : 'border-zinc-800 bg-[#080B12] hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono font-bold text-white">01. Market Agent</span>
                  <span className="text-[10px] font-mono text-cyan-400">ACTIVE</span>
                </div>
                <p className="text-xs text-zinc-400">Monitors orderbook depth & DEX price feeds.</p>
              </div>

              <div
                onClick={() => setActiveSwarmAgent('risk')}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${
                  activeSwarmAgent === 'risk'
                    ? 'border-amber-400 bg-amber-950/30 shadow-lg shadow-amber-500/20'
                    : 'border-zinc-800 bg-[#080B12] hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono font-bold text-white">02. Risk Agent</span>
                  <span className="text-[10px] font-mono text-amber-400">ACTIVE</span>
                </div>
                <p className="text-xs text-zinc-400">Enforces collateral margins & zero liquidation.</p>
              </div>
            </div>

            {/* Center: Central Robyn OS */}
            <div className="md:col-span-4 border-2 border-emerald-500 bg-[#0A0E18] rounded-xl p-6 text-center shadow-[0_0_35px_rgba(0,200,5,0.25)] relative">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-3">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-base font-bold font-mono text-white">ROBYN OS</div>
              <div className="text-xs font-mono text-emerald-400 mt-1">Primary Orchestrator</div>
              <div className="text-[11px] text-zinc-400 mt-3 pt-3 border-t border-zinc-800">
                Target Route: <strong className="text-white uppercase">{activeSwarmAgent} Agent</strong>
              </div>
            </div>

            {/* Right Agents */}
            <div className="md:col-span-4 space-y-4">
              <div
                onClick={() => setActiveSwarmAgent('portfolio')}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${
                  activeSwarmAgent === 'portfolio'
                    ? 'border-emerald-400 bg-emerald-950/30 shadow-lg shadow-emerald-500/20'
                    : 'border-zinc-800 bg-[#080B12] hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono font-bold text-white">03. Portfolio Agent</span>
                  <span className="text-[10px] font-mono text-emerald-400">ACTIVE</span>
                </div>
                <p className="text-xs text-zinc-400">Rebalances multi-token yields & balances.</p>
              </div>

              <div
                onClick={() => setActiveSwarmAgent('execution')}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${
                  activeSwarmAgent === 'execution'
                    ? 'border-purple-400 bg-purple-950/30 shadow-lg shadow-purple-500/20'
                    : 'border-zinc-800 bg-[#080B12] hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono font-bold text-white">04. Execution Agent</span>
                  <span className="text-[10px] font-mono text-purple-400">ACTIVE</span>
                </div>
                <p className="text-xs text-zinc-400">Signs & broadcasts 100ms Orbit transactions.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODULE 4: TOKEN & COLLATERAL PARTICLE FLOW                */}
      {/* ========================================================= */}
      {activeTab === 'collateral' && (
        <div className="border border-zinc-800/90 bg-[#04060A] rounded-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-sm font-mono text-white font-bold tracking-wider uppercase flex items-center gap-2">
                <span className="text-emerald-400">🔒</span>
                TOKEN / COLLATERAL / ASSET FLOW
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Visual particles demonstrate how locking $ROBYN unlocks collateral in tokenized stocks ($NVDA, $AAPL) or $ETH.
              </p>
            </div>
            <div className="text-[11px] font-mono px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
              SIMULATED DEMO EXECUTION
            </div>
          </div>

          {/* Interactive Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#080B12] p-5 rounded-xl border border-zinc-800">
            {/* Slider */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-300">1. Adjust $ROBYN Tokens to Lock:</span>
                <span className="text-emerald-400 font-bold">{lockedRobynAmount.toLocaleString()} $ROBYN ($7,250 USD)</span>
              </div>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={lockedRobynAmount}
                onChange={(e) => setLockedRobynAmount(Number(e.target.value))}
                className="w-full accent-emerald-400 bg-zinc-800 h-2 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>1,000 $ROBYN</span>
                <span>25,000 $ROBYN</span>
                <span>50,000 $ROBYN</span>
              </div>
            </div>

            {/* Asset Selector */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-mono text-zinc-300 block">2. Select Target Collateral:</label>
              <div className="grid grid-cols-4 gap-2">
                {(['NVDA', 'AAPL', 'TSLA', 'ETH'] as const).map((ast) => (
                  <button
                    key={ast}
                    onClick={() => setTargetAsset(ast)}
                    className={`py-2 px-1 text-center rounded border font-mono text-xs transition-all ${
                      targetAsset === ast
                        ? 'border-emerald-500 bg-emerald-500/20 text-white font-bold'
                        : 'border-zinc-800 bg-black/50 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    ${ast}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4-Stage Particle Conduit Flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Node 1 */}
            <div className={`border rounded-xl p-4 bg-[#080B12] transition-all ${
              collateralFlowStep === 1 ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-zinc-800'
            }`}>
              <div className="text-[10px] font-mono text-zinc-500 mb-1">01. TOKEN DEPOSIT</div>
              <div className="text-sm font-bold text-white">{lockedRobynAmount.toLocaleString()} $ROBYN</div>
              <div className="text-xs text-emerald-400 mt-1">${collateralValuation.toLocaleString()} USD Value</div>
            </div>

            {/* Node 2 */}
            <div className={`border rounded-xl p-4 bg-[#080B12] transition-all ${
              collateralFlowStep === 2 ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-zinc-800'
            }`}>
              <div className="text-[10px] font-mono text-zinc-500 mb-1">02. SMART VAULT</div>
              <div className="text-sm font-bold text-white">Non-Custodial Lock</div>
              <div className="text-xs text-zinc-400 mt-1">Arbitrum Orbit Smart Contract</div>
            </div>

            {/* Node 3 */}
            <div className={`border rounded-xl p-4 bg-[#080B12] transition-all ${
              collateralFlowStep === 3 ? 'border-amber-400 shadow-lg shadow-amber-500/20' : 'border-zinc-800'
            }`}>
              <div className="text-[10px] font-mono text-zinc-500 mb-1">03. RISK & LTV GUARD</div>
              <div className="text-sm font-bold text-white">Max LTV: {activeAssetData.ltv * 100}%</div>
              <div className="text-xs text-amber-400 mt-1">Health Factor: 1.45 (Optimal)</div>
            </div>

            {/* Node 4 */}
            <div className={`border rounded-xl p-4 bg-[#080B12] transition-all ${
              collateralFlowStep === 4 ? 'border-cyan-400 shadow-lg shadow-cyan-500/20' : 'border-zinc-800'
            }`}>
              <div className="text-[10px] font-mono text-zinc-500 mb-1">04. ASSET ISSUED</div>
              <div className="text-sm font-bold text-white">{safeBorrowUnits} {activeAssetData.ticker}</div>
              <div className="text-xs text-cyan-400 mt-1">${maxBorrowUsd.toLocaleString()} USD Line</div>
            </div>
          </div>

          <button
            onClick={triggerCollateralFlow}
            className="w-full py-3 rounded-lg bg-[#00C805] hover:bg-[#00C805]/90 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00C805]/20"
          >
            <span>⚡</span>
            <span>SIMULATE VALUE CONDUIT ({lockedRobynAmount.toLocaleString()} $ROBYN ➔ {safeBorrowUnits} ${targetAsset})</span>
          </button>
        </div>
      )}
    </section>
  )
}
