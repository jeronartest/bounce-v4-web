import { Button } from '@mui/material'
import React from 'react'
import { useSwitchNetwork } from 'wagmi'
import { getDefaultChainId } from '@/utils/web3/chain'

const SwitchNetworkButton = ({ targetChain }: { targetChain: number }) => {
  const { switchNetwork } = useSwitchNetwork()

  return (
    <Button
      variant="contained"
      fullWidth
      sx={{ mt: 24, mb: 12 }}
      onClick={() => {
        switchNetwork(targetChain || getDefaultChainId())
      }}
    >
      Switch network
    </Button>
  )
}

export default SwitchNetworkButton
