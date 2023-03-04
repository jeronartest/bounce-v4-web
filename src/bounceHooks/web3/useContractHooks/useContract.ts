import { useMemo } from 'react'

import { Contract } from 'ethers'
import { useNetwork } from 'wagmi'
import { useProviderOrSigner } from '../useProviderOrSigner'
import { getContract, getFixedSwapContract } from '@/utils/web3/contract'
import { Erc20 } from '@/constants/web3/contractTypes'
import ERC20_ABI from '@/constants/web3/abis/erc20.json'

// returns null on errors
export function useContract<T extends Contract = Contract>(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)

  const canReturnContract = useMemo(() => address && ABI && providerOrSigner, [address, ABI, providerOrSigner])

  return useMemo(() => {
    if (!canReturnContract) return null
    try {
      return getContract(address, ABI, providerOrSigner)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, providerOrSigner, canReturnContract]) as T
}

// TODO: don't run if interact with native token
export function useErc20Contract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useFixedSwapContract(withSignerIfPossible = true) {
  const { chain } = useNetwork()
  const providerOrSigner = useProviderOrSigner(withSignerIfPossible)

  return useMemo(() => getFixedSwapContract(providerOrSigner, chain?.id), [chain?.id, providerOrSigner])
}
