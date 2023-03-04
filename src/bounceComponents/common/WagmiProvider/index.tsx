import React, { ReactNode } from 'react'
import { WagmiConfig } from 'wagmi'
import { client } from '@/utils/web3/wagmi'

interface WagmiProviderProps {
  children: ReactNode
}

const WagmiProvider = ({ children }: WagmiProviderProps) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>
}

export default WagmiProvider
