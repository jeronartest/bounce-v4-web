import { useRequest } from 'ahooks'

import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import useChainConfigInBackend from '../web3/useChainConfigInBackend'
import { getPoolHistory } from 'api/pool'
import { PoolType } from 'api/pool/type'

const usePoolHistory = () => {
  const router = useRouter()
  const { poolId, chainShortName } = router.query

  const { address: account, isConnected } = useAccount()

  const chainConfigInBackend = useChainConfigInBackend('shortName', chainShortName)

  return useRequest(
    async () => {
      if (typeof poolId !== 'string') {
        return Promise.reject(new Error('Invalid poolId'))
      }

      const response = await getPoolHistory({
        poolId,
        category: PoolType.FixedSwap,
        chainId: chainConfigInBackend?.id,
        address: account
      })

      return response.data
    },
    {
      cacheKey: `POOL_HISTORY_${account}`,
      ready: !!poolId && !!chainConfigInBackend?.id,
      // pollingInterval: 10000,
      refreshDeps: [account, isConnected]
    }
  )
}

export default usePoolHistory
