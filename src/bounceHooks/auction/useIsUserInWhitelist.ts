import { useCallback, useEffect, useState } from 'react'

import { FixedSwapPoolProp, PoolType } from 'api/pool/type'
import { getUserWhitelistProof } from 'api/user'
import useChainConfigInBackend from 'bounceHooks/web3/useChainConfigInBackend'
import { useActiveWeb3React } from 'hooks'
import { useQueryParams } from 'hooks/useQueryParams'

const useIsUserInWhitelist = (poolInfo: FixedSwapPoolProp) => {
  const { account } = useActiveWeb3React()

  const { poolId, chainShortName } = useQueryParams()

  const chainConfigInBackend = useChainConfigInBackend('shortName', chainShortName || '')

  const [isUserInWhitelist, setIsUserInWhitelist] = useState<boolean>()
  const [isCheckingWhitelist, setisCheckingWhitelist] = useState(true)

  const checkIsUserInWhitelist = useCallback(async () => {
    // console.log('account: ', account)
    // console.log('chainConfigInBackend?.id: ', chainConfigInBackend?.id)
    // console.log('poolId: ', poolId)

    if (!poolInfo.enableWhiteList) {
      setIsUserInWhitelist(true)
      setisCheckingWhitelist(false)
      return
    }

    if (!account || !chainConfigInBackend?.id || !poolId) {
      setIsUserInWhitelist(undefined)
      setisCheckingWhitelist(false)
      return
    }

    try {
      const proof = await getUserWhitelistProof({
        address: account,
        category: PoolType.FixedSwap,
        chainId: chainConfigInBackend?.id,
        poolId: String(poolId)
      })

      setIsUserInWhitelist(!!proof)
    } catch (error) {
      setIsUserInWhitelist(false)
    } finally {
      setisCheckingWhitelist(false)
    }
  }, [account, chainConfigInBackend?.id, poolId, poolInfo.enableWhiteList])

  useEffect(() => {
    checkIsUserInWhitelist()
  }, [checkIsUserInWhitelist])

  return { data: isUserInWhitelist, loading: isCheckingWhitelist }
}

export default useIsUserInWhitelist
