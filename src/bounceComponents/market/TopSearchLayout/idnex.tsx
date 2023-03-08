import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import { Stack } from '@mui/system'
// import StartupIdeas from 'bounceComponents/market/components/StartupIdeas'

export type ITopSearchLayoutProps = {
  title: string
  children: React.ReactNode
  centerBox: React.ReactNode
}

const TopSearchLayout: React.FC<ITopSearchLayoutProps> = ({ title, children, centerBox }) => {
  return (
    <Box>
      <Box sx={{ height: 358, background: 'var(--ps-gray-900)' }} />
      <Box sx={{ position: 'relative', mt: -358 }}>
        <Container maxWidth="lg">
          <Stack spacing={32} pt={60} pb={48}>
            <Typography variant="h1" sx={{ color: 'var(--ps-white)', textAlign: 'left' }}>
              {title}
            </Typography>
            {children}
          </Stack>
        </Container>
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          {centerBox}
        </Container>
      </Box>
    </Box>
  )
}

export default TopSearchLayout
