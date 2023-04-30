import React from 'react'
import { Box } from '@mui/material'

const tokenAuction: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: 1088
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: 865,
          background: 'var(--ps-text-4)',
          borderRadius: 30
        }}
      ></Box>
    </Box>
  )
}

export default tokenAuction
