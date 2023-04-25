import { useMemo } from 'react'
import { FixedSwapPoolProp } from 'api/pool/type'

const useIsLimitExceeded = (poolInfo: FixedSwapPoolProp) => {
  return useMemo(() => Number(poolInfo.curPlayer) >= Number(poolInfo.maxPlayere), [poolInfo])
}

export default useIsLimitExceeded
