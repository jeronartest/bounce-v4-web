import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { BounceAnime } from '../BounceAnime'

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
        <BounceAnime />

        <Typography variant="h3" sx={{ mt: 40, textAlign: 'center' }}>
          Thank you for your interest in Bounce! Mobile version coming soon! Please use desktop for now.
        </Typography>
      </Stack>
    </Box>
  )
}
