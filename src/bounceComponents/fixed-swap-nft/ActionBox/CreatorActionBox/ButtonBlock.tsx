import React from 'react'
import { useAccount, useNetwork } from 'wagmi'

import SwitchNetworkButton from '../../SwitchNetworkButton'
import CancelButton from './CancelButton'
import ClaimButton from './ClaimButton'
import ConnectWalletButton from './ConnectWalletButton'
import { PoolStatus } from '@/api/pool/type'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import useChainConfigInBackend from '@/hooks/web3/useChainConfigInBackend'
import useCreatorClaim from '@/hooks/auction/use1155CreatorClaim'

const ButtonBlock = () => {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()

  const { data: poolInfo } = usePoolInfo()

  const chainConfig = useChainConfigInBackend('id', poolInfo?.chainId)
  const chainOfPool = chainConfig.ethChainId
  const isCurrentChainEqualChainOfPool = chain?.id && chain.id === chainOfPool

  const { run: claim, loading: isClaiming } = useCreatorClaim()

  if (!isConnected) {
    return <ConnectWalletButton />
  }

  if (!isCurrentChainEqualChainOfPool) {
    return <SwitchNetworkButton targetChain={chainConfig.ethChainId} />
  }

  if (poolInfo.status === PoolStatus.Closed && !poolInfo.creatorClaimed) {
    return <ClaimButton onClick={claim} loading={isClaiming} />
  }

  if (poolInfo.status === PoolStatus.Upcoming) {
    return <CancelButton />
  }

  return null
}

export default ButtonBlock
