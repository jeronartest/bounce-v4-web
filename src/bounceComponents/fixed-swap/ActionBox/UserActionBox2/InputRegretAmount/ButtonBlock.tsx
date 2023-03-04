import { Button, Stack } from '@mui/material'
import { BigNumber } from 'bignumber.js'
import { parseUnits } from 'ethers/lib/utils.js'
import React from 'react'
import usePoolWithParticipantInfo from '@/hooks/auction/usePoolWithParticipantInfo'
import usePoolInfo from '@/hooks/auction/usePoolInfo'

export interface ButtonBlockProps {
  regretAmount: string
  onCancel: () => void
  onConfirm: () => void
}

const ButtonBlock = ({ regretAmount, onCancel, onConfirm }: ButtonBlockProps) => {
  const { data: poolInfo } = usePoolInfo()
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  const regretUnits = new BigNumber(regretAmount ? parseUnits(regretAmount, poolInfo.token0.decimals).toString() : '0')
  const isRegretBalanceSufficient = regretUnits.lte(poolWithParticipantInfo?.participant.swappedAmount0)

  return (
    <Stack direction="row" spacing={8} sx={{ mt: 24 }}>
      <Button variant="outlined" fullWidth onClick={onCancel}>
        Cancel
      </Button>

      {isRegretBalanceSufficient ? (
        <Button variant="contained" fullWidth disabled={!regretAmount} onClick={onConfirm}>
          Get fund back
        </Button>
      ) : (
        <Button variant="contained" fullWidth disabled>
          Insufficient balance
        </Button>
      )}
    </Stack>
  )
}

export default ButtonBlock
