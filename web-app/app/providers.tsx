'use client'

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
import { robinhoodChain } from '../lib/chains'

const config = getDefaultConfig({
  appName: 'Robyn Collateral Vault',
  projectId: 'robynhoodvault2024',
  chains: [robinhoodChain],
  wallets: [
    {
      groupName: 'Installed & Recommended',
      wallets: [metaMaskWallet, phantomWallet, injectedWallet, rainbowWallet, walletConnectWallet],
    },
  ],
  ssr: true,
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
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
