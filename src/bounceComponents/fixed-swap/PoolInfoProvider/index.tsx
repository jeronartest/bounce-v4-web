import React, { createContext, ReactNode, useContext } from 'react'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { useRequest } from 'ahooks'
import useChainConfigInBackend from 'bounceHooks/web3/useChainConfigInBackend'
import { FixedSwapPool, PoolType } from 'api/pool/type'
import { getPoolInfo } from 'api/pool'

const PoolInfoContext = createContext<FixedSwapPool | null>(null)

export const usePoolInfoContext = () => {
  const context = useContext(PoolInfoContext)
  console.log('>>>>> context: ', context)
  // if (context === undefined) {
  //   throw new Error('usePoolInfoContext must be used within PoolInfoContext')
  // }
  return context
}

const PoolInfoProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const router = useRouter()
  const { poolId, chainShortName } = router.query

  const { address: account } = useAccount()

  const chainConfigInBackend = useChainConfigInBackend('shortName', chainShortName)

  const { data: poolInfo } = useRequest(
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

      return response.data.fixedSwapPool || null
    },
    {
      cacheKey: `POOL_INFO_${account}`,
      ready: typeof poolId === 'string' && !!poolId && !!chainConfigInBackend?.id,
      // pollingInterval: 10000,
      refreshDeps: [account]
    }
  )

  return <PoolInfoContext.Provider value={poolInfo}>{children}</PoolInfoContext.Provider>
}

export default PoolInfoProvider
