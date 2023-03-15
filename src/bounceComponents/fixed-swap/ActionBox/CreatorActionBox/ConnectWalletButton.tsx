import { Button } from '@mui/material'
import { useWalletModalToggle } from 'state/application/hooks'

const ConnectWalletButton = () => {
  const walletModalToggle = useWalletModalToggle()
  return (
    <Button variant="contained" fullWidth sx={{ my: 12 }} onClick={walletModalToggle}>
      Connect Wallet
    </Button>
  )
}

export default ConnectWalletButton
