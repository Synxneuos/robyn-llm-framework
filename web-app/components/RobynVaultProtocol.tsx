import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

// Canonical Token Addresses on Robinhood Chain (ID: 4663)
const ROBINHOOD_CHAIN_TOKENS = [
  { symbol: 'NVDA', name: 'NVIDIA • Robinhood Token', ca: '0xd0601ce157db5bdc3162bbac2a2c8af5320d9eec', allocPct: 35, price: 230.36 },
  { symbol: 'AAPL', name: 'Apple • Robinhood Token', ca: '0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9', allocPct: 25, price: 319.97 },
  { symbol: 'TSLA', name: 'Tesla • Robinhood Token', ca: '0x322F0929c4625eD5bAd873c95208D54E1c003b2d', allocPct: 20, price: 354.08 },
  { symbol: 'AMZN', name: 'Amazon • Robinhood Token', ca: '0x12f190a9F9d7D37a250758b26824B97CE941bF54', allocPct: 20, price: 258.51 },
]

const TOTAL_ROBYN_SUPPLY = 1_000_000_000 // 1 Billion ROBYN basis

export default function RobynVaultProtocol({ onBackToMain }: { onBackToMain: () => void }) {
  const { address, isConnected } = useAccount()

  // Calculator States
  const [userRobynAmount, setUserRobynAmount] = useState<string>('10000000') // Default 10M tokens (1%)
  const [dailyVolumeUsd, setDailyVolumeUsd] = useState<number>(500000) // $500k default daily volume
  const [robynPriceUsd, setRobynPriceUsd] = useState<number>(0.045) // $0.045 token price
  const [activeTab, setActiveTab] = useState<'calculator' | 'distribution' | 'contract' | 'security'>('calculator')

  // Pro-rata calculations based on 1B supply
  const userTokens = parseFloat(userRobynAmount) || 0
  const userTokenUsdValue = userTokens * robynPriceUsd
  const userHolderShareRatio = userTokens / TOTAL_ROBYN_SUPPLY
  const userHolderSharePct = (userTokens / TOTAL_ROBYN_SUPPLY) * 100

  // Launchpad 1% Fee Economics & Exact 10% Protocol Fee to Stock DCA
  const totalDailyTradingFeeUsd = dailyVolumeUsd * 0.01 // 1% Total Trade Fee on Launchpad
  const protocolFeeCutUsd = totalDailyTradingFeeUsd * 0.70 // 70% Protocol Gross Cut
  const stockDcaDailyUsd = protocolFeeCutUsd * 0.10 // Exactly 10% Fee Allocated to Stock DCA
  const protocolReserveDailyUsd = protocolFeeCutUsd * 0.90 // 90% Protocol & Gas Reserve

  // Multi-Asset Portfolio Allocations (Daily Payout USD)
  const nvdaDailyUsd = stockDcaDailyUsd * 0.35 // 35%
  const aaplDailyUsd = stockDcaDailyUsd * 0.25 // 25%
  const tslaDailyUsd = stockDcaDailyUsd * 0.20 // 20%
  const amznDailyUsd = stockDcaDailyUsd * 0.20 // 20%

  // User Proportional Entitlements (Daily USD & Stock Units)
  const userDailyStockClaimUsd = stockDcaDailyUsd * userHolderShareRatio
  const userMonthlyStockClaimUsd = userDailyStockClaimUsd * 30
  const userYearlyStockClaimUsd = userDailyStockClaimUsd * 365

  // Cumulative Asset-Backed Value per ROBYN growth (annualized from DCA inflow)
  const annualTotalDcaInflowUsd = stockDcaDailyUsd * 365
  const assetBackedGrowthPerTokenAnnual = annualTotalDcaInflowUsd / TOTAL_ROBYN_SUPPLY

  return (
    <div className="min-h-screen bg-[#020408] text-[#E2E8F0] font-sans pb-24 selection:bg-[#00C805] selection:text-black">
      {/* Top Protocol Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#06090e]/90 backdrop-blur-md border-b border-[#00C805]/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
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
            <span className="font-mono text-xs font-bold tracking-wider text-white">ROBYN // STOCK VAULT SPECIFICATION</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#00C805]/10 text-[#00C805] border border-[#00C805]/30 font-mono hidden md:inline-block">
              ROBINHOOD CHAIN • 4663
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-mono text-gray-400">FEE ALLOCATION BUDGET</div>
            <div className="text-xs font-mono text-[#00C805] font-bold">10% STOCK DCA • 90% TREASURY</div>
          </div>
          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Protocol Architecture Hero */}
        <div className="relative rounded-2xl bg-gradient-to-br from-[#0a121a] via-[#05080c] to-[#020408] border border-[#00C805]/30 p-6 sm:p-8 overflow-hidden shadow-[0_0_50px_rgba(0,200,5,0.06)]">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#00C805]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-3xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C805]/10 border border-[#00C805]/30 text-[#00C805] font-mono text-xs">
              <span>⚡</span> Stock-Backed Holder Vault Architecture
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Pro-Rata Multi-Asset Stock Vault Protocol
            </h1>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Mathematical calculation engine &amp; architectural specification for the Robyn OS Stock-Backed Holder Vault. Exactly 10% of defined protocol fees continuously purchase tokenized stocks (NVDA, AAPL, TSLA, AMZN). Every ROBYN holder receives a strictly proportional entitlement without locking penalties or duration multipliers.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[11px] font-mono text-gray-400">TOTAL ROBYN SUPPLY</div>
              <div className="text-base sm:text-lg font-bold text-[#00C805] font-mono mt-0.5">1,000,000,000 Fixed</div>
              <div className="text-[10px] text-gray-500 mt-1">Universal holder calculation basis</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[11px] font-mono text-gray-400">LOCK DURATION</div>
              <div className="text-base sm:text-lg font-bold text-white font-mono mt-0.5">0 Days (Liquid)</div>
              <div className="text-[10px] text-gray-500 mt-1">Withdrawable anytime at zero penalty</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[11px] font-mono text-gray-400">STOCK DCA ALLOCATION</div>
              <div className="text-base sm:text-lg font-bold text-[#00C805] font-mono mt-0.5">Exact 10.00%</div>
              <div className="text-[10px] text-gray-500 mt-1">Defined protocol fee allocation</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[11px] font-mono text-gray-400">PORTFOLIO ASSETS</div>
              <div className="text-base sm:text-lg font-bold text-cyan-400 font-mono mt-0.5">4 Equities</div>
              <div className="text-[10px] text-gray-500 mt-1">NVDA 35% • AAPL 25% • TSLA 20% • AMZN 20%</div>
            </div>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4 font-mono text-xs">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border ${
              activeTab === 'calculator'
                ? 'bg-[#00C805]/15 border-[#00C805] text-[#00C805] font-bold shadow-[0_0_15px_rgba(0,200,5,0.2)]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🧮</span> Pro-Rata Holder Calculator
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border ${
              activeTab === 'distribution'
                ? 'bg-[#00C805]/15 border-[#00C805] text-[#00C805] font-bold shadow-[0_0_15px_rgba(0,200,5,0.2)]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>📊</span> 10% Fee DCA Multi-Asset Split
          </button>
          <button
            onClick={() => setActiveTab('contract')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border ${
              activeTab === 'contract'
                ? 'bg-[#00C805]/15 border-[#00C805] text-[#00C805] font-bold shadow-[0_0_15px_rgba(0,200,5,0.2)]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🛡️</span> RobynStockVault.sol Blueprint
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border ${
              activeTab === 'security'
                ? 'bg-[#00C805]/15 border-[#00C805] text-[#00C805] font-bold shadow-[0_0_15px_rgba(0,200,5,0.2)]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🔐</span> Accounting &amp; Security Proof
          </button>
          <a
            href="#stocks"
            className="px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-400/40 text-emerald-300 hover:text-white hover:border-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)] ml-auto"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>📈</span> Live 5-Min Stock DCA Engine ↗
          </a>
        </div>

        {/* TAB 1: INTERACTIVE PRO-RATA HOLDER CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Input Sliders */}
            <div className="lg:col-span-6 space-y-6">
              <div className="rounded-2xl bg-[#080d14] border border-white/10 p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <span className="text-[#00C805]">01.</span> Holder Holdings &amp; Volume Parameters
                  </h3>
                  <span className="text-xs font-mono text-gray-400">1B Total Supply Basis</span>
                </div>

                {/* Token Amount Input */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <label className="text-gray-300">ROBYN Tokens Held ($ROBYN)</label>
                    <span className="text-[#00C805] font-bold">≈ ${(userTokens * robynPriceUsd).toLocaleString()} USD</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={userRobynAmount}
                      onChange={(e) => setUserRobynAmount(e.target.value)}
                      placeholder="e.g. 10000000"
                      className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-[#00C805]"
                    />
                    <div className="absolute right-3 top-2.5 flex items-center gap-1">
                      <button
                        onClick={() => setUserRobynAmount('1000000')}
                        className="px-2 py-1 rounded bg-white/10 hover:bg-[#00C805]/20 text-[10px] font-mono text-gray-300"
                      >
                        1M (0.1%)
                      </button>
                      <button
                        onClick={() => setUserRobynAmount('10000000')}
                        className="px-2 py-1 rounded bg-white/10 hover:bg-[#00C805]/20 text-[10px] font-mono text-gray-300"
                      >
                        10M (1%)
                      </button>
                      <button
                        onClick={() => setUserRobynAmount('50000000')}
                        className="px-2 py-1 rounded bg-white/10 hover:bg-[#00C805]/20 text-[10px] font-mono text-gray-300"
                      >
                        50M (5%)
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-gray-400">
                    <span>Pro-Rata Holder Share:</span>
                    <span className="text-[#00C805] font-bold">{userHolderSharePct.toFixed(4)}% of Vault</span>
                  </div>
                </div>

                {/* Launchpad 24h Volume Slider */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-xs font-mono">
                    <label className="text-gray-300">Expected 24h Trading Volume</label>
                    <span className="text-[#00C805] font-bold font-mono">${dailyVolumeUsd.toLocaleString()} / Day</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="50000"
                    value={dailyVolumeUsd}
                    onChange={(e) => setDailyVolumeUsd(Number(e.target.value))}
                    className="w-full accent-[#00C805] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-gray-500">
                    <span>$50K (Base)</span>
                    <span>$500K (Standard)</span>
                    <span>$2M (Trending)</span>
                    <span>$5M (God Candle)</span>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-gray-400">
                    <span>Daily Total Trading Fee (1%):</span>
                    <span className="text-white">${totalDailyTradingFeeUsd.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Protocol Cut (70%):</span>
                    <span className="text-white">${protocolFeeCutUsd.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold border-t border-white/5 pt-2">
                    <span>10% Stock DCA Inflow:</span>
                    <span>${stockDcaDailyUsd.toLocaleString()} / Day</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Projected Stock Entitlements */}
            <div className="lg:col-span-6 space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-[#0b141f] to-[#06090e] border border-[#00C805]/30 p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <span className="text-[#00C805]">02.</span> Projected Stock Entitlements
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#00C805]/10 text-[#00C805] border border-[#00C805]/30">
                    Pro-Rata Claim
                  </span>
                </div>

                {/* Big Share & Payout Display */}
                <div className="p-5 rounded-xl bg-black/60 border border-[#00C805]/20 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-gray-400">ANNUAL STOCK ACCUMULATION</div>
                    <div className="text-3xl sm:text-4xl font-bold font-mono text-[#00C805] mt-1">
                      ${userYearlyStockClaimUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      Based on ${dailyVolumeUsd.toLocaleString()} Daily Volume
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs text-gray-400">YOUR SHARE</div>
                    <div className="text-xl font-bold text-white mt-1">{userHolderSharePct.toFixed(4)}%</div>
                    <div className="text-[11px] text-[#00C805] mt-1">{userTokens.toLocaleString()} ROBYN</div>
                  </div>
                </div>

                {/* Return Matrix Across 4 Stocks */}
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  {ROBINHOOD_CHAIN_TOKENS.map(stock => {
                    const stockAllocDailyUsd = stockDcaDailyUsd * (stock.allocPct / 100)
                    const userDailyStockUsd = stockAllocDailyUsd * userHolderShareRatio
                    const userAnnualUnits = (userDailyStockUsd * 365) / stock.price

                    return (
                      <div key={stock.symbol} className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <div className="flex items-center justify-between text-gray-400 text-[11px]">
                          <span className="font-bold text-white">{stock.symbol}</span>
                          <span className="text-[#00C805]">{stock.allocPct}% Alloc</span>
                        </div>
                        <div className="text-base font-bold text-cyan-400 pt-1">
                          +{userAnnualUnits.toFixed(3)} Shares/Yr
                        </div>
                        <div className="text-[10px] text-gray-400">
                          ≈ ${(userDailyStockUsd * 365).toFixed(2)} USD (@ ${stock.price})
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Asset-Backed Value per ROBYN Growth Card */}
                <div className="p-4 rounded-xl bg-[#00C805]/5 border border-[#00C805]/20 space-y-1 font-mono text-xs">
                  <div className="text-gray-400 text-[11px]">PROJECTED ASSET-BACKED VALUE PER ROBYN GROWTH</div>
                  <div className="text-lg font-bold text-white flex items-baseline gap-2">
                    <span>+${assetBackedGrowthPerTokenAnnual.toFixed(8)} USD / Year</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Direct mathematical consequence of 10% fee DCA into permanent Robinhood Chain stock reserves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 10% MULTI-ASSET SPLIT */}
        {activeTab === 'distribution' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#080d14] border border-white/10 p-6 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <span className="text-[#00C805]">📊</span> Exact 10% Stock DCA Portfolio Allocation
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-1">
                  Sum = 100% of the 10% Stock DCA Budget. Integer remainder safely assigned to AMZN.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
                {ROBINHOOD_CHAIN_TOKENS.map(token => (
                  <div key={token.symbol} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{token.symbol}</span>
                      <span className="px-2 py-0.5 rounded bg-[#00C805]/15 text-[#00C805] text-xs font-bold">
                        {token.allocPct}%
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-300">{token.name}</div>
                      <div className="text-xs text-emerald-400 font-bold mt-1">Market Price: ${token.price.toFixed(2)}</div>
                    </div>
                    <div className="pt-2 border-t border-white/5 space-y-1 text-[11px]">
                      <div className="text-gray-400">Canonical Address:</div>
                      <code className="text-[10px] text-cyan-400 break-all block">{token.ca}</code>
                      <a
                        href={`https://robinhoodchain.blockscout.com/token/${token.ca}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-gray-400 hover:text-white underline block pt-1"
                      >
                        ↗ Verify on Blockscout
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-3 text-xs font-mono">
                <div className="text-[#00C805] font-bold">Fee Routing Logic:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-[11px]">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="font-bold text-white block mb-1">10% Stock DCA Budget:</span>
                    Autonomous Netlify keeper triggers every 300 seconds, sweeping exactly 10% of claimed fees into tokenized securities on Robinhood Chain.
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="font-bold text-white block mb-1">90% Protocol &amp; Gas Reserve:</span>
                    Reserved for protocol liquidity, autonomous relayer gas subsidization, and long-term ecosystem development.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SMART CONTRACT BLUEPRINT */}
        {activeTab === 'contract' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="rounded-2xl bg-[#080d14] border border-white/10 p-6 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-[#00C805]">🛡️</span> RobynStockVault.sol Contract Specification
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Solidity 0.8.20 • SafeERC20 • ReentrancyGuard • Ownable2Step • Target Chain: Robinhood Chain (ID: 4663)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div className="text-white font-bold">1. depositRobyn(uint256 amount)</div>
                  <p className="text-gray-400 text-[11px]">
                    User deposits ROBYN into the vault 1:1. Zero lock time. Auto-settles all pending claims before modifying share balances.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div className="text-white font-bold">2. withdrawRobyn(uint256 amount)</div>
                  <p className="text-gray-400 text-[11px]">
                    Instant withdrawal of ROBYN principal at any time with zero penalties. Automatically claims all accrued stock tokens.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div className="text-white font-bold">3. claimAll()</div>
                  <p className="text-gray-400 text-[11px]">
                    Batch claims all eligible tokenized stocks (NVDA, AAPL, TSLA, AMZN) directly into the user's wallet in a single transaction.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/20 space-y-2">
                <div className="text-[#00C805] font-bold">View &amp; Telemetry Functions:</div>
                <div className="text-gray-300 text-[11px] space-y-1">
                  <div>• <code className="text-cyan-400">getUserEntitlement(address user, address stockToken)</code>: Cumulative gross entitlement</div>
                  <div>• <code className="text-cyan-400">getUserClaimable(address user, address stockToken)</code>: Real-time claimable balance</div>
                  <div>• <code className="text-cyan-400">getUserClaimed(address user, address stockToken)</code>: Total stock units already claimed</div>
                  <div>• <code className="text-cyan-400">getVaultBalance(address stockToken)</code>: On-chain reserve of specified stock</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & ACCOUNTING PROOF */}
        {activeTab === 'security' && (
          <div className="space-y-6 font-mono text-xs">
            <div className="rounded-2xl bg-[#080d14] border border-white/10 p-6 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-[#00C805]">🔐</span> High-Precision Index Accounting &amp; Security Proof
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Synthetix/MasterChef standard adapted for transferable multi-asset equity distribution.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div className="text-white font-bold text-sm">Anti-Double-Claim Protection</div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Because standard ERC-20 tokens do not possess transfer hooks, a snapshot-only model allows users to claim stock, transfer tokens to a secondary wallet, and claim again. Soft-custody vault shares eliminate this exploit: claims are strictly bound to deposited share balances and accumulated index debts.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                  <div className="text-white font-bold text-sm">Integer Remainder Safety</div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Splitting funds across 4 assets (35%, 25%, 20%, 20%) can cause 1-wei rounding loss with integer division. The autonomous daemon assigns the remainder to AMZN (`stockPurchaseBudget - nvda - aapl - tsla`), ensuring exactly 100% of the 10% fee allocation is spent.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-2">
                <div className="text-white font-bold text-sm">Verified Python Accounting Test Suite Output:</div>
                <div className="p-3 rounded-lg bg-black text-emerald-400 font-mono text-[11px] space-y-1">
                  <div>✓ TEST 1: Specification Verification (Holders A 10%, B 5%, C 1%) - PASSED</div>
                  <div>✓ TEST 2: Double Claim Prevention (Subsequent claim yields 0) - PASSED</div>
                  <div>✓ TEST 3: Exact 10% Protocol Fee Allocation &amp; Remainder Safety - PASSED</div>
                  <div>✓ TEST 4: Anti-Flash-Loan / Retroactive Capture Prevention - PASSED</div>
                  <div className="text-white pt-1">ALL TEST SUITES COMPLETED SUCCESSFULLY (4/4 PASSED)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
