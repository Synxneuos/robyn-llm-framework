import React, { useState, useEffect } from 'react'
import { useAccount, useBalance, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { ConnectButton } from '@rainbow-me/rainbowkit'

// Duration multipliers & APR tiers
const LOCK_DURATIONS = [
  { days: 7, label: '7 Days (Quick Lock)', multiplier: 1.0, bonusBps: '+0%', baseApr: 5.2 },
  { days: 30, label: '30 Days (Standard)', multiplier: 1.25, bonusBps: '+25%', baseApr: 8.5 },
  { days: 90, label: '90 Days (Quarterly)', multiplier: 1.75, bonusBps: '+75%', baseApr: 14.2 },
  { days: 180, label: '180 Days (Strategic)', multiplier: 2.2, bonusBps: '+120%', baseApr: 21.0 },
  { days: 365, label: '365 Days (Max Alpha)', multiplier: 3.0, bonusBps: '+200%', baseApr: 36.5 },
]

export default function RobynVaultProtocol({ onBackToMain }: { onBackToMain: () => void }) {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })

  // Vault Staking States
  const [tokenAmount, setTokenAmount] = useState<string>('50000')
  const [selectedDuration, setSelectedDuration] = useState<number>(30)
  const [activeTab, setActiveTab] = useState<'calculator' | 'distribution' | 'contract' | 'live_vault'>('calculator')

  // Launchpad Volume Simulator States
  const [dailyVolumeUsd, setDailyVolumeUsd] = useState<number>(500000) // $500k default daily volume
  const [robynPriceUsd, setRobynPriceUsd] = useState<number>(0.045) // $0.045 token price
  const [totalPoolLocked, setTotalPoolLocked] = useState<number>(10000000) // 10M tokens locked globally

  // Calculations
  const durationObj = LOCK_DURATIONS.find(d => d.days === selectedDuration) || LOCK_DURATIONS[1]
  const userTokens = parseFloat(tokenAmount) || 0
  const userTokenUsdValue = userTokens * robynPriceUsd
  const userLockWeight = userTokens * durationObj.multiplier

  // Launchpad 1% Fee Economics (Pons / Standard Launchpad Model)
  const totalFeeCollectedDaily = dailyVolumeUsd * 0.01 // 1% Total Trade Fee
  const launchpadFeeCutDaily = totalFeeCollectedDaily * 0.30 // 30% to Launchpad
  const robynProjectFeeGrossDaily = totalFeeCollectedDaily * 0.70 // 70% to Robyn Protocol

  // Robyn Protocol 70% Distribution Breakdown:
  // 50% -> Stakers/Lockers Real Yield Pool (ETH / Stable Yield)
  // 25% -> Token Buyback & Burn / Liquidity Protection
  // 25% -> AI Compute Infrastructure & Core Dev Ops
  const stakerYieldDailyUsd = robynProjectFeeGrossDaily * 0.50
  const buybackDailyUsd = robynProjectFeeGrossDaily * 0.25
  const devInfraDailyUsd = robynProjectFeeGrossDaily * 0.25

  const stakerYieldMonthlyUsd = stakerYieldDailyUsd * 30
  const stakerYieldYearlyUsd = stakerYieldDailyUsd * 365

  // User Share of Staking Pool
  const totalEffectivePoolWeight = totalPoolLocked * 1.5 // Weighted average assumption
  const userPoolSharePct = totalEffectivePoolWeight > 0 ? Math.min(100, (userLockWeight / (totalEffectivePoolWeight + userLockWeight)) * 100) : 0

  const userEstimatedDailyYieldUsd = (stakerYieldDailyUsd * userPoolSharePct) / 100
  const userEstimatedMonthlyYieldUsd = userEstimatedDailyYieldUsd * 30
  const userEstimatedYearlyYieldUsd = userEstimatedDailyYieldUsd * 365
  
  // Real Yield APY % on User Locked Capital
  const calculatedRealApy = userTokenUsdValue > 0 ? (userEstimatedYearlyYieldUsd / userTokenUsdValue) * 100 : durationObj.baseApr

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
            <span className="font-mono text-xs font-bold tracking-wider text-white">ROBYN OS // VAULT &amp; FEE PROTOCOL</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#00C805]/10 text-[#00C805] border border-[#00C805]/30 font-mono hidden md:inline-block">
              INTERNAL GENESIS SPEC
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-mono text-gray-400">PONS FEE ALLOCATION</div>
            <div className="text-xs font-mono text-[#00C805] font-bold">70% PROTOCOL / 30% LAUNCHPAD</div>
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
              <span>⚡</span> Single-Sided Non-Custodial Lock Vault Architecture
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Token Lock, Fee Distribution &amp; Synthetic Collateral Engine
            </h1>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Complete blueprint &amp; mathematical calculation engine for the Robyn OS Token Lock Vault. Users lock project tokens without needing ETH liquidity pairs, while receiving 100% transparent fee rewards derived from trading volume.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[11px] font-mono text-gray-400">LIQUIDITY REQUIREMENT</div>
              <div className="text-base sm:text-lg font-bold text-[#00C805] font-mono mt-0.5">0 ETH Needed (Single Asset)</div>
              <div className="text-[10px] text-gray-500 mt-1">User locks pure $ROBYN tokens only</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[11px] font-mono text-gray-400">LAUNCHPAD TOTAL FEE</div>
              <div className="text-base sm:text-lg font-bold text-white font-mono mt-0.5">1.00% Per Swap</div>
              <div className="text-[10px] text-gray-500 mt-1">30% Launchpad / 70% Robyn Cut</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[11px] font-mono text-gray-400">PROTOCOL REVENUE SHARE</div>
              <div className="text-base sm:text-lg font-bold text-[#00C805] font-mono mt-0.5">50% Real Yield to Lockers</div>
              <div className="text-[10px] text-gray-500 mt-1">Paid in Native ETH / Stable coins</div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
              <div className="text-[11px] font-mono text-gray-400">MAX EMISSION POOL CAP</div>
              <div className="text-base sm:text-lg font-bold text-cyan-400 font-mono mt-0.5">5.0% Supply Guard</div>
              <div className="text-[10px] text-gray-500 mt-1">Zero hyper-inflation design</div>
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
            <span>🧮</span> Interactive Yield &amp; Volume Calculator
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border ${
              activeTab === 'distribution'
                ? 'bg-[#00C805]/15 border-[#00C805] text-[#00C805] font-bold shadow-[0_0_15px_rgba(0,200,5,0.2)]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>📊</span> 1% Launchpad Fee Distribution Model
          </button>
          <button
            onClick={() => setActiveTab('contract')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border ${
              activeTab === 'contract'
                ? 'bg-[#00C805]/15 border-[#00C805] text-[#00C805] font-bold shadow-[0_0_15px_rgba(0,200,5,0.2)]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🛡️</span> Smart Contract &amp; Custody Blueprint
          </button>
          <button
            onClick={() => setActiveTab('live_vault')}
            className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border ${
              activeTab === 'live_vault'
                ? 'bg-[#00C805]/15 border-[#00C805] text-[#00C805] font-bold shadow-[0_0_15px_rgba(0,200,5,0.2)]'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🔐</span> Live Vault Interface (Testnet/Sim)
          </button>
          <a
            href="#stocks"
            className="px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-400/40 text-emerald-300 hover:text-white hover:border-emerald-400 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)] ml-auto"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>📈</span> 5-Min Stock DCA Engine ↗
          </a>
        </div>

        {/* TAB 1: INTERACTIVE YIELD & VOLUME CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Input Sliders */}
            <div className="lg:col-span-6 space-y-6">
              <div className="rounded-2xl bg-[#080d14] border border-white/10 p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <span className="text-[#00C805]">01.</span> Position Parameters
                  </h3>
                  <span className="text-xs font-mono text-gray-400">Single-Sided Lock</span>
                </div>

                {/* Token Amount Input */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <label className="text-gray-300">Robyn Tokens to Lock ($ROBYN)</label>
                    <span className="text-[#00C805] font-bold">≈ ${(userTokens * robynPriceUsd).toLocaleString()} USD</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      placeholder="e.g. 50000"
                      className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-[#00C805]"
                    />
                    <button
                      onClick={() => setTokenAmount('100000')}
                      className="absolute right-3 top-2.5 px-2.5 py-1 rounded bg-white/10 hover:bg-[#00C805]/20 text-[11px] font-mono text-gray-300 hover:text-[#00C805]"
                    >
                      MAX POOL
                    </button>
                  </div>
                </div>

                {/* Duration Selection */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <label className="text-gray-300">Lock Duration (Timelock Multiplier)</label>
                    <span className="text-[#00C805] font-bold">{durationObj.multiplier}x Multiplier ({durationObj.bonusBps})</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {LOCK_DURATIONS.map((d) => (
                      <button
                        key={d.days}
                        onClick={() => setSelectedDuration(d.days)}
                        className={`p-3 rounded-xl border text-left font-mono transition-all ${
                          selectedDuration === d.days
                            ? 'bg-[#00C805]/15 border-[#00C805] text-white shadow-[0_0_10px_rgba(0,200,5,0.15)]'
                            : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-bold">{d.label}</div>
                        <div className="text-[10px] text-[#00C805] mt-0.5">{d.multiplier}x Weight · {d.bonusBps}</div>
                      </button>
                    ))}
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
              </div>
            </div>

            {/* Right Column: Output Metrics & Real Yield Breakdown */}
            <div className="lg:col-span-6 space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-[#0b141f] to-[#06090e] border border-[#00C805]/30 p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                    <span className="text-[#00C805]">02.</span> Real Yield &amp; Collateral Payouts
                  </h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#00C805]/10 text-[#00C805] border border-[#00C805]/30">
                    Calculated Live
                  </span>
                </div>

                {/* Big APY Display */}
                <div className="p-5 rounded-xl bg-black/60 border border-[#00C805]/20 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-gray-400">PROJECTED REAL YIELD APY</div>
                    <div className="text-3xl sm:text-4xl font-bold font-mono text-[#00C805] mt-1">
                      {calculatedRealApy.toFixed(1)}%
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      Combined: Volume Fee Stream + 5% Token Emission Pool
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs text-gray-400">YOUR POOL SHARE</div>
                    <div className="text-xl font-bold text-white mt-1">{userPoolSharePct.toFixed(3)}%</div>
                    <div className="text-[11px] text-[#00C805] mt-1">{userLockWeight.toLocaleString()} Weighted Points</div>
                  </div>
                </div>

                {/* Return Matrix */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono">
                    <div className="text-[10px] text-gray-400">DAILY PAYOUT</div>
                    <div className="text-sm sm:text-base font-bold text-white mt-1">
                      ${userEstimatedDailyYieldUsd.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-[#00C805] mt-0.5">
                      ≈ {(userEstimatedDailyYieldUsd / 2600).toFixed(4)} ETH
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono">
                    <div className="text-[10px] text-gray-400">MONTHLY STREAM</div>
                    <div className="text-sm sm:text-base font-bold text-white mt-1">
                      ${userEstimatedMonthlyYieldUsd.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-[#00C805] mt-0.5">
                      ≈ {(userEstimatedMonthlyYieldUsd / 2600).toFixed(3)} ETH
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono">
                    <div className="text-[10px] text-gray-400">YEARLY TOTAL</div>
                    <div className="text-sm sm:text-base font-bold text-[#00C805] mt-1">
                      ${userEstimatedYearlyYieldUsd.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      ≈ {(userEstimatedYearlyYieldUsd / 2600).toFixed(2)} ETH
                    </div>
                  </div>
                </div>

                {/* Synthetic Stock Collateral Equivalent */}
                <div className="p-4 rounded-xl bg-[#00C805]/5 border border-[#00C805]/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-gray-300 font-bold flex items-center gap-1.5">
                      <span>🏛️</span> Synthetic Stocks / ETH Backing
                    </span>
                    <span className="text-[#00C805]">Fully Collateralized</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    By locking your tokens for {selectedDuration} days, your position qualifies for ${(userTokenUsdValue * 0.75).toFixed(2)} in synthetic borrowing power against tokenized stocks ($NVDA, $AAPL, $TSLA) or Native $ETH via the Robyn Risk Engine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 1% LAUNCHPAD FEE DISTRIBUTION MODEL */}
        {activeTab === 'distribution' && (
          <div className="space-y-8">
            <div className="rounded-2xl bg-[#080d14] border border-white/10 p-6 sm:p-8 space-y-6">
              <div className="max-w-3xl space-y-2">
                <h3 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                  <span className="text-[#00C805]">📊</span> Pons / Launchpad 1% Fee Mechanics
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Har swap transaction par 1.0% total trading fee deduct hoti hai. Launchpad aur Robyn Protocol ke beech revenue 30% / 70% split hota hai:
                </p>
              </div>

              {/* Fee Flow Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {/* 1. Total Volume Fee */}
                <div className="rounded-xl bg-black/60 border border-white/10 p-5 space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-bold">TOTAL TRADING VOLUME</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white">100% Volume</span>
                  </div>
                  <div className="text-2xl font-bold text-white">${dailyVolumeUsd.toLocaleString()} / Day</div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5 space-y-1 text-xs">
                    <div className="flex justify-between text-gray-400">
                      <span>Total Fee (1.00%):</span>
                      <span className="text-white font-bold">${totalFeeCollectedDaily.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Launchpad Cut (30%) */}
                <div className="rounded-xl bg-black/60 border border-orange-500/30 p-5 space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-orange-400 font-bold">LAUNCHPAD CUT (30%)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      Pons / Bonding Curve
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">${launchpadFeeCutDaily.toLocaleString()} / Day</div>
                  <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 space-y-1 text-xs text-gray-400">
                    <p>Platform infrastructure, routing fees, and bonding curve liquidity maintenance fee.</p>
                  </div>
                </div>

                {/* 3. Robyn Protocol Net Cut (70%) */}
                <div className="rounded-xl bg-black/60 border border-[#00C805]/30 p-5 space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#00C805] font-bold">ROBYN PROTOCOL CUT (70%)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#00C805]/10 text-[#00C805] border border-[#00C805]/30">
                      Protocol Revenue
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-[#00C805]">${robynProjectFeeGrossDaily.toLocaleString()} / Day</div>
                  <div className="p-3 rounded-lg bg-[#00C805]/5 border border-[#00C805]/10 space-y-1 text-xs text-gray-400">
                    <p>Project gross income allocated to token lockers, buybacks, and dev compute.</p>
                  </div>
                </div>
              </div>

              {/* Sub-distribution of 70% Protocol Cut */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-white font-mono">
                  Robyn Protocol 70% Revenue Allocation Strategy:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                  <div className="p-4 rounded-xl bg-gradient-to-b from-[#00C805]/10 to-transparent border border-[#00C805]/30 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-[#00C805]">1. Staker Real Yield (50%)</span>
                      <span className="text-white">${stakerYieldDailyUsd.toLocaleString()}/day</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#00C805] h-full w-[50%]"></div>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Token lock karne wale users ko directly ETH/stablecoins me daily stream hota hai.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-b from-cyan-500/10 to-transparent border border-cyan-500/30 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-cyan-400">2. Buyback &amp; Burn (25%)</span>
                      <span className="text-white">${buybackDailyUsd.toLocaleString()}/day</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full w-[25%]"></div>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Open market se $ROBYN tokens buy karke permanent burn address par send kiye jate hain (Supply reduction).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/30 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-purple-400">3. AI Compute &amp; Dev (25%)</span>
                      <span className="text-white">${devInfraDailyUsd.toLocaleString()}/day</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-400 h-full w-[25%]"></div>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      Robyn Engine LLM inference, GPU cluster rental, aur autonomous agent node infrastructure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SMART CONTRACT & CUSTODY BLUEPRINT */}
        {activeTab === 'contract' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Architecture Explanation */}
              <div className="rounded-2xl bg-[#080d14] border border-white/10 p-6 space-y-4">
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <span className="text-[#00C805]">🛡️</span> Custody: Smart Contract vs Team Wallet
                </h3>
                
                <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">
                    <strong className="text-red-400 block mb-1">❌ Centralized Wallet Custody (Avoid karna hai):</strong>
                    Agar user ke tokens kisi team/admin personal wallet me transfer honge, toh launchpad aur buyers usko rug-pull / scam samjhenge. Koi trust nahi karega.
                  </div>

                  <div className="p-4 rounded-xl bg-[#00C805]/10 border border-[#00C805]/30 text-gray-300">
                    <strong className="text-[#00C805] block mb-1">✅ Verified Smart Contract Escrow Vault (Industry Standard):</strong>
                    Website se jab user &quot;Lock Tokens&quot; dabata hai, tokens verified smart contract (`RobynVault.sol`) ke andar lock hote hain:
                    <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
                      <li>Team ya creator tokens ko withdraw nahi kar sakta (No rug capability).</li>
                      <li>Smart contract code ke rules strict hote hain: user apna token tabhi withdraw kar sakta hai jab uska timelock expire ho jaye.</li>
                      <li>Rewards automatically on-chain claim hote hain.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                    <strong className="text-white block">5% Reward Cap Mechanism:</strong>
                    <p className="text-gray-400">
                      Hyper-inflation se bachne ke liye total token reward budget ko total supply ke 5% par cap kiya gaya hai. Agar trading volume bohot high hoga toh rewards ETH / Stablecoin me diye jayenge taaki token price par koi dumping pressure na aaye!
                    </p>
                  </div>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="rounded-2xl bg-[#04060a] border border-[#00C805]/20 p-6 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-gray-400">RobynVault.sol (On-Chain Timelock)</span>
                  <span className="text-[#00C805]">Solidity ^0.8.20</span>
                </div>
                <div className="bg-black/80 rounded-xl p-4 text-gray-300 overflow-x-auto text-[11px] leading-relaxed border border-white/5">
                  <span className="text-purple-400">function</span> <span className="text-blue-400">lockTokens</span>(
                    <br />&nbsp;&nbsp;<span className="text-yellow-400">uint256</span> amount,
                    <br />&nbsp;&nbsp;<span className="text-yellow-400">uint256</span> lockDurationDays
                  <br />) <span className="text-purple-400">external</span> {'{'}
                    <br />&nbsp;&nbsp;<span className="text-gray-500">// 1. Non-custodial transfer from user to contract</span>
                    <br />&nbsp;&nbsp;robynToken.<span className="text-blue-400">transferFrom</span>(msg.sender, <span className="text-purple-400">address</span>(<span className="text-purple-400">this</span>), amount);
                    <br />
                    <br />&nbsp;&nbsp;<span className="text-gray-500">// 2. Calculate weighted multiplier</span>
                    <br />&nbsp;&nbsp;<span className="text-yellow-400">uint256</span> multiplier = <span className="text-blue-400">getDurationMultiplier</span>(lockDurationDays);
                    <br />&nbsp;&nbsp;<span className="text-yellow-400">uint256</span> weight = (amount * multiplier) / 100;
                    <br />
                    <br />&nbsp;&nbsp;<span className="text-gray-500">// 3. Record timelock in vault state</span>
                    <br />&nbsp;&nbsp;locks[msg.sender].amount += amount;
                    <br />&nbsp;&nbsp;locks[msg.sender].unlockTimestamp = block.timestamp + (lockDurationDays * 1 days);
                    <br />&nbsp;&nbsp;totalVaultWeight += weight;
                    <br />
                    <br />&nbsp;&nbsp;<span className="text-purple-400">emit</span> <span className="text-blue-400">TokensLocked</span>(msg.sender, amount, lockDurationDays);
                  <br />{'}'}
                </div>
                <p className="text-[10px] text-gray-500">
                  ⚡ Fully compatible with Base, Ethereum, and Arbitrum EVM networks.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE VAULT INTERFACE (TESTNET / SIMULATOR) */}
        {activeTab === 'live_vault' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-[#0a121d] to-[#04070c] border border-[#00C805]/40 p-6 sm:p-8 space-y-6 shadow-[0_0_30px_rgba(0,200,5,0.1)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-mono">Robyn Vault Deposit</h3>
                  <p className="text-xs text-gray-400">Single-Sided Smart Contract Staking</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-gray-400">WALLET STATUS</div>
                  <div className="text-xs font-mono font-bold text-[#00C805]">
                    {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Disconnected'}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 font-mono">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Amount to Lock</span>
                    <span className="text-gray-400">Balance: 125,000 $ROBYN</span>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none focus:border-[#00C805]"
                    />
                    <span className="absolute right-4 top-3 text-xs font-mono text-gray-400">$ROBYN</span>
                  </div>
                </div>

                <div className="space-y-1.5 font-mono">
                  <label className="text-xs text-gray-300">Lock Period</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[7, 30, 90, 365].map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDuration(d)}
                        className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                          selectedDuration === d
                            ? 'bg-[#00C805] text-black border-[#00C805]'
                            : 'bg-black/40 text-gray-300 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {d} Days
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary Matrix */}
                <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Lock Multiplier:</span>
                    <span className="text-white font-bold">{durationObj.multiplier}x Weight</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Unlock Date:</span>
                    <span className="text-[#00C805]">{new Date(Date.now() + selectedDuration * 86400000).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Estimated Real Yield APY:</span>
                    <span className="text-[#00C805] font-bold">{calculatedRealApy.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Synthetic Stock Collateral:</span>
                    <span className="text-cyan-400 font-bold">${(userTokenUsdValue * 0.75).toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Lock Action Button */}
                {isConnected ? (
                  <button
                    onClick={() => alert(`Locking ${tokenAmount} $ROBYN for ${selectedDuration} days in Robyn Non-Custodial Vault...`)}
                    className="w-full py-4 rounded-xl bg-[#00C805] hover:bg-[#00a804] text-black font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,200,5,0.4)]"
                  >
                    🔒 Lock {tokenAmount} $ROBYN Tokens
                  </button>
                ) : (
                  <div className="flex justify-center pt-2">
                    <ConnectButton />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
