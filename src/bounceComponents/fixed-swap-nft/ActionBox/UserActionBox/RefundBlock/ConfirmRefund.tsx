import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { BigNumber } from 'bignumber.js'
import { ContractReceipt } from 'ethers'

import { parseUnits } from 'ethers/lib/utils.js'
import RefundButton from './RefundButton'
import PoolInfoItem from '@/components/fixed-swap/PoolInfoItem'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'

export interface ConfirmRefundProps {
  refundAmount: string
  onCancel: () => void
  onRefundPart: (data: ContractReceipt) => void
  onRefundAll: (data: ContractReceipt) => void
}

const ConfirmRefund = ({ refundAmount, onCancel, onRefundPart, onRefundAll }: ConfirmRefundProps): JSX.Element => {
  const { data: poolInfo } = usePoolInfo()

  const formattedRegretBidAmount = refundAmount ? new BigNumber(refundAmount).times(poolInfo.ratio).toString() : null

  return (
    <Box sx={{ mt: 62 }}>
      <Box sx={{ border: '1px solid #D1D4D8', borderRadius: 20, px: 16, py: 16 }}>
        <Typography variant="h5">Confirmation</Typography>
        <PoolInfoItem title="Regret amount" sx={{ mt: 8 }}>
          <Typography>
            {refundAmount} {poolInfo.token0.symbol}
          </Typography>
        </PoolInfoItem>
        <PoolInfoItem title="Bid you want to regret" sx={{ mt: 8 }}>
          <Typography>
            {formattedRegretBidAmount || '-'} {poolInfo.token1.symbol}
          </Typography>
        </PoolInfoItem>
      </Box>

      <Stack direction="row" spacing={8} sx={{ mt: 24 }}>
        <Button variant="outlined" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <RefundButton
          onRefundAll={onRefundAll}
          onRefundPart={onRefundPart}
          token0AmountToRefund={parseUnits(refundAmount, poolInfo.token0.decimals)}
        />
      </Stack>
    </Box>
  )
}

export default ConfirmRefund
