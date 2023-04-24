import { LoadingButton } from '@mui/lab'
import { Button, Stack } from '@mui/material'

export interface ButtonBlockProps {
  regretAmount: string
  onCancel: () => void
  onConfirm: () => void
  isRegretting: boolean
}

const ButtonBlock = ({ regretAmount, isRegretting, onCancel, onConfirm }: ButtonBlockProps) => {
  return (
    <Stack direction="row" spacing={8} sx={{ mt: 24 }}>
      <Button variant="outlined" fullWidth onClick={onCancel}>
        Cancel
      </Button>

      {isRegretting ? (
        <LoadingButton loading loadingPosition="start" fullWidth>
          Regretting
        </LoadingButton>
      ) : (
        <Button variant="contained" fullWidth disabled={!regretAmount} onClick={onConfirm}>
          Get fund back
        </Button>
      )}
    </Stack>
  )
}

export default ButtonBlock
