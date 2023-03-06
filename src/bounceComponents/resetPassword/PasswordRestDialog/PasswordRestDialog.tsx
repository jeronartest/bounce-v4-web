import { useModal } from '@ebay/nice-modal-react'
import { Box, Button, Typography } from '@mui/material'
import Image from 'components/Image'
import React from 'react'
import Checked from './reset-check.png'
// export type IPasswordRestDialogProps = {}

const PasswordRestDialog: React.FC = ({}) => {
  const modal = useModal()
  return (
    <Box textAlign={'center'} width={334}>
      <Image src={Checked} width={60} />
      <Typography variant="h2" color={'#000000'} mt={20}>
        Your password has been reset and you need to log in again.
      </Typography>
      <Button variant="contained" sx={{ width: 140, mt: 40 }} onClick={() => modal.hide()}>
        Confirm
      </Button>
    </Box>
  )
}

export default PasswordRestDialog
