import React, { useCallback, useMemo } from 'react'
import { Button, Typography } from '@mui/material'
import { BigNumber } from 'bignumber.js'
import { parseUnits } from 'ethers/lib/utils.js'
import PoolInfoItem from '../../PoolInfoItem'
import TokenImage from '@/components/common/TokenImage'
import NumberInput from '@/components/common/NumberInput'
import usePoolInfo from '@/hooks/auction/usePoolInfo'
import { formatNumber } from '@/utils/web3/number'
import useToken1Balance from '@/hooks/auction/useToken1Balance'
import usePoolWithParticipantInfo from '@/hooks/auction/usePoolWithParticipantInfo'
import { getUserSwappedAmount1, getUserSwappedUnits1 } from '@/utils/auction'

interface BidAmountInputProps {
  bidAmount: string
  setBidAmount: (value: string) => void
}

const BidAmountInput = ({ bidAmount, setBidAmount }: BidAmountInputProps) => {
  const { data: poolInfo } = usePoolInfo()

  const { token1Balance } = useToken1Balance()
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  const availableAmount1 = useMemo(
    () => new BigNumber(poolInfo.amountTotal1).minus(new BigNumber(poolInfo.currentTotal1)),
    [poolInfo.amountTotal1, poolInfo.currentTotal1],
  )

  const hasBidLimit = new BigNumber(poolInfo.maxAmount1PerWallet).gt(0)

  // const isJoined = useIsUserJoinedPool()

  const userSwappedAmount1Units = useMemo(() => {
    const userSwappedAmount1 = getUserSwappedAmount1(
      poolWithParticipantInfo?.participant.swappedAmount0,
      poolInfo.token0.decimals,
      poolInfo.token1.decimals,
      poolInfo.ratio,
    )

    console.log('userSwappedAmount1.toString(): ', userSwappedAmount1.toString())

    // return new BigNumber(parseUnits(userSwappedAmount1.toString(), poolInfo.token1.decimals).toString())
    return getUserSwappedUnits1(userSwappedAmount1, poolInfo.token1.decimals)
  }, [
    poolInfo.ratio,
    poolInfo.token0.decimals,
    poolInfo.token1.decimals,
    poolWithParticipantInfo?.participant.swappedAmount0,
  ])

  const leftAllocationToken1 = useMemo(
    () =>
      hasBidLimit
        ? new BigNumber(poolInfo.maxAmount1PerWallet).minus(userSwappedAmount1Units)
        : new BigNumber(poolInfo.amountTotal1),
    [hasBidLimit, poolInfo.amountTotal1, poolInfo.maxAmount1PerWallet, userSwappedAmount1Units],
  )

  const handleMaxButtonClick = useCallback(() => {
    // console.log('___ leftAmount1InPool: ', availableAmount1.toString())
    // console.log('___ token1Balance: ', token1Balance.toString())
    // console.log('___ leftAllocationToken1: ', leftAllocationToken1.toString())

    const minimum = BigNumber.min(token1Balance, availableAmount1, leftAllocationToken1)

    console.log('minimum:', minimum.toString())

    setBidAmount(
      formatNumber(minimum.toString(), {
        unit: poolInfo.token1.decimals,
        decimalPlaces: poolInfo.token1.decimals,
        shouldSplitByComma: false,
      }),
    )
  }, [availableAmount1, leftAllocationToken1, poolInfo.token1.decimals, setBidAmount, token1Balance])

  const formattedTokenWillGet = bidAmount
    ? formatNumber(new BigNumber(bidAmount).div(poolInfo.ratio), { unit: 0 })
    : '0'

  return (
    <>
      <NumberInput
        sx={{ mt: 12 }}
        fullWidth
        value={bidAmount}
        placeholder="Enter"
        onUserInput={(value) => {
          setBidAmount(value)
        }}
        endAdornment={
          <>
            <Button size="small" variant="outlined" sx={{ mr: 20, minWidth: 60 }} onClick={handleMaxButtonClick}>
              Max
            </Button>
            <TokenImage alt={poolInfo.token1.symbol} src={poolInfo.token1.largeUrl} size={24} />
            <Typography sx={{ ml: 8 }}>{poolInfo.token1.symbol}</Typography>
          </>
        }
      />

      <PoolInfoItem title="Token you will recieve" sx={{ mt: 8 }}>
        {formattedTokenWillGet} {poolInfo.token0.symbol}
      </PoolInfoItem>
    </>
  )
}

export default BidAmountInput
