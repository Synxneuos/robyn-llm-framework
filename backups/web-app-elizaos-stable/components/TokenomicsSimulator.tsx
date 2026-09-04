'use client'

import React, { useState } from 'react'

export default function TokenomicsSimulator() {
  const TOTAL_SUPPLY = 1_000_000_000 // 1 Billion $ROBYN

  // User input states
  const [userTokens, setUserTokens] = useState<number>(500_000) // 500k tokens
  const [durationDays, setDurationDays] = useState<number>(90)
  const [percentSupplyLocked, setPercentSupplyLocked] = useState<number>(25) // 25% of supply locked globally
  const [treasuryStockUsd, setTreasuryStockUsd] = useState<number>(1_000_000) // $1M stock collateral
  const [quarterlyFeePoolUsd, setQuarterlyFeePoolUsd] = useState<number>(150_000) // $150k trading fees

  // Duration Multiplier logic
  const getMultiplier = (days: number) => {
    if (days >= 365) return 2.5
    if (days >= 90) return 1.75
    if (days >= 30) return 1.25
    return 1.0
  }

  const multiplier = getMultiplier(durationDays)

  // Calculations
  const totalLockedTokens = (TOTAL_SUPPLY * percentSupplyLocked) / 100
  const userWeightedShares = userTokens * multiplier

  // Average pool weight assumed ~1.5x across stakers
  const totalPoolWeightedShares = totalLockedTokens * 1.5

  // User's pool share percentage: P_i = W_i / W_total
  const userShareFraction = totalPoolWeightedShares > 0 ? userWeightedShares / totalPoolWeightedShares : 0
  const userSharePct = userShareFraction * 100

  // Collateral & Reward allocation
  const userCollateralUsd = userShareFraction * treasuryStockUsd
  const userFloorPricePerToken = userTokens > 0 ? userCollateralUsd / userTokens : 0
  const userQuarterlyRewardUsd = userShareFraction * quarterlyFeePoolUsd
  const userAnnualizedApy = userTokens > 0 ? ((userQuarterlyRewardUsd * 4) / (userTokens * 0.005)) * 100 : 0

  return (
    <div id="tokenomics-sim" className="rounded-3xl bg-gradient-to-b from-[#08120a] via-[#040805] to-[#020402] border border-green-500/20 p-6 sm:p-10 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-green-500/20 text-green-400 text-xs font-extrabold px-3 py-1 rounded-full border border-green-500/30 uppercase tracking-wide">
              1,000,000,000 Total Supply
            </span>
            <span className="text-xs text-gray-400 font-medium">Mathematical Allocation Model</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
            $ROBYN Transparent Reward & Collateral Formula
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-2xl">
            How tokens earn real Wall Street stock collateral and quarterly cash distributions. 100% verifiable mathematics without arbitrary inflated metrics.
          </p>
        </div>
      </div>

      {/* Formula Explanation Banner */}
      <div className="mt-6 p-4 rounded-2xl bg-black/60 border border-white/10 text-xs text-gray-300 grid md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <span className="text-green-400 font-bold uppercase tracking-wider block">1. Weighted Shares</span>
          <code className="text-white font-mono bg-white/5 px-2 py-1 rounded block text-[11px]">
            W_i = Tokens_Locked × Multiplier
          </code>
          <span className="text-gray-400 text-[11px]">7d: 1.0x · 30d: 1.25x · 90d: 1.75x · 365d: 2.5x</span>
        </div>
        <div className="space-y-1">
          <span className="text-green-400 font-bold uppercase tracking-wider block">2. Pool Share %</span>
          <code className="text-white font-mono bg-white/5 px-2 py-1 rounded block text-[11px]">
            P_i = W_i / W_total
          </code>
          <span className="text-gray-400 text-[11px]">Your percentage of the global locked supply</span>
        </div>
        <div className="space-y-1">
          <span className="text-green-400 font-bold uppercase tracking-wider block">3. Reward & Collateral</span>
          <code className="text-white font-mono bg-white/5 px-2 py-1 rounded block text-[11px]">
            Payout = P_i × Total_Fees_Collected
          </code>
          <span className="text-gray-400 text-[11px]">Distributed in ETH or tokenized equity</span>
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="grid lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-6 space-y-5">
          {/* User Token Amount */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-300 uppercase mb-2">
              <span>Your $ROBYN Token Holding</span>
              <span className="text-green-400 font-bold font-mono text-sm">
                {userTokens.toLocaleString()} $ROBYN
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="10000000"
              step="10000"
              value={userTokens}
              onChange={(e) => setUserTokens(parseInt(e.target.value))}
              className="w-full accent-green-500 h-2 bg-black/60 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-500 mt-1">
              <span>10K</span>
              <span>1M</span>
              <span>5M</span>
              <span>10M tokens</span>
            </div>
          </div>

          {/* Lock Duration Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
              Lock Duration & Weight Multiplier:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { days: 7, label: '7 Days', mult: '1.0x' },
                { days: 30, label: '30 Days', mult: '1.25x' },
                { days: 90, label: '90 Days', mult: '1.75x' },
                { days: 365, label: '365 Days', mult: '2.5x' },
              ].map((tier) => (
                <button
                  key={tier.days}
                  type="button"
                  onClick={() => setDurationDays(tier.days)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    durationDays === tier.days
                      ? 'border-green-400 bg-green-500/20 text-white shadow-md shadow-green-500/20'
                      : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/25'
                  }`}
                >
                  <div className="font-bold text-xs">{tier.label}</div>
                  <div className="text-[11px] text-green-400 font-semibold mt-0.5">{tier.mult}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Global Vault Assumptions (Simulation Sliders) */}
          <div className="pt-2 border-t border-white/10 space-y-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Market Assumptions (Dynamic Parameters):
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Total 1B Supply Locked:</span>
                <span className="text-white font-mono font-semibold">{percentSupplyLocked}% ({totalLockedTokens.toLocaleString()} tokens)</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={percentSupplyLocked}
                onChange={(e) => setPercentSupplyLocked(parseInt(e.target.value))}
                className="w-full accent-green-500 h-1.5 bg-black/60 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Protocol Revenue Pool (Trading Fees & Divs):</span>
                <span className="text-white font-mono font-semibold">${quarterlyFeePoolUsd.toLocaleString()} / quarter</span>
              </div>
              <input
                type="range"
                min="25000"
                max="1000000"
                step="25000"
                value={quarterlyFeePoolUsd}
                onChange={(e) => setQuarterlyFeePoolUsd(parseInt(e.target.value))}
                className="w-full accent-green-500 h-1.5 bg-black/60 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Output Calculation Results Card */}
        <div className="lg:col-span-6 rounded-2xl bg-black/70 border border-green-500/30 p-6 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-green-400">
              Mathematical Output for Your Position
            </span>
            <span className="text-[11px] text-gray-400">
              Weighted: <strong className="text-white">{userWeightedShares.toLocaleString()}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/5">
              <span className="text-[11px] text-gray-400 block mb-0.5">Your Vault Share (P_i)</span>
              <span className="text-2xl font-black text-white">{userSharePct.toFixed(4)}%</span>
              <span className="text-[10px] text-gray-500 block mt-0.5">Of all staked weighted shares</span>
            </div>

            <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/5">
              <span className="text-[11px] text-gray-400 block mb-0.5">Quarterly Reward Payout</span>
              <span className="text-2xl font-black text-green-400">${userQuarterlyRewardUsd.toFixed(2)}</span>
              <span className="text-[10px] text-emerald-500 block mt-0.5">Direct Cash Distributions</span>
            </div>

            <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/5">
              <span className="text-[11px] text-gray-400 block mb-0.5">Backed Equity Collateral</span>
              <span className="text-2xl font-black text-white">${userCollateralUsd.toFixed(2)}</span>
              <span className="text-[10px] text-green-400 block mt-0.5">Treasury $NVDA Protection</span>
            </div>

            <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/5">
              <span className="text-[11px] text-gray-400 block mb-0.5">Guaranteed Price Floor</span>
              <span className="text-2xl font-black text-emerald-400">${userFloorPricePerToken.toFixed(4)}</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Per Token Min Value</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-green-950/20 border border-green-500/25 text-xs text-gray-300 leading-relaxed space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>⚖️ Exact Distribution Logic:</span>
            </div>
            <p>
              Rewards are never printed out of thin air. They derive exclusively from real economic yield: DEX trading fees on Robinhood Chain and stock dividend disbursements from the treasury. If 100% of stakers unstake, your principal and accumulated cash remain fully intact in the verified smart contract.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
