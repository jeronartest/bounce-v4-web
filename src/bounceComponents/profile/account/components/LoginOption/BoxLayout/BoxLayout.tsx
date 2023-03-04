import { Box, Button, Typography } from '@mui/material'
import React from 'react'

export type IBoxLayoutProps = {
  email: string
  title: string
  emailSvg: React.ReactNode
  onBind: () => void
}

const BoxLayout: React.FC<IBoxLayoutProps> = ({ email, title, emailSvg, onBind }) => {
  return (
    <Box
      display={'flex'}
      px={20}
      alignItems="center"
      height={60}
      sx={{ border: '1px solid #D7D6D9', borderRadius: 20 }}
    >
      {emailSvg}
      <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
        <Typography variant="body2" color={'var(--ps-gray-700)'} ml={10}>
          {title}
        </Typography>
        <Typography variant="body1" color={'var(--ps-gray-900)'} ml={10}>
          {email}
        </Typography>
      </Box>
      {!email && (
        <Typography sx={{ ml: 'auto', cursor: 'pointer' }} variant="body1" color={'blue'} onClick={onBind}>
          Connect
        </Typography>
      )}
    </Box>
  )
}

export default BoxLayout
