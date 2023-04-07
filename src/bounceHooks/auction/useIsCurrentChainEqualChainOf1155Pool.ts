import { useMemo } from 'react'
import { useNetwork } from 'wagmi'
import useChainConfigInBackend from '../web3/useChainConfigInBackend'
import useNFTPoolInfo from './useNftPoolInfo'

const useIsCurrentChainEqualChainOfPool = () => {
  const { data: poolInfo } = useNFTPoolInfo()
  const { chain } = useNetwork()

  const chainConfig = useChainConfigInBackend('id', poolInfo?.chainId)
  const chainOfPool = chainConfig.ethChainId

  return useMemo(() => chain?.id && chain.id === chainOfPool, [chain?.id, chainOfPool])
}

export default useIsCurrentChainEqualChainOfPool
