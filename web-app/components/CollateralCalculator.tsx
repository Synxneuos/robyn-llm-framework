'use client'

import React, { useState } from 'react'

interface Props {
  onSelectAmount?: (amount: string, days: number) => void
}

export default function CollateralCalculator({ onSelectAmount }: Props) {
  const [inputEth, setInputEth] = useState<number>(0.5)
  const [duration, setDuration] = useState<number>(30)

  // Global pool baseline: $1.425M NVDA Treasury, 11,445 shares, 250 ETH baseline locked
  const TREASURY_USD = 1425000
  const NVDA_SHARES = 11445
  const ESTIMATED_POOL_TOTAL_ETH = 250

  const getMultiplier = (days: number) => {
    if (days >= 365) return 2.5
    if (days >= 90) return 1.75
    if (days >= 30) return 1.25
    return 1.0
  }

  const multiplier = getMultiplier(duration)
  const weightedAmount = inputEth * multiplier
  const poolSharePct = (weightedAmount / (ESTIMATED_POOL_TOTAL_ETH + weightedAmount)) * 100
  const backedCollateralUsd = (poolSharePct / 100) * TREASURY_USD
  const backedNvdaShares = (poolSharePct / 100) * NVDA_SHARES

  // APY based on duration (4.8% base up to 12.0%)
  const apyPct = 4.8 * multiplier
  const annualDividendUsd = (backedCollateralUsd * apyPct) / 100
  const durationPayoutUsd = (annualDividendUsd * duration) / 365

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#08120b] to-[#040805] border border-green-500/30 p-6 sm:p-8 shadow-xl shadow-green-950/30">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 font-bold text-lg">
            🧮
          </div>
          <div>
            <h3 className="font-extrabold text-white text-lg tracking-tight">
              Automated TradFi Collateral & Yield Calculator
            </h3>
            <p className="text-xs text-gray-400">
              Calculate exact NVDA equity backing, floor price protection, and streaming rewards
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-block bg-green-500/10 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/30">
          Live Algorithm
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        {/* Input sliders */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-300 uppercase mb-2">
              <span>Amount to Lock (ETH)</span>
              <span className="text-green-400 text-sm font-bold">{inputEth} ETH</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="10"
              step="0.05"
              value={inputEth}
              onChange={(e) => setInputEth(parseFloat(e.target.value))}
              className="w-full accent-green-500 h-2 bg-black/60 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-500 mt-1">
              <span>0.05 ETH</span>
              <span>2.5 ETH</span>
              <span>5.0 ETH</span>
              <span>10.0 ETH</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
              Select Lock Duration & Multiplier:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { days: 7, label: '7 Days', mult: '1.0x', apy: '4.8%' },
                { days: 30, label: '30 Days', mult: '1.25x', apy: '6.0%' },
                { days: 90, label: '90 Days', mult: '1.75x', apy: '8.4%' },
                { days: 365, label: '365 Days', mult: '2.5x', apy: '12.0%' },
              ].map((tier) => (
                <button
                  key={tier.days}
                  type="button"
                  onClick={() => setDuration(tier.days)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    duration === tier.days
                      ? 'border-green-400 bg-green-500/20 text-white shadow-md shadow-green-500/20'
                      : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <div className="font-bold text-xs">{tier.label}</div>
                  <div className="text-[11px] text-green-400 font-semibold">{tier.mult}</div>
                  <div className="text-[10px] text-gray-500">{tier.apy} APY</div>
                </button>
              ))}
            </div>
          </div>

          {onSelectAmount && (
            <button
              type="button"
              onClick={() => onSelectAmount(inputEth.toString(), duration)}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl text-sm transition shadow-lg shadow-green-500/20"
            >
              Apply to Lock Position Form →
            </button>
          )}
        </div>

        {/* Calculated Results Card */}
        <div className="rounded-xl bg-black/50 border border-green-500/30 p-5 space-y-4 backdrop-blur-md">
          <div className="text-xs font-bold uppercase tracking-wider text-green-400 flex items-center justify-between">
            <span>Automated Collateral Output</span>
            <span className="text-[11px] text-gray-400">Duration Multiplier: {multiplier}x</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
              <span className="text-[11px] text-gray-400 block mb-0.5">Backed Equity Value</span>
              <span className="text-xl font-bold text-white">${backedCollateralUsd.toFixed(2)}</span>
              <span className="text-[10px] text-green-400 block mt-0.5">Real US Stock Protection</span>
            </div>

            <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
              <span className="text-[11px] text-gray-400 block mb-0.5">NVDA Shares Backing</span>
              <span className="text-xl font-bold text-green-400">{backedNvdaShares.toFixed(2)}</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Shares in Treasury</span>
            </div>

            <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
              <span className="text-[11px] text-gray-400 block mb-0.5">Pool Ownership</span>
              <span className="text-xl font-bold text-white">{poolSharePct.toFixed(3)}%</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Weighted Vault Share</span>
            </div>

            <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
              <span className="text-[11px] text-gray-400 block mb-0.5">Est. Streamed Dividend</span>
              <span className="text-xl font-bold text-emerald-400">${durationPayoutUsd.toFixed(2)}</span>
              <span className="text-[10px] text-emerald-500 block mt-0.5">{apyPct.toFixed(1)}% Annualized Rate</span>
            </div>
          </div>

          <div className="text-xs text-gray-400 bg-green-500/5 border border-green-500/20 rounded-lg p-3 leading-relaxed">
            🛡️ <strong>Principal Floor Guarantee:</strong> Your locked liquidity is algorithmically backed by treasury-held $NVDA equity. If market price dips, treasury collateral ensures downside protection.
          </div>
        </div>
      </div>
    </div>
  )
}
