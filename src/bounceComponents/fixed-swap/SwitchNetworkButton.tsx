import { Button } from '@mui/material'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'

const SwitchNetworkButton = ({ targetChain }: { targetChain: number }) => {
  const switchNetwork = useSwitchNetwork()

  return (
    <Button
      variant="contained"
      fullWidth
      sx={{ mt: 24, mb: 12 }}
      onClick={() => {
        switchNetwork(targetChain)
      }}
    >
      Switch network
    </Button>
  )
}

export default SwitchNetworkButton
