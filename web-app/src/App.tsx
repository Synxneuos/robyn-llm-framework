import React, { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import HeroBanner from '../components/HeroBanner'
import TokenomicsSimulator from '../components/TokenomicsSimulator'
import VaultDashboard from '../components/VaultDashboard'
import DocsPage from '../components/DocsPage'

export default function App() {
  const { isConnected } = useAccount()
  const [currentView, setCurrentView] = useState<'app' | 'docs'>('app')

  const scrollToSection = (id: string) => {
    setCurrentView('app')
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#040608] text-white selection:bg-green-500 selection:text-black">
      {/* Sleek Robinhood Navigation Bar */}
      <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 bg-[#040608]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div
            onClick={() => setCurrentView('app')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            {/* Robinhood Feather Emblem */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center p-2 shadow-lg shadow-green-500/20">
              <svg className="w-full h-full text-black fill-current" viewBox="0 0 24 24">
                <path d="M12 2L4 10h5v10h6V10h5L12 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-white text-lg sm:text-xl tracking-tight leading-none">
                  Robyn OS <span className="text-green-400 font-extrabold">- FW</span>
                </h1>
                <span className="hidden sm:inline-block bg-green-500/15 text-green-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-green-500/30 tracking-wider">
                  ROBINHOOD CHAIN
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium hidden sm:block">
                TradFi Collateral Escrow · 100ms Arbitrum Orbit Nitro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-gray-300">
              <button
                type="button"
                onClick={() => scrollToSection('vault-actions')}
                className="hover:text-green-400 transition"
              >
                Collateral Vault
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('tokenomics-sim')}
                className="hover:text-green-400 transition"
              >
                1B Tokenomics
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('architecture')}
                className="hover:text-green-400 transition"
              >
                Architecture
              </button>
              <button
                type="button"
                onClick={() => setCurrentView(currentView === 'docs' ? 'app' : 'docs')}
                className={`transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                  currentView === 'docs'
                    ? 'border-green-400 bg-green-500/15 text-green-400 font-bold'
                    : 'border-white/10 hover:border-green-500/40 text-gray-300'
                }`}
              >
                <span>{currentView === 'docs' ? '← Back to App' : 'Documentation'}</span>
              </button>
            </nav>

            <ConnectButton
              showBalance={{ smallScreen: false, largeScreen: true }}
              chainStatus="icon"
              accountStatus="full"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-12">
        {currentView === 'docs' ? (
          <DocsPage onBackToApp={() => setCurrentView('app')} />
        ) : (
          <>
            {/* Clean Hero Banner */}
            <HeroBanner />

            {/* Transparent 1B Tokenomics & Collateral Math Simulator */}
            <section id="tokenomics-sim">
              <TokenomicsSimulator />
            </section>

            {/* Live On-Chain Staking & Dividend Vault */}
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
              <VaultDashboard />
            </section>

            {/* Architecture & Breakthrough Modules Showcase */}
            <section id="architecture" className="border-t border-white/10 pt-12">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Robyn Ecosystem Engine
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
          </>
        )}
      </main>

      {/* Sleek Minimalist Footer */}
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
            <button
              onClick={() => setCurrentView('docs')}
              className="text-green-400 hover:underline font-semibold"
            >
              Documentation
            </button>
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
              GitHub
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
