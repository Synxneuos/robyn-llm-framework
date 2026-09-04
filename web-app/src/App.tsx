import React, { useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import FrameworkHero from '../components/FrameworkHero'
import FrameworkArchitecture from '../components/FrameworkArchitecture'
import FrameworkModules from '../components/FrameworkModules'
import DeveloperSDK from '../components/DeveloperSDK'
import DocsPage from '../components/DocsPage'

export default function App() {
  const [currentView, setCurrentView] = useState<'app' | 'docs'>('app')

  const scrollToSection = (id: string) => {
    setCurrentView('app')
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#000000] text-white selection:bg-[#00C805] selection:text-black">
      {/* Sleek Robinhood Top Navigation Bar */}
      <header className="border-b border-white/10 backdrop-blur-xl sticky top-0 z-50 bg-[#000000]/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div
            onClick={() => setCurrentView('app')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            {/* Robinhood Feather Emblem */}
            <div className="w-9 h-9 rounded-xl bg-[#00C805] flex items-center justify-center p-2 shadow-lg shadow-[#00C805]/25">
              <svg className="w-full h-full text-black fill-current" viewBox="0 0 24 24">
                <path d="M12 2L4 10h5v10h6V10h5L12 2z" />
              </svg>
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
                Autonomous AI OS for Robinhood Chain (100ms Orbit Nitro)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-gray-300">
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
                onClick={() => scrollToSection('sdk')}
                className="hover:text-[#00C805] transition"
              >
                Developer SDK
              </button>
              <a
                href="https://huggingface.co/robynhooood/Robyn-Agent"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00C805] transition"
              >
                Model (0.5B)
              </a>
              <button
                type="button"
                onClick={() => setCurrentView(currentView === 'docs' ? 'app' : 'docs')}
                className={`transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                  currentView === 'docs'
                    ? 'border-[#00C805] bg-[#00C805]/15 text-[#00C805] font-bold'
                    : 'border-white/10 hover:border-[#00C805]/40 text-gray-300'
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

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-16">
        {currentView === 'docs' ? (
          <DocsPage onBackToApp={() => setCurrentView('app')} />
        ) : (
          <>
            {/* Hero Banner */}
            <FrameworkHero onOpenDocs={() => setCurrentView('docs')} />

            {/* Architecture Pipeline */}
            <FrameworkArchitecture />

            {/* 5 Core AI Framework Modules */}
            <FrameworkModules />

            {/* Developer Python SDK & Contracts */}
            <DeveloperSDK />
          </>
        )}
      </main>

      {/* Sleek Robinhood Minimalist Footer */}
      <footer className="border-t border-white/10 bg-[#060709] py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#00C805] flex items-center justify-center p-1">
              <svg className="w-full h-full text-black fill-current" viewBox="0 0 24 24">
                <path d="M12 2L4 10h5v10h6V10h5L12 2z" />
              </svg>
            </div>
            <span className="font-bold text-white">Robyn OS - FW</span>
            <span>· Open-Source Autonomous AI Engine on Robinhood Chain</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={() => setCurrentView('docs')}
              className="text-[#00C805] hover:underline font-semibold"
            >
              Documentation
            </button>
            <a
              href="https://github.com/robynhood-fw/robyn-llm-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00C805] transition"
            >
              GitHub Framework
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
              RPC Endpoint
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
