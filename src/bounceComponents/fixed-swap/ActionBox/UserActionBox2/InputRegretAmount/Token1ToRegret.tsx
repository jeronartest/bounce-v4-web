import React from 'react'
import { Typography } from '@mui/material'
import { BigNumber } from 'bignumber.js'

import PoolInfoItem from 'bounceComponents/fixed-swap/PoolInfoItem'
import usePoolInfo from 'bounceHooks/auction/usePoolInfo'
import { formatNumber } from '@/utils/web3/number'

interface Token1ToRegretProps {
  regretAmount: string
}

const Token1ToRegret = ({ regretAmount }: Token1ToRegretProps) => {
  const { data: poolInfo } = usePoolInfo()

  const token1RegretAmount = regretAmount
    ? formatNumber(new BigNumber(regretAmount).times(poolInfo.ratio).toString(), {
        unit: 0,
        decimalPlaces: poolInfo.token1.decimals
      })
    : '0'

  return (
    <PoolInfoItem title="Bid you want to regret" sx={{ mt: 8 }}>
      <Typography>
        {token1RegretAmount} {poolInfo.token1.symbol}
      </Typography>
    </PoolInfoItem>
  )
}

export default Token1ToRegret
