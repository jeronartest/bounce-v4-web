import { LoadingButton } from '@mui/lab'

export interface ClaimButtonProps {
  onClick: () => void
  loading?: boolean
  isWinnerSeedDone?: boolean
}

const ClaimButton = ({ onClick, loading, isWinnerSeedDone }: ClaimButtonProps) => {
  return (
    <LoadingButton
      disabled={!isWinnerSeedDone}
      loadingPosition="start"
      variant="contained"
      fullWidth
      onClick={onClick}
      loading={loading}
    >
      {isWinnerSeedDone ? 'Claim Token Back' : 'Claims can only be made after the winners list has been generated'}
    </LoadingButton>
  )
}

export default ClaimButton
