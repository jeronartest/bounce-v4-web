import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import { parseUnits } from 'ethers/lib/utils.js'
import { getUserSwappedAmount1, getUserSwappedUnits1 } from 'utils/auction'
import { FixedSwapPoolProp } from 'api/pool/type'

const useIsLimitExceeded = (bidAmount: string, poolInfo: FixedSwapPoolProp) => {
  const userSwappedAmount1Units = getUserSwappedUnits1(
    getUserSwappedAmount1(
      poolInfo?.participant.swappedAmount0 || 0,
      poolInfo.token0.decimals,
      poolInfo.token1.decimals,
      poolInfo.ratio
    ),
    poolInfo.token1.decimals
  )
  const hasBidLimit = useMemo(() => new BigNumber(poolInfo.maxAmount1PerWallet).gt(0), [poolInfo.maxAmount1PerWallet])

  const token1AllocationUnits = hasBidLimit
    ? new BigNumber(poolInfo.maxAmount1PerWallet)
    : new BigNumber(poolInfo.amountTotal1)

  const bidAmountUnits = new BigNumber(bidAmount ? parseUnits(bidAmount, poolInfo.token1.decimals).toString() : '0')

  const isBidAmountGtLeftAllocationToken1 = bidAmountUnits.gt(token1AllocationUnits)

  const isUserSwappedAmount1GteToken1Allocation = userSwappedAmount1Units.gte(token1AllocationUnits)

  // console.log('isBidAmountGtLeftAllocationToken1: ', isBidAmountGtLeftAllocationToken1)
  // console.log('isUserSwappedAmount1GteLeftAllocationToken1: ', isUserSwappedAmount1GteToken1Allocation)

  return useMemo(
    () => isBidAmountGtLeftAllocationToken1 || isUserSwappedAmount1GteToken1Allocation,
    [isBidAmountGtLeftAllocationToken1, isUserSwappedAmount1GteToken1Allocation]
  )
}

export default useIsLimitExceeded
