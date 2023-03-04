import { create, muiDialogV5, useModal } from '@ebay/nice-modal-react'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import Image from 'next/image'
import { useNetwork } from 'wagmi'
import { Token } from '../types'
import LogoSVG from '@/assets/imgs/components/logo.svg'
import { shortenAddress } from '@/utils/web3/address'
import Dialog from '@/components/common/DialogBase'
import { ExplorerDataType, getExplorerLink } from '@/utils/web3/getExplorerLink'
import CopyToClipboard from '@/components/common/CopyToClipboard'
import OpenInNewSVG from '@/assets/imgs/icon/open_in_new.svg'

const DangerousTokenDialog = create<Token>((selectedToken) => {
  // console.log('DangerousTokenDialog selectedToken: ', selectedToken)

  const modal = useModal()

  const { chain } = useNetwork()

  const handleResolve = () => {
    modal.resolve()
    modal.hide()
  }
  const handleReject = () => {
    modal.reject(new Error('Rejected'))
    modal.hide()
  }

  return (
    <Dialog title=" " {...muiDialogV5(modal)} onClose={handleReject} sx={{ position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', position: 'absolute', top: 40, left: 'calc(50% - 30px)' }}>
        <Image src={LogoSVG} width={60} height={60} alt="Bounce Logo" />
      </Box>

      <Box sx={{ width: 400, background: 'rgba(202, 32, 32, 0.1)', borderRadius: 20, p: 20, mb: 20 }}>
        <Typography variant="h4" color="var(--ps-gray-600)" sx={{ display: 'inline' }}>
          This token isn&apos;t traded on leading U.S. centralized exchanges or frequently swapped on Bounce. Always
          conduct your own research before trading.&nbsp;
        </Typography>
      </Box>

      <Box
        sx={{
          background: '#F5F5F5',
          borderRadius: 20,
          px: 20,
          py: 10,
          mb: 32,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography>{shortenAddress(selectedToken.address)}</Typography>

        <Stack direction="row" alignItems="center" spacing={4}>
          <a
            href={getExplorerLink(chain?.id, selectedToken.address, ExplorerDataType.TOKEN)}
            target="_blank"
            rel="noreferrer"
          >
            <IconButton>
              <Image src={OpenInNewSVG} width={20} height={20} alt="open in new" />
            </IconButton>
          </a>

          <CopyToClipboard text={selectedToken.address} />
        </Stack>
      </Box>

      <Stack direction="row" spacing={10} justifyContent="center">
        <Button sx={{ width: 140 }} variant="outlined" onClick={handleReject}>
          Cancel
        </Button>
        <Button sx={{ width: 140 }} variant="contained" onClick={handleResolve}>
          I understand
        </Button>
      </Stack>
    </Dialog>
  )
})

export default DangerousTokenDialog
