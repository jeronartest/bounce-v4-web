import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'

import { FixedSwapPoolProp } from 'api/pool/type'

const useIsAllTokenSwapped = (poolInfo: FixedSwapPoolProp) => {
  return useMemo(() => {
    return new BigNumber(poolInfo.swappedAmount0).isGreaterThanOrEqualTo(poolInfo.amountTotal0)
  }, [poolInfo])
}
export default useIsAllTokenSwapped
