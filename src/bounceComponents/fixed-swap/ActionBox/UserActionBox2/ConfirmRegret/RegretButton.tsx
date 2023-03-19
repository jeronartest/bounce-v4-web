import { LoadingButton } from '@mui/lab'
import { Dots } from 'themes'

export interface RegretButtonProps {
  onClick: () => void
  loading?: boolean
}

const RegretButton = ({ onClick, loading }: RegretButtonProps): JSX.Element => {
  return (
    <LoadingButton
      variant="contained"
      loadingPosition="start"
      fullWidth
      sx={{ mt: 24, mb: 12, px: 40 }}
      loading={loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          Confirm
          <Dots />
        </>
      ) : (
        'Confirm'
      )}
    </LoadingButton>
  )
}

export default RegretButton
