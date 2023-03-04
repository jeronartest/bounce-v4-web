import { Button, ButtonProps } from '@mui/material'
import React from 'react'
// import { useDispatch } from 'react-redux'
// import { toggleWalletDialogOpen } from 'store/dialog'

export type IConnectWalletProps = {
  label?: React.ReactNode
} & ButtonProps
const ConnectWallet: React.FC<IConnectWalletProps> = ({ label = 'Connect Wallet', sx, ...rest }) => {
  // const dispatch = useDispatch()
  const onClick = () => {
    // dispatch(toggleWalletDialogOpen(true))
  }

  return (
    <Button
      onClick={onClick}
      color="primary"
      variant="contained"
      {...rest}
      sx={{ border: '1px solid var(--ps-text)', backgroundColor: 'var(--ps-darkBrown)', ...sx }}
    >
      {label}
    </Button>
  )
}

export default ConnectWallet
