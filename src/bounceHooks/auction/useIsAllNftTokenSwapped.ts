import { useMemo } from 'react'

import usePoolInfo from './useNftPoolInfo'

const useIsAllTokenSwapped = () => {
  const { data: poolInfo } = usePoolInfo()
  return useMemo(() => {
    // nft amount must be integer
    return !!poolInfo ? poolInfo.swappedAmount0 >= poolInfo.amountTotal0 : undefined
  }, [poolInfo])
}
export default useIsAllTokenSwapped
