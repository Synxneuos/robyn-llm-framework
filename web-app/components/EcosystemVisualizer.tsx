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
}

export default function EcosystemVisualizer() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeView, setActiveView] = useState<'canvas' | 'bot' | 'roadmap'>('canvas')

  // Default Node Layout
  const initialNodes: GraphNode[] = [
    {
      id: 'input',
      title: 'Omni-Channel Ingest',
      category: 'Perception Stream',
      x: 30,
      y: 190,
      status: 'idle',
      icon: '💬',
      badge: 'TG / WA / DC',
      badgeColor: '#00F0FF',
      summary: 'Receives user commands, buy/sell triggers, and staking inputs from Telegram, WhatsApp & Discord.',
      inspector: {
        type: 'Perception Ingestion',
        latency: '12ms',
        inputTensor: '{\n  "channel": "TELEGRAM_WHATSAPP_DISCORD",\n  "intent": "/lock 5000 Stocks/ETH",\n  "user_id": "@crypto_trader_01"\n}',
        outputPayload: '{\n  "parsed_action": "COLLATERAL_LOCK_STOCKS_ETH",\n  "amount_robyn": 5000,\n  "auto_hedge": true\n}',
        params: { channels: 'TG, WA, DC', auth: 'ECDSA_SESSION', stream: 'REALTIME_WEBSOCKET' }
      }
    },
    {
      id: 'robyn',
      title: 'Robyn Engine',
      category: 'Autonomous Cognition',
      x: 260,
      y: 180,
      status: 'idle',
      icon: '⚡',
      badge: 'Robyn Core',
      badgeColor: '#00C805',
      summary: 'Processes incoming chat intents, analyzes charts/alerts, and dispatches deterministic tool calls.',
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
      x: 490,
      y: 70,
      status: 'idle',
      icon: '❖',
      badge: 'DAG Router',
      badgeColor: '#3B82F6',
      summary: 'Routes parallel execution across chart analytics, price oracles, and smart accounts.',
      inspector: {
        type: 'Execution Dispatcher',
        latency: '16ms',
        inputTensor: '{\n  "plan": "DAG_PARALLEL_EXECUTION",\n  "parallel_threads": 3\n}',
        outputPayload: '{\n  "thread_1": "CHART_AND_WHALE_ALERTS",\n  "thread_2": "LTV_MARGIN_CHECK",\n  "thread_3": "STOCKS_ETH_VAULT"\n}',
        params: { concurrency: 3, timeout: '100ms', flashbots_check: true }
      }
    },
    {
      id: 'oracle',
      title: 'Chart & Price Oracle',
      category: 'Market Analytics',
      x: 720,
      y: 70,
      status: 'idle',
      icon: '📊',
      badge: 'Pyth / Analytics',
      badgeColor: '#00F0FF',
      summary: 'Streams technical indicators, RSI oversold/overbought signals, and whale alerts to chat.',
      inspector: {
        type: 'Price & Technical Oracle',
        latency: '18ms',
        inputTensor: '{\n  "pairs": ["STOCKS/USDC", "ETH/USDC", "ROBYN/USD"],\n  "indicators": ["RSI", "MACD", "WHALE_VOLUME"]\n}',
        outputPayload: '{\n  "stocks_price": 128.50,\n  "eth_price": 2540.00,\n  "alert_trigger": "RSI_OVERSOLD_BUY_SIGNAL"\n}',
        params: { update_freq: '100ms', confidence: '99.98%', source: 'PYTH_ORACLE' }
      }
    },
    {
      id: 'risk',
      title: 'Risk & LTV Guard',
      category: 'Safety Barrier',
      x: 490,
      y: 290,
      status: 'idle',
      icon: '🛡️',
      badge: 'Max LTV 70%',
      badgeColor: '#F59E0B',
      summary: 'Calculates loan-to-value safety buffer and protects against liquidation events.',
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
      category: 'Value Staking Vault',
      x: 720,
      y: 290,
      status: 'idle',
      icon: '🔒',
      badge: 'Stocks / ETH',
      badgeColor: '#10B981',
      summary: 'Locks $ROBYN tokens and issues instant credit lines in Tokenized Stocks ($NVDA, $AAPL) or Native $ETH.',
      inspector: {
        type: 'Non-Custodial Collateral Vault',
        latency: '22ms',
        inputTensor: '{\n  "locked_robyn": 5000,\n  "collateral_target": "STOCKS_OR_ETH"\n}',
        outputPayload: '{\n  "issued_units": "39.49 Stocks ($NVDA) OR 2.0 ETH",\n  "position_status": "ACTIVE_COLLATERALIZED"\n}',
        params: { contract: '0xRobynVault...4201', standard: 'ERC-4337', non_custodial: true }
      }
    },
    {
      id: 'bot_daemon',
      title: 'Telegram / WA Daemon',
      category: 'Instant Chat Dispatch',
      x: 950,
      y: 90,
      status: 'idle',
      icon: '🤖',
      badge: 'Live Bot Gateway',
      badgeColor: '#EC4899',
      summary: 'Delivers real-time whale/chart alerts to Telegram, WhatsApp & Discord; accepts 1-tap user confirmation.',
      inspector: {
        type: 'Omni-Channel Daemon',
        latency: '15ms',
        inputTensor: '{\n  "alert": "Whale accumulated $1.2M $ROBYN",\n  "prompt_action": "/lock 5000 NVDA"\n}',
        outputPayload: '{\n  "chat_response_delivered": true,\n  "user_confirmed": true,\n  "dispatched_to_orbit": true\n}',
        params: { platform: 'TELEGRAM_WHATSAPP_DISCORD', instant_stream: true, sub_80ms: true }
      }
    },
    {
      id: 'settlement',
      title: 'Orbit Finality',
      category: 'Robinhood Chain',
      x: 1170,
      y: 200,
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
    { from: 'router', to: 'oracle', label: 'chart_and_prices' },
    { from: 'oracle', to: 'bot_daemon', label: 'push_alerts' },
    { from: 'robyn', to: 'risk', label: 'verify_ltv()' },
    { from: 'risk', to: 'collateral', label: 'approve_limit()' },
    { from: 'oracle', to: 'collateral', label: 'price_feed' },
    { from: 'bot_daemon', to: 'settlement', label: 'user_action_tx' },
    { from: 'collateral', to: 'settlement', label: 'issue_line()' },
  ]

  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes)
  const [selectedNodeId, setSelectedNodeId] = useState<string>('robyn')
  const [isExecuting, setIsExecuting] = useState<boolean>(false)

  // Pan & Zoom Engine
  const [zoom, setZoom] = useState<number>(0.68)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 20, y: 35 })
  const [isPanning, setIsPanning] = useState<boolean>(false)
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Node Dragging State
  const [dragNodeId, setDragNodeId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  // Collateral Staking Slider inside inspector
  const [stakingAmount, setStakingAmount] = useState<number>(5000)
  const [selectedAssetType, setSelectedAssetType] = useState<'Stocks' | 'ETH'>('Stocks')

  // Omni-Channel Chat Simulator State
  const [selectedChannel, setSelectedChannel] = useState<'telegram' | 'whatsapp' | 'discord'>('telegram')
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string; alert?: boolean }>>([
    {
      sender: 'agent',
      text: '📊 [CHART & ORACLE ALERT]\n• Target: Stocks / ETH ($NVDA / $ETH)\n• Signal: RSI Oversold (28.4) & Whale Inflow +$1.2M\n• Suggested Action: Lock $ROBYN for Stocks / ETH collateral line or execute buy.',
      time: '12:04:10',
      alert: true
    },
    {
      sender: 'user',
      text: '/lock 5000 Stocks/ETH',
      time: '12:04:14'
    },
    {
      sender: 'agent',
      text: '🔒 [AUTONOMOUS ACTION EXECUTED]\n• Locked: 5,000 $ROBYN ($7,250 USD)\n• Issued Collateral: 39.49 Stocks ($NVDA) OR Native $ETH line\n• Health Factor: 1.45 (Optimal Safe)\n• Latency: 78.4ms (Robinhood Orbit)\n• Tx Hash: 0x63cf2dd4c771ce8b11d3dfd37a59fc55bab3e6b626818c177f16d4c051a6aefd',
      time: '12:04:15'
    }
  ])
  const [chatInput, setChatInput] = useState<string>('')
  const [isBotResponding, setIsBotResponding] = useState<boolean>(false)

  // Auto-fit zoom on mount
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        if (width < 600) {
          setZoom(0.44)
          setPan({ x: 10, y: 15 })
        } else if (width < 900) {
          setZoom(0.55)
          setPan({ x: 15, y: 25 })
        } else {
          setZoom(0.68)
          setPan({ x: 20, y: 35 })
        }
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleZoomIn = () => setZoom(prev => Math.min(1.4, prev + 0.12))
  const handleZoomOut = () => setZoom(prev => Math.max(0.35, prev - 0.12))
  const handleFitView = () => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth
      const optimalZoom = width < 768 ? 0.44 : width < 1100 ? 0.58 : 0.68
      setZoom(optimalZoom)
      setPan({ x: 20, y: 35 })
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.ctrlKey || e.metaKey) {
      const zoomDelta = e.deltaY > 0 ? -0.05 : 0.05
      setZoom(prev => Math.max(0.35, Math.min(1.4, prev + zoomDelta)))
    } else {
      setPan(prev => ({
        x: prev.x - e.deltaX * 0.7,
        y: prev.y - e.deltaY * 0.7
      }))
    }
  }

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleNodePointerDown = (nodeId: string, e: React.PointerEvent) => {
    e.stopPropagation()
    const node = nodes.find(n => n.id === nodeId)
    if (!node || !containerRef.current) return

    setDragNodeId(nodeId)
    setDragOffset({
      x: (e.clientX / zoom) - node.x,
      y: (e.clientY / zoom) - node.y,
    })
    setSelectedNodeId(nodeId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragNodeId) {
      const newX = (e.clientX / zoom) - dragOffset.x
      const newY = (e.clientY / zoom) - dragOffset.y
      setNodes(prev => prev.map(n => n.id === dragNodeId ? { ...n, x: newX, y: newY } : n))
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      })
    }
  }

  const handlePointerUp = () => {
    setDragNodeId(null)
    setIsPanning(false)
  }

  // Run Sequential Data Flow with traveling green photons
  const runSequentialFlow = () => {
    if (isExecuting) return
    setIsExecuting(true)
    setNodes(prev => prev.map(n => ({ ...n, status: 'idle' })))

    const steps = [
      { id: 'input', duration: 350 },
      { id: 'robyn', duration: 750 },
      { id: 'router', duration: 1200 },
      { id: 'oracle', duration: 1650 },
      { id: 'bot_daemon', duration: 2100 },
      { id: 'risk', duration: 2550 },
      { id: 'collateral', duration: 3000 },
      { id: 'settlement', duration: 3500 },
    ]

    steps.forEach((step, idx) => {
      setTimeout(() => {
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
    }, 4100)
  }

  const resetLayout = () => {
    setNodes(initialNodes)
    handleFitView()
    setSelectedNodeId('robyn')
  }

  // Calculate Cubic Bezier SVG Curve between two nodes
  const getCurvePath = (n1: GraphNode, n2: GraphNode) => {
    const x1 = n1.x + 200
    const y1 = n1.y + 55
    const x2 = n2.x
    const y2 = n2.y + 55

    const dx = Math.abs(x2 - x1) * 0.5
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
  }

  // Handle Send in Omni-Channel Chat Simulator
  const handleSendChatCommand = (cmdText: string) => {
    const timeNow = new Date().toLocaleTimeString()
    const newMessages = [...chatMessages, { sender: 'user' as const, text: cmdText, time: timeNow }]
    setChatMessages(newMessages)
    setChatInput('')
    setIsBotResponding(true)

    setTimeout(() => {
      let reply = ''
      const parts = cmdText.split(' ')
      const c = parts[0].toLowerCase()

      if (c === '/lock' || c === '/collateral' || c === '/stake') {
        const amt = parts[1] || '5000'
        reply = `🔒 [ROBYN ENGINE AUTONOMOUS ACTION]\n• Platform: ${selectedChannel.toUpperCase()} Gateway\n• Locked: ${amt} $ROBYN ($7,250 USD)\n• Collateral Issued: 39.49 Stocks ($NVDA) OR Native $ETH\n• Health Factor: 1.45 (Optimal Safe)\n• Latency: 78.2ms (Robinhood Orbit)\n• Tx Hash: 0x${Math.random().toString(16).substring(2, 22)}...`
      } else if (c === '/buy' || c === '/snipe') {
        reply = `⚡ [AUTONOMOUS BUY/SNIPE EXECUTED]\n• Platform: ${selectedChannel.toUpperCase()}\n• Token: ${parts[1] || '$ROBYN'}\n• Amount: ${parts[2] || '0.5'} ETH\n• Speed: 62.4ms (Zero-Approval Direct)\n• Gas: $0.00038 USD\n• Tx: 0x${Math.random().toString(16).substring(2, 22)}...`
      } else if (c === '/chart' || c === '/analyze') {
        reply = `📊 [CHART & TECHNICAL ANALYSIS]\n• Pair: Stocks / ETH ($NVDA & $ETH)\n• 24h Vol: $4.2M (Orbit DEX Pools)\n• RSI: 31.2 (Approaching Buy Support)\n• Oracle Feed: Pyth Verified (100ms blocks)`
      } else {
        reply = `🤖 [Robyn Agent (${selectedChannel.toUpperCase()})]\nActive Commands: /lock <amount> <Stocks/ETH>, /buy <token> <amount>, /chart <pair>, /alerts`
      }

      setChatMessages([...newMessages, { sender: 'agent' as const, text: reply, time: new Date().toLocaleTimeString() }])
      setIsBotResponding(false)
    }, 450)
  }

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[1]

  return (
    <section id="visualizer" className="space-y-6 scroll-mt-20 select-none">
      {/* 1. Header Bar with Switcher */}
      <div className="border border-zinc-800/80 bg-[#06080D] p-6 sm:p-7 rounded-xl relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ROBYN OS • INTERACTIVE EXECUTION & OMNI-CHANNEL ENGINE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              Living Architecture & Future Horizon
              <span className="text-[11px] font-mono font-normal px-2.5 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/40 text-emerald-300">
                8-Node Live Canvas
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
              Experience the complete lifecycle: from chart & whale alerts on Telegram/WhatsApp to Stocks / ETH collateral, token buy/sell, and the December 2026 roadmap convergence.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/80 p-1.5 rounded-lg border border-zinc-800 self-start lg:self-auto">
            <button
              onClick={() => setActiveView('canvas')}
              className={`px-3.5 py-2 text-xs font-mono rounded-md transition-all flex items-center gap-2 ${
                activeView === 'canvas'
                  ? 'bg-zinc-800 text-white font-semibold border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="text-emerald-400">01</span> Floating Canvas
            </button>
            <button
              onClick={() => setActiveView('bot')}
              className={`px-3.5 py-2 text-xs font-mono rounded-md transition-all flex items-center gap-2 ${
                activeView === 'bot'
                  ? 'bg-zinc-800 text-white font-semibold border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="text-cyan-400">02</span> Chat Agent Alerts (TG/WA/DC)
            </button>
            <button
              onClick={() => setActiveView('roadmap')}
              className={`px-3.5 py-2 text-xs font-mono rounded-md transition-all flex items-center gap-2 ${
                activeView === 'roadmap'
                  ? 'bg-zinc-800 text-white font-semibold border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="text-purple-400">03</span> Roadmap (Dec 2026 Horizon)
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: INTERACTIVE FLOATING NODE CANVAS (PAN & ZOOM)     */}
      {/* ========================================================= */}
      {activeView === 'canvas' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left: Drag, Pan & Zoom Node Canvas */}
          <div
            ref={containerRef}
            onWheel={handleWheel}
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="xl:col-span-8 border border-zinc-800/90 bg-[#04060A] rounded-xl relative overflow-hidden min-h-[580px] h-[640px] cursor-grab active:cursor-grabbing"
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

            {/* Top Floating Controls Overlay */}
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
              <div className="bg-black/90 border border-zinc-800 px-3 py-1.5 rounded-lg text-[11px] font-mono text-zinc-400 flex items-center gap-2 backdrop-blur-md shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Drag Nodes • Pan Canvas • Zoom: {Math.round(zoom * 100)}%</span>
              </div>
            </div>

            {/* Zoom & Fit Action Pills */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-1 bg-black/90 border border-zinc-800 p-1 rounded-lg backdrop-blur-md shadow-lg">
              <button
                onClick={handleZoomIn}
                title="Zoom In"
                className="w-7 h-7 flex items-center justify-center rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-sm font-bold transition-colors"
              >
                +
              </button>
              <button
                onClick={handleZoomOut}
                title="Zoom Out"
                className="w-7 h-7 flex items-center justify-center rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-sm font-bold transition-colors"
              >
                −
              </button>
              <button
                onClick={handleFitView}
                title="Fit to Screen"
                className="px-2.5 h-7 flex items-center justify-center rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-[11px] font-mono font-semibold transition-colors"
              >
                ⛶ Fit All
              </button>
              <button
                onClick={resetLayout}
                title="Reset Layout"
                className="px-2.5 h-7 flex items-center justify-center rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-[11px] font-mono transition-colors"
              >
                ↺ Reset
              </button>
            </div>

            {/* Transformed Canvas World Container */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: '0 0',
                width: '1420px',
                height: '560px',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              {/* SVG Connection Cables Layer with Traveling Photons */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                <defs>
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
                      <path
                        d={pathD}
                        fill="none"
                        stroke={isSelectedPath ? '#22c55e40' : '#1E293B'}
                        strokeWidth={isSelectedPath ? '3' : '2'}
                        strokeDasharray={isSelectedPath ? 'none' : '4, 4'}
                      />

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
                    onPointerDown={(e) => handleNodePointerDown(node.id, e)}
                    style={{
                      transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                      width: '200px',
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
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{node.icon}</span>
                        <span className="text-[10px] font-mono text-zinc-400 font-semibold truncate max-w-[85px]">
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

                    <div className="text-xs font-bold text-white mb-1 truncate">
                      {node.title}
                    </div>

                    <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {node.summary}
                    </p>

                    <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[9px] font-mono">
                      <span className="text-zinc-500">Latency: {node.inspector.latency}</span>
                      <span className={node.status === 'running' ? 'text-emerald-400 animate-pulse font-bold' : node.status === 'complete' ? 'text-emerald-400' : 'text-zinc-500'}>
                        {node.status === 'running' ? '● RUNNING' : node.status === 'complete' ? '✓ COMPLETE' : '● READY'}
                      </span>
                    </div>

                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black border-2 border-zinc-600" />
                    <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-black border-2 border-[#00C805]" />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Real-time Glassmorphism Node Inspector */}
          <div className="xl:col-span-4 border border-zinc-800/90 bg-[#06080D] rounded-xl p-5 sm:p-6 space-y-5 flex flex-col justify-between backdrop-blur-xl">
            <div className="space-y-4">
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

              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Ingest Memory Tensor</span>
                  <span className="text-zinc-500">JSON Schema</span>
                </div>
                <pre className="p-3 bg-black/90 border border-zinc-800 rounded-lg text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                  <code>{selectedNode.inspector.inputTensor}</code>
                </pre>
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Output Execution Calldata</span>
                  <span className="text-emerald-500/80">Deterministic</span>
                </div>
                <pre className="p-3 bg-black/90 border border-emerald-500/30 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  <code>{selectedNode.inspector.outputPayload}</code>
                </pre>
              </div>

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
      )}

      {/* ========================================================= */}
      {/* VIEW 2: OMNI-CHANNEL AGENT BOT (BUY/SELL/CHART ALERTS)   */}
      {/* ========================================================= */}
      {activeView === 'bot' && (
        <div className="border border-zinc-800/90 bg-[#04060A] rounded-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-sm font-mono text-white font-bold tracking-wider uppercase flex items-center gap-2">
                <span className="text-cyan-400">📱</span>
                OMNI-CHANNEL AGENT • ALERTS & USER DISPATCH
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Real-time chart analysis, whale alerts, and buy/sell commands delivered directly into Telegram, WhatsApp & Discord with 1-tap user confirmation.
              </p>
            </div>

            {/* Platform Switcher */}
            <div className="flex items-center gap-1.5 bg-black/70 p-1 rounded-lg border border-zinc-800 self-start sm:self-auto">
              <button
                onClick={() => setSelectedChannel('telegram')}
                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 ${
                  selectedChannel === 'telegram'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>✈️</span> Telegram
              </button>
              <button
                onClick={() => setSelectedChannel('whatsapp')}
                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 ${
                  selectedChannel === 'whatsapp'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>💬</span> WhatsApp
              </button>
              <button
                onClick={() => setSelectedChannel('discord')}
                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 ${
                  selectedChannel === 'discord'
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>🎮</span> Discord
              </button>
            </div>
          </div>

          {/* Interactive Chat Console + 1-Tap Trigger Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chat Device Simulator */}
            <div className="lg:col-span-8 border border-zinc-800 bg-black/90 rounded-xl flex flex-col h-[400px] shadow-2xl relative overflow-hidden">
              <div className="px-4 py-2.5 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-zinc-200 font-bold capitalize">@{selectedChannel}_robyn_agent</span>
                </div>
                <span className="text-[10px] text-zinc-500">Orbit Latency: 78.4ms</span>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-zinc-500 mb-0.5">
                      {msg.sender === 'user' ? 'You' : `Robyn Agent (${selectedChannel.toUpperCase()})`} • {msg.time}
                    </div>
                    <div
                      className={`max-w-[85%] p-3 rounded-lg whitespace-pre-line leading-relaxed text-xs ${
                        msg.sender === 'user'
                          ? 'bg-zinc-800 text-white'
                          : msg.alert
                          ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 shadow-md'
                          : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isBotResponding && (
                  <div className="flex flex-col items-start">
                    <div className="text-[10px] text-zinc-500 mb-0.5">Robyn Agent • Executing...</div>
                    <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.3s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-zinc-800 bg-zinc-950/90 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && chatInput.trim()) {
                      handleSendChatCommand(chatInput)
                    }
                  }}
                  placeholder={`Send live command to ${selectedChannel} bot (e.g. /lock 5000 Stocks/ETH, /buy $ROBYN 0.5)...`}
                  className="flex-1 bg-black border border-zinc-800 rounded-lg px-3.5 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  onClick={() => {
                    if (chatInput.trim()) handleSendChatCommand(chatInput)
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-mono font-bold transition-all"
                >
                  Send
                </button>
              </div>
            </div>

            {/* 1-Tap Trigger Commands */}
            <div className="lg:col-span-4 space-y-3">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                1-Tap Live Autonomous Triggers
              </div>

              <button
                onClick={() => handleSendChatCommand('/lock 5000 Stocks/ETH')}
                className="w-full text-left p-3 rounded-lg border border-zinc-800 bg-[#080B12] hover:border-emerald-500/50 transition-all group"
              >
                <div className="text-xs font-mono text-emerald-400 font-bold group-hover:underline">
                  /lock 5000 Stocks/ETH
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Lock 5k $ROBYN & issue Stocks/ETH collateral
                </div>
              </button>

              <button
                onClick={() => handleSendChatCommand('/buy $ROBYN 0.5')}
                className="w-full text-left p-3 rounded-lg border border-zinc-800 bg-[#080B12] hover:border-cyan-500/50 transition-all group"
              >
                <div className="text-xs font-mono text-cyan-400 font-bold group-hover:underline">
                  /buy $ROBYN 0.5
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Sub-80ms zero-approval DEX swap on Robinhood Chain
                </div>
              </button>

              <button
                onClick={() => handleSendChatCommand('/chart Stocks/ETH')}
                className="w-full text-left p-3 rounded-lg border border-zinc-800 bg-[#080B12] hover:border-amber-500/50 transition-all group"
              >
                <div className="text-xs font-mono text-amber-400 font-bold group-hover:underline">
                  /chart Stocks/ETH
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Run technical analysis & RSI whale indicator check
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: ROADMAP HORIZON MATRIX (DECEMBER 2026 TARGET)     */}
      {/* ========================================================= */}
      {activeView === 'roadmap' && (
        <div className="border border-zinc-800/90 bg-[#04060A] rounded-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-sm font-mono text-white font-bold tracking-wider uppercase flex items-center gap-2">
                <span className="text-purple-400">🚀</span>
                ENGINEERING ROADMAP HORIZON • DEC 2026 TARGET
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Aggressive engineering timeline converging across core kernel, omni-channel alerts, swarms, and zkML verification.
              </p>
            </div>
            <div className="bg-purple-950/40 border border-purple-500/40 text-purple-300 font-mono text-xs px-3 py-1.5 rounded-lg font-bold">
              DECEMBER 2026 TARGET
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Phase 01 */}
            <div className="border border-emerald-500/40 bg-black/80 p-4.5 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">PHASE 01: Q1 2026</span>
                <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  SHIPPED / LIVE
                </span>
              </div>
              <div className="text-sm font-bold text-white">Core Kernel & Robyn Engine</div>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                <li>0.5B Tool-Calling Engine</li>
                <li>SQLite / Chroma Vector Memory</li>
                <li>CLI 3-Step Setup & ElizaOS Adapter</li>
                <li>Live robynos.xyz Production Host</li>
              </ul>
            </div>

            {/* Phase 02 */}
            <div className="border border-cyan-500/40 bg-black/80 p-4.5 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">PHASE 02: Q2 2026</span>
                <span className="text-[9px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                  85% IN FLIGHT
                </span>
              </div>
              <div className="text-sm font-bold text-white">Collateral & Omni-Channel</div>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                <li>$ROBYN Token Collateral Vault</li>
                <li>Tokenized Stocks / ETH Credit Lines</li>
                <li>Telegram, WhatsApp & Discord Alerts</li>
                <li>Flashbots Orbit MEV Simulation</li>
              </ul>
            </div>

            {/* Phase 03 */}
            <div className="border border-zinc-800 bg-black/80 p-4.5 rounded-xl space-y-2.5 hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-300">PHASE 03: Q3 2026</span>
                <span className="text-[9px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                  PLANNED
                </span>
              </div>
              <div className="text-sm font-bold text-white">Multi-Agent Swarms</div>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                <li>P2P Agent-to-Agent Consensus</li>
                <li>Collaborative DeFi Liquidity Swarms</li>
                <li>Dynamic Cross-Chain Bridging</li>
                <li>Autonomous Risk Balancing</li>
              </ul>
            </div>

            {/* Phase 04 */}
            <div className="border border-purple-500/40 bg-black/80 p-4.5 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400">PHASE 04: DEC 2026</span>
                <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                  CONVERGENCE
                </span>
              </div>
              <div className="text-sm font-bold text-white">zkML & Autonomous Proofs</div>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                <li>Zero-Knowledge Agent Proofs</li>
                <li>Verifiable On-Chain Execution</li>
                <li>Hyper-Agent Autonomous Settlement</li>
                <li>+ More Coming in Phase 05 (2027+)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
