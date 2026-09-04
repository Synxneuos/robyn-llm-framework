import React, { useState, useEffect } from 'react'
import FrameworkHero from '../components/FrameworkHero'
import CharacterStudio from '../components/CharacterStudio'
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
    <div className="min-h-screen flex flex-col justify-between bg-[#000000] text-white selection:bg-[#00C805] selection:text-black relative">
      {/* Background Cyberpunk Matrix Grid */}
      <div className="fixed inset-0 bg-[radial-gradient(#122616_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none z-0" />

      {/* 1. ElizaOS Cyberpunk Top Navigation Bar */}
      <header className="border-b border-white/10 backdrop-blur-2xl sticky top-0 z-50 bg-[#000000]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            {/* Strictly using the updated Green Neon Anime Logo */}
            <div className="w-10 h-10 rounded-xl border border-[#00C805]/40 p-0.5 bg-black shadow-lg shadow-[#00C805]/20 overflow-hidden group-hover:border-[#00C805] transition">
              <img
                src="/robyn_logo.png"
                alt="Robyn OS Official Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono font-black text-white text-base sm:text-lg tracking-tight leading-none">
                  Robyn OS <span className="text-[#00C805] font-extrabold">- FW</span>
                </h1>
                <span className="font-mono bg-[#00C805]/15 text-[#00C805] text-[10px] font-extrabold px-2 py-0.5 rounded border border-[#00C805]/30 tracking-wider">
                  [ v1.0.0-PROD ]
                </span>
              </div>
              <p className="font-mono text-[10px] text-gray-400 font-medium hidden sm:block">
                Autonomous Multi-Agent OS · Robinhood Chain (Arbitrum Orbit)
              </p>
            </div>
          </div>

          {/* Nav Links & Actions */}
          <div className="flex items-center gap-5">
            <nav className="hidden lg:flex items-center gap-6 font-mono text-xs text-gray-300">
              <button
                type="button"
                onClick={() => scrollToSection('character-studio')}
                className="hover:text-[#00C805] transition"
              >
                // Studio
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('plugins')}
                className="hover:text-[#00C805] transition"
              >
                // Plugins
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('architecture')}
                className="hover:text-[#00C805] transition"
              >
                // Pipeline
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('model')}
                className="hover:text-[#00C805] transition"
              >
                // Model (HF)
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('sdk')}
                className="hover:text-[#00C805] transition"
              >
                // SDK
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/robynhood-fw/robyn-llm-framework"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs bg-black/80 hover:bg-white/10 text-white border border-[#00C805]/40 hover:border-[#00C805] px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-sm shadow-[#00C805]/20"
              >
                <span>⭐ GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Live Chain Telemetry Ticker Bar */}
        <div className="bg-black/95 border-t border-white/5 py-1.5 px-4 overflow-x-auto text-[11px] font-mono text-gray-400 flex items-center justify-between gap-6 whitespace-nowrap">
          <div className="flex items-center gap-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00C805] animate-ping" />
              <span className="text-white font-bold">ROBINHOOD CHAIN MAINNET</span>
            </div>
            <span>|</span>
            <div>
              Block:{' '}
              <span className="text-[#00C805] font-bold">
                #{blockNumber ? blockNumber.toLocaleString() : '54,440,747'}
              </span>
            </div>
            <span>|</span>
            <div>
              Gas:{' '}
              <span className="text-white font-semibold">
                {gasPriceGwei} Gwei
              </span>
            </div>
            <span>|</span>
            <div>
              Latency Engine:{' '}
              <span className="text-[#00C805] font-semibold">100ms Nitro Orbit</span>
            </div>
            <span>|</span>
            <div>
              AI Core:{' '}
              <span className="text-white">Robyn-Agent (0.5B Hermes)</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Body Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-16 flex-1 w-full">
        {/* ElizaOS-Grade Hero with 3-Step Quickstart */}
        <FrameworkHero />

        {/* ElizaOS Signature Character Studio & Execution Stream */}
        <CharacterStudio />

        {/* Modular Plugin Ecosystem */}
        <FrameworkModules />

        {/* 4-Stage Autonomous Pipeline */}
        <FrameworkArchitecture />

        {/* Neural Core / Model Spotlight */}
        <ModelSpotlight />

        {/* Developer SDK */}
        <DeveloperSDK />
      </main>

      {/* 3. Cyberpunk Minimalist Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#020406] py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8 font-mono text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-[#00C805]/40 p-0.5 bg-black overflow-hidden">
              <img
                src="/robyn_logo.png"
                alt="Robyn Logo"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div>
              <span className="font-bold text-white text-sm">Robyn OS - FW</span>
              <p className="text-[10px] text-gray-500">Autonomous Multi-Agent AI Framework on Robinhood Chain</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium text-xs">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 mt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-gray-500">
          <div>© 2026 Robyn OS Framework · Apache-2.0 License</div>
          <div className="text-[#00C805]">Engineered for Sub-100ms Arbitrum Orbit</div>
        </div>
      </footer>
    </div>
  )
}
