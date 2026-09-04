'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import dynamic from 'next/dynamic'

const VaultDashboard = dynamic(() => import('../components/VaultDashboard'), { ssr: false })

export default function Home() {
  const { isConnected, address } = useAccount()

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-black text-sm">R</div>
            <div>
              <h1 className="font-bold text-white leading-none">Robyn Vault</h1>
              <p className="text-xs text-gray-500">Robinhood Chain · ID 4663</p>
            </div>
          </div>
          <ConnectButton
            showBalance={true}
            chainStatus="icon"
            accountStatus="address"
          />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1 text-green-400 text-sm font-medium mb-4">
            ✦ Live on Robinhood Chain · 100ms Blocks · 0.4 Gwei Gas
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Lock Tokens.<br />
            <span className="text-green-400">Earn Wall Street.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Bridge TradFi equity collateral with DeFi liquidity. Lock ETH to receive real NVDA stock collateral backing and streaming dividend rewards on Robinhood Chain.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            '🏦 $1.4M NVDA Treasury',
            '📈 11,445 Real Shares',
            '💵 $46,920 Dividends Streamed',
            '⚡ 100ms Settlement',
            '🔗 MetaMask + Phantom',
          ].map((f) => (
            <span key={f} className="card-bg px-4 py-2 rounded-full text-sm text-gray-300">
              {f}
            </span>
          ))}
        </div>

        {/* Main Content */}
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="card-bg rounded-2xl p-12 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Connect Your Wallet</h3>
              <p className="text-gray-400 text-sm mb-6">
                Connect MetaMask or Phantom to start locking tokens and earning real stock dividends on Robinhood Chain.
              </p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          </div>
        ) : (
          <VaultDashboard />
        )}

        {/* How It Works */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '🔒',
              title: 'Lock ETH',
              desc: 'Lock ETH for 7–365 days. Longer locks earn higher multipliers (up to 2.5x shares).',
            },
            {
              icon: '📊',
              title: 'Get Stock Backing',
              desc: 'Your share of the vault is backed by real NVDA stock held in the treasury. Collateral is proportional to your pool share.',
            },
            {
              icon: '💰',
              title: 'Claim Dividends',
              desc: 'Earn 4.8–12% APY in streaming stock dividends. Claim anytime to your wallet on Robinhood Chain.',
            },
          ].map((item) => (
            <div key={item.title} className="card-bg rounded-xl p-6">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="font-bold text-white mb-2">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-16 py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>Robyn Collateral Vault · Built on Robinhood Chain</p>
          <div className="flex gap-4">
            <a href="https://robinhoodchain.blockscout.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Explorer</a>
            <a href="https://github.com/robynhood-fw/robyn-llm-framework" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://rpc.mainnet.chain.robinhood.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">RPC</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
