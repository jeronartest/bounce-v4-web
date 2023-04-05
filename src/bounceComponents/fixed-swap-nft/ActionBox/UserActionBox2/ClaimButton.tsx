import React from 'react'
import { LoadingButton } from '@mui/lab'

export interface ClaimButtonProps {
  onClick: () => void
  loading?: boolean
}

const ClaimButton = ({ onClick, loading }: ClaimButtonProps) => {
  return (
    <LoadingButton variant="contained" fullWidth onClick={onClick} loading={loading}>
      Claim Token
    </LoadingButton>
  )
}

export default ClaimButton
