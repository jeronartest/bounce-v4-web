import { useMemo } from 'react'
import { FixedSwapNFTPoolProp } from 'api/pool/type'
import { BigNumber } from 'bignumber.js'

function useMaxSwapAmount0Limit(poolInfo: FixedSwapNFTPoolProp) {
  const hasBidLimit = new BigNumber(poolInfo.maxAmount1PerWallet).gt(0)
  const availableAmount0 = useMemo(() => poolInfo.currentTotal0, [poolInfo.currentTotal0])

  const userSwappedAmount0Units = useMemo(() => {
    return poolInfo.participant.swappedAmount0 || 0
  }, [poolInfo.participant.swappedAmount0])

  const leftAllocationToken0 = useMemo(
    () =>
      hasBidLimit
        ? new BigNumber(poolInfo.maxAmount1PerWallet).gt(userSwappedAmount0Units)
          ? new BigNumber(poolInfo.maxAmount1PerWallet).minus(userSwappedAmount0Units)
          : 0
        : new BigNumber(poolInfo.currentTotal0),
    [hasBidLimit, poolInfo.currentTotal0, poolInfo.maxAmount1PerWallet, userSwappedAmount0Units]
  )

  return useMemo(() => {
    const minimum = BigNumber.minimum(availableAmount0, poolInfo.amountTotal0, leftAllocationToken0)
    return minimum.toString()
  }, [availableAmount0, leftAllocationToken0, poolInfo.amountTotal0])
}

const useIsLimitExceeded1155 = (bidAmount: string, poolInfo: FixedSwapNFTPoolProp) => {
  const token0Allocation = useMaxSwapAmount0Limit(poolInfo)

  return useMemo(() => Number(bidAmount) > Number(token0Allocation), [bidAmount, token0Allocation])
}

export default useIsLimitExceeded1155
