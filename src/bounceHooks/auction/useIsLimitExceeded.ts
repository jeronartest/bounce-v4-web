import { useMemo } from 'react'
import { FixedSwapPoolProp } from 'api/pool/type'
import { CurrencyAmount } from 'constants/token'

export function useMaxSwapAmount1Limit(poolInfo: FixedSwapPoolProp) {
  return useMemo(() => {
    const hasBidLimit = poolInfo.currencyMaxAmount1PerWallet.greaterThan('0')
    return hasBidLimit
      ? poolInfo.participant.currencySwappedAmount1
        ? poolInfo.currencyMaxAmount1PerWallet.subtract(poolInfo.participant.currencySwappedAmount1)
        : poolInfo.currencyMaxAmount1PerWallet
      : poolInfo.currencyAmountTotal1.subtract(poolInfo.currencySwappedTotal1)
  }, [
    poolInfo.currencyAmountTotal1,
    poolInfo.currencyMaxAmount1PerWallet,
    poolInfo.currencySwappedTotal1,
    poolInfo.participant.currencySwappedAmount1
  ])
}

const useIsLimitExceeded = (bidAmount: string, poolInfo: FixedSwapPoolProp) => {
  const token1Allocation = useMaxSwapAmount1Limit(poolInfo)

  const currencyBidAmount = CurrencyAmount.fromAmount(poolInfo.currencyAmountTotal1.currency, bidAmount)

  return useMemo(() => currencyBidAmount?.greaterThan(token1Allocation), [currencyBidAmount, token1Allocation])
}

export default useIsLimitExceeded
