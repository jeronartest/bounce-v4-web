import React from 'react'
import { Container, Link, Stack, Typography } from '@mui/material'

// export type IFooterProps = {}

const Footer: React.FC = ({}) => {
  return (
    <Container maxWidth="xl">
      <Stack sx={{ py: 24 }} spacing={34}>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize={12} color="#908E96">
            ©2023 Bounce dao Ltd. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={28} sx={{ color: '#908E96', fontSize: 12 }}>
            <Link href="https://bounce.finance/termsOfService">Terms Of Service</Link>
            <Link href="https://bounce.finance/privacyPolicy">Privacy Policy</Link>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  )
}

export default Footer
