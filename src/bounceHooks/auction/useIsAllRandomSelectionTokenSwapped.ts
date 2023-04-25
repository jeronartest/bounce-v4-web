import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'

import { FixedSwapPoolProp } from 'api/pool/type'

const useIsAllRandomSelectionTokenSwapped = (poolInfo: FixedSwapPoolProp) => {
  return useMemo(() => {
    return poolInfo.curPlayer && poolInfo.maxPlayere
      ? new BigNumber(poolInfo.curPlayer).isGreaterThanOrEqualTo(poolInfo.maxPlayere)
      : false
  }, [poolInfo])
}
export default useIsAllRandomSelectionTokenSwapped
