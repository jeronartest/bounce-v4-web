import React from 'react'
import { Button, SxProps, Typography } from '@mui/material'
import Image, { StaticImageData } from 'next/image'

export interface WalletButtonProps {
  onClick: () => void
  icon: StaticImageData
  walletName: string
  sx?: SxProps
  disabled?: boolean
}

const WalletButton = ({ onClick, icon, walletName, sx, disabled }: WalletButtonProps): JSX.Element => {
  return (
    <Button onClick={onClick} fullWidth variant="outlined" sx={{ ...sx }} disabled={disabled}>
      <Image src={icon} alt={walletName} />

      <Typography sx={{ ml: 20 }} variant="h5">
        {walletName}
      </Typography>
    </Button>
  )
}

export default WalletButton
