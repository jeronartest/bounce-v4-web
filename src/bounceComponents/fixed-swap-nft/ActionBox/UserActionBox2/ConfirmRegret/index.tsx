import { Box, Button, Stack, Typography } from '@mui/material'
import { BigNumber } from 'bignumber.js'
import RegretButton from './RegretButton'
import PoolInfoItem from 'bounceComponents/fixed-swap/PoolInfoItem'
import { FixedSwapPoolParams } from 'bounceComponents/fixed-swap-nft/MainBlock/UserMainBlock'
import { CurrencyAmount } from 'constants/token'

export interface ConfirmRegretProps {
  regretAmount: string
  onCancel: () => void
  handleRegret: () => void
  isRegretting?: boolean
}

const ConfirmRegret = ({
  regretAmount,
  onCancel,
  handleRegret,
  poolInfo,
  isRegretting
}: ConfirmRegretProps & FixedSwapPoolParams): JSX.Element => {
  const formattedToken0RegretAmount = regretAmount || '0'

  const token1RegretAmount = regretAmount
    ? new BigNumber(formattedToken0RegretAmount).times(poolInfo.ratio).toString()
    : '0'
  const currencyToken1RegretAmount = CurrencyAmount.fromAmount(
    poolInfo.currencyAmountTotal1.currency,
    token1RegretAmount
  )

  return (
    <Box sx={{ mt: 24 }}>
      <Box sx={{ border: '1px solid #D1D4D8', borderRadius: 20, px: 16, py: 16 }}>
        <Typography variant="h5">Confirmation</Typography>
        <PoolInfoItem title="Regret amount" sx={{ mt: 8 }}>
          <Typography>
            {formattedToken0RegretAmount} {poolInfo.token0.symbol}
          </Typography>
        </PoolInfoItem>
        <PoolInfoItem title="Bid you want to regret" sx={{ mt: 8 }}>
          <Typography>
            {currencyToken1RegretAmount?.toSignificant() || '-'} {poolInfo.token1.symbol}
          </Typography>
        </PoolInfoItem>
      </Box>

      <Stack direction="row" spacing={8} sx={{ mt: 24 }}>
        <Button variant="outlined" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <RegretButton onClick={handleRegret} loading={isRegretting} />
      </Stack>
    </Box>
  )
}

export default ConfirmRegret
