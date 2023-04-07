import React from 'react'
import { Typography } from '@mui/material'
import { formatNumber } from '@/utils/web3/number'
import usePoolInfo from 'bounceHooks/auction/useNftPoolInfo'
import useToken1Balance from 'bounceHooks/auction/useToken1Balance'

const Balance = () => {
  const { data: poolInfo } = usePoolInfo()
  const { token1Balance, isToken1BalanceLoading } = useToken1Balance()

  const formattedToken1Balance = isToken1BalanceLoading
    ? '-'
    : token1Balance && token1Balance.toString() !== 'NaN'
    ? formatNumber(token1Balance.toString(), { unit: poolInfo.token1.decimals, decimalPlaces: 6 })
    : '0'

  return (
    <Typography>
      Balance: {formattedToken1Balance} {poolInfo.token1.symbol}
    </Typography>
  )
}

export default Balance
