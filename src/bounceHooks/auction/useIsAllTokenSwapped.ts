import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'

import usePoolInfo from './usePoolInfo'

const useIsAllTokenSwapped = () => {
  const { data: poolInfo } = usePoolInfo()

  return useMemo(() => {
    return !!poolInfo ? new BigNumber(poolInfo.swappedAmount0).isGreaterThanOrEqualTo(poolInfo.amountTotal0) : undefined
  }, [poolInfo])
}
export default useIsAllTokenSwapped
