import React, { useState } from 'react'

export default function EcosystemVisualizer() {
  const [activeTab, setActiveTab] = useState<'flow' | 'collateral' | 'omnichannel' | 'roadmap'>('flow')

  // Collateral State
  const [lockedRobyn, setLockedRobyn] = useState<number>(5000)
  const [selectedAsset, setSelectedAsset] = useState<'NVDA' | 'AAPL' | 'TSLA' | 'ETH'>('NVDA')
  const [collateralTx, setCollateralTx] = useState<{ txHash: string; units: string; health: string; time: string } | null>(null)
  const [isMinting, setIsMinting] = useState<boolean>(false)

  // Omni-Channel Chat State
  const [selectedChannel, setSelectedChannel] = useState<'telegram' | 'discord' | 'whatsapp'>('telegram')
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'user',
      text: '/lock 5000 NVDA',
      time: '12:04:18'
    },
    {
      sender: 'bot',
      text: '🔒 [COLLATERAL POSITION MINTED]\n• Platform: Telegram Bot Gateway\n• Locked: 5,000 $ROBYN ($7,250 USD)\n• Collateral Issued: 39.49 $NVDA ($5,075 USD)\n• Health Factor: 1.43 (Safe / Zero Liquidation)\n• Speed: 82.4ms (Robinhood Orbit Direct)\n• Tx: 0x63cf2dd4c771ce8b11d3dfd37a59fc55bab3e6b626818c177f16d4c051a6aefd',
      time: '12:04:18'
    }
  ])
  const [inputCommand, setInputCommand] = useState<string>('')

  // Asset Price Config
  const assetConfig = {
    NVDA: { name: 'NVIDIA Corp (Tokenized)', price: 128.50, ltv: 0.70, liq: 0.85 },
    AAPL: { name: 'Apple Inc (Tokenized)', price: 224.20, ltv: 0.75, liq: 0.88 },
    TSLA: { name: 'Tesla Inc (Tokenized)', price: 215.80, ltv: 0.65, liq: 0.80 },
    ETH:  { name: 'Native Ether', price: 2540.00, ltv: 0.80, liq: 0.90 },
  }

  const robynPrice = 1.45
  const collateralValuation = lockedRobyn * robynPrice
  const activeAssetData = assetConfig[selectedAsset]
  const maxBorrowUsd = collateralValuation * activeAssetData.ltv
  const maxBorrowUnits = (maxBorrowUsd / activeAssetData.price).toFixed(3)
  const safeBorrowUnits = ((maxBorrowUsd * 0.85) / activeAssetData.price).toFixed(3)

  const handleSimulateLock = () => {
    setIsMinting(true)
    setTimeout(() => {
      const randomHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      setCollateralTx({
        txHash: randomHash,
        units: safeBorrowUnits,
        health: '1.45 (Optimal)',
        time: new Date().toLocaleTimeString()
      })
      setIsMinting(false)
    }, 450)
  }

  const handleRunBotCommand = (cmd: string) => {
    const userMsgTime = new Date().toLocaleTimeString()
    const newMsgs = [...chatMessages, { sender: 'user' as const, text: cmd, time: userMsgTime }]
    setChatMessages(newMsgs)

    setTimeout(() => {
      let reply = ''
      const parts = cmd.split(' ')
      const c = parts[0].toLowerCase()

      if (c === '/lock' || c === '/collateral') {
        const amt = parts[1] || '5000'
        const ast = (parts[2] || selectedAsset).toUpperCase()
        reply = `🔒 [COLLATERAL POSITION MINTED]\n• Platform: ${selectedChannel.toUpperCase()} Real-time Gateway\n• Locked: ${amt} $ROBYN\n• Collateral Issued: 39.5 $${ast}\n• Health Factor: 1.45 (Safe)\n• Latency: 78.2ms\n• Tx: 0x${Math.random().toString(16).substring(2, 18)}...`
      } else if (c === '/snipe') {
        reply = `⚡ [OMNI-SNIPE EXECUTED]\n• Channel: ${selectedChannel.toUpperCase()}\n• Token: ${parts[1] || '0xCASHCAT'}\n• Amount: ${parts[2] || '0.25'} ETH\n• Latency: 64.2ms (Zero-Approval)\n• Gas: $0.00031 USD`
      } else if (c === '/hedge') {
        reply = `🛡️ [AI HEDGING ACTIVATED]\n• Channel: ${selectedChannel.toUpperCase()}\n• Target: ${parts[1] || '0xCASHCAT'}\n• Trigger: 2.0x pump\n• Action: Auto-sweep 35% profits into Tokenized $NVDA\n• Keeper: 100ms Orbit Watcher`
      } else {
        reply = `🤖 [Robyn Omni-Agent (${selectedChannel.toUpperCase()})]\nStatus: Online (100ms Orbit)\nAvailable: /lock <amount> <asset>, /snipe <token> <eth>, /hedge <token> <mult>`
      }

      setChatMessages([...newMsgs, { sender: 'bot' as const, text: reply, time: new Date().toLocaleTimeString() }])
    }, 280)
  }

  return (
    <section id="visualizer" className="space-y-8 scroll-mt-24">
      {/* Header */}
      <div className="border border-zinc-800 bg-[#0A0A0A] p-6 sm:p-8 rounded-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C805]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM VISUALIZER & CAPABILITY ENGINE
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              The Living Architecture.
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
              Explore how Robyn OS processes real-time perception, manages token-locked stock collateral, and runs autonomous sub-80ms bots across Telegram, Discord, and WhatsApp.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/60 p-1.5 rounded-md border border-zinc-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('flow')}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                activeTab === 'flow'
                  ? 'bg-zinc-800 text-white font-medium border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              [01] Ecosystem Map
            </button>
            <button
              onClick={() => setActiveTab('collateral')}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                activeTab === 'collateral'
                  ? 'bg-[#00C805]/20 text-[#00C805] font-medium border border-[#00C805]/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              [02] Token Collateral Vault
            </button>
            <button
              onClick={() => setActiveTab('omnichannel')}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                activeTab === 'omnichannel'
                  ? 'bg-cyan-500/20 text-cyan-400 font-medium border border-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              [03] Omni-Channel Bots
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                activeTab === 'roadmap'
                  ? 'bg-purple-500/20 text-purple-400 font-medium border border-purple-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              [04] Roadmap (Dec 2026)
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: ECOSYSTEM MAP */}
      {activeTab === 'flow' && (
        <div className="border border-zinc-800 bg-[#0A0A0A] rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00C805]" />
              <span className="text-xs font-mono text-zinc-300">INTERACTIVE MULTI-LAYER EXECUTION MAP</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">Latency: 85ms Target</span>
          </div>

          {/* Visual Node Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Node 1 */}
            <div className="border border-zinc-800 bg-black/60 p-4 rounded-md space-y-2 relative group hover:border-zinc-700 transition-colors">
              <div className="text-[10px] font-mono text-zinc-500">01. INGESTION</div>
              <div className="text-sm font-semibold text-white">Perception Layer</div>
              <p className="text-xs text-zinc-400">Real-time RPC streams, Telegram, Discord & WhatsApp hooks.</p>
              <div className="text-[11px] font-mono text-cyan-400 pt-2 border-t border-zinc-800/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Active Polling
              </div>
            </div>

            {/* Node 2 */}
            <div className="border border-zinc-800 bg-black/60 p-4 rounded-md space-y-2 relative group hover:border-[#00C805]/50 transition-colors">
              <div className="text-[10px] font-mono text-[#00C805]">02. COGNITION</div>
              <div className="text-sm font-semibold text-white">Hermes 0.5B Core</div>
              <p className="text-xs text-zinc-400">Local tool-calling LLM generates deterministic structured JSON.</p>
              <div className="text-[11px] font-mono text-[#00C805] pt-2 border-t border-zinc-800/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C805]" />
                Zero Hallucination
              </div>
            </div>

            {/* Node 3 */}
            <div className="border border-zinc-800 bg-black/60 p-4 rounded-md space-y-2 relative group hover:border-zinc-700 transition-colors">
              <div className="text-[10px] font-mono text-amber-500">03. GUARDRAILS</div>
              <div className="text-sm font-semibold text-white">LTV & Risk Engine</div>
              <p className="text-xs text-zinc-400">Validates collateral ratios, slippage bounds & Flashbots simulation.</p>
              <div className="text-[11px] font-mono text-amber-400 pt-2 border-t border-zinc-800/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Max LTV: 75%
              </div>
            </div>

            {/* Node 4 */}
            <div className="border border-zinc-800 bg-black/60 p-4 rounded-md space-y-2 relative group hover:border-zinc-700 transition-colors">
              <div className="text-[10px] font-mono text-indigo-400">04. SETTLEMENT</div>
              <div className="text-sm font-semibold text-white">Robinhood Chain</div>
              <p className="text-xs text-zinc-400">100ms Arbitrum Orbit sequencer executing zero-approval batches.</p>
              <div className="text-[11px] font-mono text-indigo-400 pt-2 border-t border-zinc-800/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Gas: &lt;$0.0009
              </div>
            </div>

            {/* Node 5 */}
            <div className="border border-zinc-800 bg-black/60 p-4 rounded-md space-y-2 relative group hover:border-emerald-500/50 transition-colors">
              <div className="text-[10px] font-mono text-emerald-400">05. COLLATERAL</div>
              <div className="text-sm font-semibold text-white">Stock / ETH Vault</div>
              <p className="text-xs text-zinc-400">Issues tokenized $NVDA, $AAPL, $TSLA, or $ETH credit lines.</p>
              <div className="text-[11px] font-mono text-emerald-400 pt-2 border-t border-zinc-800/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Non-Custodial
              </div>
            </div>
          </div>

          {/* Dynamic Telemetry Box */}
          <div className="p-4 bg-black/80 border border-zinc-800/80 rounded font-mono text-xs text-zinc-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <span className="text-zinc-300">Live Daemon Status:</span>
              <span className="text-emerald-400">RUNNING (Orbit Sequencer Direct)</span>
            </div>
            <div className="text-zinc-500 text-[11px]">
              Ecosystem Throughput: ~1,200 TPS | Settlement Confirmation: 100ms
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOKEN COLLATERAL VAULT SIMULATOR */}
      {activeTab === 'collateral' && (
        <div className="border border-zinc-800 bg-[#0A0A0A] rounded-lg p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00C805]" />
                <h3 className="text-sm font-mono text-white font-semibold">TOKEN-LOCKED STOCK & ETH COLLATERAL ENGINE</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Lock your $ROBYN tokens to mint instant borrowing power in Tokenized Stocks ($NVDA, $AAPL, $TSLA) or Native $ETH.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-zinc-500">ROBYN Price:</span>
              <span className="text-xs font-mono text-[#00C805] ml-1.5 font-bold">${robynPrice.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-5">
              {/* Asset Selector */}
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-2">1. Choose Target Collateral Asset:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['NVDA', 'AAPL', 'TSLA', 'ETH'] as const).map((asset) => (
                    <button
                      key={asset}
                      onClick={() => setSelectedAsset(asset)}
                      className={`p-3 rounded border text-left transition-all ${
                        selectedAsset === asset
                          ? 'border-[#00C805] bg-[#00C805]/10 text-white'
                          : 'border-zinc-800 bg-black/50 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="text-xs font-mono font-bold">${asset}</div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">${assetConfig[asset].price.toFixed(2)}</div>
                      <div className="text-[10px] text-emerald-400/80 font-mono mt-1">Max LTV: {assetConfig[asset].ltv * 100}%</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">2. $ROBYN Tokens to Lock:</span>
                  <span className="text-[#00C805] font-bold text-sm">{lockedRobyn.toLocaleString()} $ROBYN</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={lockedRobyn}
                  onChange={(e) => setLockedRobyn(Number(e.target.value))}
                  className="w-full accent-[#00C805] bg-zinc-800 h-1.5 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>500 $ROBYN ($725)</span>
                  <span>25,000 $ROBYN ($36,250)</span>
                  <span>50,000 $ROBYN ($72,500)</span>
                </div>
              </div>

              {/* Simulated Button */}
              <button
                onClick={handleSimulateLock}
                disabled={isMinting}
                className="w-full py-3 px-4 rounded bg-[#00C805] hover:bg-[#00C805]/90 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                {isMinting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Executing Arbitrum Orbit Lock & Issue...
                  </>
                ) : (
                  <>
                    <span>⚡</span> Lock {lockedRobyn.toLocaleString()} $ROBYN & Mint ${selectedAsset} Collateral
                  </>
                )}
              </button>
            </div>

            {/* Live Metrics Card */}
            <div className="lg:col-span-5 border border-zinc-800 bg-black/70 p-5 rounded-md space-y-4">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
                Real-Time Collateral Metrics
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Collateral Valuation:</span>
                  <span className="text-zinc-200">${collateralValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Max Allowed Borrow:</span>
                  <span className="text-white">{maxBorrowUnits} ${selectedAsset} (${maxBorrowUsd.toLocaleString()})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Safe Recommended (Zero Liq):</span>
                  <span className="text-[#00C805] font-bold">{safeBorrowUnits} ${selectedAsset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Health Factor:</span>
                  <span className="text-emerald-400 font-bold">1.45 (Optimal)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Liquidation Threshold:</span>
                  <span className="text-zinc-400">{activeAssetData.liq * 100}% LTV</span>
                </div>
                <div className="flex justify-between border-t border-zinc-800 pt-2 text-[11px]">
                  <span className="text-zinc-500">Execution Speed:</span>
                  <span className="text-cyan-400">82.4ms (Robinhood Chain)</span>
                </div>
              </div>

              {/* Execution Result */}
              {collateralTx && (
                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded text-xs font-mono space-y-1 mt-3">
                  <div className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>✓</span> COLLATERAL POSITION CREATED
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">Tx: {collateralTx.txHash}</div>
                  <div className="text-[11px] text-zinc-300">Issued: {collateralTx.units} ${selectedAsset} (Health: {collateralTx.health})</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OMNI-CHANNEL BOT STUDIO */}
      {activeTab === 'omnichannel' && (
        <div className="border border-zinc-800 bg-[#0A0A0A] rounded-lg p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <h3 className="text-sm font-mono text-white font-semibold">OMNI-CHANNEL AGENT RUNTIME</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Instant sub-80ms agent listener & executor unified across Telegram, Discord, and WhatsApp.
              </p>
            </div>

            {/* Platform Switcher */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded border border-zinc-800 self-start sm:self-auto">
              <button
                onClick={() => setSelectedChannel('telegram')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  selectedChannel === 'telegram'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Telegram Bot
              </button>
              <button
                onClick={() => setSelectedChannel('discord')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  selectedChannel === 'discord'
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Discord Agent
              </button>
              <button
                onClick={() => setSelectedChannel('whatsapp')}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  selectedChannel === 'whatsapp'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                WhatsApp API
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interactive Chat Console */}
            <div className="lg:col-span-8 border border-zinc-800 bg-black/80 rounded-md flex flex-col h-[380px]">
              {/* Chat Header */}
              <div className="px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-900/50 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-zinc-200 font-bold capitalize">@{selectedChannel}_robyn_agent</span>
                </div>
                <span className="text-[11px] text-zinc-500">Latency: 78.4ms</span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-zinc-500 mb-0.5">
                      {msg.sender === 'user' ? 'You' : `Robyn (${selectedChannel.toUpperCase()})`} • {msg.time}
                    </div>
                    <div
                      className={`max-w-[85%] p-3 rounded-md whitespace-pre-line text-xs ${
                        msg.sender === 'user'
                          ? 'bg-zinc-800 text-white'
                          : 'bg-zinc-900/90 border border-zinc-800 text-zinc-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-zinc-800 bg-zinc-900/30 flex gap-2">
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
                  placeholder={`Send command to ${selectedChannel} bot (e.g. /lock 5000 NVDA, /snipe 0xTOKEN 0.2)...`}
                  className="flex-1 bg-black border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />
                <button
                  onClick={() => {
                    if (inputCommand.trim()) {
                      handleRunBotCommand(inputCommand)
                      setInputCommand('')
                    }
                  }}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-mono font-medium transition-colors"
                >
                  Send
                </button>
              </div>
            </div>

            {/* Quick Action Chips & Docs */}
            <div className="lg:col-span-4 space-y-4">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                1-Click Preset Commands
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleRunBotCommand('/lock 5000 NVDA')}
                  className="w-full text-left p-2.5 rounded border border-zinc-800 bg-black/50 hover:border-[#00C805]/50 transition-colors"
                >
                  <div className="text-xs font-mono text-[#00C805] font-bold">/lock 5000 NVDA</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Lock 5k $ROBYN & issue $NVDA collateral</div>
                </button>

                <button
                  onClick={() => handleRunBotCommand('/snipe 0xCASHCAT 0.25')}
                  className="w-full text-left p-2.5 rounded border border-zinc-800 bg-black/50 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="text-xs font-mono text-cyan-400 font-bold">/snipe 0xCASHCAT 0.25</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Sub-80ms zero-approval DEX swap</div>
                </button>

                <button
                  onClick={() => handleRunBotCommand('/hedge 0xCASHCAT 2.0')}
                  className="w-full text-left p-2.5 rounded border border-zinc-800 bg-black/50 hover:border-amber-500/50 transition-colors"
                >
                  <div className="text-xs font-mono text-amber-400 font-bold">/hedge 0xCASHCAT 2.0</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Auto-sweep 35% profit into tokenized stocks</div>
                </button>

                <button
                  onClick={() => handleRunBotCommand('/status')}
                  className="w-full text-left p-2.5 rounded border border-zinc-800 bg-black/50 hover:border-zinc-600 transition-colors"
                >
                  <div className="text-xs font-mono text-zinc-300 font-bold">/status</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">Check 100ms Orbit telemetry & wallet balance</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ROADMAP MATRIX (LOCKED DEC 2026 HORIZON) */}
      {activeTab === 'roadmap' && (
        <div className="border border-zinc-800 bg-[#0A0A0A] rounded-lg p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <h3 className="text-sm font-mono text-white font-semibold">ENGINEERING ROADMAP HORIZON</h3>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Fast-tracked development matrix targeting full autonomous convergence by December 2026.
              </p>
            </div>
            <span className="text-xs font-mono text-purple-400 border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 rounded">
              DECEMBER 2026 MILESTONE TARGET
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Phase 01 */}
            <div className="border border-emerald-500/30 bg-black/60 p-4 rounded-md space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400">PHASE 01: Q1 2026</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">SHIPPED / LIVE</span>
              </div>
              <div className="text-sm font-semibold text-white">Core Kernel & Hermes-Agent</div>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                <li>0.5B Hermes Tool-Calling Engine</li>
                <li>SQLite / Chroma Vector Memory</li>
                <li>CLI 3-Step Setup & ElizaOS Adapter</li>
                <li>Custom Domain & Live Netlify CI/CD</li>
              </ul>
            </div>

            {/* Phase 02 */}
            <div className="border border-cyan-500/30 bg-black/60 p-4 rounded-md space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">PHASE 02: Q2 2026</span>
                <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">85% IN FLIGHT</span>
              </div>
              <div className="text-sm font-semibold text-white">Collateral & Omni-Channel</div>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                <li>$ROBYN Token Collateral Vault</li>
                <li>Tokenized Stock ($NVDA/$AAPL) Lines</li>
                <li>Telegram, Discord & WhatsApp Daemons</li>
                <li>Flashbots Orbit MEV Simulation</li>
              </ul>
            </div>

            {/* Phase 03 */}
            <div className="border border-zinc-800 bg-black/60 p-4 rounded-md space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-300">PHASE 03: Q3 2026</span>
                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">PLANNED</span>
              </div>
              <div className="text-sm font-semibold text-white">Multi-Agent Swarm Protocol</div>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                <li>P2P Agent-to-Agent Consensus</li>
                <li>Collaborative DeFi Liquidity Swarms</li>
                <li>Dynamic Cross-Chain Bridging</li>
                <li>Autonomous Risk Balancing</li>
              </ul>
            </div>

            {/* Phase 04 */}
            <div className="border border-purple-500/30 bg-black/60 p-4 rounded-md space-y-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400">PHASE 04: DEC 2026</span>
                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">FINAL CONVERGENCE</span>
              </div>
              <div className="text-sm font-semibold text-white">zkML & Autonomous Proofs</div>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside">
                <li>Zero-Knowledge Agent Proofs</li>
                <li>Verifiable On-Chain Execution</li>
                <li>Hyper-Agent Autonomous Settlement</li>
                <li>+ Phase 05 / 2027+ Expansion</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
