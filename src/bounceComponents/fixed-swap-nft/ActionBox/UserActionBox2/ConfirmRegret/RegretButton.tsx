import { LoadingButton } from '@mui/lab'

export interface RegretButtonProps {
  onClick: () => void
  loading?: boolean
}

const RegretButton = ({ onClick, loading }: RegretButtonProps): JSX.Element => {
  return (
    <LoadingButton
      loadingPosition="start"
      variant="contained"
      fullWidth
      sx={{ mt: 24, mb: 12, px: 40 }}
      loading={loading}
      onClick={onClick}
    >
      Confirm
    </LoadingButton>
  )
}

export default RegretButton
