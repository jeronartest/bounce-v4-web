/* eslint-disable prettier/prettier */
import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import useToken1Balance from '@/hooks/auction/use1155Token1Balance'

const useIsBalanceInsufficient = (bidAmount: string) => {
    const { data: poolInfo } = usePoolInfo()

    const amount1AvailableToPurchase = poolInfo.maxAmount1PerWallet && Number(poolInfo.maxAmount1PerWallet) !== 0 ? new BigNumber(poolInfo.maxAmount1PerWallet) : new BigNumber(poolInfo.currentTotal0)
    const { token1Balance } = useToken1Balance()
    const isBidAmountGtToken1Balance = new BigNumber(
        bidAmount ? new BigNumber(bidAmount).times(poolInfo.ratio).toString() : '0',
    ).gt(token1Balance)

    const isBidAmountGtAmount1AvailableToPurchase = new BigNumber(
        bidAmount ? bidAmount : '0',
    ).gt(amount1AvailableToPurchase)

    const isToken1BalanceLte0 = token1Balance.lte(0)
    // console.log('isBidAmountGtToken1Balance', isBidAmountGtToken1Balance)
    // console.log('isBidAmountGtAmount1AvailableToPurchase', isBidAmountGtAmount1AvailableToPurchase)
    // console.log('isToken1BalanceLte0', isToken1BalanceLte0)
    return useMemo(
        () => isBidAmountGtToken1Balance || isBidAmountGtAmount1AvailableToPurchase || isToken1BalanceLte0,
        [isBidAmountGtAmount1AvailableToPurchase, isBidAmountGtToken1Balance, isToken1BalanceLte0],
    )
}

export default useIsBalanceInsufficient
