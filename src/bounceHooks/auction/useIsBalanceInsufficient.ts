import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import { parseUnits } from 'ethers/lib/utils.js'
import usePoolInfo from 'bounceHooks/auction/usePoolInfo'
import useToken1Balance from 'bounceHooks/auction/useToken1Balance'

const useIsBalanceInsufficient = (bidAmount: string) => {
  const { data: poolInfo } = usePoolInfo()

  const amount1AvailableToPurchase = new BigNumber(poolInfo.amountTotal1).minus(new BigNumber(poolInfo.currentTotal1))

  const { token1Balance } = useToken1Balance()
  const isBidAmountGtToken1Balance = new BigNumber(
    bidAmount ? parseUnits(bidAmount, poolInfo.token1.decimals).toString() : '0'
  ).gt(token1Balance)

  const isBidAmountGtAmount1AvailableToPurchase = new BigNumber(
    bidAmount ? parseUnits(bidAmount, poolInfo.token1.decimals).toString() : '0'
  ).gt(amount1AvailableToPurchase)

  const isToken1BalanceLte0 = token1Balance.lte(0)

  return useMemo(
    () => isBidAmountGtToken1Balance || isBidAmountGtAmount1AvailableToPurchase || isToken1BalanceLte0,
    [isBidAmountGtAmount1AvailableToPurchase, isBidAmountGtToken1Balance, isToken1BalanceLte0]
  )
}

export default useIsBalanceInsufficient
