import { useRequest } from 'ahooks'

import useChainConfigInBackend from '../web3/useChainConfigInBackend'
import { getPoolHistory } from 'api/pool'
import { PoolType } from 'api/pool/type'
import { useQueryParams } from 'hooks/useQueryParams'
import { useActiveWeb3React } from 'hooks'

const usePoolHistory = () => {
  const { poolId, chainShortName } = useQueryParams()

  const { account } = useActiveWeb3React()

  const chainConfigInBackend = useChainConfigInBackend('shortName', chainShortName || '')

  return useRequest(
    async () => {
      if (typeof poolId !== 'string') {
        return Promise.reject(new Error('Invalid poolId'))
      }

      const response = await getPoolHistory({
        poolId,
        category: PoolType.FixedSwap,
        chainId: chainConfigInBackend?.id || 0,
        address: account || ''
      })

      return response.data
    },
    {
      // cacheKey: `POOL_HISTORY_${account}`,
      ready: !!poolId && !!chainConfigInBackend?.id,
      // pollingInterval: 10000,
      refreshDeps: [account]
    }
  )
}

export default usePoolHistory
