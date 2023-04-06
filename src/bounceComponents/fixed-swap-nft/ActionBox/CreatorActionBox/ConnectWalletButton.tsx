import React from 'react'

import { Button } from '@mui/material'
import { show } from '@ebay/nice-modal-react'

import ConnectWalletDialog from 'bounceComponents/common/ConnectWalletDialog'

const ConnectWalletButton = () => {
  return (
    <Button
      variant="contained"
      fullWidth
      sx={{ my: 12 }}
      onClick={() => {
        show(ConnectWalletDialog)
      }}
    >
      Connect Wallet
    </Button>
  )
}

export default ConnectWalletButton
