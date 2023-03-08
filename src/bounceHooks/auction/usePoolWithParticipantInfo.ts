import { useRequest } from 'ahooks'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

import useChainConfigInBackend from '../web3/useChainConfigInBackend'
import { getPoolInfo } from 'api/pool'
import { PoolType } from 'api/pool/type'

const usePoolWithParticipantInfo = () => {
  const router = useRouter()
  const { poolId, chainShortName } = router.query

  const { address: account, isConnected } = useAccount()

  const chainConfigInBackend = useChainConfigInBackend('shortName', chainShortName)

  return useRequest(
    async () => {
      if (typeof poolId !== 'string') {
        return Promise.reject(new Error('Invalid poolId'))
      }

      const response = await getPoolInfo({
        poolId,
        category: PoolType.FixedSwap,
        chainId: chainConfigInBackend?.id,
        address: account
      })

      const rawPoolInfo = response.data.fixedSwapPool

      return {
        ...rawPoolInfo,
        token0: {
          ...rawPoolInfo.token0,
          symbol: rawPoolInfo.token0.symbol.toUpperCase()
        },
        token1: {
          ...rawPoolInfo.token1,
          symbol: rawPoolInfo.token1.symbol.toUpperCase()
        }
      }
    },
    {
      cacheKey: `POOL_INFO_${poolId}_${account}`,
      ready: !!poolId && !!chainConfigInBackend?.id,
      pollingInterval: 30000,
      refreshDeps: [account, isConnected]
    }
  )
}

export default usePoolWithParticipantInfo
