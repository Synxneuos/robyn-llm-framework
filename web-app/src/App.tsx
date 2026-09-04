import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import StatusBar from '../components/StatusBar'
import FrameworkHero from '../components/FrameworkHero'
import EcosystemVisualizer from '../components/EcosystemVisualizer'
import TerminalSection from '../components/TerminalSection'
import FrameworkArchitecture from '../components/FrameworkArchitecture'
import CharacterStudio from '../components/CharacterStudio'
import FrameworkModules from '../components/FrameworkModules'
import ModelSpotlight from '../components/ModelSpotlight'
import DeveloperSDK from '../components/DeveloperSDK'
import GitHubCTA from '../components/GitHubCTA'
import Footer from '../components/Footer'
import RobynVaultProtocol from '../components/RobynVaultProtocol'

export default function App() {
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [gasPriceGwei, setGasPriceGwei] = useState<string>('0.36')
  const [currentView, setCurrentView] = useState<'main' | 'vault'>('main')

  // Check URL hash and query params for hidden vault view
  useEffect(() => {
    const handleUrlChange = () => {
      const hash = window.location.hash
      const params = new URLSearchParams(window.location.search)
      if (hash === '#vault' || params.get('view') === 'vault' || params.get('vault') === 'true') {
        setCurrentView('vault')
      } else {
        setCurrentView('main')
      }
    }

    handleUrlChange()
    window.addEventListener('hashchange', handleUrlChange)
    window.addEventListener('popstate', handleUrlChange)
    return () => {
      window.removeEventListener('hashchange', handleUrlChange)
      window.removeEventListener('popstate', handleUrlChange)
    }
  }, [])

  const setView = (view: 'main' | 'vault') => {
    setCurrentView(view)
    if (view === 'vault') {
      window.location.hash = '#vault'
    } else {
      window.location.hash = ''
    }
  }

  // Real on-chain telemetry polling from Robinhood RPC
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

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // If in hidden vault mode, render the RobynVaultProtocol page
  if (currentView === 'vault') {
    return <RobynVaultProtocol onBackToMain={() => setView('main')} />
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#000000] text-[#E2E8F0] selection:bg-[#00C805] selection:text-black relative tech-grid-bg">
      {/* 1. Header */}
      <Header onNavigate={scrollToSection} />

      {/* 2. System Status Bar */}
      <StatusBar blockNumber={blockNumber} gasPriceGwei={gasPriceGwei} />

      {/* 3. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full space-y-16 flex-1">
        <FrameworkHero onExplore={() => scrollToSection('visualizer')} />
        <EcosystemVisualizer />
        <TerminalSection />
        <FrameworkArchitecture />
        <CharacterStudio />
        <FrameworkModules />
        <ModelSpotlight />
        <DeveloperSDK />
        <GitHubCTA />
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  )
}
