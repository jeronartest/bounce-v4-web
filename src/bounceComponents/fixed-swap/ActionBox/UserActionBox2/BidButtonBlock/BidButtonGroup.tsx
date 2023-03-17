import { ReactNode } from 'react'
import { Button, Stack, SxProps } from '@mui/material'

export interface BidButtonGroupProps {
  withCancelButton?: boolean
  children?: ReactNode
  stackSx?: SxProps
  onCancel?: () => void
}

const BidButtonGroup = ({ withCancelButton, children, stackSx, onCancel }: BidButtonGroupProps) => {
  return (
    <Stack direction="row" spacing={8} sx={stackSx}>
      {withCancelButton && (
        <Button variant="outlined" fullWidth onClick={onCancel}>
          Cancel
        </Button>
      )}
      {children}
    </Stack>
  )
}

export default BidButtonGroup
