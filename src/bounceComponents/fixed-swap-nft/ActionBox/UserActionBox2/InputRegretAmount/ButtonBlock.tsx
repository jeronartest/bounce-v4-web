import { LoadingButton } from '@mui/lab'
import { Button, Stack } from '@mui/material'
import { BigNumber } from 'bignumber.js'
import { FixedSwapPoolParams } from 'bounceComponents/fixed-swap-nft/MainBlock/UserMainBlock'

export interface ButtonBlockProps {
  regretAmount: string
  onCancel: () => void
  onConfirm: () => void
  isRegretting: boolean
}

const ButtonBlock = ({
  regretAmount,
  isRegretting,
  onCancel,
  onConfirm,
  poolInfo
}: ButtonBlockProps & FixedSwapPoolParams) => {
  const regretUnits = new BigNumber(regretAmount || '0')
  const isRegretBalanceSufficient = regretUnits.lte(poolInfo?.participant.swappedAmount0 || '0')

  return (
    <Stack direction="row" spacing={8} sx={{ mt: 24 }}>
      <Button variant="outlined" fullWidth onClick={onCancel}>
        Cancel
      </Button>

      {isRegretting ? (
        <LoadingButton loading loadingPosition="start" fullWidth>
          Regretting
        </LoadingButton>
      ) : isRegretBalanceSufficient ? (
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
