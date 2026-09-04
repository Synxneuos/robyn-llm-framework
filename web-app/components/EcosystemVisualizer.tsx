import React, { useState, useEffect, useRef } from 'react'

export default function EcosystemVisualizer() {
  const [activeTab, setActiveTab] = useState<'flow' | 'collateral' | 'omnichannel' | 'roadmap'>('flow')

  // Execution Surge Animation State
  const [isSurging, setIsSurging] = useState<boolean>(false)
  const [surgeStep, setSurgeStep] = useState<number>(0)
  const [activeNode, setActiveNode] = useState<number | null>(null)

  // Collateral State
  const [lockedRobyn, setLockedRobyn] = useState<number>(5000)
  const [selectedAsset, setSelectedAsset] = useState<'NVDA' | 'AAPL' | 'TSLA' | 'ETH'>('NVDA')
  const [collateralTx, setCollateralTx] = useState<{ txHash: string; units: string; health: string; time: string } | null>(null)
  const [isMinting, setIsMinting] = useState<boolean>(false)

  // Omni-Channel Chat State
  const [selectedChannel, setSelectedChannel] = useState<'telegram' | 'discord' | 'whatsapp'>('telegram')
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false)
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string; channel?: string }>>([
    {
      sender: 'user',
      text: '/lock 5000 NVDA',
      time: '12:04:18',
      channel: 'telegram'
    },
    {
      sender: 'bot',
      text: '🔒 [COLLATERAL POSITION MINTED]\n• Platform: Telegram Bot Gateway\n• Locked: 5,000 $ROBYN ($7,250 USD)\n• Collateral Issued: 39.49 $NVDA ($5,075 USD)\n• Health Factor: 1.45 (Optimal / Zero Liquidation)\n• Latency: 78.4ms (Robinhood Orbit Direct)\n• Tx: 0x63cf2dd4c771ce8b11d3dfd37a59fc55bab3e6b626818c177f16d4c051a6aefd',
      time: '12:04:18',
      channel: 'telegram'
    }
  ])
  const [inputCommand, setInputCommand] = useState<string>('')

  // Canvas Ref for Background Particle Grid
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Asset Price Config
  const assetConfig = {
    NVDA: { name: 'NVIDIA Corp (Tokenized)', price: 128.50, ltv: 0.70, liq: 0.85, color: '#00C805' },
    AAPL: { name: 'Apple Inc (Tokenized)', price: 224.20, ltv: 0.75, liq: 0.88, color: '#00F0FF' },
    TSLA: { name: 'Tesla Inc (Tokenized)', price: 215.80, ltv: 0.65, liq: 0.80, color: '#E11D48' },
    ETH:  { name: 'Native Ether', price: 2540.00, ltv: 0.80, liq: 0.90, color: '#A855F7' },
  }

  const robynPrice = 1.45
  const collateralValuation = lockedRobyn * robynPrice
  const activeAssetData = assetConfig[selectedAsset]
  const maxBorrowUsd = collateralValuation * activeAssetData.ltv
  const maxBorrowUnits = (maxBorrowUsd / activeAssetData.price).toFixed(3)
  const safeBorrowUnits = ((maxBorrowUsd * 0.85) / activeAssetData.price).toFixed(3)
  const healthFactor = 1.45

  // Trigger high-velocity execution surge
  const handleTriggerSurge = () => {
    if (isSurging) return
    setIsSurging(true)
    setSurgeStep(1)

    const timers = [
      setTimeout(() => setSurgeStep(2), 250),
      setTimeout(() => setSurgeStep(3), 500),
      setTimeout(() => setSurgeStep(4), 750),
      setTimeout(() => setSurgeStep(5), 1000),
      setTimeout(() => {
        setIsSurging(false)
        setSurgeStep(0)
      }, 1600)
    ]

    return () => timers.forEach(clearTimeout)
  }

  // Particle Canvas Background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number }> = []
    const colors = ['#00C805', '#00F0FF', '#A855F7', '#3B82F6']

    for (let i = 0; i < 35; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw subtle cyber grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)'
      ctx.lineWidth = 1
      const gridSize = 40
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw and connect particles
      particles.forEach((p, idx) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        // Connect nearby particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (dist < 90) {
            ctx.strokeStyle = p.color
            ctx.globalAlpha = (1 - dist / 90) * 0.15
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      })
      ctx.globalAlpha = 1.0
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [activeTab])

  // Collateral Minting Handler
  const handleSimulateLock = () => {
    setIsMinting(true)
    setTimeout(() => {
      const randomHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      setCollateralTx({
        txHash: randomHash,
        units: safeBorrowUnits,
        health: '1.45 (Optimal Safe)',
        time: new Date().toLocaleTimeString()
      })
      setIsMinting(false)
    }, 600)
  }

  // Omni-Channel Chat Execution
  const handleRunBotCommand = (cmd: string) => {
    const userMsgTime = new Date().toLocaleTimeString()
    const newMsgs = [...chatMessages, { sender: 'user' as const, text: cmd, time: userMsgTime, channel: selectedChannel }]
    setChatMessages(newMsgs)
    setIsBotTyping(true)

    setTimeout(() => {
      let reply = ''
      const parts = cmd.split(' ')
      const c = parts[0].toLowerCase()

      if (c === '/lock' || c === '/collateral') {
        const amt = parts[1] || '5000'
        const ast = (parts[2] || selectedAsset).toUpperCase()
        reply = `🔒 [COLLATERAL POSITION MINTED]\n• Platform: ${selectedChannel.toUpperCase()} Real-time Gateway\n• Locked: ${amt} $ROBYN\n• Collateral Issued: 39.5 $${ast}\n• Health Factor: 1.45 (Optimal Safe)\n• Latency: 78.2ms\n• Tx: 0x${Math.random().toString(16).substring(2, 18)}...`
      } else if (c === '/snipe') {
        reply = `⚡ [OMNI-SNIPE EXECUTED]\n• Channel: ${selectedChannel.toUpperCase()}\n• Token: ${parts[1] || '0xCASHCAT'}\n• Amount: ${parts[2] || '0.25'} ETH\n• Latency: 64.2ms (Zero-Approval)\n• Gas: $0.00031 USD\n• Tx Hash: 0x${Math.random().toString(16).substring(2, 18)}...`
      } else if (c === '/hedge') {
        reply = `🛡️ [AI HEDGING ACTIVATED]\n• Channel: ${selectedChannel.toUpperCase()}\n• Target: ${parts[1] || '0xCASHCAT'}\n• Trigger: 2.0x pump\n• Action: Auto-sweep 35% profits into Tokenized $NVDA\n• Keeper: 100ms Orbit Watcher`
      } else {
        reply = `🤖 [Robyn Omni-Agent (${selectedChannel.toUpperCase()})]\nStatus: Online (100ms Orbit)\nAvailable: /lock <amount> <asset>, /snipe <token> <eth>, /hedge <token> <mult>`
      }

      setChatMessages([...newMsgs, { sender: 'bot' as const, text: reply, time: new Date().toLocaleTimeString(), channel: selectedChannel }])
      setIsBotTyping(false)
    }, 450)
  }

  // Node details for visualizer
  const nodes = [
    {
      id: 1,
      name: 'Perception Stream',
      sub: 'Telegram / Discord / WhatsApp / RPC',
      metric: 'Active Ingest',
      color: '#00F0FF',
      desc: 'Aggregates real-time event streams and intent webhooks into low-latency memory tensors.'
    },
    {
      id: 2,
      name: 'Hermes 0.5B Core',
      sub: 'Local Reasoning & Cognition',
      metric: 'Zero Hallucination',
      color: '#00C805',
      desc: 'Executes deterministic function-calling and plans execution steps in <40ms.'
    },
    {
      id: 3,
      name: 'Risk & LTV Guardrails',
      sub: 'Deterministic Circuit Breaker',
      metric: 'Max LTV: 75%',
      color: '#F59E0B',
      desc: 'Simulates Flashbots bundles, verifies collateral ratios, and prevents liquidation events.'
    },
    {
      id: 4,
      name: 'Arbitrum Orbit Sequencer',
      sub: 'Robinhood Chain Settlement',
      metric: '100ms Blocks',
      color: '#6366F1',
      desc: 'Broadcasts zero-approval atomic batches directly to 100ms sequencer with <$0.0009 gas.'
    },
    {
      id: 5,
      name: 'Stock & ETH Collateral',
      sub: 'Tokenized Equities & Yield',
      metric: 'Non-Custodial',
      color: '#10B981',
      desc: 'Issues and manages token-locked collateral lines against NVDA, AAPL, TSLA, and ETH.'
    }
  ]

  return (
    <section id="visualizer" className="space-y-8 scroll-mt-24">
      {/* 1. Header & Tab Navigation */}
      <div className="border border-zinc-800 bg-[#07090E] p-6 sm:p-8 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#00C805]/10 via-[#00F0FF]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE INTERACTIVE VISUALIZER & CAPABILITY ENGINE
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              The Living Architecture
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded border border-zinc-700 bg-zinc-900 text-zinc-300">
                60 FPS Live
              </span>
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl mt-2 leading-relaxed">
              Experience the end-to-end autonomous flow: from multi-channel chat perception to token-locked stock collateral and 100ms on-chain settlement.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/80 p-1.5 rounded-lg border border-zinc-800 self-start lg:self-auto backdrop-blur-md">
            <button
              onClick={() => setActiveTab('flow')}
              className={`px-3.5 py-2 text-xs font-mono rounded-md transition-all flex items-center gap-2 ${
                activeTab === 'flow'
                  ? 'bg-zinc-800 text-white font-semibold border border-zinc-600 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              [01] Interactive Map
            </button>
            <button
              onClick={() => setActiveTab('collateral')}
              className={`px-3.5 py-2 text-xs font-mono rounded-md transition-all flex items-center gap-2 ${
                activeTab === 'collateral'
                  ? 'bg-[#00C805]/20 text-[#00C805] font-semibold border border-[#00C805]/40 glow-green'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>🔒</span>
              [02] Collateral Vault
            </button>
            <button
              onClick={() => setActiveTab('omnichannel')}
              className={`px-3.5 py-2 text-xs font-mono rounded-md transition-all flex items-center gap-2 ${
                activeTab === 'omnichannel'
                  ? 'bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/40 glow-cyan'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>⚡</span>
              [03] Omni-Channel Bots
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3.5 py-2 text-xs font-mono rounded-md transition-all flex items-center gap-2 ${
                activeTab === 'roadmap'
                  ? 'bg-purple-500/20 text-purple-400 font-semibold border border-purple-500/40 glow-purple'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>🚀</span>
              [04] Roadmap (Dec 2026)
            </button>
          </div>
        </div>
      </div>

      {/* 2. TAB 1: INTERACTIVE ECOSYSTEM MAP WITH REAL ANIMATIONS */}
      {activeTab === 'flow' && (
        <div className="border border-zinc-800 bg-[#05070B] rounded-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          {/* Background Canvas Particles */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />

          {/* Action Trigger Bar */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <div>
                <div className="text-xs font-mono font-bold text-white tracking-wider">
                  AUTONOMOUS ON-CHAIN PIPELINE RUNNER
                </div>
                <div className="text-[11px] text-zinc-400">
                  Click any node to inspect telemetry or trigger an end-to-end execution pulse.
                </div>
              </div>
            </div>

            {/* Live Surge Trigger Button */}
            <button
              onClick={handleTriggerSurge}
              disabled={isSurging}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                isSurging
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 glow-green'
                  : 'bg-[#00C805] hover:bg-[#00C805]/90 text-black shadow-lg shadow-[#00C805]/20 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isSurging ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  SURGING PIPELINE ({surgeStep}/5)...
                </>
              ) : (
                <>
                  <span>⚡</span> TRIGGER LIVE EXECUTION SURGE
                </>
              )}
            </button>
          </div>

          {/* Visual Node Grid with Laser Conduits */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
            {nodes.map((node) => {
              const isCurrentSurge = surgeStep === node.id
              const isSelected = activeNode === node.id

              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 relative group ${
                    isCurrentSurge
                      ? 'border-[#00C805] bg-[#00C805]/15 scale-105 shadow-2xl shadow-[#00C805]/30'
                      : isSelected
                      ? 'border-cyan-400 bg-cyan-950/30'
                      : 'border-zinc-800/90 bg-black/70 hover:border-zinc-700 hover:bg-zinc-900/60'
                  }`}
                >
                  {/* Glowing Top Laser Line Indicator */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] transition-all ${
                      isCurrentSurge
                        ? 'bg-gradient-to-r from-transparent via-[#00C805] to-transparent animate-pulse'
                        : isSelected
                        ? 'bg-cyan-400'
                        : 'bg-transparent'
                    }`}
                  />

                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-zinc-500">
                      0{node.id}. STAGE
                    </span>
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold"
                      style={{
                        backgroundColor: `${node.color}20`,
                        color: node.color,
                        border: `1px solid ${node.color}40`
                      }}
                    >
                      {node.metric}
                    </span>
                  </div>

                  {/* Node Visual Center: Animated Holographic Orb */}
                  <div className="my-3 flex items-center justify-center">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      {/* Rotating Outer Ring */}
                      <div
                        className={`absolute inset-0 rounded-full border border-dashed transition-all ${
                          isCurrentSurge ? 'animate-spin border-[#00C805]' : 'animate-spin-slow border-zinc-700'
                        }`}
                      />
                      {/* Reverse Orbit Ring */}
                      <div
                        className={`absolute inset-1 rounded-full border border-dotted transition-all ${
                          isCurrentSurge ? 'animate-spin-reverse border-cyan-400' : 'animate-spin-reverse border-zinc-800'
                        }`}
                      />
                      {/* Core Glowing Dot */}
                      <div
                        className={`w-4 h-4 rounded-full transition-all ${
                          isCurrentSurge
                            ? 'bg-white scale-125 shadow-lg shadow-[#00C805]'
                            : 'bg-zinc-600 group-hover:bg-zinc-300'
                        }`}
                        style={{
                          backgroundColor: isCurrentSurge ? '#FFFFFF' : node.color
                        }}
                      />
                    </div>
                  </div>

                  {/* Node Title & Description */}
                  <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {node.name}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                    {node.sub}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
                    {node.desc}
                  </p>

                  {/* Status Indicator */}
                  <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-500">Latency</span>
                    <span className="text-emerald-400 font-bold">&lt; 18.2ms</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Animated Connecting Laser Conduit */}
          <div className="relative z-10 hidden md:block px-4">
            <svg className="w-full h-4 overflow-visible" viewBox="0 0 1000 16" fill="none">
              <line
                x1="0"
                y1="8"
                x2="1000"
                y2="8"
                stroke="#1F2937"
                strokeWidth="2"
              />
              <line
                x1="0"
                y1="8"
                x2="1000"
                y2="8"
                stroke={isSurging ? '#00C805' : '#00F0FF'}
                strokeWidth="2"
                className={isSurging ? 'animate-laser-fast' : 'animate-laser'}
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Real-time Telemetry Trace Display */}
          <div className="relative z-10 bg-black/90 border border-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C805] animate-ping" />
              <div>
                <span className="text-zinc-400">Current Trace: </span>
                <span className="text-[#00C805] font-bold">
                  {isSurging ? `[EXECUTION SURGE ACTIVE: STEP ${surgeStep}/5]` : '[DAEMON LISTENING - 100ms ORBIT SYNC]'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-zinc-400">
              <div>
                TPS: <span className="text-white font-bold">1,240</span>
              </div>
              <div>
                Avg Block Latency: <span className="text-emerald-400 font-bold">82.4ms</span>
              </div>
              <div>
                Gas: <span className="text-cyan-400 font-bold">&lt; $0.0009</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB 2: HOLOGRAPHIC TOKEN COLLATERAL VAULT */}
      {activeTab === 'collateral' && (
        <div className="border border-zinc-800 bg-[#06080D] rounded-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C805]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Subheader */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00C805] animate-pulse" />
                <h3 className="text-sm font-mono text-white font-bold tracking-wider uppercase">
                  TOKEN-LOCKED STOCKS & ETH COLLATERAL VAULT
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Lock $ROBYN tokens into deterministic smart contracts to borrow real-world tokenized equities ($NVDA, $AAPL, $TSLA) or Native $ETH.
              </p>
            </div>

            <div className="bg-black/60 border border-zinc-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400">$ROBYN Oracle Price:</span>
              <span className="text-xs font-mono text-[#00C805] font-bold">${robynPrice.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            {/* Left Column: Interactive Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Asset Selector */}
              <div>
                <label className="text-xs font-mono text-zinc-300 block mb-2.5 flex items-center justify-between">
                  <span>1. Choose Collateral Asset to Borrow:</span>
                  <span className="text-emerald-400 text-[11px]">Non-Custodial Issuance</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(['NVDA', 'AAPL', 'TSLA', 'ETH'] as const).map((asset) => {
                    const info = assetConfig[asset]
                    const isSelected = selectedAsset === asset

                    return (
                      <button
                        key={asset}
                        onClick={() => setSelectedAsset(asset)}
                        className={`p-3.5 rounded-lg border text-left transition-all relative overflow-hidden ${
                          isSelected
                            ? 'border-[#00C805] bg-[#00C805]/15 text-white glow-green scale-[1.02]'
                            : 'border-zinc-800 bg-black/60 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/40'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-white">${asset}</span>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: info.color }} />
                        </div>
                        <div className="text-sm font-semibold text-zinc-200 mt-1">
                          ${info.price.toFixed(2)}
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400/90 mt-1">
                          Max LTV: {info.ltv * 100}%
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* $ROBYN Lock Slider with Visual Fluid Tank */}
              <div className="space-y-3 bg-black/70 border border-zinc-800/90 p-5 rounded-lg">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-300 font-medium">2. $ROBYN Amount to Stake & Lock:</span>
                  <span className="text-[#00C805] font-bold text-base">
                    {lockedRobyn.toLocaleString()} $ROBYN
                  </span>
                </div>

                {/* Animated Slider */}
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={lockedRobyn}
                  onChange={(e) => setLockedRobyn(Number(e.target.value))}
                  className="w-full accent-[#00C805] bg-zinc-800 h-2 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                  <span>1,000 $ROBYN ($1,450)</span>
                  <span>50,000 $ROBYN ($72,500)</span>
                  <span>100,000 $ROBYN ($145,000)</span>
                </div>

                {/* Staking Yield / Valuation Bar */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Total Collateral Valuation:</span>
                  <span className="text-white font-bold text-sm">
                    ${collateralValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleSimulateLock}
                disabled={isMinting}
                className="w-full py-3.5 px-5 rounded-lg bg-[#00C805] hover:bg-[#00C805]/90 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#00C805]/20 hover:scale-[1.01] active:scale-[0.99]"
              >
                {isMinting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    MINTING ${selectedAsset} COLLATERAL ON ARBITRUM ORBIT...
                  </>
                ) : (
                  <>
                    <span>⚡</span> LOCK {lockedRobyn.toLocaleString()} $ROBYN & ISSUE {safeBorrowUnits} ${selectedAsset}
                  </>
                )}
              </button>
            </div>

            {/* Right Column: Holographic HUD Gauge & Telemetry */}
            <div className="lg:col-span-5 border border-zinc-800 bg-black/80 p-6 rounded-xl space-y-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-3 flex items-center justify-between">
                  <span>Holographic Health Gauge</span>
                  <span className="text-[#00C805] text-[11px] font-bold">100ms Orbit Verified</span>
                </div>

                {/* SVG Circular Arc Meter */}
                <div className="my-6 flex flex-col items-center justify-center">
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      {/* Track */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#1E293B"
                        strokeWidth="8"
                        fill="none"
                      />
                      {/* Animated Glowing Arc */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#00C805"
                        strokeWidth="8"
                        strokeDasharray="251.2"
                        strokeDashoffset="65"
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-700"
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center text-center">
                      <span className="text-2xl font-bold font-mono text-white">1.45</span>
                      <span className="text-[10px] font-mono text-[#00C805] uppercase tracking-widest font-semibold">
                        HEALTH FACTOR
                      </span>
                      <span className="text-[10px] text-zinc-400 mt-0.5">Optimal (Zero Liq)</span>
                    </div>
                  </div>
                </div>

                {/* Live Metrics breakdown */}
                <div className="space-y-3 font-mono text-xs border-t border-zinc-800/80 pt-4">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Max Allowed Borrow:</span>
                    <span className="text-white font-bold">{maxBorrowUnits} ${selectedAsset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Safe Recommended Line:</span>
                    <span className="text-[#00C805] font-bold">{safeBorrowUnits} ${selectedAsset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Liquidation Threshold:</span>
                    <span className="text-amber-400">{activeAssetData.liq * 100}% LTV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Execution Block Time:</span>
                    <span className="text-cyan-400 font-bold">100ms Orbit Direct</span>
                  </div>
                </div>
              </div>

              {/* Execution Pop-up Voucher */}
              {collateralTx && (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-xs font-mono space-y-1.5 cyber-pulse-green">
                  <div className="text-emerald-400 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>✓ COLLATERAL POSITION CONFIRMED</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    Tx: {collateralTx.txHash}
                  </div>
                  <div className="text-[11px] text-zinc-200">
                    Issued: <span className="font-bold text-white">{collateralTx.units} ${selectedAsset}</span> | Health: {collateralTx.health}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 3: OMNI-CHANNEL LIVE AGENT STUDIO WITH SOUNDWAVE EQUALIZER */}
      {activeTab === 'omnichannel' && (
        <div className="border border-zinc-800 bg-[#06080D] rounded-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Subheader */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="text-sm font-mono text-white font-bold tracking-wider uppercase">
                  OMNI-CHANNEL AGENT RUNTIME
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Autonomous real-time listener & executor operating seamlessly across Telegram, Discord, and WhatsApp.
              </p>
            </div>

            {/* Platform Neon Selector */}
            <div className="flex items-center gap-1.5 bg-black/70 p-1 rounded-lg border border-zinc-800 self-start sm:self-auto">
              <button
                onClick={() => setSelectedChannel('telegram')}
                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 ${
                  selectedChannel === 'telegram'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>✈️</span> Telegram Bot
              </button>
              <button
                onClick={() => setSelectedChannel('discord')}
                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 ${
                  selectedChannel === 'discord'
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>🎮</span> Discord Agent
              </button>
              <button
                onClick={() => setSelectedChannel('whatsapp')}
                className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 ${
                  selectedChannel === 'whatsapp'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>💬</span> WhatsApp API
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            {/* Left: Interactive Chat Terminal */}
            <div className="lg:col-span-8 border border-zinc-800 bg-black/90 rounded-xl flex flex-col h-[420px] shadow-2xl relative overflow-hidden">
              {/* Terminal Title Bar */}
              <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-950/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-zinc-200 font-bold capitalize tracking-wide">
                    @{selectedChannel}_robyn_agent (v1.0.0)
                  </span>
                </div>

                {/* Animated Audio Equalizer Soundwave */}
                <div className="flex items-center gap-1 h-5 px-2 bg-black/50 border border-zinc-800 rounded">
                  <span className="text-[10px] text-zinc-500 mr-1">AI Voice:</span>
                  <span className="w-1 bg-emerald-400 rounded-full sound-bar-1" />
                  <span className="w-1 bg-emerald-400 rounded-full sound-bar-2" />
                  <span className="w-1 bg-emerald-400 rounded-full sound-bar-3" />
                  <span className="w-1 bg-emerald-400 rounded-full sound-bar-4" />
                  <span className="w-1 bg-emerald-400 rounded-full sound-bar-5" />
                </div>
              </div>

              {/* Chat Message Scroll Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 font-mono text-xs">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-zinc-500 mb-1 flex items-center gap-1">
                      <span>{msg.sender === 'user' ? 'You' : `Robyn AI (${(msg.channel || selectedChannel).toUpperCase()})`}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>
                    <div
                      className={`max-w-[85%] p-3.5 rounded-xl whitespace-pre-line leading-relaxed text-xs ${
                        msg.sender === 'user'
                          ? 'bg-zinc-800 text-white border border-zinc-700'
                          : 'bg-zinc-950/90 border border-zinc-800 text-zinc-200 shadow-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isBotTyping && (
                  <div className="flex flex-col items-start">
                    <div className="text-[10px] text-zinc-500 mb-1">Robyn AI • Thinking...</div>
                    <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.3s]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3.5 border-t border-zinc-800 bg-zinc-950/90 flex gap-2">
                <input
                  type="text"
                  value={inputCommand}
                  onChange={(e) => setInputCommand(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputCommand.trim()) {
                      handleRunBotCommand(inputCommand)
                      setInputCommand('')
                    }
                  }}
                  placeholder={`Send live command to ${selectedChannel} bot (e.g. /lock 5000 NVDA, /snipe 0xCASHCAT 0.2)...`}
                  className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  onClick={() => {
                    if (inputCommand.trim()) {
                      handleRunBotCommand(inputCommand)
                      setInputCommand('')
                    }
                  }}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-mono font-bold transition-all"
                >
                  Send
                </button>
              </div>
            </div>

            {/* Right: 1-Click Command Presets */}
            <div className="lg:col-span-4 space-y-4">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                Instant 1-Click Action Triggers
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => handleRunBotCommand('/lock 5000 NVDA')}
                  className="w-full text-left p-3.5 rounded-lg border border-zinc-800 bg-black/60 hover:border-[#00C805] hover:bg-[#00C805]/10 transition-all group"
                >
                  <div className="text-xs font-mono text-[#00C805] font-bold group-hover:underline">
                    /lock 5000 NVDA
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Lock 5k $ROBYN & issue $NVDA stock collateral
                  </div>
                </button>

                <button
                  onClick={() => handleRunBotCommand('/snipe 0xCASHCAT 0.25')}
                  className="w-full text-left p-3.5 rounded-lg border border-zinc-800 bg-black/60 hover:border-cyan-400 hover:bg-cyan-950/20 transition-all group"
                >
                  <div className="text-xs font-mono text-cyan-400 font-bold group-hover:underline">
                    /snipe 0xCASHCAT 0.25
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Sub-80ms zero-approval DEX swap on Robinhood Chain
                  </div>
                </button>

                <button
                  onClick={() => handleRunBotCommand('/hedge 0xCASHCAT 2.0')}
                  className="w-full text-left p-3.5 rounded-lg border border-zinc-800 bg-black/60 hover:border-amber-400 hover:bg-amber-950/20 transition-all group"
                >
                  <div className="text-xs font-mono text-amber-400 font-bold group-hover:underline">
                    /hedge 0xCASHCAT 2.0
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Auto-sweep 35% profits into tokenized stocks
                  </div>
                </button>

                <button
                  onClick={() => handleRunBotCommand('/status')}
                  className="w-full text-left p-3.5 rounded-lg border border-zinc-800 bg-black/60 hover:border-purple-400 hover:bg-purple-950/20 transition-all group"
                >
                  <div className="text-xs font-mono text-purple-400 font-bold group-hover:underline">
                    /status
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Check Orbit 100ms latency & wallet health
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 4: ROADMAP MATRIX (DECEMBER 2026 HORIZON) */}
      {activeTab === 'roadmap' && (
        <div className="border border-zinc-800 bg-[#06080D] rounded-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                <h3 className="text-sm font-mono text-white font-bold tracking-wider uppercase">
                  ENGINEERING ROADMAP HORIZON
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Aggressive engineering timeline converging in December 2026.
              </p>
            </div>
            <div className="bg-purple-950/40 border border-purple-500/40 text-purple-300 font-mono text-xs px-3 py-1.5 rounded-lg font-bold">
              DECEMBER 2026 TARGET
            </div>
          </div>

          {/* Roadmap Highway Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {/* Phase 01 */}
            <div className="border border-emerald-500/40 bg-black/80 p-5 rounded-xl space-y-3 relative glow-green">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">PHASE 01: Q1 2026</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  SHIPPED / LIVE
                </span>
              </div>
              <div className="text-sm font-bold text-white">Core Kernel & Hermes-Agent</div>
              <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
                <li>0.5B Hermes Tool-Calling Engine</li>
                <li>SQLite / Chroma Vector Memory</li>
                <li>CLI 3-Step Setup & ElizaOS Adapter</li>
                <li>Live robynos.xyz Production Host</li>
              </ul>
            </div>

            {/* Phase 02 */}
            <div className="border border-cyan-500/40 bg-black/80 p-5 rounded-xl space-y-3 relative glow-cyan">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">PHASE 02: Q2 2026</span>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                  85% IN FLIGHT
                </span>
              </div>
              <div className="text-sm font-bold text-white">Collateral & Omni-Channel</div>
              <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
                <li>$ROBYN Token Collateral Vault</li>
                <li>Tokenized Stock ($NVDA/$AAPL) Lines</li>
                <li>Telegram, Discord & WhatsApp Daemons</li>
                <li>Flashbots Orbit MEV Simulation</li>
              </ul>
            </div>

            {/* Phase 03 */}
            <div className="border border-zinc-800 bg-black/80 p-5 rounded-xl space-y-3 relative hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-300">PHASE 03: Q3 2026</span>
                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                  PLANNED
                </span>
              </div>
              <div className="text-sm font-bold text-white">Multi-Agent Swarms</div>
              <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
                <li>P2P Agent-to-Agent Consensus</li>
                <li>Collaborative DeFi Liquidity Swarms</li>
                <li>Dynamic Cross-Chain Bridging</li>
                <li>Autonomous Risk Balancing</li>
              </ul>
            </div>

            {/* Phase 04 */}
            <div className="border border-purple-500/40 bg-black/80 p-5 rounded-xl space-y-3 relative glow-purple">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400">PHASE 04: DEC 2026</span>
                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                  CONVERGENCE
                </span>
              </div>
              <div className="text-sm font-bold text-white">zkML & Autonomous Proofs</div>
              <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
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
