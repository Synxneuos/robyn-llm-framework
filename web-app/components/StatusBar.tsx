import React from 'react'

interface StatusBarProps {
  blockNumber: number | null
  gasPriceGwei: string
}

export default function StatusBar({ blockNumber, gasPriceGwei }: StatusBarProps) {
  return (
    <div className="bg-[#020406] hairline-border-b py-2 px-4 text-[11px] font-mono text-[#8B949E] overflow-x-auto whitespace-nowrap select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C805] animate-pulse" />
          <span className="text-white font-medium">SYSTEM ONLINE</span>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <span className="text-[#6E7681]">RUNTIME</span>{' '}
            <span className="text-[#C9D1D9]">v1.0.0</span>
          </div>
          <span className="text-[#30363D]">|</span>
          <div>
            <span className="text-[#6E7681]">AGENTS</span>{' '}
            <span className="text-[#C9D1D9]">03 ACTIVE</span>
          </div>
          <span className="text-[#30363D]">|</span>
          <div>
            <span className="text-[#6E7681]">NETWORK</span>{' '}
            <span className="text-[#C9D1D9]">ROBINHOOD MAINNET</span>
          </div>
          <span className="text-[#30363D]">|</span>
          <div>
            <span className="text-[#6E7681]">BLOCK</span>{' '}
            <span className="text-[#00C805] font-semibold">
              #{blockNumber ? blockNumber.toLocaleString() : '54,440,747'}
            </span>
          </div>
          <span className="text-[#30363D]">|</span>
          <div>
            <span className="text-[#6E7681]">GAS</span>{' '}
            <span className="text-[#C9D1D9]">{gasPriceGwei} Gwei</span>
          </div>
          <span className="text-[#30363D]">|</span>
          <div>
            <span className="text-[#6E7681]">RPC LATENCY</span>{' '}
            <span className="text-[#00C805]">100ms (NITRO)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
