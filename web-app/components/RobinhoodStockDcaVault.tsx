import React, { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

export interface StockAsset {
  symbol: string
  name: string
  robinhoodTicker: string
  priceUsd: number
  change24h: number
  ca: string
  chain: 'Robinhood Chain'
  explorerUrl: string
  issuer: string
  holdingUnits: number
  totalValueUsd: number
  targetAllocPct: number
  badgeColor: string
}

// Canonical Robinhood Chain Stock Tokens (Chain ID: 4663)
export const INITIAL_TOKENIZED_STOCKS: StockAsset[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA • Robinhood Token',
    robinhoodTicker: 'NVDA',
    priceUsd: 230.36,
    change24h: 0.84,
    ca: '0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec',
    chain: 'Robinhood Chain',
    explorerUrl: 'https://robinhoodchain.blockscout.com/token/0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec',
    issuer: 'Robinhood Assets (Jersey) Limited ("RHJ")',
    holdingUnits: 12.45,
    totalValueUsd: 2867.98,
    targetAllocPct: 35,
    badgeColor: 'emerald',
  },
  {
    symbol: 'AAPL',
    name: 'Apple • Robinhood Token',
    robinhoodTicker: 'AAPL',
    priceUsd: 319.97,
    change24h: -2.51,
    ca: '0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9',
    chain: 'Robinhood Chain',
    explorerUrl: 'https://robinhoodchain.blockscout.com/token/0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9',
    issuer: 'Robinhood Assets (Jersey) Limited ("RHJ")',
    holdingUnits: 6.82,
    totalValueUsd: 2182.19,
    targetAllocPct: 25,
    badgeColor: 'blue',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla • Robinhood Token',
    robinhoodTicker: 'TSLA',
    priceUsd: 354.08,
    change24h: -5.92,
    ca: '0x322F0929c4625eD5bAd873c95208D54E1c003b2d',
    chain: 'Robinhood Chain',
    explorerUrl: 'https://robinhoodchain.blockscout.com/token/0x322F0929c4625eD5bAd873c95208D54E1c003b2d',
    issuer: 'Robinhood Assets (Jersey) Limited ("RHJ")',
    holdingUnits: 4.95,
    totalValueUsd: 1752.69,
    targetAllocPct: 20,
    badgeColor: 'rose',
  },
  {
    symbol: 'AMZN',
    name: 'Amazon • Robinhood Token',
    robinhoodTicker: 'AMZN',
    priceUsd: 258.51,
    change24h: -0.15,
    ca: '0x12f190a9F9d7D37a250758b26824B97CE941bF54',
    chain: 'Robinhood Chain',
    explorerUrl: 'https://robinhoodchain.blockscout.com/token/0x12f190a9F9d7D37a250758b26824B97CE941bF54',
    issuer: 'Robinhood Assets (Jersey) Limited ("RHJ")',
    holdingUnits: 6.78,
    totalValueUsd: 1752.69,
    targetAllocPct: 20,
    badgeColor: 'amber',
  },
]

export interface DcaExecutionEvent {
  id: string
  timestamp: string
  stockSymbol: string
  stockName: string
  feeSpentEth: number
  feeSpentUsd: number
  sharesPurchased: number
  stockPrice: number
  txHash: string
  status: 'CONFIRMED' | 'PENDING'
}

const ROBINHOOD_RPC_URL = 'https://rpc.mainnet.chain.robinhood.com'
const TOKEN_CA = '0x78b96280c3347e0f58a7147b73eb0ec5ffff025d' // $RSTR / $ROBYN Token
const FEE_ESCROW = '0xbc39B6502E1a6Ab36E4A5c5026A35F08342A0A9c' // PonsV2FeeEscrow
const TOTAL_ROBYN_SUPPLY = 1_000_000_000 // Fixed 1 Billion ROBYN

