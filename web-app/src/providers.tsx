import React from 'react'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import {
  metaMaskWallet,
  phantomWallet,
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { robinhoodChain, robinhoodTestnet } from '../lib/chains'

export const config = getDefaultConfig({
  appName: 'Robyn Collateral Vault',
  projectId: '21fef48091f12692cad574a6f7753648',
  chains: [robinhoodChain, robinhoodTestnet],
  wallets: [
    {
      groupName: 'Installed & Recommended',
      wallets: [metaMaskWallet, phantomWallet, injectedWallet, rainbowWallet, walletConnectWallet],
    },
  ],
  ssr: false,
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          initialChain={robinhoodChain}
          theme={darkTheme({
            accentColor: '#00C805',
            accentColorForeground: '#000000',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
