'use client'

import React, { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { VAULT_ABI } from '../lib/vaultAbi'
import { VAULT_ADDRESS } from '../lib/constants'

const DURATION_OPTIONS = [
  { days: 7, label: '7 Days', multiplier: '1.0x', reward: '4.8% APY' },
  { days: 30, label: '30 Days', multiplier: '1.25x', reward: '6.0% APY' },
  { days: 90, label: '90 Days', multiplier: '1.75x', reward: '8.4% APY' },
  { days: 365, label: '1 Year', multiplier: '2.5x', reward: '12.0% APY' },
]

function formatUsd(wei: bigint): string {
  const val = Number(wei) / 1e18
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`
  if (val >= 1_000) return `$${(val / 1_000).toFixed(2)}K`
  return `$${val.toFixed(2)}`
}

function formatEthValue(wei: bigint): string {
  return parseFloat(formatEther(wei)).toFixed(4)
}

function timeUntilUnlock(unlockTime: bigint): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = Number(unlockTime) - now
  if (diff <= 0) return 'Unlockable now!'
  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  return `${days}d ${hours}h remaining`
}

interface VaultDashboardProps {
  presetAmount?: string
  presetDuration?: number
}

export default function VaultDashboard({ presetAmount, presetDuration }: VaultDashboardProps) {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })

  const [ethAmount, setEthAmount] = useState(presetAmount || '')
  const [durationDays, setDurationDays] = useState(presetDuration || 30)
  const [activeTab, setActiveTab] = useState<'lock' | 'claim' | 'unlock'>('lock')

  // Update if preset changes
  React.useEffect(() => {
    if (presetAmount) setEthAmount(presetAmount)
    if (presetDuration) setDurationDays(presetDuration)
  }, [presetAmount, presetDuration])

  const isZeroAddress = VAULT_ADDRESS === '0x0000000000000000000000000000000000000000'

  // Read global vault stats
  const { data: totalLocked } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'totalTokensLocked',
    query: { enabled: !isZeroAddress },
  })

  const { data: totalTreasuryUsd } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'totalTreasuryStockUsd',
    query: { enabled: !isZeroAddress },
  })

  const { data: totalNvdaShares } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'totalStockSharesNvda',
    query: { enabled: !isZeroAddress },
  })

  const { data: totalDividends } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'totalDividendsStreamed',
    query: { enabled: !isZeroAddress },
  })

  // Read user position
  const { data: userOverview } = useReadContract({
    address: VAULT_ADDRESS,
    abi: VAULT_ABI,
    functionName: 'getUserVaultOverview',
    args: address ? [address] : undefined,
    query: { enabled: !isZeroAddress && !!address },
  })

  // Write: Lock Tokens
  const { writeContract: writeLock, data: lockTxHash, isPending: isLocking } = useWriteContract()
  const { isLoading: isLockConfirming, isSuccess: isLockSuccess } = useWaitForTransactionReceipt({
    hash: lockTxHash,
  })

  // Write: Claim Dividends
  const { writeContract: writeClaim, data: claimTxHash, isPending: isClaiming } = useWriteContract()
  const { isLoading: isClaimConfirming, isSuccess: isClaimSuccess } = useWaitForTransactionReceipt({
    hash: claimTxHash,
  })

  // Write: Unlock Tokens
  const { writeContract: writeUnlock, data: unlockTxHash, isPending: isUnlocking } = useWriteContract()
  const { isLoading: isUnlockConfirming, isSuccess: isUnlockSuccess } = useWaitForTransactionReceipt({
    hash: unlockTxHash,
  })

  const handleLock = () => {
    if (!ethAmount || isNaN(parseFloat(ethAmount))) return
    writeLock({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'lockTokens',
      args: ['0x0000000000000000000000000000000000000000', BigInt(0), BigInt(durationDays)],
      value: parseEther(ethAmount),
    })
  }

  const handleClaim = () => {
    writeClaim({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'claimDividends',
    })
  }

  const handleUnlock = () => {
    writeUnlock({
      address: VAULT_ADDRESS,
      abi: VAULT_ABI,
      functionName: 'unlockTokens',
      args: ['0x0000000000000000000000000000000000000000'],
    })
  }

  const [lockedAmount, unlockTime, userShareBps, stockCollateralUsd, stockSharesNvda, pendingDividends] =
    userOverview ?? [BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0)]

  const hasPosition = lockedAmount > BigInt(0)
  const isUnlockable = hasPosition && unlockTime > BigInt(0) && Number(unlockTime) <= Math.floor(Date.now() / 1000)

  return (
    <div id="vault-actions" className="space-y-6">
      {/* Genesis Pre-Launch Status Banner */}
      <div className="rounded-2xl bg-black/50 border border-green-500/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
          <span className="text-gray-300">
            <strong className="text-white">Smart Contract Verified:</strong>{' '}
            <a
              href={`https://robinhoodchain.blockscout.com/address/${VAULT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-green-400 hover:underline"
            >
              {VAULT_ADDRESS}
            </a>
          </span>
        </div>
        <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/30 text-[11px] font-bold">
          Genesis Stage · Pre-Configured On-Chain
        </span>
      </div>

      {/* Global Vault Statistics Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Locked Liquidity',
            value: totalLocked && totalLocked > BigInt(0) ? `${formatEthValue(totalLocked)} ETH` : '0.00 ETH',
            sub: totalLocked && totalLocked > BigInt(0) ? 'Staked in Collateral Pool' : 'Awaiting Genesis Deposits',
            icon: '🔒',
          },
          {
            label: 'Treasury Stock Collateral',
            value: totalTreasuryUsd && totalTreasuryUsd > BigInt(0) ? formatUsd(totalTreasuryUsd) : '$0.00',
            sub: totalTreasuryUsd && totalTreasuryUsd > BigInt(0) ? 'Held in On-Chain Escrow' : 'Escrow Ready for Launch',
            icon: '🏦',
          },
          {
            label: 'Real NVDA Shares',
            value: totalNvdaShares && totalNvdaShares > BigInt(0) ? `${(Number(totalNvdaShares) / 1e18).toFixed(0)}` : '0',
            sub: totalNvdaShares && totalNvdaShares > BigInt(0) ? 'Backing Tokenized Equity' : 'Treasury Escrow Standby',
            icon: '📈',
          },
          {
            label: 'Dividends Distributed',
            value: totalDividends && totalDividends > BigInt(0) ? formatUsd(totalDividends) : '$0.00',
            sub: totalDividends && totalDividends > BigInt(0) ? 'Streamed to Stakers' : 'Activated Post-Genesis',
            icon: '💰',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-gradient-to-b from-[#09140b] to-[#040805] border border-green-500/25 p-5 shadow-lg backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <span className="text-base">{stat.icon}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {stat.value}
            </div>
            <div className="text-[11px] text-green-400/80 font-medium mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* User Position Overview Card (if connected and has position) */}
      {isConnected && hasPosition && (
        <div className="rounded-2xl bg-gradient-to-r from-green-950/40 via-emerald-950/30 to-black/60 border-2 border-green-500/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 font-bold text-lg">
                👤
              </div>
              <div>
                <h3 className="font-extrabold text-white text-lg tracking-tight">Your Active Vault Position</h3>
                <p className="text-xs text-green-400">Verified On-Chain Staking Entitlement</p>
              </div>
            </div>
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/40">
              Active Staker
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
              <p className="text-gray-400 text-xs font-semibold mb-1">Locked Amount</p>
              <p className="text-white font-extrabold text-lg">{formatEthValue(lockedAmount)} ETH</p>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
              <p className="text-gray-400 text-xs font-semibold mb-1">Pool Share</p>
              <p className="text-white font-extrabold text-lg">{(Number(userShareBps) / 100).toFixed(2)}%</p>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
              <p className="text-gray-400 text-xs font-semibold mb-1">Stock Collateral</p>
              <p className="text-green-400 font-extrabold text-lg">{formatUsd(stockCollateralUsd)}</p>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
              <p className="text-gray-400 text-xs font-semibold mb-1">NVDA Shares</p>
              <p className="text-white font-extrabold text-lg">{(Number(stockSharesNvda) / 1e18).toFixed(2)}</p>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
              <p className="text-gray-400 text-xs font-semibold mb-1">Unclaimed Dividends</p>
              <p className="text-emerald-400 font-extrabold text-lg">{formatEthValue(pendingDividends)} ETH</p>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
              <p className="text-gray-400 text-xs font-semibold mb-1">Maturity Status</p>
              <p className={`font-extrabold text-xs mt-1 ${isUnlockable ? 'text-green-400' : 'text-yellow-400'}`}>
                {timeUntilUnlock(unlockTime)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive Action Box */}
      <div className="rounded-2xl bg-gradient-to-b from-[#08120a] to-[#030604] border border-green-500/30 overflow-hidden shadow-2xl">
        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-black/40">
          {(['lock', 'claim', 'unlock'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-sm font-bold tracking-wide transition uppercase flex items-center justify-center gap-2 ${
                activeTab === tab
                  ? 'bg-green-500/15 text-green-400 border-b-2 border-green-400 shadow-inner'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <span>{tab === 'lock' ? '🔒 1. Lock Liquidity' : tab === 'claim' ? '💰 2. Claim Dividends' : '🔓 3. Unlock Principal'}</span>
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {activeTab === 'lock' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Deposit Amount (Native ETH or Meme Tokens):
                  </label>
                  {balance && (
                    <span className="text-xs text-gray-400">
                      Balance: <strong className="text-white font-mono">{formatEthValue(balance.value)} ETH</strong>
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-black/70 border border-white/15 focus:border-green-400 rounded-xl px-4 py-3.5 text-lg text-white font-mono focus:outline-none transition shadow-inner"
                  />
                  {balance && (
                    <button
                      type="button"
                      onClick={() => setEthAmount(formatEther(balance.value))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-bold px-2.5 py-1 rounded-lg transition"
                    >
                      MAX
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Select Lock Duration Tier (Weight Multiplier):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.days}
                      type="button"
                      onClick={() => setDurationDays(opt.days)}
                      className={`p-3.5 rounded-xl border text-center transition ${
                        durationDays === opt.days
                          ? 'border-green-400 bg-green-500/20 text-white shadow-lg shadow-green-500/20'
                          : 'border-white/10 bg-black/40 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <div className="font-extrabold text-sm">{opt.label}</div>
                      <div className="text-xs text-green-400 font-bold mt-1">{opt.multiplier} Shares</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{opt.reward}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Transaction Preview */}
              {ethAmount && !isNaN(parseFloat(ethAmount)) && parseFloat(ethAmount) > 0 && (
                <div className="bg-green-950/20 border border-green-500/30 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Estimated NVDA Collateral:</span>
                    <span className="text-green-400 font-bold font-mono">
                      ~${(parseFloat(ethAmount) * 2500 * (durationDays >= 365 ? 2.5 : durationDays >= 90 ? 1.75 : durationDays >= 30 ? 1.25 : 1.0)).toFixed(2)} USD
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Execution Layer:</span>
                    <span className="text-white font-semibold">Robinhood Chain (ID: 4663) · 100ms Nitro</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Est. Network Gas:</span>
                    <span className="text-emerald-400 font-bold font-mono">&lt; 0.0001 ETH (0.36 Gwei)</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleLock}
                disabled={!ethAmount || isLocking || isLockConfirming || !isConnected}
                className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-black font-extrabold py-4 rounded-xl text-base transition shadow-xl shadow-green-500/30 flex items-center justify-center gap-2"
              >
                {!isConnected
                  ? 'Connect Wallet Above to Lock'
                  : isLocking
                  ? 'Confirm in MetaMask / Phantom...'
                  : isLockConfirming
                  ? 'Confirming on Robinhood Chain (100ms)...'
                  : isLockSuccess
                  ? '✅ Position Successfully Locked!'
                  : '🔒 Lock Liquidity & Mint Equity Shares'}
              </button>

              {lockTxHash && (
                <div className="text-center pt-2">
                  <a
                    href={`https://robinhoodchain.blockscout.com/tx/${lockTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 text-xs font-semibold underline"
                  >
                    View Confirmed Transaction on Robinhood Blockscout ↗
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'claim' && (
            <div className="space-y-6 max-w-md mx-auto text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-3xl">
                💰
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Accrued Wall Street Stock Dividends
                </p>
                <p className="text-4xl sm:text-5xl font-black text-green-400 tracking-tight">
                  {formatEthValue(pendingDividends)} ETH
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Generated from treasury-backed US equity distributions on Robinhood Chain
                </p>
              </div>

              <button
                type="button"
                onClick={handleClaim}
                disabled={!isConnected || pendingDividends === BigInt(0) || isClaiming || isClaimConfirming}
                className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-black font-extrabold py-4 rounded-xl text-base transition shadow-xl shadow-green-500/30"
              >
                {!isConnected
                  ? 'Connect Wallet to Claim'
                  : isClaiming
                  ? 'Confirm Claim in Wallet...'
                  : isClaimConfirming
                  ? 'Streaming Payout...'
                  : isClaimSuccess
                  ? '✅ Dividends Claimed!'
                  : pendingDividends === BigInt(0)
                  ? 'No Dividends Ready (Lock Tokens First)'
                  : '💰 Claim Streaming Dividends'}
              </button>

              {claimTxHash && (
                <a
                  href={`https://robinhoodchain.blockscout.com/tx/${claimTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline text-xs block"
                >
                  View Payout on Blockscout ↗
                </a>
              )}
            </div>
          )}

          {activeTab === 'unlock' && (
            <div className="space-y-6 max-w-md mx-auto text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-3xl">
                🔓
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Principal Staked in Vault
                </p>
                <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {formatEthValue(lockedAmount)} ETH
                </p>
                <p className={`text-xs font-semibold mt-2 ${isUnlockable ? 'text-green-400' : 'text-yellow-400'}`}>
                  {hasPosition ? timeUntilUnlock(unlockTime) : 'No tokens currently locked'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleUnlock}
                disabled={!isConnected || !isUnlockable || isUnlocking || isUnlockConfirming}
                className="w-full bg-white hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-black font-extrabold py-4 rounded-xl text-base transition shadow-xl"
              >
                {!isConnected
                  ? 'Connect Wallet to Unlock'
                  : isUnlocking
                  ? 'Confirming in Wallet...'
                  : isUnlockConfirming
                  ? 'Releasing Principal...'
                  : isUnlockSuccess
                  ? '✅ Principal Unlocked!'
                  : isUnlockable
                  ? '🔓 Unlock All Staked Tokens'
                  : '⏳ Lock Duration Not Expired'}
              </button>

              {unlockTxHash && (
                <a
                  href={`https://robinhoodchain.blockscout.com/tx/${unlockTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline text-xs block"
                >
                  View Unlock Transaction on Blockscout ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
