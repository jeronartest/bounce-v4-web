import React from 'react'
import PoolInfoItem from '../../PoolInfoItem'
import usePoolInfo from '@/hooks/auction/usePoolInfo'
import usePoolWithParticipantInfo from '@/hooks/auction/usePoolWithParticipantInfo'
import { formatNumber } from '@/utils/web3/number'
import { getUserSwappedAmount1, getUserSwappedUnits1 } from '@/utils/auction'

const BidAmountLimit = () => {
  const { data: poolInfo } = usePoolInfo()
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  const formatedMMaxAmount1PerWallet = poolInfo.maxAmount1PerWallet
    ? formatNumber(poolInfo.maxAmount1PerWallet, {
        unit: poolInfo.token1.decimals,
        decimalPlaces: 6,
      })
    : '-'

  const userSwappedAmount1 = getUserSwappedAmount1(
    poolWithParticipantInfo?.participant.swappedAmount0,
    poolInfo.token0.decimals,
    poolInfo.token1.decimals,
    poolInfo.ratio,
  )

  const userSwappedUnits1 = getUserSwappedUnits1(userSwappedAmount1, poolInfo.token1.decimals)

  const userSwappedUnits1GteToken1Allocation = userSwappedUnits1.isGreaterThanOrEqualTo(poolInfo.maxAmount1PerWallet)

  return (
    <PoolInfoItem
      title="Bid amount limit"
      sx={{ mt: 8, color: userSwappedUnits1GteToken1Allocation ? '#F53030' : 'black' }}
    >
      {formatNumber(userSwappedAmount1, { unit: 0 })} {poolInfo.token1.symbol} / {formatedMMaxAmount1PerWallet}&nbsp;
      {poolInfo.token1.symbol}
    </PoolInfoItem>
  )
}

export default BidAmountLimit
