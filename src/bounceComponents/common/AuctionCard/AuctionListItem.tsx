import { Stack, Typography } from '@mui/material'
import React from 'react'

export type IAuctionListItemProps = {
  label: string | React.ReactNode
  value: string | React.ReactNode
}

export const AuctionListItem: React.FC<IAuctionListItemProps> = ({ label, value }) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={20} component="li">
      <Typography variant="body2" color="var(--ps-gray-600)" component="div">
        {label}
      </Typography>
      <Typography variant="body2" color="var(--ps-gray-900)" component="div">
        {value}
      </Typography>
    </Stack>
  )
}

export default AuctionListItem
