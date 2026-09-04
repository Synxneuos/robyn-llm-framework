import React, { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId } from 'wagmi'
import VaultDashboard from '../components/VaultDashboard'

export default function App() {
  const { isConnected, address } = useAccount()
  const chainId = useChainId()
  const [blockNumber, setBlockNumber] = useState<number | null>(null)
  const [gasPriceGwei, setGasPriceGwei] = useState<string>('0.38')

  useEffect(() => {
    // Fetch real live block number and gas price from Robinhood RPC
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
    const interval = setInterval(fetchRpcStats, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-green-500 selection:text-black">
      {/* Top Telemetry Ticker */}
      <div className="bg-emerald-950/60 border-b border-emerald-500/20 text-xs py-1.5 px-4 text-emerald-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold tracking-wide">ROBINHOOD CHAIN MAINNET (ID: 4663)</span>
          <span className="text-emerald-500/50">|</span>
          <span>Block: {blockNumber ? `#${blockNumber.toLocaleString()}` : 'Connecting...'}</span>
          <span className="text-emerald-500/50">|</span>
          <span>Gas: {gasPriceGwei} Gwei</span>
          <span className="text-emerald-500/50">|</span>
          <span>Speed: 100ms Blocktime (Nitro L2)</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://robinhoodchain.blockscout.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1 text-emerald-300"
          >
            Blockscout Explorer ↗
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#050814]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center font-black text-black text-xl shadow-lg shadow-green-500/20">
              R
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white text-lg tracking-tight">Robyn Collateral Vault</h1>
                <span className="bg-green-500/20 text-green-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-green-500/30">
                  TradFi Bridge
                </span>
              </div>
              <p className="text-xs text-gray-400">Equity Collateral · Streaming Dividends</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ConnectButton
              showBalance={{ smallScreen: false, largeScreen: true }}
              chainStatus="icon"
              accountStatus="full"
            />
          </div>
        </div>
      </header>

      {/* Hero & App Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 via-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-full px-4 py-1.5 text-green-400 text-xs font-semibold mb-4 tracking-wide shadow-sm">
            <span>Wall Street Equity Meets On-Chain Liquidity</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Lock On-Chain Liquidity.<br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
              Earn Real US Equity Collateral.
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            Bridging TradFi equity collateral with degen liquidity on Robinhood Chain. Lock ETH or meme tokens into the autonomous collateral pool to back your position with <strong className="text-white">$NVDA</strong> shares and claim streaming Wall Street cash dividends.
          </p>
        </div>

        {/* Feature Stats Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
          <div className="card-bg p-3.5 rounded-xl border border-white/10 text-center">
            <div className="text-xs text-gray-400 uppercase font-semibold">Treasury Backing</div>
            <div className="text-xl font-bold text-white mt-0.5">$1,425,000</div>
            <div className="text-[11px] text-green-400 font-medium">11,445 Real NVDA Shares</div>
          </div>
          <div className="card-bg p-3.5 rounded-xl border border-white/10 text-center">
            <div className="text-xs text-gray-400 uppercase font-semibold">Dividends Streamed</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">$46,920</div>
            <div className="text-[11px] text-gray-400">Quarterly Equity Yield</div>
          </div>
          <div className="card-bg p-3.5 rounded-xl border border-white/10 text-center">
            <div className="text-xs text-gray-400 uppercase font-semibold">Max Lock APY</div>
            <div className="text-xl font-bold text-green-400 mt-0.5">12.0%</div>
            <div className="text-[11px] text-gray-400">2.5x Duration Multiplier</div>
          </div>
          <div className="card-bg p-3.5 rounded-xl border border-white/10 text-center">
            <div className="text-xs text-gray-400 uppercase font-semibold">Block Time</div>
            <div className="text-xl font-bold text-white mt-0.5">100 ms</div>
            <div className="text-[11px] text-emerald-400 font-medium">Robinhood Nitro L2</div>
          </div>
        </div>

        {/* Wallet Connection Gate */}
        {!isConnected ? (
          <div className="card-bg rounded-2xl p-8 sm:p-12 max-w-xl mx-auto text-center border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner shadow-green-500/20">
              ⚡
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Connect Your Web3 Wallet</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
              Connect MetaMask, Phantom, Coinbase Wallet, or any WalletConnect app on Robinhood Chain to manage your collateral positions and claim dividends.
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-2 text-xs text-gray-400">
              <div>
                <span className="block font-bold text-white mb-1">🦊 MetaMask</span>
                Injected & Extension
              </div>
              <div>
                <span className="block font-bold text-white mb-1">👻 Phantom</span>
                Multi-chain EVM
              </div>
              <div>
                <span className="block font-bold text-white mb-1">🔗 WalletConnect</span>
                300+ Mobile Wallets
              </div>
            </div>
          </div>
        ) : (
          <VaultDashboard />
        )}

        {/* Architecture Flow */}
        <div className="mt-16 border-t border-white/10 pt-12">
          <h3 className="text-center font-bold text-xl text-white mb-8">
            How The Robyn TradFi Collateral Engine Operates
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card-bg p-6 rounded-xl border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold mb-4">
                1
              </div>
              <h4 className="font-bold text-white text-base mb-2">Lock Liquidity</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Stakers deposit ETH or Robinhood Chain tokens into the smart contract. Choose a duration tier (7 to 365 days) to earn up to 2.5x weighted shares in the treasury pool.
              </p>
            </div>

            <div className="card-bg p-6 rounded-xl border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 font-bold mb-4">
                2
              </div>
              <h4 className="font-bold text-white text-base mb-2">Autonomous Equity Backing</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Robyn Autonomous Agent periodically takes profits from algorithmic volume and acquires tokenized Wall Street stocks ($NVDA, $AAPL) held directly in the transparent on-chain treasury.
              </p>
            </div>

            <div className="card-bg p-6 rounded-xl border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold mb-4">
                3
              </div>
              <h4 className="font-bold text-white text-base mb-2">Streaming Dividends</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Quarterly dividends and yield generated by the equities are autonomously streamed into the vault contract. Users can claim their share directly to their wallet in real-time.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050814]/90 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>Robyn Collateral Vault · Robinhood Chain Mainnet (4663)</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://robinhoodchain.blockscout.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              Blockscout
            </a>
            <a
              href="https://rpc.mainnet.chain.robinhood.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              RPC Endpoint
            </a>
            <a
              href="https://github.com/robynhood-fw/robyn-llm-framework"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
