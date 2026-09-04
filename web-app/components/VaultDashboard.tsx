'use client'

import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useBalance } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { VAULT_ABI } from '../lib/vaultAbi'
import { VAULT_ADDRESS } from '../lib/constants'

const DURATION_OPTIONS = [
  { days: 7,   label: '7 Days',   multiplier: '1.0x',  reward: '4.8% APY' },
  { days: 30,  label: '30 Days',  multiplier: '1.25x', reward: '6.0% APY' },
  { days: 90,  label: '90 Days',  multiplier: '1.75x', reward: '8.4% APY' },
  { days: 365, label: '1 Year',   multiplier: '2.5x',  reward: '12% APY'  },
]

function formatUsd(wei: bigint): string {
  const val = Number(wei) / 1e18
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`
  if (val >= 1_000) return `$${(val / 1_000).toFixed(2)}K`
  return `$${val.toFixed(2)}`
}

function formatEthValue(wei: bigint): string {
  return parseFloat(formatEther(wei)).toFixed(6)
}

function timeUntilUnlock(unlockTime: bigint): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = Number(unlockTime) - now
  if (diff <= 0) return 'Unlockable now!'
  const days = Math.floor(diff / 86400)
  const hours = Math.floor((diff % 86400) / 3600)
  return `${days}d ${hours}h remaining`
}

export default function VaultDashboard() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })

  const [ethAmount, setEthAmount] = useState('')
  const [durationDays, setDurationDays] = useState(30)
  const [activeTab, setActiveTab] = useState<'lock' | 'claim' | 'unlock'>('lock')

  const isZeroAddress = VAULT_ADDRESS === '0x0000000000000000000000000000000000000000'

  // Read global vault stats
  const { data: totalLocked, refetch: refetchStats } = useReadContract({
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
  const { data: userOverview, refetch: refetchUserData } = useReadContract({
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

  // User data from contract
  const [lockedAmount, unlockTime, userShareBps, stockCollateralUsd, stockSharesNvda, pendingDividends, guaranteedFloor] = userOverview ?? [BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0)]
  const hasPosition = lockedAmount > BigInt(0)
  const isUnlockable = hasPosition && unlockTime > BigInt(0) && Number(unlockTime) <= Math.floor(Date.now() / 1000)

  if (!isConnected) return null

  return (
    <div className="space-y-6">
      {isZeroAddress && (
        <div className="card-bg rounded-xl p-4 border border-yellow-500/40 bg-yellow-500/5">
          <p className="text-yellow-400 text-sm font-medium">
            ⚠️ Contract not deployed yet. Run <code className="bg-black/30 px-1 rounded">python scripts/deploy_vault.py</code> then paste the address in <code className="bg-black/30 px-1 rounded">lib/constants.ts</code>
          </p>
        </div>
      )}

      {/* Global Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Locked', value: totalLocked ? `${formatEthValue(totalLocked)} ETH` : '—' },
          { label: 'Treasury (NVDA)', value: totalTreasuryUsd ? formatUsd(totalTreasuryUsd) : '—' },
          { label: 'NVDA Shares', value: totalNvdaShares ? `${(Number(totalNvdaShares) / 1e18).toFixed(0)}` : '—' },
          { label: 'Dividends Streamed', value: totalDividends ? formatUsd(totalDividends) : '—' },
        ].map((stat) => (
          <div key={stat.label} className="card-bg rounded-xl p-4 text-center">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{stat.label}</p>
            <p className="text-white font-bold text-lg">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* User Position Card */}
      {hasPosition && (
        <div className="card-bg rounded-xl p-6 glow-border">
          <h3 className="text-green-400 font-bold text-lg mb-4">Your Position</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-xs mb-1">Locked Amount</p>
              <p className="text-white font-semibold">{formatEthValue(lockedAmount)} ETH</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Your Pool Share</p>
              <p className="text-white font-semibold">{(Number(userShareBps) / 100).toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Stock Collateral</p>
              <p className="text-green-400 font-semibold">{formatUsd(stockCollateralUsd)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">NVDA Shares</p>
              <p className="text-white font-semibold">{(Number(stockSharesNvda) / 1e18).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Pending Dividends</p>
              <p className="text-green-400 font-semibold">{formatEthValue(pendingDividends)} ETH</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Unlock Status</p>
              <p className={isUnlockable ? 'text-green-400 font-semibold' : 'text-yellow-400 font-semibold'}>
                {timeUntilUnlock(unlockTime)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Tabs */}
      <div className="card-bg rounded-xl overflow-hidden">
        <div className="flex border-b border-white/10">
          {(['lock', 'claim', 'unlock'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-green-500/10 text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'lock' ? '🔒 Lock Tokens' : tab === 'claim' ? '💰 Claim Dividends' : '🔓 Unlock'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'lock' && (
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Amount (ETH)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition-colors"
                  />
                  {balance && (
                    <button
                      onClick={() => setEthAmount(formatEthValue(balance.value))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-xs font-medium hover:text-green-300"
                    >
                      MAX
                    </button>
                  )}
                </div>
                {balance && (
                  <p className="text-gray-500 text-xs mt-1">Balance: {formatEthValue(balance.value)} ETH</p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Lock Duration</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.days}
                      onClick={() => setDurationDays(opt.days)}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        durationDays === opt.days
                          ? 'border-green-400 bg-green-500/10 text-white'
                          : 'border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <div className="font-semibold text-sm">{opt.label}</div>
                      <div className="text-xs text-green-400 mt-1">{opt.multiplier}</div>
                      <div className="text-xs text-gray-500">{opt.reward}</div>
                    </button>
                  ))}
                </div>
              </div>

              {ethAmount && !isNaN(parseFloat(ethAmount)) && (
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estimated Stock Collateral:</span>
                    <span className="text-green-400 font-medium">
                      ~{formatUsd(BigInt(Math.floor(parseFloat(ethAmount) * 2500 * 1e18 / 1e3)))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-white">Robinhood Chain (ID: 4663)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Est. Gas:</span>
                    <span className="text-white">~0.0001 ETH (0.4 Gwei)</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleLock}
                disabled={!ethAmount || isLocking || isLockConfirming || isZeroAddress}
                className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors"
              >
                {isLocking ? 'Confirm in Wallet...' : isLockConfirming ? 'Confirming on Chain...' : isLockSuccess ? '✅ Locked!' : '🔒 Lock Tokens'}
              </button>

              {lockTxHash && (
                <a
                  href={`https://robinhoodchain.blockscout.com/tx/${lockTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-green-400 text-sm hover:underline"
                >
                  View on Blockscout →
                </a>
              )}
            </div>
          )}

          {activeTab === 'claim' && (
            <div className="space-y-4">
              {hasPosition ? (
                <>
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm mb-1">Pending Dividends Available</p>
                    <p className="text-4xl font-bold text-green-400">{formatEthValue(pendingDividends)} ETH</p>
                    <p className="text-gray-500 text-sm mt-1">From NVDA stock treasury distributions</p>
                  </div>
                  <button
                    onClick={handleClaim}
                    disabled={pendingDividends === BigInt(0) || isClaiming || isClaimConfirming || isZeroAddress}
                    className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors"
                  >
                    {isClaiming ? 'Confirm in Wallet...' : isClaimConfirming ? 'Processing...' : isClaimSuccess ? '✅ Claimed!' : '💰 Claim Dividends'}
                  </button>
                  {claimTxHash && (
                    <a
                      href={`https://robinhoodchain.blockscout.com/tx/${claimTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-green-400 text-sm hover:underline"
                    >
                      View on Blockscout →
                    </a>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No active position. Lock tokens first to earn dividends.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'unlock' && (
            <div className="space-y-4">
              {hasPosition ? (
                <>
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm mb-1">Your Locked Amount</p>
                    <p className="text-4xl font-bold text-white">{formatEthValue(lockedAmount)} ETH</p>
                    <p className={`text-sm mt-2 ${isUnlockable ? 'text-green-400' : 'text-yellow-400'}`}>
                      {timeUntilUnlock(unlockTime)}
                    </p>
                  </div>
                  <button
                    onClick={handleUnlock}
                    disabled={!isUnlockable || isUnlocking || isUnlockConfirming || isZeroAddress}
                    className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors"
                  >
                    {isUnlocking ? 'Confirm in Wallet...' : isUnlockConfirming ? 'Processing...' : isUnlockSuccess ? '✅ Unlocked!' : isUnlockable ? '🔓 Unlock Tokens' : '⏳ Still Locked'}
                  </button>
                  {unlockTxHash && (
                    <a
                      href={`https://robinhoodchain.blockscout.com/tx/${unlockTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-green-400 text-sm hover:underline"
                    >
                      View on Blockscout →
                    </a>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No active position to unlock.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
