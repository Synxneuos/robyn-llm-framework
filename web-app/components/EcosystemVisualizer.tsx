import React, { useState, useEffect, useRef } from 'react'

interface GraphNode {
  id: string
  title: string
  category: string
  x: number
  y: number
  status: 'idle' | 'running' | 'complete'
  icon: string
  badge: string
  badgeColor: string
  summary: string
  inspector: {
    type: string
    latency: string
    inputTensor: string
    outputPayload: string
    params: Record<string, string | number>
  }
}

interface GraphEdge {
  from: string
  to: string
  label?: string
  active?: boolean
}

export default function EcosystemVisualizer() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Canvas Viewport & Node Positions (Draggable)
  const initialNodes: GraphNode[] = [
    {
      id: 'input',
      title: 'User Intent Ingest',
      category: 'Perception Stream',
      x: 40,
      y: 180,
      status: 'idle',
      icon: '💬',
      badge: 'RPC / TG',
      badgeColor: '#00F0FF',
      summary: 'Aggregates natural language intent and prompts into structured tensors.',
      inspector: {
        type: 'Perception Ingestion',
        latency: '12ms',
        inputTensor: '{\n  "prompt": "Stake $ROBYN for Stocks / ETH collateral & hedge",\n  "channel": "RPC_GATEWAY",\n  "session": "0x420120...auth"\n}',
        outputPayload: '{\n  "intent": "COLLATERAL_STAKE_AND_HEDGE",\n  "target_line": "STOCKS_OR_ETH",\n  "risk_tier": "CONSERVATIVE"\n}',
        params: { channel: 'RPC_DIRECT', format: 'V2_JSON', auth: 'ECDSA_VERIFIED' }
      }
    },
    {
      id: 'robyn',
      title: 'Robyn Engine',
      category: 'Autonomous Cognition',
      x: 320,
      y: 160,
      status: 'idle',
      icon: '⚡',
      badge: 'Robyn Core',
      badgeColor: '#00C805',
      summary: 'Deterministic reasoning engine that plans tool execution with zero hallucinations.',
      inspector: {
        type: 'Cognition Core',
        latency: '32ms',
        inputTensor: '{\n  "intent": "COLLATERAL_STAKE_AND_HEDGE",\n  "context_tokens": 512\n}',
        outputPayload: '{\n  "dag_plan": [\n    "get_oracle_price(STOCKS_ETH)",\n    "verify_ltv_barrier(70%)",\n    "issue_collateral_voucher()"\n  ]\n}',
        params: { engine: 'Robyn-Engine-v1.0', mode: 'DETERMINISTIC', temp: 0.0 }
      }
    },
    {
      id: 'router',
      title: 'Tool Router',
      category: 'Parallel Dispatch',
      x: 600,
      y: 70,
      status: 'idle',
      icon: '❖',
      badge: 'DAG Router',
      badgeColor: '#3B82F6',
      summary: 'Dispatches parallel sub-calls across on-chain contracts and oracle feeds.',
      inspector: {
        type: 'Execution Dispatcher',
        latency: '16ms',
        inputTensor: '{\n  "plan": "DAG_3_BRANCHES",\n  "parallel_threads": 3\n}',
        outputPayload: '{\n  "branch_1": "DISPATCHED_TO_ORACLE",\n  "branch_2": "DISPATCHED_TO_RISK",\n  "branch_3": "DISPATCHED_TO_VAULT"\n}',
        params: { concurrency: 3, timeout: '100ms', flashbots_check: true }
      }
    },
    {
      id: 'oracle',
      title: 'Data & Market Oracle',
      category: 'Price Streams',
      x: 880,
      y: 40,
      status: 'idle',
      icon: '📊',
      badge: 'Pyth / Uniswap',
      badgeColor: '#00F0FF',
      summary: 'Real-time price feeds for Tokenized Stocks ($NVDA, $AAPL, $TSLA) and Native $ETH.',
      inspector: {
        type: 'Price Oracle Feeds',
        latency: '18ms',
        inputTensor: '{\n  "pairs": ["STOCKS/USDC", "ETH/USDC", "ROBYN/USD"]\n}',
        outputPayload: '{\n  "stocks_price": 128.50,\n  "eth_price": 2540.00,\n  "robyn_price": 1.45\n}',
        params: { update_freq: '100ms', confidence: '99.98%', source: 'PYTH_ORACLE' }
      }
    },
    {
      id: 'risk',
      title: 'Risk & LTV Guard',
      category: 'Safety Circuit Breaker',
      x: 600,
      y: 330,
      status: 'idle',
      icon: '🛡️',
      badge: 'Max LTV 70%',
      badgeColor: '#F59E0B',
      summary: 'Calculates loan-to-value health factor and enforces zero-liquidation thresholds.',
      inspector: {
        type: 'Risk Guardrail',
        latency: '14ms',
        inputTensor: '{\n  "collateral_val_usd": 7250.00,\n  "max_ltv_pct": 70\n}',
        outputPayload: '{\n  "safe_borrow_usd": 5075.00,\n  "health_factor": 1.45,\n  "liquidation_risk": "ZERO"\n}',
        params: { max_ltv: '70.0%', liq_threshold: '85.0%', health_score: 1.45 }
      }
    },
    {
      id: 'collateral',
      title: 'Stocks / ETH Collateral',
      category: 'Token Staking Vault',
      x: 880,
      y: 250,
      status: 'idle',
      icon: '🔒',
      badge: 'Stocks / ETH',
      badgeColor: '#10B981',
      summary: 'Locks $ROBYN tokens and issues instant credit lines in Tokenized Stocks or Native $ETH.',
      inspector: {
        type: 'Non-Custodial Collateral Vault',
        latency: '22ms',
        inputTensor: '{\n  "locked_robyn": 5000,\n  "collateral_target": "STOCKS_OR_ETH"\n}',
        outputPayload: '{\n  "issued_units": "39.49 Stocks ($NVDA) OR 2.0 ETH",\n  "position_status": "ACTIVE_COLLATERALIZED"\n}',
        params: { contract: '0xRobynVault...4201', standard: 'ERC-4337', non_custodial: true }
      }
    },
    {
      id: 'settlement',
      title: 'Orbit Finality',
      category: 'Robinhood Chain',
      x: 1150,
      y: 190,
      status: 'idle',
      icon: '✓',
      badge: '100ms Block',
      badgeColor: '#A855F7',
      summary: '100ms Arbitrum Orbit sequencer settlement with sub-$0.0009 gas execution.',
      inspector: {
        type: 'On-Chain Settlement',
        latency: '19ms',
        inputTensor: '{\n  "signed_tx": "0x63cf2dd4c771ce8b11d3dfd37a59fc55bab3e6b626818c177f16d4c051a6aefd"\n}',
        outputPayload: '{\n  "status": "CONFIRMED_BLOCK_849201",\n  "gas_fee_usd": "$0.00042",\n  "block_latency_ms": 82.4\n}',
        params: { block_time: '100ms', chain_id: 420120, gas_used: 42190 }
      }
    }
  ]

  const edges: GraphEdge[] = [
    { from: 'input', to: 'robyn', label: 'intent_tensor' },
    { from: 'robyn', to: 'router', label: 'dag_plan' },
    { from: 'router', to: 'oracle', label: 'get_prices()' },
    { from: 'robyn', to: 'risk', label: 'verify_ltv()' },
    { from: 'risk', to: 'collateral', label: 'approve_limit()' },
    { from: 'oracle', to: 'collateral', label: 'price_feed' },
    { from: 'collateral', to: 'settlement', label: 'issue_line()' },
  ]

  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes)
  const [selectedNodeId, setSelectedNodeId] = useState<string>('robyn')
  const [isExecuting, setIsExecuting] = useState<boolean>(false)
  const [activeStep, setActiveStep] = useState<number>(-1)
  const [photonProgress, setPhotonProgress] = useState<number>(0)

  // Dragging State
  const [dragNodeId, setDragNodeId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Collateral Staking Slider inside inspector
  const [stakingAmount, setStakingAmount] = useState<number>(5000)
  const [selectedAssetType, setSelectedAssetType] = useState<'Stocks' | 'ETH'>('Stocks')

  // Handle Drag Start
  const handlePointerDown = (nodeId: string, e: React.PointerEvent) => {
    e.stopPropagation()
    const node = nodes.find(n => n.id === nodeId)
    if (!node || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    setDragNodeId(nodeId)
    setDragOffset({
      x: (e.clientX - rect.left) - node.x,
      y: (e.clientY - rect.top) - node.y,
    })
    setSelectedNodeId(nodeId)
  }

  // Handle Dragging
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragNodeId || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const newX = Math.max(10, Math.min(rect.width - 240, (e.clientX - rect.left) - dragOffset.x))
    const newY = Math.max(10, Math.min(rect.height - 140, (e.clientY - rect.top) - dragOffset.y))

    setNodes(prev => prev.map(n => n.id === dragNodeId ? { ...n, x: newX, y: newY } : n))
  }

  // Handle Drag End
  const handlePointerUp = () => {
    setDragNodeId(null)
  }

  // Run Sequential Data Flow with traveling green photons
  const runSequentialFlow = () => {
    if (isExecuting) return
    setIsExecuting(true)
    setActiveStep(0)
    setPhotonProgress(0)

    // Reset node states
    setNodes(prev => prev.map(n => ({ ...n, status: 'idle' })))

    const steps = [
      { id: 'input', duration: 400 },
      { id: 'robyn', duration: 800 },
      { id: 'router', duration: 1300 },
      { id: 'oracle', duration: 1800 },
      { id: 'risk', duration: 2200 },
      { id: 'collateral', duration: 2700 },
      { id: 'settlement', duration: 3300 },
    ]

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setActiveStep(idx)
        setSelectedNodeId(step.id)
        setNodes(prev => prev.map(n => {
          if (n.id === step.id) return { ...n, status: 'running' }
          if (steps.slice(0, idx).some(s => s.id === n.id)) return { ...n, status: 'complete' }
          return n
        }))
      }, step.duration)
    })

    setTimeout(() => {
      setNodes(prev => prev.map(n => ({ ...n, status: 'complete' })))
      setIsExecuting(false)
      setActiveStep(-1)
    }, 3800)
  }

  // Reset node positions
  const resetLayout = () => {
    setNodes(initialNodes)
    setSelectedNodeId('robyn')
  }

  // Calculate Cubic Bezier SVG Curve between two nodes
  const getCurvePath = (n1: GraphNode, n2: GraphNode) => {
    const x1 = n1.x + 210
    const y1 = n1.y + 55
    const x2 = n2.x
    const y2 = n2.y + 55

    const dx = Math.abs(x2 - x1) * 0.5
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
  }

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[1]

  return (
    <section id="visualizer" className="space-y-6 scroll-mt-20 select-none">
      {/* 1. Header Bar */}
      <div className="border border-zinc-800/80 bg-[#06080D] p-6 sm:p-7 rounded-xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              INTERACTIVE FLOATING NODE CANVAS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Robyn Engine Living Architecture
              <span className="text-[11px] font-mono font-normal px-2.5 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/40 text-emerald-300">
                Draggable & Interactive
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
              Drag any node freely on the canvas. Connected glowing cables adapt in real time. Click nodes to inspect their internal memory tensors, parameters, and Stocks / ETH collateral issuance.
            </p>
          </div>

          {/* Action Control Buttons */}
          <div className="flex items-center gap-2.5 self-start lg:self-auto">
            <button
              onClick={resetLayout}
              className="px-3.5 py-2 text-xs font-mono rounded-lg border border-zinc-800 bg-black/60 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all flex items-center gap-1.5"
            >
              <span>↺</span> Reset Nodes
            </button>

            <button
              onClick={runSequentialFlow}
              disabled={isExecuting}
              className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-[#00C805] hover:bg-[#00C805]/90 text-black transition-all flex items-center gap-2 shadow-lg shadow-[#00C805]/25"
            >
              {isExecuting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>EXECUTING FLOW...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>RUN INTERACTIVE FLOW</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN FLOATING NODE CANVAS & INSPECTOR SPLIT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left: Drag & Drop Node Canvas (8 Cols on XL) */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="xl:col-span-8 border border-zinc-800/90 bg-[#04060A] rounded-xl relative overflow-hidden min-h-[580px] h-[620px] cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'none' }}
        >
          {/* Subtle Dot Matrix Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Floating Instructions Pill */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none bg-black/80 border border-zinc-800/80 px-3 py-1.5 rounded-lg text-[11px] font-mono text-zinc-400 flex items-center gap-2 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Click & Drag Nodes • Cables recalculate live</span>
          </div>

          {/* SVG Connection Cables Layer with Traveling Photons */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            <defs>
              <linearGradient id="cableGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="50%" stopColor="#00C805" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>

              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {edges.map((edge, idx) => {
              const n1 = nodes.find(n => n.id === edge.from)
              const n2 = nodes.find(n => n.id === edge.to)
              if (!n1 || !n2) return null

              const pathD = getCurvePath(n1, n2)
              const isSelectedPath = selectedNodeId === n1.id || selectedNodeId === n2.id

              return (
                <g key={idx}>
                  {/* Background Track Cable */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isSelectedPath ? '#22c55e40' : '#1E293B'}
                    strokeWidth={isSelectedPath ? '3' : '2'}
                    strokeDasharray={isSelectedPath ? 'none' : '4, 4'}
                  />

                  {/* Glowing Laser Pulse when active */}
                  {(isExecuting || isSelectedPath) && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#00C805"
                      strokeWidth="2.5"
                      strokeDasharray="8, 16"
                      className="animate-laser-fast"
                      filter="url(#glow)"
                      opacity="0.85"
                    />
                  )}
                </g>
              )
            })}
          </svg>

          {/* Draggable Nodes Layer */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id
            const isDraggingThis = dragNodeId === node.id

            return (
              <div
                key={node.id}
                onPointerDown={(e) => handlePointerDown(node.id, e)}
                style={{
                  transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                  width: '210px',
                }}
                className={`absolute top-0 left-0 z-20 rounded-xl p-4 border transition-shadow duration-150 backdrop-blur-md cursor-grab active:cursor-grabbing ${
                  isDraggingThis
                    ? 'border-[#00C805] bg-[#0A101D]/95 shadow-2xl shadow-[#00C805]/40 scale-105 z-30'
                    : isSelected
                    ? 'border-[#00C805] bg-[#080D18]/95 shadow-xl shadow-[#00C805]/20 ring-1 ring-[#00C805]/50'
                    : node.status === 'complete'
                    ? 'border-emerald-500/40 bg-[#060910]/90 hover:border-zinc-600'
                    : 'border-zinc-800 bg-[#060910]/85 hover:border-zinc-700'
                }`}
              >
                {/* Node Top Ports & Status */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{node.icon}</span>
                    <span className="text-[10px] font-mono text-zinc-400 font-semibold truncate max-w-[90px]">
                      {node.category}
                    </span>
                  </div>

                  <span
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold"
                    style={{
                      backgroundColor: `${node.badgeColor}15`,
                      color: node.badgeColor,
                      border: `1px solid ${node.badgeColor}35`
                    }}
                  >
                    {node.badge}
                  </span>
                </div>

                {/* Node Title */}
                <div className="text-xs font-bold text-white mb-1 truncate">
                  {node.title}
                </div>

                <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {node.summary}
                </p>

                {/* Node Status Bar & Socket Points */}
                <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[9px] font-mono">
                  <span className="text-zinc-500">Latency: {node.inspector.latency}</span>
                  <span className={node.status === 'running' ? 'text-emerald-400 animate-pulse font-bold' : node.status === 'complete' ? 'text-emerald-400' : 'text-zinc-500'}>
                    {node.status === 'running' ? '● RUNNING' : node.status === 'complete' ? '✓ COMPLETE' : '● READY'}
                  </span>
                </div>

                {/* Visual Connection Port Dots */}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black border-2 border-zinc-600" />
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black border-2 border-[#00C805]" />
              </div>
            )
          })}
        </div>

        {/* Right: Real-time Glassmorphism Node Inspector (4 Cols on XL) */}
        <div className="xl:col-span-4 border border-zinc-800/90 bg-[#06080D] rounded-xl p-5 sm:p-6 space-y-5 flex flex-col justify-between backdrop-blur-xl">
          <div className="space-y-4">
            {/* Inspector Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{selectedNode.icon}</span>
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                    {selectedNode.title}
                  </h3>
                  <div className="text-[11px] font-mono text-emerald-400">{selectedNode.category}</div>
                </div>
              </div>

              <span className="text-xs font-mono px-2.5 py-1 rounded bg-black border border-zinc-800 text-zinc-300">
                {selectedNode.inspector.latency}
              </span>
            </div>

            {/* Ingest Tensor Display */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                <span>Ingest Memory Tensor</span>
                <span className="text-zinc-500">JSON Schema</span>
              </div>
              <pre className="p-3 bg-black/90 border border-zinc-800 rounded-lg text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                <code>{selectedNode.inspector.inputTensor}</code>
              </pre>
            </div>

            {/* Output Payload Display */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                <span>Output Execution Calldata</span>
                <span className="text-emerald-500/80">Deterministic</span>
              </div>
              <pre className="p-3 bg-black/90 border border-emerald-500/30 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                <code>{selectedNode.inspector.outputPayload}</code>
              </pre>
            </div>

            {/* Special Interactive Staking & Stocks / ETH Slider if Collateral Node is clicked */}
            {selectedNode.id === 'collateral' && (
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/40 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300 font-bold">Adjust $ROBYN Staking:</span>
                  <span className="text-emerald-400 font-bold">{stakingAmount.toLocaleString()} $ROBYN</span>
                </div>

                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={stakingAmount}
                  onChange={(e) => setStakingAmount(Number(e.target.value))}
                  className="w-full accent-[#00C805] bg-zinc-800 h-1.5 rounded cursor-pointer"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-zinc-400">Target Asset:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelectedAssetType('Stocks')}
                      className={`px-2.5 py-1 text-xs font-mono rounded border ${
                        selectedAssetType === 'Stocks'
                          ? 'border-emerald-500 bg-emerald-500/20 text-white font-bold'
                          : 'border-zinc-800 bg-black text-zinc-400'
                      }`}
                    >
                      Tokenized Stocks ($NVDA/$AAPL)
                    </button>
                    <button
                      onClick={() => setSelectedAssetType('ETH')}
                      className={`px-2.5 py-1 text-xs font-mono rounded border ${
                        selectedAssetType === 'ETH'
                          ? 'border-emerald-500 bg-emerald-500/20 text-white font-bold'
                          : 'border-zinc-800 bg-black text-zinc-400'
                      }`}
                    >
                      Native $ETH
                    </button>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-zinc-300 pt-2 border-t border-zinc-800 flex justify-between">
                  <span>Available Collateral Line:</span>
                  <strong className="text-emerald-400">
                    {selectedAssetType === 'Stocks' ? `$${(stakingAmount * 1.45 * 0.70).toFixed(2)} USD in Stocks` : `${((stakingAmount * 1.45 * 0.75) / 2540).toFixed(3)} ETH`}
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* Node Spec Parameters Table */}
          <div className="pt-3 border-t border-zinc-800 space-y-2 text-xs font-mono">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Node Hardware & Consensus Specs</div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {Object.entries(selectedNode.inspector.params).map(([key, val]) => (
                <div key={key} className="bg-black/60 p-2 rounded border border-zinc-800/80">
                  <span className="text-zinc-500 block text-[9px] uppercase">{key}</span>
                  <span className="text-white font-medium">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
