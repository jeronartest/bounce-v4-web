import { useMemo } from 'react'
import { useAccount, useProvider, useSigner } from 'wagmi'

import { getDefaultChainId } from '@/utils/web3/chain'

export const useProviderOrSigner = (withSignerIfPossible = true) => {
  const provider = useProvider({ chainId: getDefaultChainId() })
  const { address, isConnected } = useAccount()
  const { data: signer } = useSigner()

  return useMemo(
    () => (withSignerIfPossible && address && isConnected && signer ? signer : provider),
    [address, isConnected, provider, signer, withSignerIfPossible],
  )
}
