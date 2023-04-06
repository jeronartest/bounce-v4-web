import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { BigNumber } from 'bignumber.js'
import { ContractReceipt } from 'ethers'

import { parseUnits } from 'ethers/lib/utils.js'
import RegretButton from './RegretButton'
import PoolInfoItem from 'bounceComponents/fixed-swap/PoolInfoItem'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import { formatNumber } from '@/utils/web3/number'

export interface ConfirmRegretProps {
  regretAmount: string
  onCancel: () => void
  handleRegret: () => void
  isRegretting?: boolean
}

const ConfirmRegret = ({ regretAmount, onCancel, handleRegret, isRegretting }: ConfirmRegretProps): JSX.Element => {
  const { data: poolInfo } = usePoolInfo()

  const formattedToken0RegretAmount = regretAmount
    ? formatNumber(new BigNumber(regretAmount).toString(), {
        unit: 0,
        decimalPlaces: poolInfo.token0.decimals
      })
    : '0'

  const token1RegretAmount = regretAmount
    ? formatNumber(new BigNumber(regretAmount).times(poolInfo.ratio).toString(), {
        unit: 0,
        decimalPlaces: poolInfo.token1.decimals
      })
    : '0'

  return (
    <Box sx={{ mt: 62 }}>
      <Box sx={{ border: '1px solid #D1D4D8', borderRadius: 20, px: 16, py: 16 }}>
        <Typography variant="h5">Confirmation</Typography>
        <PoolInfoItem title="Regret amount" sx={{ mt: 8 }}>
          <Typography>
            {formattedToken0RegretAmount} {poolInfo.token0.symbol}
          </Typography>
        </PoolInfoItem>
        <PoolInfoItem title="Bid you want to regret" sx={{ mt: 8 }}>
          <Typography>
            {token1RegretAmount} {poolInfo.token1.symbol}
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
