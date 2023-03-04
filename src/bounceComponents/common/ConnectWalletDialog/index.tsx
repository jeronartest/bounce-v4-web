import { create, muiDialogV5, useModal } from '@ebay/nice-modal-react'
import { Stack } from '@mui/material'
import React from 'react'
import { useConnect } from 'wagmi'
import DialogBase from '../DialogBase'
import WalletButton from './WalletButton'

import MetamaskPNG from 'assets/imgs/wallets/metamask.png'
import CoinbaseWalletPNG from 'assets/imgs/wallets/coinbase_wallet.png'
import WalletConnectPNG from 'assets/imgs/wallets/wallet_connect.png'
import { coinbaseConnector, metaMaskConnector, walletConnectConnector } from '@/utils/web3/wagmi'

const ConnectWalletDialog = create(() => {
  const modal = useModal()
  const { connect } = useConnect()

  return (
    <DialogBase title="Connect Wallet" fullWidth {...muiDialogV5(modal)}>
      <Stack spacing={20}>
        <WalletButton
          onClick={async () => {
            const provider = await metaMaskConnector.getProvider()
            await provider.request({
              method: 'wallet_requestPermissions',
              params: [
                {
                  eth_accounts: {}
                }
              ]
            })
            connect({ connector: metaMaskConnector })
            modal.hide()
          }}
          walletName="MetaMask"
          icon={MetamaskPNG}
        />

        <WalletButton
          onClick={() => {
            connect({ connector: coinbaseConnector })
            modal.hide()
          }}
          walletName="Coinbase Wallet"
          icon={CoinbaseWalletPNG}
        />

        <WalletButton
          onClick={() => {
            connect({ connector: walletConnectConnector })
            modal.hide()
          }}
          walletName="Wallet Connect"
          icon={WalletConnectPNG}
        />
      </Stack>
    </DialogBase>
  )
})

export default ConnectWalletDialog
