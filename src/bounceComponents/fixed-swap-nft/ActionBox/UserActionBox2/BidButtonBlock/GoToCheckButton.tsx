import { Button } from '@mui/material'
import React from 'react'
import useIsUserInWhitelist from '@/hooks/auction/useIsUserInWhitelist'

export interface GoToCheckButtonProps {
  onClick: () => void
  bidAmount: string
}

const GoToCheckButton = ({ onClick, bidAmount }: GoToCheckButtonProps) => {
  const { data: isUserInWhitelist, loading: isCheckingWhitelist } = useIsUserInWhitelist()

  return (
    <Button
      variant="contained"
      fullWidth
      sx={{ mt: 24 }}
      onClick={onClick}
      disabled={!bidAmount || !isUserInWhitelist || isCheckingWhitelist}
    >
      Place a Bid
    </Button>
  )
}

export default GoToCheckButton
