import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import Image from 'components/Image'

export const Mobile: React.FC = ({}) => {
  return (
    <Box
      sx={{
        padding: '0 18px',
        height: '100vh',
        display: ' flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 999999999
      }}
    >
      <Stack sx={{ alignItems: 'center' }}>
        <Image src="/imgs/mobile/pc.png" alt="" width={193} height={188} />
        <Typography variant="h3" sx={{ mt: 28, color: '#111111', textAlign: 'center' }}>
          Mobile version is coming soon, please use the desktop version for now.
        </Typography>
      </Stack>
    </Box>
  )
}