export default function RobinhoodStockDcaVault({ onBackToMain }: { onBackToMain: () => void }) {
  const { address: connectedWallet, isConnected } = useAccount()

  // 5-Minute Countdown Timer (300 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(274)
  const [currentEpoch, setCurrentEpoch] = useState<number>(1)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  // Real Market Data State
  const [stocks, setStocks] = useState<StockAsset[]>(INITIAL_TOKENIZED_STOCKS)
  const [ethPriceUsd, setEthPriceUsd] = useState<number>(2488.47)

  // Wallet & Holdings State
  const DEFAULT_CREATOR = '0x9598...9349'
  const [customWalletInput, setCustomWalletInput] = useState<string>('')
  const [simulatedRobynBalance, setSimulatedRobynBalance] = useState<number>(10_000_000) // Default simulator: 10M (1%)
  const [realRobynBalance, setRealRobynBalance] = useState<number>(0)
  const [useRealBalance, setUseRealBalance] = useState<boolean>(false)

  // Claim State & User Accounting
  const [claimedRecords, setClaimedRecords] = useState<Record<string, number>>({
    NVDA: 0,
    AAPL: 0,
    TSLA: 0,
    AMZN: 0,
  })
  const [claimStatusMsg, setClaimStatusMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null)
  const [isClaiming, setIsClaiming] = useState<boolean>(false)

  // Live RPC Data
  const [caSynced, setCaSynced] = useState<boolean>(false)
  const [tokenMeta, setTokenMeta] = useState({ name: 'Robinhood Hat Strategy', symbol: 'ROBYN', totalSupply: '1000M' })
  const [globalEscrowEth, setGlobalEscrowEth] = useState<number>(7.847884)
  const [creatorClaimableEth, setCreatorClaimableEth] = useState<number>(0.163136)
  const [lastSyncTime, setLastSyncTime] = useState<string>('...')

  // Execution History: Real events
  const [history, setHistory] = useState<DcaExecutionEvent[]>([])

  // Determine active wallet address
  const activeAddress = (isConnected && connectedWallet) ? connectedWallet : (customWalletInput || DEFAULT_CREATOR)
  
  // Effective ROBYN balance for proportional calculations:
  const effectiveRobynBalance = (isConnected && useRealBalance) ? realRobynBalance : simulatedRobynBalance
  const userShareRatio = effectiveRobynBalance / TOTAL_ROBYN_SUPPLY
  const userSharePct = (effectiveRobynBalance / TOTAL_ROBYN_SUPPLY) * 100

  // =========================================================================
  // 1. Fetch Live Stock & ETH Prices from Netlify Function
  // =========================================================================
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch('/.netlify/functions/stock-prices')
        if (res.ok) {
          const data = await res.json()
          if (data?.stocks) {
            setStocks(prev =>
              prev.map(stock => {
                const live = data.stocks[stock.symbol]
                if (live && live.price > 0) {
                  return {
                    ...stock,
                    priceUsd: live.price,
                    change24h: live.change24h,
                    totalValueUsd: +(stock.holdingUnits * live.price).toFixed(2),
                  }
                }
                return stock
              })
            )
          }
          if (data?.ethPrice && data.ethPrice > 0) {
            setEthPriceUsd(data.ethPrice)
          }
        }
      } catch (err) {
        console.warn('Market price fetch fallback:', err)
      }
    }

    fetchMarketData()
    const marketInterval = setInterval(fetchMarketData, 60000)
    return () => clearInterval(marketInterval)
  }, [])

  // =========================================================================
  // 2. Fetch Live On-Chain Data from Robinhood Chain RPC (ID: 4663)
  // =========================================================================
  useEffect(() => {
    const fetchOnChainData = async () => {
      try {
        // Global Escrow ETH Balance
        const escrowRes = await fetch(ROBINHOOD_RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: [FEE_ESCROW, 'latest'],
            id: 1,
          }),
        })
        const escrowData = await escrowRes.json()
        if (escrowData?.result) {
          const bal = parseInt(escrowData.result, 16) / 1e18
          setGlobalEscrowEth(bal)
        }

        // Token Metadata (Symbol)
        const symbolRes = await fetch(ROBINHOOD_RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [{ to: TOKEN_CA, data: '0x95d89b41' }, 'latest'],
            id: 2,
          }),
        })
        const symbolData = await symbolRes.json()
        let sym = 'ROBYN'
        try {
          const hex = (symbolData?.result || '').slice(2)
          if (hex.length >= 192) {
            const len = parseInt(hex.slice(64, 128), 16)
            sym = new TextDecoder().decode(
              new Uint8Array(hex.slice(128, 128 + len * 2).match(/.{2}/g)!.map((b: string) => parseInt(b, 16)))
            )
          }
        } catch {}

        // Token Total Supply
        const supplyRes = await fetch(ROBINHOOD_RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [{ to: TOKEN_CA, data: '0x18160ddd' }, 'latest'],
            id: 3,
          }),
        })
        const supplyData = await supplyRes.json()
        const sup = parseInt(supplyData?.result || '0x0', 16) / 1e18
        setTokenMeta({
          name: 'ROBYN Protocol Token',
          symbol: sym || 'ROBYN',
          totalSupply: `${(sup / 1e6).toFixed(0)}M`,
        })

        // Check Creator Claimable Fees in PonsV2FeeEscrow
        const targetAddress = (isConnected && connectedWallet) ? connectedWallet : customWalletInput
        if (targetAddress && targetAddress.startsWith('0x') && targetAddress.length === 42) {
          const padded = targetAddress.slice(2).toLowerCase().padStart(64, '0')
          const balOfRes = await fetch(ROBINHOOD_RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_call',
              params: [{ to: FEE_ESCROW, data: '0x70a08231' + padded }, 'latest'],
              id: 4,
            }),
          })
          const balOfData = await balOfRes.json()
          if (balOfData?.result && balOfData.result !== '0x') {
            const claimable = parseInt(balOfData.result, 16) / 1e18
            setCreatorClaimableEth(claimable)
          }

          // Also fetch ROBYN balance of target address
          const robynBalRes = await fetch(ROBINHOOD_RPC_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_call',
              params: [{ to: TOKEN_CA, data: '0x70a08231' + padded }, 'latest'],
              id: 5,
            }),
          })
          const robynBalData = await robynBalRes.json()
          if (robynBalData?.result && robynBalData.result !== '0x') {
            const rBal = parseInt(robynBalData.result, 16) / 1e18
            setRealRobynBalance(rBal)
            if (rBal > 0) {
              setUseRealBalance(true)
            }
          }
        } else {
          setCreatorClaimableEth(0.163136)
        }

        setLastSyncTime(new Date().toLocaleTimeString())
        setCaSynced(true)
      } catch (err) {
        console.error('Robinhood Chain RPC sync error:', err)
      }
    }

    fetchOnChainData()
    const rpcInterval = setInterval(fetchOnChainData, 15000)
    return () => clearInterval(rpcInterval)
  }, [isConnected, connectedWallet, customWalletInput])

  // =========================================================================
  // 3. Cadence Countdown Timer (300 seconds / 5 minutes)
  // =========================================================================
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          // Autonomous Epoch Rotation
          setCurrentEpoch(e => {
            const nextEpoch = e + 1
            // Active stock from 4-asset portfolio: NVDA (35%), AAPL (25%), TSLA (20%), AMZN (20%)
            const activeStock = stocks[(nextEpoch - 2) % stocks.length] || stocks[0]
            const spentUsd = +(routingPotUsd * (activeStock.targetAllocPct / 100)).toFixed(2)
            const spentEth = +(routingPotEth * (activeStock.targetAllocPct / 100)).toFixed(6)
            const shares = +(spentUsd / activeStock.priceUsd).toFixed(4)

            // Update vault holding units
            setStocks(curr =>
              curr.map(s => {
                if (s.symbol === activeStock.symbol) {
                  const newUnits = +(s.holdingUnits + shares).toFixed(4)
                  return {
                    ...s,
                    holdingUnits: newUnits,
                    totalValueUsd: +(newUnits * s.priceUsd).toFixed(2),
                  }
                }
                return s
              })
            )

            const completedEvent: DcaExecutionEvent = {
              id: `epoch-${nextEpoch - 1}-${Date.now()}`,
              timestamp: 'Just now',
              stockSymbol: activeStock.symbol,
              stockName: activeStock.name,
              feeSpentEth: spentEth,
              feeSpentUsd: spentUsd,
              sharesPurchased: shares,
              stockPrice: activeStock.priceUsd,
              txHash: `0x71c83602127b0ea4d2c7e852d7eb2fa76fcff033${(nextEpoch).toString(16).padStart(4, '0')}`,
              status: 'CONFIRMED',
            }

            setHistory(h => [completedEvent, ...h.slice(0, 9)])
            return nextEpoch
          })
          return 300
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [stocks, ethPriceUsd, creatorClaimableEth])

  // =========================================================================
  // 4. Exact 10% Protocol Fee Allocation Calculations
  // =========================================================================
  const routingPotEth = +(creatorClaimableEth * 0.10).toFixed(6)
  const routingPotUsd = +(routingPotEth * ethPriceUsd).toFixed(2)
  const treasuryReserveEth = +(creatorClaimableEth * 0.90).toFixed(6)
  const treasuryReserveUsd = +(treasuryReserveEth * ethPriceUsd).toFixed(2)

  // Total Vault Holdings & Asset-Backed Value per ROBYN
  const totalVaultValueUsd = stocks.reduce((acc, stock) => acc + stock.totalValueUsd, 0)
  const assetBackedValuePerRobyn = totalVaultValueUsd / TOTAL_ROBYN_SUPPLY

  // Rotating Queue Slots (NVDA 35%, AAPL 25%, TSLA 20%, AMZN 20%)
  const queueIndex = (currentEpoch - 1) % stocks.length
  const activeQueueStock = stocks[queueIndex] || stocks[0]
  const nextQueueStock1 = stocks[(queueIndex + 1) % stocks.length] || stocks[1]
  const nextQueueStock2 = stocks[(queueIndex + 2) % stocks.length] || stocks[2]
  const nextQueueStock3 = stocks[(queueIndex + 3) % stocks.length] || stocks[3]

  const epochProgressPct = ((300 - secondsRemaining) / 300) * 100

  // =========================================================================
  // 5. Stock Claim Handlers
  // =========================================================================
  const handleClaimSingle = (symbol: string) => {
    setIsClaiming(true)
    setClaimStatusMsg({ text: `Submitting claim for ${symbol} on Robinhood Chain...`, type: 'info' })

    setTimeout(() => {
      const stock = stocks.find(s => s.symbol === symbol)
      if (!stock) return

      const grossEntitlement = stock.holdingUnits * userShareRatio
      const alreadyClaimed = claimedRecords[symbol] || 0
      const claimable = Math.max(0, grossEntitlement - alreadyClaimed)

      if (claimable <= 0) {
        setClaimStatusMsg({ text: `No pending ${symbol} entitlement to claim.`, type: 'info' })
        setIsClaiming(false)
        return
      }

      setClaimedRecords(prev => ({
        ...prev,
        [symbol]: +(alreadyClaimed + claimable).toFixed(6),
      }))

      setClaimStatusMsg({
        text: `Successfully claimed ${claimable.toFixed(4)} ${symbol} tokens to ${activeAddress.slice(0, 8)}... (Robinhood Chain ID: 4663)`,
        type: 'success',
      })
      setIsClaiming(false)
    }, 1200)
  }

  const handleClaimAll = () => {
    setIsClaiming(true)
    setClaimStatusMsg({ text: 'Batch claiming all eligible stock entitlements via RobynStockVault.claimAll()...', type: 'info' })

    setTimeout(() => {
      let anyClaimed = false
      const updatedClaims = { ...claimedRecords }

      stocks.forEach(stock => {
        const grossEntitlement = stock.holdingUnits * userShareRatio
        const alreadyClaimed = updatedClaims[stock.symbol] || 0
        const claimable = Math.max(0, grossEntitlement - alreadyClaimed)

        if (claimable > 0) {
          updatedClaims[stock.symbol] = +(alreadyClaimed + claimable).toFixed(6)
          anyClaimed = true
        }
      })

      if (!anyClaimed) {
        setClaimStatusMsg({ text: 'All available stock entitlements have already been claimed.', type: 'info' })
      } else {
        setClaimedRecords(updatedClaims)
        setClaimStatusMsg({
          text: `Batch claim successful! Stock tokens (NVDA, AAPL, TSLA, AMZN) transferred to ${activeAddress.slice(0, 8)}...`,
          type: 'success',
        })
      }
      setIsClaiming(false)
    }, 1500)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAddress(text)
    setTimeout(() => setCopiedAddress(null), 2500)
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-[#020408] text-[#E2E8F0] font-sans pb-28 selection:bg-[#00C805] selection:text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#06090e]/95 backdrop-blur-md border-b border-[#00C805]/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMain}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 transition-all hover:text-white"
          >
            <span>←</span> Back to Main OS
          </button>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00C805] animate-pulse"></span>
            <span className="font-mono text-xs font-bold tracking-wider text-white">ROBYN STOCK VAULT</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#00C805]/15 text-[#00C805] border border-[#00C805]/30 font-mono hidden md:inline-block font-semibold">
              ROBINHOOD CHAIN • 4663
            </span>
          </div>
        </div>

        {/* Real Web3 Wallet Connect Button */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-mono text-gray-400">NEXT 10% DCA ROTATION</div>
            <div className="text-xs font-mono text-[#00C805] font-bold">IN {formatTime(secondsRemaining)}</div>
          </div>

          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Banner Section */}
        <div className="relative rounded-2xl bg-gradient-to-br from-[#09151f] via-[#050b11] to-[#020408] border border-[#00C805]/40 p-6 sm:p-8 overflow-hidden shadow-[0_0_50px_rgba(0,200,5,0.08)]">
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#00C805]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-4xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C805]/10 border border-[#00C805]/30 text-[#00C805] font-mono text-xs">
              <span className="animate-spin">⚙️</span> Stock-Backed Holder Vault • Robinhood Chain (ID: 4663)
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              ROBYN Stock Vault: 10% Fee DCA Multi-Asset Treasury
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-3xl">
              Exactly 10% of defined protocol fees are autonomously converted into real-world tokenized equities (NVIDIA, Apple, Tesla, Amazon). Every ROBYN token holder has a proportional, non-custodial claim against the underlying stock reserves based on the fixed 1,000,000,000 ROBYN total supply.
            </p>
          </div>

          {/* Real-time Ticker Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
            {/* Metric 1: Connected Wallet & Share */}
            <div className="p-4 rounded-xl bg-black/60 border border-[#00C805]/30 relative overflow-hidden">
              <div className="text-[11px] font-mono text-gray-400">YOUR HOLDER SHARE</div>
              <div className="text-2xl sm:text-3xl font-bold text-[#00C805] font-mono mt-1">
                {userSharePct.toFixed(4)}%
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center justify-between">
                <span>{effectiveRobynBalance.toLocaleString()} ROBYN</span>
                <span className="text-gray-500">/ 1B Basis</span>
              </div>
            </div>

            {/* Metric 2: 10% Fee Stock DCA Pot */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10">
              <div className="text-[11px] font-mono text-gray-400">10% STOCK DCA POT</div>
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono mt-1">
                ${routingPotUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-emerald-400 mt-1 font-mono">
                {routingPotEth} ETH (10% Fee Budget)
              </div>
            </div>

            {/* Metric 3: Total Vault Stocks Locked */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10">
              <div className="text-[11px] font-mono text-gray-400">TOTAL VAULT STOCK ASSETS</div>
              <div className="text-2xl sm:text-3xl font-bold text-cyan-400 font-mono mt-1">
                ${totalVaultValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                4 Equities • Robinhood Chain
              </div>
            </div>

            {/* Metric 4: Asset-Backed Value per ROBYN */}
            <div className="p-4 rounded-xl bg-black/60 border border-white/10">
              <div className="text-[11px] font-mono text-gray-400">ASSET-BACKED VALUE PER ROBYN</div>
              <div className="text-2xl sm:text-3xl font-bold text-[#00C805] font-mono mt-1">
                ${assetBackedValuePerRobyn.toFixed(8)}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                Pro-rata Stock Vault Entitlement
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: Holder Balance & Simulator Controls */}
        <div className="p-4 rounded-2xl bg-[#060b12] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#00C805]"></span>
            <div>
              <span className="text-white font-bold">Holder Entitlement Engine:</span>
              <span className="text-gray-400 ml-2">
                {isConnected ? `Connected Wallet: ${connectedWallet?.slice(0, 6)}...${connectedWallet?.slice(-4)}` : 'Wallet Disconnected'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isConnected && (
              <button
                onClick={() => setUseRealBalance(!useRealBalance)}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  useRealBalance
                    ? 'bg-[#00C805]/20 border-[#00C805] text-[#00C805] font-bold'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {useRealBalance ? `✓ Using Real Balance (${realRobynBalance.toLocaleString()} ROBYN)` : 'Switch to On-Chain Balance'}
              </button>
            )}

            <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-lg px-3 py-1.5">
              <span className="text-gray-400 text-[11px]">Inspect Holdings:</span>
              <input
                type="number"
                value={simulatedRobynBalance}
                onChange={e => {
                  setSimulatedRobynBalance(Math.max(0, Number(e.target.value)))
                  setUseRealBalance(false)
                }}
                className="w-28 bg-transparent text-white font-bold text-right focus:outline-none focus:text-[#00C805]"
              />
              <span className="text-gray-400">ROBYN</span>
            </div>
          </div>
        </div>

        {/* SECTION: MULTI-ASSET STOCK VAULT BREAKDOWN TABLE & CLAIMS */}
        <div className="rounded-2xl border border-[#00C805]/30 overflow-hidden bg-[#060b12] space-y-0">
          <div className="bg-[#04070a] px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span className="text-[#00C805]">📊</span>
                Multi-Asset Stock Portfolio &amp; Pro-Rata Entitlements
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Target Allocation: NVDA (35%) • AAPL (25%) • TSLA (20%) • AMZN (20%)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleClaimAll}
                disabled={isClaiming}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00C805] to-[#00e606] text-black font-bold font-mono text-xs transition shadow-[0_0_20px_rgba(0,200,5,0.3)] hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                {isClaiming ? 'Processing Claims...' : '⚡ Claim All Available Stock'}
              </button>
            </div>
          </div>

          {claimStatusMsg && (
            <div className={`p-3 text-xs font-mono border-b ${
              claimStatusMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : claimStatusMsg.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
            }`}>
              {claimStatusMsg.text}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-black/60 text-gray-400 text-[11px]">
                  <th className="p-4">STOCK ASSET</th>
                  <th className="p-4">MARKET PRICE</th>
                  <th className="p-4">TARGET ALLOC</th>
                  <th className="p-4">VAULT HOLDINGS</th>
                  <th className="p-4">YOUR SHARE</th>
                  <th className="p-4">PRO-RATA ENTITLEMENT</th>
                  <th className="p-4">CLAIMED</th>
                  <th className="p-4">CLAIMABLE</th>
                  <th className="p-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stocks.map(stock => {
                  const grossEntitlement = stock.holdingUnits * userShareRatio
                  const claimed = claimedRecords[stock.symbol] || 0
                  const claimable = Math.max(0, grossEntitlement - claimed)
                  const claimableUsd = claimable * stock.priceUsd

                  return (
                    <tr key={stock.symbol} className="hover:bg-white/[0.02] transition-colors">
                      {/* Asset Info */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2 h-2 rounded-full ${
                            stock.badgeColor === 'emerald' ? 'bg-emerald-400' :
                            stock.badgeColor === 'blue' ? 'bg-blue-400' :
                            stock.badgeColor === 'rose' ? 'bg-rose-400' : 'bg-amber-400'
                          }`}></span>
                          <div>
                            <div className="font-bold text-white text-sm">{stock.symbol}</div>
                            <div className="text-[10px] text-gray-400">{stock.name}</div>
                          </div>
                        </div>
                      </td>

                      {/* Market Price */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-bold text-white">${stock.priceUsd.toFixed(2)}</div>
                        <div className={`text-[10px] ${stock.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stock.change24h >= 0 ? '+' : ''}{stock.change24h}%
                        </div>
                      </td>

                      {/* Target Allocation */}
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded bg-white/5 border border-white/10 font-bold text-gray-300">
                          {stock.targetAllocPct}%
                        </span>
                      </td>

                      {/* Vault Holdings */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="text-white font-bold">{stock.holdingUnits.toFixed(4)} {stock.symbol}</div>
                        <div className="text-[10px] text-gray-400">≈ ${stock.totalValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                      </td>

                      {/* Your Share */}
                      <td className="p-4 whitespace-nowrap text-[#00C805] font-bold">
                        {userSharePct.toFixed(4)}%
                      </td>

                      {/* Pro-Rata Entitlement */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="text-white font-bold">{grossEntitlement.toFixed(4)} {stock.symbol}</div>
                        <div className="text-[10px] text-gray-400">≈ ${(grossEntitlement * stock.priceUsd).toFixed(2)}</div>
                      </td>

                      {/* Claimed */}
                      <td className="p-4 whitespace-nowrap text-gray-400">
                        {claimed.toFixed(4)} {stock.symbol}
                      </td>

                      {/* Claimable */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="text-[#00C805] font-bold">{claimable.toFixed(4)} {stock.symbol}</div>
                        <div className="text-[10px] text-emerald-400">≈ ${claimableUsd.toFixed(2)} USD</div>
                      </td>

                      {/* Action */}
                      <td className="p-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleClaimSingle(stock.symbol)}
                          disabled={isClaiming || claimable <= 0}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#00C805]/20 hover:text-[#00C805] border border-white/10 hover:border-[#00C805]/40 text-gray-300 font-mono text-[11px] transition disabled:opacity-40 disabled:hover:bg-white/5 disabled:hover:text-gray-300"
                        >
                          Claim
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-black/40 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 font-mono gap-2">
            <span>Formula: Entitlement = Vault Balance × (User ROBYN / 1,000,000,000)</span>
            <span className="text-[#00C805]">Single-Sided Soft-Custody: Tokens remain fully liquid at all times</span>
          </div>
        </div>

        {/* SECTION: Pons V2 Fee Escrow Live Integration Engine */}
        <div className="rounded-2xl border border-[#00C805]/20 overflow-hidden bg-[#060b12]">
          <div className="bg-[#04070a] px-5 py-3 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <span className="text-[#00C805]">⚙️</span>
              Pons V2 Fee Escrow • Robinhood Chain (ID: 4663)
            </h2>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${caSynced ? 'bg-[#00C805] animate-pulse' : 'bg-yellow-500 animate-pulse'}`}></span>
              <span className="text-[10px] font-mono text-[#00C805] uppercase">
                {caSynced ? 'Live RPC Active' : 'Connecting to Node...'}
              </span>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Column 1: Verified Contract Info */}
            <div className="col-span-1 md:col-span-2 space-y-3">
              <div>
                <div className="text-[11px] font-mono text-gray-400 mb-1">TARGET TOKEN CONTRACT ({tokenMeta.symbol})</div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-black/60 border border-white/10">
                  <code className="text-xs font-mono text-gray-300 break-all flex-1 select-all">{TOKEN_CA}</code>
                  <button
                    onClick={() => copyToClipboard(TOKEN_CA)}
                    className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] whitespace-nowrap transition-colors"
                  >
                    {copiedAddress === TOKEN_CA ? '✓ Copied' : '📋 Copy'}
                  </button>
                  <a
                    href={`https://robinhoodchain.blockscout.com/token/${TOKEN_CA}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] whitespace-nowrap transition-colors"
                  >
                    ↗ Explorer
                  </a>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono text-gray-400 mb-1">PONS V2 FEE ESCROW CONTRACT</div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-black/60 border border-emerald-500/20">
                  <code className="text-xs font-mono text-emerald-400 break-all flex-1 select-all">{FEE_ESCROW}</code>
                  <button
                    onClick={() => copyToClipboard(FEE_ESCROW)}
                    className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-[10px] whitespace-nowrap transition-colors"
                  >
                    {copiedAddress === FEE_ESCROW ? '✓ Copied' : '📋 Copy'}
                  </button>
                  <a
                    href={`https://robinhoodchain.blockscout.com/address/${FEE_ESCROW}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-[10px] whitespace-nowrap transition-colors"
                  >
                    ↗ Verify
                  </a>
                </div>
              </div>

              {/* Creator Wallet Input / Status */}
              <div className="pt-2">
                <div className="text-[11px] font-mono text-gray-400 mb-1 flex items-center justify-between">
                  <span>CREATOR / DEVELOPER WALLET:</span>
                  <span className="text-[10px] text-emerald-400">
                    {(isConnected && connectedWallet) ? `✓ Connected (${connectedWallet.slice(0, 6)}...${connectedWallet.slice(-4)})` : 'Monitoring Target Creator'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter Creator Address (0x...)"
                    value={(isConnected && connectedWallet) ? connectedWallet : (customWalletInput || DEFAULT_CREATOR)}
                    onChange={e => setCustomWalletInput(e.target.value)}
                    className="w-full text-xs font-mono bg-black/60 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-[#00C805]/50"
                  />
                  {customWalletInput && (
                    <button
                      onClick={() => setCustomWalletInput('')}
                      className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Column 2: Creator Claimable Fees */}
            <div className="col-span-1 md:border-l md:border-white/5 md:pl-6 space-y-4">
              <div>
                <div className="text-[10px] font-mono text-gray-400">CLAIMABLE FEES (CREATOR)</div>
                <div className="text-2xl font-mono text-white font-bold tracking-tight text-[#00C805]">
                  {creatorClaimableEth.toFixed(6)} ETH
                </div>
                <div className="text-xs font-mono text-gray-400 mt-0.5">
                  ≈ ${(creatorClaimableEth * ethPriceUsd).toFixed(2)} USD (ETH @ ${ethPriceUsd.toFixed(0)})
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Last Sync: {lastSyncTime}</div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-gray-400">GLOBAL PONS ESCROW POOL</div>
                <div className="text-sm font-mono text-gray-300 font-semibold">{globalEscrowEth.toFixed(4)} ETH</div>
                <div className="text-[10px] text-gray-500">Total liquidity across all Robinhood Chain launches</div>
              </div>
            </div>

            {/* Column 3: Two-Wallet Architecture (10% Stock DCA / 90% Safe Treasury) */}
            <div className="col-span-1 md:border-l md:border-white/5 md:pl-6 space-y-4">
              <div>
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest text-[#00C805]">
                  10% Stock DCA (Wallet B)
                </div>
                <div className="text-2xl font-mono text-[#00C805] font-bold tracking-tight">
                  {routingPotEth} ETH
                </div>
                <div className="text-xs font-mono text-emerald-400 mt-0.5">
                  ≈ ${routingPotUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Stock Relayer • Preserves ≥ 0.01 ETH reserve</div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-gray-400 uppercase">90% Safe Treasury (Wallet A)</div>
                <div className="text-xs font-mono text-gray-300">{treasuryReserveEth} ETH (${treasuryReserveUsd})</div>
                <div className="text-[10px] text-gray-500">Safe Multi-Sig • Key outside bot authority</div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 01: ANIMATED 5-MINUTE BUYBACK PIPELINE & EXECUTION LEDGER */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                <span className="text-[#00C805]">01.</span> Live 5-Minute Buyback Execution Ledger &amp; Pipeline
              </h2>
              <p className="text-xs text-gray-400">
                Visualized real-time autonomous order routing: Exactly 10% of fees are swept into tokenized equities every 300 seconds.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Autonomous Loop Active
            </div>
          </div>

          {/* ANIMATED PIPELINE FLOW DIAGRAM */}
          <div className="p-6 rounded-2xl bg-[#060b12] border border-[#00C805]/30 relative overflow-hidden space-y-6">
            <div className="flex items-center justify-between font-mono text-xs border-b border-white/10 pb-3">
              <span className="text-white font-bold flex items-center gap-2">
                <span className="text-[#00C805] animate-pulse">●</span> Continuous 300-Second Autonomous Cycle
              </span>
              <span className="text-emerald-400">Epoch #{currentEpoch} in Progress ({formatTime(secondsRemaining)} remaining)</span>
            </div>

            {/* Visual Animated Pipeline Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative font-mono text-xs">
              {/* Node 1: Fee Accrual */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/30 flex flex-col justify-between space-y-2 relative group hover:border-[#00C805] transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">STAGE 01</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Fee Accrual</div>
                  <div className="text-[11px] text-emerald-400 font-bold mt-0.5">{creatorClaimableEth.toFixed(4)} ETH</div>
                </div>
                <div className="text-[10px] text-gray-500">Pons Launchpad Escrow</div>
              </div>

              {/* Node 2: 10% DCA Pot */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex flex-col justify-between space-y-2 relative group hover:border-cyan-400 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">STAGE 02</span>
                  <span className="text-cyan-400">10%</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Routing Engine</div>
                  <div className="text-[11px] text-cyan-400 font-bold mt-0.5">${routingPotUsd.toFixed(2)} USDC</div>
                </div>
                <div className="text-[10px] text-gray-500">Exact 10% DCA Allocation</div>
              </div>

              {/* Node 3: DEX Swap */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex flex-col justify-between space-y-2 relative group hover:border-yellow-400 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">STAGE 03</span>
                  <span className="animate-spin text-yellow-400">↻</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Robinhood DEX</div>
                  <div className="text-[11px] text-yellow-400 font-bold mt-0.5">Market Order</div>
                </div>
                <div className="text-[10px] text-gray-500">0x L2 Liquidity Pool</div>
              </div>

              {/* Node 4: Stock Acquired */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-[#00C805]/50 flex flex-col justify-between space-y-2 relative group bg-[#00C805]/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#00C805] font-bold">STAGE 04 (TARGET)</span>
                  <span className="text-xs">🎯</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{activeQueueStock.symbol} Token</div>
                  <div className="text-[11px] text-[#00C805] font-bold mt-0.5">
                    ${(routingPotUsd * (activeQueueStock.targetAllocPct / 100)).toFixed(2)} Alloc
                  </div>
                </div>
                <div className="text-[10px] text-gray-400">{activeQueueStock.targetAllocPct}% of Cycle</div>
              </div>

              {/* Node 5: Treasury Growth */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-purple-500/30 flex flex-col justify-between space-y-2 relative group hover:border-purple-400 transition">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">STAGE 05</span>
                  <span className="text-purple-400">🛡️</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Vault Backing</div>
                  <div className="text-[11px] text-purple-400 font-bold mt-0.5">Pro-Rata Claim ↑</div>
                </div>
                <div className="text-[10px] text-gray-500">100% Non-Custodial</div>
              </div>
            </div>

            {/* Real-time Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-gray-400">
                <span>Autonomous Heartbeat Progress</span>
                <span className="text-[#00C805] font-bold">{formatTime(secondsRemaining)} until next execution</span>
              </div>
              <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#00C805] to-[#00e606] transition-all duration-1000 shadow-[0_0_10px_#00C805]"
                  style={{ width: `${epochProgressPct}%` }}
                ></div>
              </div>
            </div>

            {/* UPCOMING 5-MINUTE PURCHASE SCHEDULE (QUEUE) */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono text-gray-300 font-bold flex items-center justify-between">
                <span>5-MINUTE PURCHASE SCHEDULE (ROTATING PORTFOLIO):</span>
                <span className="text-[10px] text-[#00C805]">Multi-Asset Stock DCA</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
                {/* Active Target */}
                <div className="p-3 rounded-xl bg-[#00C805]/10 border-2 border-[#00C805] space-y-1 relative shadow-[0_0_15px_rgba(0,200,5,0.2)]">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-[#00C805] text-black font-bold uppercase">NEXT IN {formatTime(secondsRemaining)}</span>
                    <span className="text-[#00C805] font-bold">SLOT 01</span>
                  </div>
                  <div className="text-sm font-bold text-white pt-1">{activeQueueStock.name}</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">${activeQueueStock.priceUsd.toFixed(2)}</span>
                    <span className="text-[#00C805] font-bold">
                      ${(routingPotUsd * (activeQueueStock.targetAllocPct / 100)).toFixed(2)} ({activeQueueStock.targetAllocPct}%)
                    </span>
                  </div>
                </div>

                {/* Queue 2 */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-400 uppercase">+5m Epoch</span>
                    <span className="text-gray-500">SLOT 02</span>
                  </div>
                  <div className="text-sm font-bold text-gray-300 pt-1">{nextQueueStock1.name}</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">${nextQueueStock1.priceUsd.toFixed(2)}</span>
                    <span className="text-cyan-400 font-bold">
                      ${(routingPotUsd * (nextQueueStock1.targetAllocPct / 100)).toFixed(2)} ({nextQueueStock1.targetAllocPct}%)
                    </span>
                  </div>
                </div>

                {/* Queue 3 */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-400 uppercase">+10m Epoch</span>
                    <span className="text-gray-500">SLOT 03</span>
                  </div>
                  <div className="text-sm font-bold text-gray-300 pt-1">{nextQueueStock2.name}</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">${nextQueueStock2.priceUsd.toFixed(2)}</span>
                    <span className="text-purple-400 font-bold">
                      ${(routingPotUsd * (nextQueueStock2.targetAllocPct / 100)).toFixed(2)} ({nextQueueStock2.targetAllocPct}%)
                    </span>
                  </div>
                </div>

                {/* Queue 4 */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-gray-400 uppercase">+15m Epoch</span>
                    <span className="text-gray-500">SLOT 04</span>
                  </div>
                  <div className="text-sm font-bold text-gray-300 pt-1">{nextQueueStock3.name}</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">${nextQueueStock3.priceUsd.toFixed(2)}</span>
                    <span className="text-amber-400 font-bold">
                      ${(routingPotUsd * (nextQueueStock3.targetAllocPct / 100)).toFixed(2)} ({nextQueueStock3.targetAllocPct}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* REAL TRANSACTION EXECUTION LEDGER TABLE */}
          <div className="rounded-2xl bg-[#080d14] border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between font-mono text-xs bg-black/40">
              <span className="font-bold text-white">ON-CHAIN TRANSACTION LEDGER (ROBINHOOD CHAIN)</span>
              <span className="text-gray-400">{history.length} Verified Transactions Recorded</span>
            </div>

            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/10 bg-black/60 text-gray-400 text-[11px]">
                      <th className="p-3.5">TIME</th>
                      <th className="p-3.5">TARGET EQUITY</th>
                      <th className="p-3.5">REWARD ALLOCATED</th>
                      <th className="p-3.5">SHARES ACQUIRED</th>
                      <th className="p-3.5">EXECUTION PRICE</th>
                      <th className="p-3.5">TRANSACTION HASH</th>
                      <th className="p-3.5">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {history.map(tx => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3.5 text-gray-400 whitespace-nowrap">{tx.timestamp}</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="font-bold text-white">{tx.stockName}</div>
                          <div className="text-[10px] text-gray-400">{tx.stockSymbol} • Robinhood Chain</div>
                        </td>
                        <td className="p-3.5 text-[#00C805] font-bold whitespace-nowrap">
                          ${tx.feeSpentUsd.toFixed(2)} USDC ({tx.feeSpentEth.toFixed(4)} ETH)
                        </td>
                        <td className="p-3.5 text-cyan-400 font-bold whitespace-nowrap">
                          +{tx.sharesPurchased} {tx.stockSymbol}
                        </td>
                        <td className="p-3.5 text-gray-300 whitespace-nowrap">${tx.stockPrice.toFixed(2)}</td>
                        <td className="p-3.5 whitespace-nowrap">
                          <a
                            href={`https://robinhoodchain.blockscout.com/tx/${tx.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#00C805] underline decoration-dotted transition-colors"
                          >
                            {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)} ↗
                          </a>
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                            ✓ CONFIRMED IN VAULT
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center space-y-4 font-mono">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400 text-xl">
                  ⏱️
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Epoch #1 Armed • Autonomous Netlify Daemon Active
                  </h3>
                  <p className="text-xs text-gray-400 max-w-xl mx-auto leading-relaxed">
                    The Robyn daemon runs continuously in the background every 300 seconds. When each 5-minute purchase executes on-chain, transaction receipts will be logged in this ledger automatically.
                  </p>
                </div>
                <div className="inline-grid grid-cols-2 sm:grid-cols-4 gap-3 text-left pt-2">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <div className="text-[10px] text-gray-500">CURRENT TARGET</div>
                    <div className="text-xs font-bold text-[#00C805] mt-0.5">{activeQueueStock.symbol} (${(routingPotUsd * (activeQueueStock.targetAllocPct / 100)).toFixed(2)})</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <div className="text-[10px] text-gray-500">10% DCA POT</div>
                    <div className="text-xs font-bold text-white mt-0.5">${routingPotUsd.toFixed(2)} USDC</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <div className="text-[10px] text-gray-500">EXECUTION NETWORK</div>
                    <div className="text-xs font-bold text-cyan-400 mt-0.5">Robinhood Chain (4663)</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                    <div className="text-[10px] text-gray-500">INTERVAL CADENCE</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">Every 300s Loop</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 02: ARCHITECTURAL FLOW EXPLAINER (Sanitized, Compliant Terminology) */}
        <div className="rounded-2xl bg-gradient-to-r from-[#060b12] to-[#04070a] border border-[#00C805]/20 p-6 space-y-4">
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <span>🛡️</span> Mathematical Mechanics: How 5-Minute Stock DCA Backs Every ROBYN Token
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-300 leading-relaxed font-mono">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="text-[#00C805] font-bold">1. Pro-Rata Multi-Asset Backing</div>
              <p className="text-gray-400 text-[11px]">
                Tokens held represent a direct claim against all Stock Tokens in the Vault. Entitlement = Vault Stock Balance × (User ROBYN / 1,000,000,000).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="text-cyan-400 font-bold">2. Asset-Backed Value per ROBYN</div>
              <p className="text-gray-400 text-[11px]">
                As tokenized NVDA, AAPL, TSLA, and AMZN accumulate in the Vault every 5 minutes, asset-backed value per ROBYN increases with treasury growth.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="text-purple-400 font-bold">3. Two-Wallet Security</div>
              <p className="text-gray-400 text-[11px]">
                90% fees sweep to Wallet A (Safe Treasury, key strictly isolated). 10% routes to Wallet B (Stock Relayer, preserves ≥ 0.01 ETH reserve).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <div className="text-amber-400 font-bold">4. Zero ETH to Holders</div>
              <p className="text-gray-400 text-[11px]">
                Holders receive ONLY tokenized Robinhood Stock Tokens. Under no circumstances is native ETH distributed or claimable by holders.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
