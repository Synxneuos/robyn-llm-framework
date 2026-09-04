import React, { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import FrameworkHero from '../components/FrameworkHero'
import FrameworkArchitecture from '../components/FrameworkArchitecture'
import FrameworkModules from '../components/FrameworkModules'
import ModelSpotlight from '../components/ModelSpotlight'
import DeveloperSDK from '../components/DeveloperSDK'

export default function App() {
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [gasPriceGwei, setGasPriceGwei] = useState<string>('0.36')

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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#000000] text-white selection:bg-[#00C805] selection:text-black">
      {/* 1. Sleek Robinhood Top Navigation Bar */}
      <header className="border-b border-white/10 backdrop-blur-2xl sticky top-0 z-50 bg-[#000000]/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl border border-[#00C805]/40 p-0.5 bg-black shadow-lg shadow-[#00C805]/20 overflow-hidden group-hover:border-[#00C805] transition">
              <img
                src="/robyn_logo.png"
                alt="Robyn OS Official Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-white text-lg sm:text-xl tracking-tight leading-none">
                  Robyn OS <span className="text-[#00C805] font-extrabold">- FW</span>
                </h1>
                <span className="bg-[#00C805]/15 text-[#00C805] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#00C805]/30 tracking-wider">
                  AI FRAMEWORK
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium hidden sm:block">
                Autonomous AI OS for Robinhood Chain (Arbitrum Orbit)
              </p>
            </div>
          </div>

          {/* Nav Links & Actions */}
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-300">
              <button
                type="button"
                onClick={() => scrollToSection('architecture')}
                className="hover:text-[#00C805] transition"
              >
                Architecture
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('modules')}
                className="hover:text-[#00C805] transition"
              >
                5 AI Modules
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('model')}
                className="hover:text-[#00C805] transition"
              >
                Model (0.5B)
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('sdk')}
                className="hover:text-[#00C805] transition"
              >
                Developer SDK
              </button>
            </nav>

            <div className="flex items-center gap-2.5">
              <a
                href="https://github.com/robynhood-fw/robyn-llm-framework"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/15 px-3.5 py-2 rounded-xl text-xs font-bold transition"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </a>

              <ConnectButton
                showBalance={{ smallScreen: false, largeScreen: true }}
                chainStatus="icon"
                accountStatus="avatar"
              />
            </div>
          </div>
        </div>
      </header>

      {/* 2. On-Chain Nitro Telemetry Ticker */}
      <div className="bg-[#050806] border-b border-white/10 text-xs py-2 px-4 text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C805] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C805]"></span>
            </span>
            <span className="font-bold text-white uppercase tracking-wider">ROBINHOOD CHAIN MAINNET</span>
            <span className="text-white/20">|</span>
            <span className="font-mono text-[#00C805]">Block {blockNumber ? `#${blockNumber.toLocaleString()}` : 'Connecting...'}</span>
            <span className="text-white/20">|</span>
            <span className="font-mono text-gray-300">Gas: {gasPriceGwei} Gwei</span>
            <span className="text-white/20 hidden md:inline">|</span>
            <span className="text-gray-300 hidden md:inline">Latency: <strong className="text-[#00C805]">100ms Nitro</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://robinhoodchain.blockscout.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00C805] transition flex items-center gap-1 font-semibold"
            >
              Blockscout Explorer ↗
            </a>
            <a
              href="https://rpc.mainnet.chain.robinhood.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#00C805] transition hidden sm:inline"
            >
              RPC Endpoint ↗
            </a>
          </div>
        </div>
      </div>

      {/* 3. Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full space-y-20">
        {/* Hero Section */}
        <FrameworkHero />

        {/* Core Architecture Pipeline */}
        <FrameworkArchitecture />

        {/* 5 Breakthrough AI Modules */}
        <FrameworkModules />

        {/* Neural Model Spotlight */}
        <ModelSpotlight />

        {/* Developer Python SDK & Contracts */}
        <DeveloperSDK />
      </main>

      {/* 4. Top-Tier Robinhood Minimalist Footer */}
      <footer className="border-t border-white/10 bg-[#050709] py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-[#00C805]/40 p-0.5 bg-black overflow-hidden">
              <img
                src="/robyn_logo.png"
                alt="Robyn Logo"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm">Robyn OS - FW</span>
              <p className="text-[10px] text-gray-500">Autonomous AI Framework on Robinhood Chain (Arbitrum Orbit)</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            <a
              href="https://github.com/robynhood-fw/robyn-llm-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00C805] transition"
            >
              GitHub Repository
            </a>
            <a
              href="https://huggingface.co/robynhooood/Robyn-Agent"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00C805] transition"
            >
              Hugging Face Model
            </a>
            <a
              href="https://robinhoodchain.blockscout.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00C805] transition"
            >
              Blockscout Explorer
            </a>
            <a
              href="https://rpc.mainnet.chain.robinhood.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00C805] transition"
            >
              Robinhood RPC
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
