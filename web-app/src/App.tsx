import React, { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import HeroBanner from '../components/HeroBanner'
import DexScreenerTerminal from '../components/DexScreenerTerminal'
import CollateralCalculator from '../components/CollateralCalculator'
import VaultDashboard from '../components/VaultDashboard'

export default function App() {
  const { isConnected, address } = useAccount()
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [gasPriceGwei, setGasPriceGwei] = useState<string>('0.36')
  const [calcAmount, setCalcAmount] = useState<string>('')
  const [calcDuration, setCalcDuration] = useState<number>(30)

  // Fetch real on-chain block number & gas price from Robinhood RPC
  useEffect(() => {
    const fetchRpcStats = async () => {
      try {
        const res = await fetch('https://rpc.mainnet.chain.robinhood.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([
            { jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] },
            { jsonrpc: '2.0', id: 2, method: 'eth_gasPrice', params: [] },
          ]),
        })
        const data = await res.json()
        if (Array.isArray(data)) {
          const block = parseInt(data[0].result, 16)
          const gas = (parseInt(data[1].result, 16) / 1e9).toFixed(4)
          setBlockNumber(block)
          setGasPriceGwei(gas)
        }
      } catch (err) {
        console.warn('RPC poll error:', err)
      }
    }

    fetchRpcStats()
    const interval = setInterval(fetchRpcStats, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleApplyCalculator = (amount: string, days: number) => {
    setCalcAmount(amount)
    setCalcDuration(days)
    const el = document.getElementById('vault-actions')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#040608] text-white selection:bg-green-500 selection:text-black">
      {/* 1. Live Robinhood Nitro L2 Telemetry Ticker */}
      <div className="bg-[#020d04] border-b border-green-500/20 text-xs py-2 px-4 text-green-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="font-extrabold tracking-wider text-white">ROBYN OS - FW</span>
            <span className="text-green-500/40">|</span>
            <span className="font-semibold text-green-400">ROBINHOOD CHAIN (ID: 4663)</span>
            <span className="text-green-500/40">|</span>
            <span className="font-mono">Block: {blockNumber ? `#${blockNumber.toLocaleString()}` : 'Connecting RPC...'}</span>
            <span className="text-green-500/40">|</span>
            <span className="font-mono">Gas: {gasPriceGwei} Gwei</span>
            <span className="text-green-500/40 hidden md:inline">|</span>
            <span className="text-gray-300 hidden md:inline">Latency: <strong className="text-green-400">100ms Orbit Nitro</strong></span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://robinhoodchain.blockscout.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 flex items-center gap-1 font-semibold underline"
            >
              Blockscout Explorer ↗
            </a>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Bar */}
      <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 bg-[#040608]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Robinhood Feather Emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center p-2 shadow-lg shadow-green-500/30">
              <svg className="w-full h-full text-black fill-current" viewBox="0 0 24 24">
                <path d="M12 2L4 10h5v10h6V10h5L12 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-white text-xl tracking-tight leading-none">
                  Robyn OS <span className="text-green-400 font-extrabold">- FW</span>
                </h1>
                <span className="bg-green-500/20 text-green-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-green-500/40 tracking-wider">
                  OFFICIAL
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">
                Wall Street Collateral · Algorithmic AI Agency
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-300">
              <a href="#vault-actions" className="hover:text-green-400 transition">Staking Vault</a>
              <a href="#dex-terminal" className="hover:text-green-400 transition">$ROBYN DexScreener</a>
              <a href="#calculator" className="hover:text-green-400 transition">Calculator</a>
              <a href="#architecture" className="hover:text-green-400 transition">Ecosystem</a>
            </nav>
            <ConnectButton
              showBalance={{ smallScreen: false, largeScreen: true }}
              chainStatus="icon"
              accountStatus="full"
            />
          </div>
        </div>
      </header>

      {/* 3. Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-12">
        {/* Hero Section */}
        <HeroBanner />

        {/* DexScreener Live Terminal Section */}
        <section id="dex-terminal">
          <DexScreenerTerminal />
        </section>

        {/* Collateral & Yield Calculator */}
        <section id="calculator">
          <CollateralCalculator onSelectAmount={handleApplyCalculator} />
        </section>

        {/* Live Staking & Dividend Vault */}
        <section>
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Robyn Autonomous Collateral Vault
              </h2>
              <p className="text-xs text-gray-400">
                Lock principal to mint weighted shares, secure $NVDA backing, and claim streaming stock dividends
              </p>
            </div>
            {!isConnected && (
              <span className="text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-lg">
                💡 Connect MetaMask or Phantom to execute on-chain
              </span>
            )}
          </div>
          <VaultDashboard presetAmount={calcAmount} presetDuration={calcDuration} />
        </section>

        {/* Architecture & 5 Breakthrough Modules Showcase */}
        <section id="architecture" className="border-t border-white/10 pt-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Autonomous Agency
            </span>
            <h3 className="text-3xl font-black text-white tracking-tight mt-3">
              The Robyn OS - FW Architectural Engine
            </h3>
            <p className="text-gray-400 text-sm mt-2">
              Engineered natively for Robinhood Chain Arbitrum Orbit with 100ms sub-second latency and zero gas overhead.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-gradient-to-b from-black/80 to-[#050b06] border border-green-500/25 p-6 shadow-lg backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 font-bold mb-4">
                ⚡
              </div>
              <h4 className="font-extrabold text-white text-base mb-2">HyperSpeed Engine (&lt;100ms)</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Faster execution than Solana. Leverages direct Arbitrum Nitro WebSocket feeds with pre-compiled bytecode routing for instant sub-second transactions.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-black/80 to-[#050b06] border border-green-500/25 p-6 shadow-lg backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 font-bold mb-4">
                🏛️
              </div>
              <h4 className="font-extrabold text-white text-base mb-2">TradFi Equity Hedging</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Autonomously converts degen meme profits into tokenized US equities ($NVDA, $AAPL) held directly in transparent on-chain custody.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-b from-black/80 to-[#050b06] border border-green-500/25 p-6 shadow-lg backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 font-bold mb-4">
                💎
              </div>
              <h4 className="font-extrabold text-white text-base mb-2">CLM Auto-Yield Vault</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Concentrated Liquidity Manager automatically rebalances tick ranges around Robinhood orderbook volume, maximizing fee yields for stakers.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-white/10 bg-[#020503] py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center p-1">
              <svg className="w-full h-full text-black fill-current" viewBox="0 0 24 24">
                <path d="M12 2L4 10h5v10h6V10h5L12 2z" />
              </svg>
            </div>
            <span className="font-bold text-white">Robyn OS - FW</span>
            <span>· Built on Robinhood Chain (Arbitrum Orbit)</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://robinhoodchain.blockscout.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition"
            >
              Blockscout
            </a>
            <a
              href="https://rpc.mainnet.chain.robinhood.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition"
            >
              RPC Endpoint
            </a>
            <a
              href="https://github.com/robynhood-fw/robyn-llm-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition"
            >
              GitHub (Robyn FW)
            </a>
            <a
              href="https://huggingface.co/robynhooood/Robyn-Agent"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition"
            >
              Hugging Face Model
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
