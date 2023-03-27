import { Container, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React from 'react'
import SignupLayout from './SignupLayout'
import login_bg from 'assets/svg/login_bg.svg'
import Footer from 'bounceComponents/common/Footer'

export type ILoginLayoutProps = {
  title: string
  subTitle: React.ReactNode
  children: React.ReactNode
}

const LoginLayout: React.FC<ILoginLayoutProps> = ({ title, subTitle, children }) => {
  return (
    <SignupLayout>
      <Container maxWidth="xl">
        <Box display="grid" gridTemplateColumns={'1fr 1fr'}>
          <Box padding={10}>
            <Box
              sx={{
                background: `url(${login_bg}) no-repeat`,
                backgroundColor: '#F5F5F5',
                borderRadius: 24,
                height: '100%',
                backgroundPosition: 'center center'
              }}
            ></Box>
          </Box>
          <Box
            sx={{
              m: '0 auto',
              maxWidth: 708,
              height: 772,
              borderRadius: 20,
              background: '#FFFFFF',
              pt: '60px',
              pb: '60px'
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
        </Box>
      </Container>
      <Footer />
    </SignupLayout>
  )
}

export default LoginLayout
