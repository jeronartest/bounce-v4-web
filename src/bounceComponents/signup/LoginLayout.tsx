import { Container, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React from 'react'
import SignupLayout from './SignupLayout'
export type ILoginLayoutProps = {
  title: string
  subTitle: React.ReactNode
  children: React.ReactNode
}

const LoginLayout: React.FC<ILoginLayoutProps> = ({ title, subTitle, children }) => {
  return (
    <SignupLayout>
      <Container maxWidth="xl">
        <Box
          sx={{
            m: '0 auto',
            width: 708,
            borderRadius: 20,
            background: '#FFFFFF',
            pt: '80px',
            pb: '66px'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Stack spacing={'20px'} alignItems="center">
              <Typography fontSize={'28px'} lineHeight="36px" variant="h1" color={'var(--ps-gray-900)'}>
                {title}
              </Typography>
              <Typography color="var(--ps-gray-600)" display={'flex'}>
                {title === 'Login' ? `Don't have an account yet? ` : 'Already have an account?'}
                &nbsp;
                <span style={{ color: '#2663FF' }}>{subTitle}</span>
              </Typography>
            </Stack>
            <Box width={'428px'} m="0 auto" mt={'40px'}>
              {children}
            </Box>
          </Box>
        </Box>
      </Container>
    </SignupLayout>
  )
}

export default LoginLayout
