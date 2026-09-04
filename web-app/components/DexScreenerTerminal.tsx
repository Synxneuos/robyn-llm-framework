'use client'

import React, { useState, useEffect } from 'react'

interface TokenData {
  pairAddress: string
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  priceUsd: string
  fdv: number
  marketCap: number
  volume24h: number
  priceChange24h: number
  liquidityUsd: number
  dexId: string
  url: string
}

export default function DexScreenerTerminal() {
  const [caInput, setCaInput] = useState('')
  const [activeCa, setActiveCa] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Load saved CA from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('robyn_token_ca')
    if (saved) {
      setCaInput(saved)
      setActiveCa(saved)
    }
  }, [])

  const fetchTokenStats = async (address: string) => {
    if (!address || address.trim().length < 10) return
    setLoading(true)
    setError(null)
    try {
      const trimmed = address.trim()
      const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${trimmed}`)
      if (!res.ok) throw new Error('DexScreener API request failed')
      const data = await res.json()

      if (data && data.pairs && data.pairs.length > 0) {
        // Sort pairs by highest liquidity
        const sorted = [...data.pairs].sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))
        const bestPair = sorted[0]

        setTokenData({
          pairAddress: bestPair.pairAddress,
          baseToken: {
            address: bestPair.baseToken.address,
            name: bestPair.baseToken.name,
            symbol: bestPair.baseToken.symbol,
          },
          priceUsd: bestPair.priceUsd || '0',
          fdv: bestPair.fdv || bestPair.marketCap || 0,
          marketCap: bestPair.marketCap || bestPair.fdv || 0,
          volume24h: bestPair.volume?.h24 || 0,
          priceChange24h: bestPair.priceChange?.h24 || 0,
          liquidityUsd: bestPair.liquidity?.usd || 0,
          dexId: bestPair.dexId || 'dex',
          url: bestPair.url,
        })
        setLastUpdated(new Date())
        localStorage.setItem('robyn_token_ca', trimmed)
      } else {
        setError('Token pair not found on DexScreener yet (may still be deploying or indexing).')
        setTokenData(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch DexScreener data')
      setTokenData(null)
    } finally {
      setLoading(false)
    }
  }

  // Fetch when activeCa changes
  useEffect(() => {
    if (activeCa) {
      fetchTokenStats(activeCa)
      const interval = setInterval(() => fetchTokenStats(activeCa), 20000)
      return () => clearInterval(interval)
    }
  }, [activeCa])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (caInput.trim()) {
      setActiveCa(caInput.trim())
    }
  }

  const formatNumber = (num: number, isCurrency = true) => {
    const prefix = isCurrency ? '$' : ''
    if (num >= 1_000_000_000) return `${prefix}${(num / 1_000_000_000).toFixed(2)}B`
    if (num >= 1_000_000) return `${prefix}${(num / 1_000_000).toFixed(2)}M`
    if (num >= 1_000) return `${prefix}${(num / 1_000).toFixed(2)}K`
    return `${prefix}${num.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  }

  const formatPrice = (priceStr: string) => {
    const price = parseFloat(priceStr)
    if (isNaN(price)) return '$0.00'
    if (price < 0.000001) return `$${price.toExponential(4)}`
    if (price < 0.01) return `$${price.toFixed(6)}`
    if (price < 1) return `$${price.toFixed(4)}`
    return `$${price.toFixed(2)}`
  }

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-[#0a140d] to-[#040805] border border-green-500/30 p-6 sm:p-8 shadow-2xl shadow-green-950/40 overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 font-bold text-lg shadow-inner shadow-green-500/30">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-lg tracking-tight">$ROBYN Live Market Terminal</h3>
              <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/30 uppercase tracking-wide">
                DexScreener Real-Time
              </span>
            </div>
            <p className="text-xs text-gray-400">Live Market Cap, Liquidity, & Real-World Pricing Feed</p>
          </div>
        </div>

        {lastUpdated && (
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            <button
              onClick={() => activeCa && fetchTokenStats(activeCa)}
              className="text-green-400 hover:text-green-300 ml-1 p-1 hover:bg-green-500/10 rounded transition"
              title="Refresh DexScreener"
            >
              🔄
            </button>
          </div>
        )}
      </div>

      {/* CA Input Form */}
      <form onSubmit={handleSubmit} className="mt-6 relative z-10">
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
          Enter $ROBYN Token Contract Address (CA):
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={caInput}
              onChange={(e) => setCaInput(e.target.value)}
              placeholder="Paste $ROBYN Contract Address (0x... or Solana/Robinhood format)"
              className="w-full bg-black/60 border border-white/15 focus:border-green-400 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 font-mono focus:outline-none transition shadow-inner"
            />
            {caInput && (
              <button
                type="button"
                onClick={() => {
                  setCaInput('')
                  setActiveCa('')
                  setTokenData(null)
                  localStorage.removeItem('robyn_token_ca')
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs"
              >
                ✕ Clear
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !caInput.trim()}
            className="bg-green-500 hover:bg-green-400 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-black font-bold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-green-500/20 whitespace-nowrap flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Querying DexScreener...
              </>
            ) : (
              <>
                <span>Fetch Market Cap</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Live Data Display or Empty State */}
      <div className="mt-6 relative z-10">
        {tokenData ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-black/40 border border-green-500/20 rounded-xl p-5 backdrop-blur-md">
            {/* Market Cap */}
            <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                Market Cap (FDV)
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-green-400 tracking-tight">
                {formatNumber(tokenData.marketCap)}
              </div>
              <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                <span>FDV:</span>
                <span className="text-white font-medium">{formatNumber(tokenData.fdv)}</span>
              </div>
            </div>

            {/* Price USD */}
            <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                Token Price
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {formatPrice(tokenData.priceUsd)}
              </div>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded ${
                    tokenData.priceChange24h >= 0
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {tokenData.priceChange24h >= 0 ? '▲ +' : '▼ '}
                  {tokenData.priceChange24h.toFixed(2)}% (24h)
                </span>
              </div>
            </div>

            {/* 24h Volume */}
            <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
              <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                24h Trading Vol
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {formatNumber(tokenData.volume24h)}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                DEX: <span className="text-green-400 uppercase font-semibold">{tokenData.dexId}</span>
              </div>
            </div>

            {/* Liquidity & Dex Link */}
            <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5 flex flex-col justify-between">
              <div>
                <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                  Total Liquidity
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatNumber(tokenData.liquidityUsd)}
                </div>
              </div>
              <a
                href={tokenData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-semibold py-1.5 px-3 rounded-lg transition mt-2 text-center"
              >
                <span>Live DexScreener Chart</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-black/30 border border-dashed border-white/15 rounded-xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-3 text-green-400 text-xl">
              🎯
            </div>
            <h4 className="font-bold text-white text-base mb-1">Ready for $ROBYN Contract Address</h4>
            <p className="text-gray-400 text-xs max-w-md mx-auto mb-4">
              Paste your token CA above whenever it is deployed. The terminal will immediately stream real-time Market Cap, Liquidity, 24h Volume, and Price directly from DexScreener.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-gray-500">Quick Test (Click to preview DexScreener stream):</span>
              <button
                type="button"
                onClick={() => {
                  const demoCa = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
                  setCaInput(demoCa)
                  setActiveCa(demoCa)
                }}
                className="text-green-400 hover:text-green-300 underline font-mono text-[11px]"
              >
                Test WETH Pair
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  )
}
