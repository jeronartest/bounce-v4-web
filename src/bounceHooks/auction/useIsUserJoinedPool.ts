import { FixedSwapPoolProp } from 'api/pool/type'
import { useMemo } from 'react'

const useIsUserJoinedPool = (poolInfo: FixedSwapPoolProp) => {
  return useMemo(() => {
    if (!poolInfo) return undefined
    return poolInfo.participant && poolInfo.participant.currencySwappedAmount0?.greaterThan('0')
  }, [poolInfo])
}

export default useIsUserJoinedPool
