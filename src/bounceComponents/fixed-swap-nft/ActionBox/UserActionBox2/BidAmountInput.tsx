import React, { useCallback, useMemo } from 'react'
import { Button, Typography } from '@mui/material'
import { BigNumber } from 'bignumber.js'
import { parseUnits } from 'ethers/lib/utils.js'
import PoolInfoItem from '../../PoolInfoItem'
import TokenImage from '@/components/common/TokenImage'
import NumberInput from '@/components/common/NumberInput'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import { formatNumber } from '@/utils/web3/number'
import useToken1Balance from '@/hooks/auction/useToken1Balance'
import usePoolWithParticipantInfo from '@/hooks/auction/use1155PoolWithParticipantInfo'
import { getUserNftSwappedAmount1, getUserSwappedUnits1 } from '@/utils/auction'

interface BidAmountInputProps {
  bidAmount: string
  setBidAmount: (value: string) => void
}

const BidAmountInput = ({ bidAmount, setBidAmount }: BidAmountInputProps) => {
  const { data: poolInfo } = usePoolInfo()

  const { token1Balance } = useToken1Balance()
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()
  const availableAmount1 = useMemo(() => poolInfo.currentTotal0, [poolInfo.currentTotal0])

  const hasBidLimit = new BigNumber(poolInfo.maxAmount1PerWallet).gt(0)

  // const isJoined = useIsUserJoinedPool()

  const userSwappedAmount1Units = useMemo(() => {
    return poolWithParticipantInfo?.participant.swappedAmount0 || 0
  }, [poolWithParticipantInfo?.participant.swappedAmount0])

  const leftAllocationToken1 = useMemo(
    () =>
      hasBidLimit
        ? new BigNumber(poolInfo.maxAmount1PerWallet).gt(userSwappedAmount1Units)
          ? new BigNumber(poolInfo.maxAmount1PerWallet).minus(userSwappedAmount1Units)
          : 0
        : new BigNumber(poolInfo.amountTotal1),
    [hasBidLimit, poolInfo.amountTotal1, poolInfo.maxAmount1PerWallet, userSwappedAmount1Units],
  )

  const handleMaxButtonClick = useCallback(() => {
    console.log('___ leftAmount1InPool: ', availableAmount1.toString())
    console.log(
      '___ token1Balance: ',
      token1Balance.div(new BigNumber(10).pow(poolInfo.token1.decimals)).div(poolInfo.ratio).integerValue().toString(),
    )
    console.log('___ leftAllocationToken1: ', leftAllocationToken1.toString(), leftAllocationToken1.toString().length)
    const minimum = BigNumber.minimum(
      token1Balance.div(new BigNumber(10).pow(poolInfo.token1.decimals)).div(poolInfo.ratio).integerValue(),
      availableAmount1,
      poolInfo.amountTotal0,
      leftAllocationToken1,
    )
    const amount = minimum.toString()
    setBidAmount(amount)
  }, [
    availableAmount1,
    leftAllocationToken1,
    poolInfo.amountTotal0,
    poolInfo.ratio,
    poolInfo.token1.decimals,
    setBidAmount,
    token1Balance,
  ])
  const setValueAble = useCallback(
    (value: string) => {
      const result = Math.round(Number(value)) + ''
      const minimum = BigNumber.minimum(
        token1Balance.div(new BigNumber(10).pow(poolInfo.token1.decimals)).div(poolInfo.ratio).integerValue(),
        availableAmount1,
        leftAllocationToken1,
        new BigNumber(result),
      )
      const amount = minimum.toString()
      setBidAmount(amount)
    },
    [availableAmount1, leftAllocationToken1, poolInfo.ratio, poolInfo.token1.decimals, setBidAmount, token1Balance],
  )
  const formattedTokenWillPay = bidAmount
    ? formatNumber(new BigNumber(bidAmount).times(poolInfo.ratio), { unit: 0 })
    : '0'

  return (
    <>
      <NumberInput
        sx={{ mt: 12 }}
        fullWidth
        value={bidAmount}
        placeholder="Enter"
        onUserInput={(value) => {
          setValueAble(value)
        }}
        endAdornment={
          <>
            <Button size="small" variant="outlined" sx={{ minWidth: 60 }} onClick={handleMaxButtonClick}>
              Max
            </Button>
          </>
        }
      />

      <PoolInfoItem title="Token you will pay" sx={{ mt: 8 }}>
        {formattedTokenWillPay} {poolInfo.token1.symbol}
      </PoolInfoItem>
    </>
  )
}

export default BidAmountInput
