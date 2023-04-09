import { Typography } from '@mui/material'
import { BigNumber } from 'bignumber.js'
import { FixedSwapPoolParams } from 'bounceComponents/fixed-swap-nft/MainBlock/UserMainBlock'

import PoolInfoItem from 'bounceComponents/fixed-swap/PoolInfoItem'
import { CurrencyAmount } from 'constants/token'

interface Token1ToRegretProps {
  regretAmount: string
}

const Token1ToRegret = ({ regretAmount, poolInfo }: Token1ToRegretProps & FixedSwapPoolParams) => {
  const token1RegretAmount = regretAmount ? new BigNumber(regretAmount).times(poolInfo.ratio).toString() : '0'
  const currencyToken1RegretAmount = CurrencyAmount.fromAmount(
    poolInfo.currencyAmountTotal1.currency,
    token1RegretAmount
  )

  return (
    <PoolInfoItem title="Bid you want to regret" sx={{ mt: 8 }}>
      <Typography>
        {currencyToken1RegretAmount?.toSignificant() || '-'} {poolInfo.token1.symbol}
      </Typography>
    </PoolInfoItem>
  )
}

export default Token1ToRegret
