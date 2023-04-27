import { Typography } from '@mui/material'
import { FixedSwapPoolProp } from 'api/pool/type'
import { BigNumber } from 'bignumber.js'

import PoolInfoItem from 'bounceComponents/fixed-swap/PoolInfoItem'
import { formatNumber } from 'utils/number'

interface Token1ToRegretProps {
  regretAmount: string
  poolInfo: FixedSwapPoolProp
}

const Token1ToRegret = ({ regretAmount, poolInfo }: Token1ToRegretProps) => {
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
